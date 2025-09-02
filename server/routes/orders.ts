import type { Request, Response } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { sendOrderConfirmationEmail } from "../lib/emailService";

type OrderItemInput = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  serviceId?: string | null;
  categoryId?: string | null;
};

export async function createOrder(req: Request, res: Response) {
  try {
    console.log('Order creation request received:', req.body);

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
      contact: { name?: string; firstName?: string; lastName?: string; email: string; phone?: string | null };
      address: string;
      serviceId?: string | null;
      categoryId?: string | null;
      promoCode?: string | null;
      discountAmount?: number | null;
      sourceQuoteId?: string | null;
    } = req.body ?? {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ ok: false, error: "No items provided" });
    }

    // Calculate totals
    const subtotal = totals?.subtotal ?? items.reduce((s, it) => s + it.price * it.quantity, 0);
    const tax = totals?.tax ?? 0;
    const shippingFee = totals?.shippingFee ?? 0;
    const total = totals?.total ?? subtotal + tax + shippingFee - (discountAmount ?? 0);

    // Generate order number
    const generateOrderNumber = () => {
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).slice(2, 6).toUpperCase();
      return `EZ-${timestamp}-${random}`;
    };

    // Get current user ID from auth context
    let userId = null;
    let userEmail = null;
    try {
      // Try to get user from auth header if present
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        
        // Create a client-side supabase instance to verify the token
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
        const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
        
        if (supabaseUrl && supabaseAnonKey) {
          const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
          const { data: { user }, error } = await supabaseClient.auth.getUser(token);
          
          if (!error && user) {
            userId = user.id;
            userEmail = user.email;
            console.log('Found authenticated user:', user.id, user.email);
          } else {
            console.log('Auth token validation failed:', error?.message);
          }
        } else {
          console.log('Missing Supabase client configuration for auth validation');
        }
      } else {
        console.log('No authorization header found');
      }
    } catch (e) {
      console.log('Could not get user from auth header:', e);
    }

    // Require authentication
    if (!userId) {
      return res.status(401).json({ 
        ok: false, 
        error: 'Authentication required. Please sign in to place an order.' 
      });
    }

    // Determine email for order and confirmation
    const orderEmail = contact?.email || userEmail;
    if (!orderEmail) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Email address is required for order confirmation.' 
      });
    }

    // Build customer name from contact info
    const customerName = contact?.name || 
      (contact?.firstName && contact?.lastName ? `${contact.firstName} ${contact.lastName}` : '') ||
      contact?.firstName || 
      contact?.lastName || 
      (orderEmail ? orderEmail.split('@')[0] : 'Customer');

    // Build proper address string
    const shippingAddress = typeof address === 'string' ? address : 
      address?.fullAddress || 
      `${address?.streetAddress || ''}${address?.apartment ? `, ${address.apartment}` : ''}, ${address?.city || ''} ${address?.postalCode || ''}`.trim() ||
      'Address not provided';

    const orderData = {
      order_number: generateOrderNumber(),
      user_id: userId,
      customer_name: customerName,
      email: orderEmail,
      phone: contact?.phone || contact?.phoneNumber || address?.phoneNumber || address?.phone || null,
      shipping_address: shippingAddress,
      status: "pending",
      payment_method: "credit_card",
      payment_status: "pending",
      shipping_method: "pickup_delivery",
      subtotal,
      tax,
      shipping_fee: shippingFee,
      total_amount: total,
      pickup_date: pickupDate ? new Date(pickupDate).toISOString() : new Date(Date.now() + 24*60*60*1000).toISOString(),
      delivery_date: deliveryDate ? new Date(deliveryDate).toISOString() : null,
      service_id: serviceId ?? null,
      category_id: categoryId ?? null,
      latitude: "52.3676", // Default Amsterdam coordinates
      longitude: "4.9041",
      promo_code: promoCode ?? null,
      discount_amount: discountAmount ?? null,
    };

    console.log('Creating order with data:', orderData);

    // Insert order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert(orderData)
      .select("id, order_number")
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return res.status(500).json({ 
        ok: false, 
        error: `Failed to create order: ${orderError.message}` 
      });
    }

    if (!order) {
      console.error("No order returned from insert");
      return res.status(500).json({ 
        ok: false, 
        error: "Failed to create order: No data returned" 
      });
    }

    console.log('Order created successfully:', order);

    // Insert order items
    const itemsPayload = items.map(item => ({
      order_id: order.id,
      product_id: null, // We don't have product IDs in this context
      product_name: item.name,
      unit_price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
      service_id: item.serviceId ?? serviceId ?? null,
      category_id: item.categoryId ?? categoryId ?? null,
      description: `${item.name} - ${item.quantity}x at €${item.price}`,
      is_temporary: false,
      is_facility_added: false,
    }));

    console.log('Creating order items:', itemsPayload);

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(itemsPayload);

    if (itemsError) {
      console.error("Order items creation error:", itemsError);
      // Don't fail the entire order if items fail - we can fix this later
      console.log("Order created but items failed to insert");
    } else {
      console.log('Order items created successfully');
    }

    // Update order with service and category information from the first item
    if (items.length > 0) {
      const firstItem = items[0];
      const updateData: any = {};
      
      if (firstItem.serviceId || serviceId) {
        updateData.service_id = firstItem.serviceId || serviceId;
        
        // Get service name for quick reference
        try {
          const { data: serviceData } = await supabaseAdmin
            .from('services')
            .select('name')
            .eq('id', firstItem.serviceId || serviceId)
            .single();
          
          if (serviceData) {
            updateData.service_name = serviceData.name;
          }
        } catch (e) {
          console.log('Could not fetch service name:', e);
        }
      }
      
      if (firstItem.categoryId || categoryId) {
        updateData.category_id = firstItem.categoryId || categoryId;
        
        // Get category name for quick reference
        try {
          const { data: categoryData } = await supabaseAdmin
            .from('categories')
            .select('name')
            .eq('id', firstItem.categoryId || categoryId)
            .single();
          
          if (categoryData) {
            updateData.category_name = categoryData.name;
          }
        } catch (e) {
          console.log('Could not fetch category name:', e);
        }
      }
      
      // Update order with service and category information
      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabaseAdmin
          .from("orders")
          .update(updateData)
          .eq("id", order.id);
        
        if (updateError) {
          console.error("Failed to update order with service/category info:", updateError);
        } else {
          console.log('Order updated with service/category information');
        }
      }
    }

    // Link custom quote if provided
    if (sourceQuoteId) {
      try {
        await supabaseAdmin
          .from('custom_price_quotes')
          .update({ 
            order_id: order.id, 
            order_number: order.order_number,
            status: 'accepted' 
          })
          .eq('id', sourceQuoteId);
        console.log('Custom quote linked to order');
      } catch (e) {
        console.log('Failed to link custom quote:', e);
      }
    }

    console.log('Order creation completed successfully');
    
    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail({
        email: orderEmail,
        firstName: contact?.firstName || contact?.name?.split(' ')[0] || '',
        orderNumber: order.order_number,
        customerName: customerName,
        totalAmount: total,
        pickupDate: pickupDate || undefined,
        deliveryDate: deliveryDate || undefined,
        address: shippingAddress,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      });
      console.log('Order confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order if email fails
    }
    
    return res.json({ 
      ok: true, 
      orderId: order.id,
      orderNumber: order.order_number
    });

  } catch (e: any) {
    console.error("Unexpected order creation error:", e);
    return res.status(500).json({ 
      ok: false, 
      error: `Unexpected error: ${e?.message || 'Unknown error'}` 
    });
  }
}