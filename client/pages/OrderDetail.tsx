import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Package, Calendar, MapPin, Clock, User, CreditCard, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import AuthGuard from "@/components/AuthGuard";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  description?: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  pickup_date: string;
  delivery_date?: string;
  shipping_address: string;
  payment_method?: string;
  payment_status: string;
  shipping_method: string;
  special_instructions?: string;
  customer_name: string;
  email: string;
  phone?: string;
  order_items: OrderItem[];
}

const statusConfig = {
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  pickup_scheduled: { label: 'Pickup Scheduled', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  in_transit_to_facility: { label: 'In Transit to Facility', color: 'bg-purple-100 text-purple-800', icon: Truck },
  arrived_at_facility: { label: 'Arrived at Facility', color: 'bg-indigo-100 text-indigo-800', icon: Package },
  processing: { label: 'Processing', color: 'bg-orange-100 text-orange-800', icon: Package },
  ready_for_delivery: { label: 'Ready for Delivery', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-blue-100 text-blue-800', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: AlertCircle }
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrder() {
      if (!id) return;
      
      console.log('Loading order with ID:', id);
      
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              id,
              product_name,
              quantity,
              unit_price,
              description
            )
          `)
          .eq('order_number', id)
          .single();

        console.log('Supabase response:', { data, error: fetchError });

        if (fetchError) throw fetchError;
        
        setOrder(data);
      } catch (err: any) {
        console.error('Error loading order:', err);
        setError(err?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'The order you are looking for could not be found.'}
          </p>
          <div className="space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
            <Link
              to="/orders"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.confirmed;
  const StatusIcon = statusInfo.icon;

  return (
    <AuthGuard redirectMessage="Please sign in to view order details">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                  <StatusIcon className="inline w-4 h-4 mr-1" />
                  {statusInfo.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-medium text-gray-900">#{order.order_number || order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pickup Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.pickup_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {order.delivery_date && (
                  <div>
                    <p className="text-sm text-gray-500">Delivery Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(order.delivery_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.order_items && order.order_items.length > 0 ? (
                  order.order_items.map((item, index) => (
                    <div key={item.id || index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.product_name}</p>
                        {item.description && (
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          Quantity: {item.quantity} × €{item.unit_price?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          €{((item.quantity || 1) * (item.unit_price || 0)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No items found for this order</p>
                )}
              </div>
              
              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">€{order.total_amount?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {order.special_instructions && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Special Instructions</h2>
                <p className="text-gray-700">{order.special_instructions}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-500" />
                Customer Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{order.email}</p>
                </div>
                {order.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{order.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                Shipping Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-900">{order.shipping_address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Method</p>
                  <p className="font-medium text-gray-900">{order.shipping_method}</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-gray-500" />
                Payment Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.payment_status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </div>
                {order.payment_method && (
                  <div>
                    <p className="text-sm text-gray-500">Method</p>
                    <p className="font-medium text-gray-900">{order.payment_method}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/orders"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  View All Orders
                </Link>
                {order.status === 'delivered' && (
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reorder
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </AuthGuard>
  );
}
