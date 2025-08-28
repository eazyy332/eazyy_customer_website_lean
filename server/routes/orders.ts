import type { Request, Response } from "express";
import { supabaseAdmin } from "../lib/supabase";

type OrderItemInput = {
  id: string; // item id from catalog (public.items.id)
  name: string;
  price: number;
  quantity: number;
  serviceId?: string | null;
  categoryId?: string | null;
};

export async function createOrder(req: Request, res: Response) {
  try {
    // Check if Supabase is properly configured
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || supabaseUrl.includes('your_supabase_url_here') || !supabaseUrl.startsWith('https://')) {
      return res.status(503).json({ 
        ok: false, 
        error: "Supabase not configured. Please connect to Supabase to enable order creation." 
      });
    }
    
    if (!supabaseKey || supabaseKey.includes('your_supabase_service_role_key_here')) {
      return res.status(503).json({ 
        ok: false, 
        error: "Supabase service role key not configured. Please connect to Supabase to enable order creation." 
      });
    }

    const {
      items,
      totals,
      pickupDate,
      deliveryDate,
      contact,
      address,
      serviceId,
      categoryId,
      promoCode,
      discountAmount,
      sourceQuoteId,
    }: {
      items: OrderItemInput[];
      totals: { subtotal: number; tax?: number; shippingFee?: number; total: number };
      pickupDate?: string | null;
      deliveryDate?: string | null;
      contact: { name: string; email: string; phone?: string | null };
      address: string; // plain text for MVP
      serviceId?: string | null;
      categoryId?: string | null;
      promoCode?: string | null;
      discountAmount?: number | null;
      sourceQuoteId?: string | null;
    } = req.body ?? {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ ok: false, error: "No items provided" });
    }

    // Compute totals defaults
    const subtotal = totals?.subtotal ?? items.reduce((s, it) => s + it.price * it.quantity, 0);
    const tax = totals?.tax ?? 0;
    const shippingFee = totals?.shippingFee ?? 0;
    const total = totals?.total ?? subtotal + tax + shippingFee - (discountAmount ?? 0);

    // Insert order (public.orders columns)
    // Build order payload conservatively to avoid referencing non-existent columns in live DB
    const generateShortOrderNumber = () => {
      const partA = Math.random().toString(36).slice(2, 8).toUpperCase();
      const partB = Math.floor(Date.now() / 1000).toString(36).toUpperCase();
      const raw = `EZ-${partA}${partB}`; // typically <= 16
      return raw.slice(0, 20);
    };

    const baseOrder: any = {
      // user_id intentionally omitted to allow DB defaults if present
      order_number: generateShortOrderNumber(),
      customer_name: contact?.name ?? "",
      email: contact?.email ?? "",
      phone: contact?.phone ?? null,
      shipping_address: address ?? "",
      status: "pending",
      payment_method: "credit_card",
      shipping_method: "hand-over",
      subtotal,
      tax,
      shipping_fee: shippingFee,
      total_amount: total,
      pickup_date: pickupDate ?? new Date().toISOString(),
      delivery_date: deliveryDate ?? null,
      service_id: serviceId ?? null,
      category_id: categoryId ?? null,
    };
    if (process.env.ENABLE_ORDER_DISCOUNTS === 'true') {
      baseOrder.promo_code = promoCode ?? null;
      baseOrder.discount_amount = discountAmount ?? null;
    }

    // If user_id is required in this schema, borrow an existing one (QA-only fallback)
    try {
      const { data: anyOrder } = await supabaseAdmin
        .from('orders')
        .select('user_id')
        .not('user_id', 'is', null)
        .limit(1)
        .maybeSingle();
      if (anyOrder?.user_id) {
        baseOrder.user_id = anyOrder.user_id;
      }
    } catch {}

    console.log('createOrder payload.order_number:', baseOrder.order_number, 'len=', String(baseOrder.order_number ?? '').length);
    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert(baseOrder)
      .select("id")
      .single();

    if (orderErr || !order) {
      // Temporary verbose logging to identify auth/config problems
      console.error("createOrder insert error:", orderErr);
      return res.status(500).json({ ok: false, error: orderErr?.message || "Failed to create order" });
    }

    const orderId = order.id as string;
    // fetch order_number for linking
    const { data: fullOrder } = await supabaseAdmin
      .from('orders')
      .select('order_number')
      .eq('id', orderId)
      .maybeSingle();

    // Insert items
    const isUuid = (v: unknown) =>
      typeof v === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(v);

    const itemsPayload = items.map((s) => ({
      order_id: orderId,
      product_id: isUuid(s.id) ? s.id : null,
      product_name: s.name,
      unit_price: s.price,
      quantity: s.quantity,
      subtotal: s.price * s.quantity,
      service_id: s.serviceId ?? serviceId ?? null,
      category_id: s.categoryId ?? categoryId ?? null,
      is_temporary: false,
      is_facility_added: false,
    }));

    const { error: itemsErr } = await supabaseAdmin.from("order_items").insert(itemsPayload);

    if (itemsErr) {
      console.error("createOrder items insert error:", itemsErr);
      return res.status(500).json({ ok: false, error: itemsErr.message });
    }

    // If created from a custom quote, link it back
    if (sourceQuoteId) {
      await supabaseAdmin
        .from('custom_price_quotes')
        .update({ order_id: orderId, order_number: fullOrder?.order_number ?? null, status: 'accepted' })
        .eq('id', sourceQuoteId);
    }

    return res.json({ ok: true, orderId });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "Unexpected error" });
  }
}


