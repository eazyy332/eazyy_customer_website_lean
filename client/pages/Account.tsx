import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/AuthGuard";

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
}

interface UserAddress {
  id: string;
  name: string;
  street: string;
  house_number: string;
  additional_info: string;
  city: string;
  postal_code: string;
  is_default: boolean;
}

interface RecentOrder {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  pickup_date: string;
  delivery_date: string;
}

export default function Account() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>('profile');

  useEffect(() => {
    if (!user) return;
    
    const loadAccountData = async () => {
      try {
        setLoading(true);
        
        // Load user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (profileData) {
          setProfile(profileData);
        }

        // Load user addresses
        const { data: addressData } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false });
        
        if (addressData) {
          setAddresses(addressData);
        }

        // Load recent orders
        const { data: orderData } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (orderData) {
          setRecentOrders(orderData);
        }
      } catch (error) {
        console.error('Error loading account data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAccountData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AuthGuard redirectMessage="Please sign in to view your account">
    case 'in_transit_to_customer':
    case 'out_for_delivery':
      return 'bg-blue-100 text-blue-800';
    case 'ready_for_delivery':
      return 'bg-green-100 text-green-800';
        <div className="min-h-screen bg-white flex items-center justify-center">
    case 'arrived_at_facility':
          <div className="text-center">
    case 'awaiting_pickup_customer':
    case 'pickup_scheduled':
      return 'bg-yellow-100 text-yellow-800';
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading account...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard redirectMessage="Please sign in to view your account">
      <div className="min-h-screen bg-white">
        <main className="px-4 md:px-8 lg:px-12 pt-8 pb-24">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-medium text-black mb-2">My Account</h1>
              <p className="text-gray-600">Manage your profile, addresses, and view order history</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'profile'
                    ? 'text-primary border-primary'
                    : 'text-gray-600 border-transparent hover:text-black'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'addresses'
                    ? 'text-primary border-primary'
                    : 'text-gray-600 border-transparent hover:text-black'
                }`}
              >
                Addresses
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'text-primary border-primary'
                    : 'text-gray-600 border-transparent hover:text-black'
                }`}
              >
                Recent Orders
              </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium text-black">Profile Information</h2>
                    <button className="text-primary hover:text-blue-700 font-medium">Edit</button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Email</label>
                      <div className="text-black font-medium">{user?.email}</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Name</label>
                      <div className="text-black font-medium">
                        {profile?.first_name && profile?.last_name 
                          ? `${profile.first_name} ${profile.last_name}`
                          : 'Not set'
                        }
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Phone</label>
                      <div className="text-black font-medium">{profile?.phone || 'Not set'}</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Member Since</label>
                      <div className="text-black font-medium">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-black mb-4">Account Actions</h3>
                  <div className="space-y-3">
                    <Link
                      to="/order/start"
                      className="block w-full text-center bg-primary text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                      Place New Order
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-center border border-gray-300 text-black py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium text-black">Saved Addresses</h2>
                  <button className="bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                    Add New Address
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-black mb-2">No Saved Addresses</h3>
                    <p className="text-gray-600 mb-4">Add an address to make ordering faster</p>
                    <button className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-black">{address.name}</h3>
                              {address.is_default && (
                                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600">
                              {address.house_number} {address.street}
                              {address.additional_info && `, ${address.additional_info}`}
                            </p>
                            <p className="text-gray-600">
                              {address.city} {address.postal_code}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-primary hover:text-blue-700 text-sm">Edit</button>
                            <button className="text-red-600 hover:text-red-700 text-sm">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium text-black">Recent Orders</h2>
                  <Link
                    to="/orders"
                    className="text-primary hover:text-blue-700 font-medium"
                  >
                    View All Orders
                  </Link>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-black mb-2">No Orders Yet</h3>
                    <p className="text-gray-600 mb-4">Start your first laundry order today</p>
                    <Link
                      to="/order/start"
                      className="inline-block bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                      Place Your First Order
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium text-black">Order #{order.order_number}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                {order.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm">
                              {new Date(order.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            {order.pickup_date && (
                              <p className="text-gray-600 text-sm">
                                Pickup: {new Date(order.pickup_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">€{order.total_amount.toFixed(2)}</div>
                            <Link
                              to={`/order/${order.order_number}`}
                              className="text-primary hover:text-blue-700 text-sm font-medium"
                            >
                              View Details →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}