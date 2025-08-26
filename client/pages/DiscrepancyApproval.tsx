import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import AuthGuard from "@/components/AuthGuard";

interface DbDiscrepancyItem {
  id: string;
  order_id: string;
  original_order_item_id: string | null;
  product_name: string | null;
  expected_quantity: number | null;
  actual_quantity: number | null;
  unit_price: number | null;
  service_id: string | null;
  category_id: string | null;
  service_name?: string | null;
  category_name?: string | null;
  product_id?: string | null;
  status?: string | null;
}

interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string | null;
  unit_price: number;
  quantity: number;
  subtotal: number;
  service_id: string | null;
  category_id: string | null;
}

export default function DiscrepancyApproval() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [items, setItems] = useState<DbDiscrepancyItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItemRow[]>([]);

  useEffect(() => {
    async function load() {
      if (!orderId) return;
      const [{ data: order, error: orderErr }, { data: disc, error: discErr }, { data: oi, error: oiErr }] = await Promise.all([
        supabase.from('orders').select('order_number').eq('id', orderId).maybeSingle(),
        supabase.from('discrepancy_items').select('*').eq('order_id', orderId),
        supabase.from('order_items').select('*').eq('order_id', orderId)
      ]);
      if (!orderErr && order) setOrderNumber(order.order_number || "");
      if (!discErr && Array.isArray(disc)) setItems(disc as DbDiscrepancyItem[]);
      if (!oiErr && Array.isArray(oi)) setOrderItems(oi as OrderItemRow[]);
    }
    load();
  }, [orderId]);

  const [itemDecisions, setItemDecisions] = useState<Record<string, "pending" | "approved" | "declined">>({});

  const handleItemDecision = (
    itemId: string,
    decision: "approved" | "declined",
  ) => {
    setItemDecisions((prev) => ({
      ...prev,
      [itemId]: decision,
    }));
  };

  const allItemsDecided = useMemo(() => items.every((it) => (itemDecisions[it.id] || 'pending') !== 'pending'), [items, itemDecisions]);
  const approvedItems = useMemo(() => items.filter((it) => (itemDecisions[it.id] || 'pending') === 'approved'), [items, itemDecisions]);
  const totalAdditionalCost = useMemo(() => approvedItems.reduce((s, it) => s + Math.max(0, it.unit_price || 0) * Math.max(0, (it.actual_quantity || 0) - (it.expected_quantity || 0)), 0), [approvedItems]);

  async function applyDecisions() {
    if (!orderId) return;
    setIsProcessing(true);
    try {
      for (const it of items) {
        const decision = itemDecisions[it.id];
        if (!decision) continue;
        const status = decision === 'approved' ? 'customer_accepted' : 'customer_declined';
        await supabase.from('discrepancy_items').update({ status }).eq('id', it.id);
        if (decision !== 'approved') continue;

        const expected = Math.max(0, it.expected_quantity || 0);
        const actual = Math.max(0, it.actual_quantity || 0);
        const unit = Math.max(0, it.unit_price || 0);

        if (it.original_order_item_id) {
          await supabase
            .from('order_items')
            .update({ quantity: actual, subtotal: unit * actual })
            .eq('id', it.original_order_item_id);
        } else if (actual > 0) {
          await supabase.from('order_items').insert({
            order_id: orderId,
            product_id: it.product_id ?? null,
            product_name: it.product_name,
            quantity: actual,
            unit_price: unit,
            subtotal: unit * actual,
            service_id: it.service_id,
            category_id: it.category_id,
          });
        }
      }

      const { data: latestItems } = await supabase
        .from('order_items')
        .select('unit_price, quantity')
        .eq('order_id', orderId);
      const subtotal = (latestItems || []).reduce((s: number, r: any) => s + (r.unit_price || 0) * (r.quantity || 0), 0);
      await supabase
        .from('orders')
        .update({ has_discrepancy: false, status: 'processing', subtotal, total_amount: subtotal })
        .eq('id', orderId);

      navigate('/orders', { state: { message: 'Discrepancy decisions submitted successfully', type: 'success' } });
    } catch (e) {
      console.error(e);
      alert('Failed to submit discrepancy decisions. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }

  const getItemDecision = (itemId: string) => itemDecisions[itemId] || 'pending';

  return (
    <AuthGuard redirectMessage="Please sign in to review order discrepancies">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="hidden">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-black hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="text-black hover:text-primary transition-colors"
            >
              Services
            </Link>
            <Link
              to="/about"
              className="text-black hover:text-primary transition-colors"
            >
              About us
            </Link>
            <Link
              to="/contact"
              className="text-black hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0ba0452a2d1340e7b84136d8ed253a1b%2Fb6e642e462f04f14827396626baf4d5e?format=webp&width=800"
              alt="eazyy logo"
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center space-x-6">
            <Link
              to="/help"
              className="text-black hover:text-primary transition-colors"
            >
              Help
            </Link>
            <Link
              to="/orders"
              className="text-black hover:text-primary transition-colors"
            >
              My Orders
            </Link>
            <div className="text-black">EN</div>
          </div>
        </nav>
      </header>

        {/* Main Content */}
        <main className="px-4 lg:px-16 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
              <Link to="/orders" className="hover:text-primary">
                My Orders
              </Link>
              <span>›</span>
              <span>Order {orderNumber}</span>
              <span>›</span>
              <span className="text-black font-medium">Discrepancy Review</span>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-orange-900 mb-2">
                    Extra Items Found
                  </h3>
                  <p className="text-orange-800">
                    Our facility found additional items in your order that
                    weren't originally listed. Please review each item and
                    decide whether you'd like us to clean them for an additional
                    fee.
                  </p>
                </div>
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-medium text-black mb-2">
              Discrepancy Review
            </h1>
            <p className="text-gray-600">Order {orderNumber} • {items.length} items found</p>
          </div>

          {/* Items Review */}
          <div className="space-y-6 mb-8">
            {items.map((item) => {
              const decision = getItemDecision(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  {/* Item Header */}
                  <div
                    className={`px-6 py-4 border-b border-gray-100 ${
                      decision === "approved"
                        ? "bg-green-50"
                        : decision === "declined"
                          ? "bg-red-50"
                          : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-black">{item.product_name || 'Item'}</h3>
                        {!item.original_order_item_id && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            New Item Type
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          €{(item.unit_price || 0).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.service_name || 'Service'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Item Content */}
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Item Image */}
                      <div>
                        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">No image</div>
                      </div>

                      {/* Item Details */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-black mb-2">
                            Description
                          </h4>
                          <p className="text-gray-600">Quantity difference detected.</p>
                        </div>

                        {item.notes && (
                          <div>
                            <h4 className="font-medium text-black mb-2">
                              Facility Notes
                            </h4>
                            <p className="text-gray-600">{item.notes}</p>
                          </div>
                        )}

                        <div>
                          <h4 className="font-medium text-black mb-2">
                            Service Details
                          </h4>
                          <p className="text-gray-600">
                            This item will be processed using our <strong>{item.service_name || 'Service'}</strong> service.
                            {!item.original_order_item_id && (
                              <span className="block mt-1 text-sm text-blue-600">
                                This is a new item type not in our standard
                                catalog.
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Decision Buttons */}
                        <div className="pt-4">
                          <h4 className="font-medium text-black mb-3">
                            Your Decision
                          </h4>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleItemDecision(item.id, 'approved')}
                              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                                decision === "approved"
                                  ? "bg-green-600 text-white"
                                  : "bg-green-100 text-green-700 hover:bg-green-200"
                              }`}
                            >
                              <svg
                                className="w-5 h-5 inline mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Approve & Add
                            </button>
                            <button
                              onClick={() => handleItemDecision(item.id, 'declined')}
                              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                                decision === "declined"
                                  ? "bg-red-600 text-white"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                            >
                              <svg
                                className="w-5 h-5 inline mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Decline
                            </button>
                          </div>
                          {decision === "declined" && (
                            <p className="text-sm text-gray-600 mt-2">
                              This item will be set aside and returned to you
                              without cleaning.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          {Object.keys(itemDecisions).length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-medium text-black mb-4">Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Approved items:</span>
                  <span className="font-medium">{approvedItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Declined items:</span>
                  <span className="font-medium">
                    {items.filter((item) => getItemDecision(item.id) === "declined").length}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Additional cost:</span>
                    <span className="text-primary">
                      €{totalAdditionalCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
            <Link
              to="/orders"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Orders
            </Link>

            <button
              onClick={applyDecisions}
              disabled={!allItemsDecided || isProcessing}
              className={`px-8 py-3 rounded-xl font-medium transition-all ${
                allItemsDecided && !isProcessing
                  ? "bg-primary text-white hover:bg-blue-700 shadow-sm"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                "Submit Decisions"
              )}
            </button>
          </div>

          {!allItemsDecided && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Please review all items before submitting your decisions.
            </p>
          )}
        </div>
      </main>
      </div>
    </AuthGuard>
  );
}
