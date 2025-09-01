import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthGuard from "@/components/AuthGuard";
import { EmailService } from "@/lib/emailService";
import { useAuth } from "@/hooks/useAuth";

type OrderStatus = 'confirmed' | 'pickup_scheduled' | 'picked_up' | 'in_processing' | 'ready_for_delivery' | 'out_for_delivery' | 'delivered';

interface TrackingStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

export default function OrderConfirmation() {
  const location = useLocation();
  const { user } = useAuth();
  const { orderId, selectedServices, totalPrice, schedule, address, paymentMethod } = location.state || {};
  
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('confirmed');
  const [showTracking, setShowTracking] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const trackingSteps: TrackingStep[] = [
    {
      status: 'confirmed',
      label: 'Order Confirmed',
      description: 'Your order has been confirmed and is being prepared',
      timestamp: new Date().toLocaleString(),
      completed: true,
      current: currentStatus === 'confirmed'
    },
    {
      status: 'pickup_scheduled',
      label: 'Pickup Scheduled',
      description: 'Driver assigned and pickup slot confirmed',
      timestamp: currentStatus !== 'confirmed' ? new Date(Date.now() + 60000).toLocaleString() : undefined,
      completed: currentStatus !== 'confirmed',
      current: currentStatus === 'pickup_scheduled'
    },
    {
      status: 'picked_up',
      label: 'Picked Up',
      description: 'Items collected and on the way to our facility',
      completed: false,
      current: currentStatus === 'picked_up'
    },
    {
      status: 'in_processing',
      label: 'In Processing',
      description: 'Your items are being cleaned by our experts',
      completed: false,
      current: currentStatus === 'in_processing'
    },
    {
      status: 'ready_for_delivery',
      label: 'Ready for Delivery',
      description: 'Cleaning complete, ready to be delivered',
      completed: false,
      current: currentStatus === 'ready_for_delivery'
    },
    {
      status: 'out_for_delivery',
      label: 'Out for Delivery',
      description: 'Driver is on the way to deliver your items',
      completed: false,
      current: currentStatus === 'out_for_delivery'
    },
    {
      status: 'delivered',
      label: 'Delivered',
      description: 'Your items have been successfully delivered',
      completed: false,
      current: currentStatus === 'delivered'
    }
  ];

  // Simulate status updates
  useEffect(() => {
    if (currentStatus === 'confirmed') {
      const timer = setTimeout(() => {
        setCurrentStatus('pickup_scheduled');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStatus]);

  // Send order confirmation email on component mount
  useEffect(() => {
    const sendConfirmationEmail = async () => {
      // Determine email address with fallbacks
      const emailAddress = address?.email || user?.email;
      
      // Ensure we have required fields
      if (!orderId || !selectedServices || emailSent || !emailAddress) {
        if (!emailAddress) {
          console.warn('No email address available for order confirmation');
        }
        return;
      }
      
      try {
        await EmailService.sendOrderConfirmation({
          email: emailAddress,
          firstName: address?.firstName || address?.fullName?.split(' ')[0] || '',
          orderNumber: orderId,
          customerName: address?.fullName || `${address?.firstName || ''} ${address?.lastName || ''}`.trim() || 'Customer',
          totalAmount: totalPrice || 0,
          pickupDate: schedule?.pickupDate,
          deliveryDate: schedule?.deliveryDate,
          address: formatAddress(address),
          items: selectedServices.map((service: any) => ({
            name: service.name,
            quantity: service.quantity,
            price: service.price
          }))
        });
        setEmailSent(true);
        console.log('Order confirmation email sent successfully');
      } catch (error) {
        console.error('Failed to send order confirmation email:', error);
        // Don't show error to user - email is not critical for order completion
      }
    };

    sendConfirmationEmail();
  }, [orderId, selectedServices, address, schedule, totalPrice, emailSent, user?.email]);

  const formatAddress = (addr: any) => {
    if (typeof addr === 'string') return addr;
    if (!addr) return 'Address not provided';
    
    return `${addr.streetAddress}${addr.apartment ? `, ${addr.apartment}` : ''}, ${addr.city}, ${addr.postalCode}`;
  };

  return (
    <AuthGuard redirectMessage="Please sign in to view your order confirmation">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="hidden">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-black hover:text-primary transition-colors">Home</Link>
            <Link to="/services" className="text-black hover:text-primary transition-colors">Services</Link>
            <Link to="/about" className="text-black hover:text-primary transition-colors">About us</Link>
            <Link to="/contact" className="text-black hover:text-primary transition-colors">Contact</Link>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img 
              src="https://cdn.builder.io/api/v1/image/assets%2F0ba0452a2d1340e7b84136d8ed253a1b%2Fb6e642e462f04f14827396626baf4d5e?format=webp&width=800" 
              alt="eazyy logo" 
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/orders" className="text-black hover:text-primary transition-colors">My Orders</Link>
            <Link to="/help" className="text-black hover:text-primary transition-colors">Help</Link>
            <div className="text-black">EN</div>
          </div>
        </nav>
      </header>

        {/* Main Content */}
        <main className="px-4 lg:px-16 py-12">
        <div className="max-w-[960px] mx-auto">
          {/* Success Message */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-5xl font-medium text-black mb-4 leading-tight">
              Order Confirmed!
            </h1>
            <p className="text-black text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Thank you for choosing eazyy. Your laundry order has been successfully placed and we'll take excellent care of your items.
            </p>
            <div className="bg-[#E9F1FF] rounded-[20px] p-8 inline-block border border-blue-100">
              <div className="text-sm text-gray-600 mb-1">Order ID</div>
              <div className="text-3xl font-bold text-primary">#{orderId}</div>
            </div>
          </div>

          {/* Tracking Toggle */}
          <div className="text-center mb-12">
            <button 
              onClick={() => setShowTracking(!showTracking)}
              className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {showTracking ? 'Hide' : 'Track'} Order Progress
            </button>
          </div>

          {/* Order Tracking */}
          {showTracking && (
            <div className="bg-white rounded-[28px] border border-gray-200 p-8 mb-12 shadow-[0_8px_30px_rgba(17,24,39,0.08)]">
              <h3 className="text-xl font-medium text-black mb-8">Order Progress</h3>
              
              <div className="relative">
                {trackingSteps.map((step, index) => (
                  <div key={step.status} className="flex items-start mb-6 last:mb-0">
                    {/* Timeline Line */}
                    {index < trackingSteps.length - 1 && (
                      <div className={`absolute left-4 top-8 w-0.5 h-16 ${
                        step.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                    )}
                    
                    {/* Status Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 relative z-10 ${
                      step.completed 
                        ? 'bg-green-500 text-white' 
                        : step.current 
                        ? 'bg-primary text-white animate-pulse shadow-lg' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {step.completed ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 bg-current rounded-full"></div>
                      )}
                    </div>
                    
                    {/* Status Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${step.current ? 'text-primary' : 'text-black'}`}>
                          {step.label}
                        </h4>
                        {step.timestamp && (
                          <span className="text-sm text-gray-500">{step.timestamp}</span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Updates */}
              <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live updates will be sent to your email and phone
                </div>
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="grid md:grid-cols-2 gap-10 mb-12">
            {/* Order Summary */}
            <div className="bg-white rounded-[28px] border border-gray-200 p-8 shadow-[0_8px_30px_rgba(17,24,39,0.08)]">
              <h3 className="text-lg font-medium text-black mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                {selectedServices?.map((service: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {service.name} ×{service.quantity}
                    </span>
                    <span className="text-black">${(service.price * service.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-black">Total</span>
                    <span className="font-bold text-primary">${totalPrice?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Payment Method</div>
                <div className="font-medium text-black">{paymentMethod?.name}</div>
                <div className="text-xs text-gray-500 mt-1">Authorization: Pending pickup</div>
              </div>
            </div>

            {/* Schedule & Address */}
            <div className="bg-white rounded-[28px] border border-gray-200 p-8 shadow-[0_8px_30px_rgba(17,24,39,0.08)]">
              <h3 className="text-lg font-medium text-black mb-4">Schedule & Address</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Pickup</div>
                  <div className="font-medium text-black">
                    {schedule?.pickupDate ? new Date(schedule.pickupDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Not scheduled'}
                  </div>
                  <div className="text-sm text-gray-600">{schedule?.pickupTime}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-1">Delivery</div>
                  <div className="font-medium text-black">
                    {schedule?.deliveryDate ? new Date(schedule.deliveryDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Not scheduled'}
                  </div>
                  <div className="text-sm text-gray-600">{schedule?.deliveryTime}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-1">Address</div>
                  <div className="font-medium text-black">{formatAddress(address)}</div>
                  {address?.specialInstructions && (
                    <div className="text-sm text-gray-600 mt-1">
                      Note: {address.specialInstructions}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-[28px] border border-gray-200 p-8 shadow-[0_8px_30px_rgba(17,24,39,0.08)]">
            <h3 className="text-xl font-medium text-black mb-6">What's Next?</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-black mb-2">Get Ready</h4>
                <p className="text-sm text-gray-600">Prepare your items for pickup on the scheduled date</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.05 11a8 8 0 1115.9 0" />
                  </svg>
                </div>
                <h4 className="font-semibold text-black mb-2">Track Progress</h4>
                <p className="text-sm text-gray-600">Monitor your order status in real-time</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-black mb-2">Stay Updated</h4>
                <p className="text-sm text-gray-600">Receive notifications via email and SMS</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12">
            <Link 
              to="/"
              className="inline-flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              ← Back to Home
            </Link>
            
            <div className="flex space-x-4">
              <Link 
                to="/orders"
                className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View All Orders
              </Link>
              <Link 
                to="/order/start"
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Place New Order
              </Link>
            </div>
          </div>
        </div>
      </main>
      </div>
    </AuthGuard>
  );
}
