import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthGuard from "@/components/AuthGuard";

interface PaymentMethod {
  id: string;
  name: string;
  type: 'ideal' | 'card' | 'paypal' | 'wallet';
  icon: string;
  description: string;
}

interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export default function OrderPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedServices, totalPrice, schedule, address, sourceQuoteId } = location.state || { 
    selectedServices: [], 
    totalPrice: 0, 
    schedule: {}, 
    address: {},
    sourceQuoteId: null
  };
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [idealBank, setIdealBank] = useState('');
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'ideal',
      name: 'iDEAL',
      type: 'ideal',
      icon: '🏦',
      description: 'Pay securely with your Dutch bank account'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      type: 'card',
      icon: '💳',
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      type: 'paypal',
      icon: '💰',
      description: 'Pay with your PayPal account'
    },
    {
      id: 'wallet',
      name: 'eazzy Wallet',
      type: 'wallet',
      icon: '👛',
      description: 'Use your wallet balance: €45.50 available'
    }
  ];

  const idealBanks = [
    'ABN AMRO',
    'ASN Bank',
    'Bunq',
    'ING',
    'Knab',
    'Rabobank',
    'SNS Bank',
    'Triodos Bank',
    'Van Lanschot'
  ];

  const handleCardDetailChange = (field: keyof CardDetails, value: string) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const isFormValid = () => {
    if (!selectedPaymentMethod || !acceptTerms) return false;
    
    if (selectedPaymentMethod === 'ideal') {
      return idealBank !== '';
    }
    
    if (selectedPaymentMethod === 'card') {
      return cardDetails.cardNumber.replace(/\s/g, '').length >= 13 &&
             cardDetails.expiryDate.length === 5 &&
             cardDetails.cvv.length >= 3 &&
             cardDetails.cardholderName.trim() !== '';
    }
    
    return true; // PayPal and wallet don't need additional validation
  };

  const handlePayment = async () => {
    if (!isFormValid()) return;

    setIsProcessing(true);
    try {
      // Get auth token for server-side user identification
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;

      // Prepare the order data in the format expected by the API
      const orderData = {
        items: selectedServices.map(service => ({
          id: service.id,
          name: service.name,
          price: service.price,
          quantity: service.quantity
        })),
        totals: {
          subtotal: totalPrice,
          tax: 0,
          shippingFee: 0,
          total: totalPrice
        },
        contact: {
          name: address?.fullName || address?.name || 'Customer',
          email: address?.email || 'customer@example.com',
          phone: address?.phoneNumber || address?.phone || null
        },
        address: typeof address === 'string' ? address : (
          address?.fullAddress || 
          `${address?.streetAddress || ''} ${address?.apartment || ''}, ${address?.city || ''} ${address?.postalCode || ''}`.trim()
        ),
        pickupDate: schedule?.pickupDate || null,
        deliveryDate: schedule?.deliveryDate || null,
        sourceQuoteId
      };

      console.log('Sending order data:', orderData);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      // Add auth token if available
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      });
      
      console.log('Order API response status:', res.status);
      
      const data = await res.json();
      console.log('Order API response data:', data);
      
      if (!res.ok || !data.ok) {
        const errorMessage = data.error || 'Failed to create order';
        console.error('Order creation failed:', errorMessage);
        alert(`Order creation failed: ${errorMessage}`);
        return;
      }

      // Clear cart after successful order
      localStorage.removeItem('eazzy-cart');
      
      navigate('/order/confirmation', {
        state: {
          orderId: data.orderNumber || data.orderId,
          selectedServices,
          totalPrice,
          schedule,
          address,
          paymentMethod: paymentMethods.find(pm => pm.id === selectedPaymentMethod)
        }
      });
    } catch (e) {
      console.error('Order creation exception:', e);
      alert('Order creation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AuthGuard redirectMessage="Please sign in to complete your order">
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
              <Link to="/help" className="text-black hover:text-primary transition-colors">Help</Link>
              <div className="text-black">EN</div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="px-4 lg:px-16 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Services</span>
              <span>Scheduling</span>
              <span>Address</span>
              <span className="text-primary font-medium">Payment</span>
              <span>Confirmation</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: '80%' }}></div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-medium text-black mb-6 leading-tight">
              Payment Method
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Choose how you'd like to pay for your order
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Method Selection */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-lg font-medium text-black mb-6">Select Payment Method</h3>
                
                <div className="space-y-3">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`w-full p-4 rounded-lg text-left transition-colors ${
                        selectedPaymentMethod === method.id
                          ? 'bg-primary text-white'
                          : 'bg-white border border-gray-200 hover:border-primary text-black'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{method.icon}</span>
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className={`text-sm ${
                              selectedPaymentMethod === method.id ? 'text-white/80' : 'text-gray-600'
                            }`}>
                              {method.description}
                            </div>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedPaymentMethod === method.id
                            ? 'bg-white border-white'
                            : 'border-gray-300'
                        }`}>
                          {selectedPaymentMethod === method.id && (
                            <div className="w-full h-full bg-primary rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* iDEAL Bank Selection */}
              {selectedPaymentMethod === 'ideal' && (
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h3 className="text-lg font-medium text-black mb-6">Choose Your Bank</h3>
                  <select 
                    value={idealBank}
                    onChange={(e) => setIdealBank(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                  >
                    <option value="">Select your bank</option>
                    {idealBanks.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Card Details */}
              {selectedPaymentMethod === 'card' && (
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h3 className="text-lg font-medium text-black mb-6">Card Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Cardholder Name</label>
                      <input 
                        type="text" 
                        value={cardDetails.cardholderName}
                        onChange={(e) => handleCardDetailChange('cardholderName', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                        placeholder="Name on card"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Card Number</label>
                      <input 
                        type="text" 
                        value={cardDetails.cardNumber}
                        onChange={(e) => handleCardDetailChange('cardNumber', formatCardNumber(e.target.value))}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Expiry Date</label>
                        <input 
                          type="text" 
                          value={cardDetails.expiryDate}
                          onChange={(e) => handleCardDetailChange('expiryDate', formatExpiryDate(e.target.value))}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">CVV</label>
                        <input 
                          type="text" 
                          value={cardDetails.cvv}
                          onChange={(e) => handleCardDetailChange('cvv', e.target.value.replace(/\D/g, ''))}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="flex items-center">
                      <input 
                        type="checkbox"
                        checked={savePaymentMethod}
                        onChange={(e) => setSavePaymentMethod(e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">Save this payment method for future orders</span>
                    </label>
                  </div>
                </div>
              )}

              {/* PayPal Info */}
              {selectedPaymentMethod === 'paypal' && (
                <div className="bg-gray-50 rounded-2xl p-8">
                  <div className="text-center">
                    <div className="text-4xl mb-4">💰</div>
                    <h3 className="text-lg font-medium text-black mb-2">PayPal Payment</h3>
                    <p className="text-gray-600">You'll be redirected to PayPal to complete your payment securely.</p>
                  </div>
                </div>
              )}

              {/* Wallet Info */}
              {selectedPaymentMethod === 'wallet' && (
                <div className="bg-gray-50 rounded-2xl p-8">
                  <div className="text-center">
                    <div className="text-4xl mb-4">👛</div>
                    <h3 className="text-lg font-medium text-black mb-2">eazzy Wallet</h3>
                    <p className="text-gray-600">Current balance: <span className="font-medium text-black">€45.50</span></p>
                    <p className="text-sm text-gray-500 mt-2">
                      Order total: €{totalPrice.toFixed(2)}
                      {totalPrice > 45.50 && (
                        <span className="text-red-600 block">Insufficient balance. Please choose another payment method.</span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <label className="flex items-start">
                  <input 
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mr-3 mt-1"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and 
                    <Link to="/privacy" className="text-primary hover:underline ml-1">Privacy Policy</Link>. 
                    Payment will be authorized now but charged only after pickup.
                  </span>
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-8">
                <h3 className="text-lg font-medium text-black mb-4">Order Summary</h3>
                
                <div className="space-y-3 text-sm">
                  {selectedServices.map((service, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600">
                        {service.name} ×{service.quantity}
                      </span>
                      <span className="text-black">€{(service.price * service.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-black">€{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pickup & Delivery</span>
                      <span className="text-green-600">Free</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-black">Total</span>
                      <span className="font-bold text-primary text-lg">€{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2 text-xs text-gray-500">
                  <p>• Payment authorized on checkout</p>
                  <p>• Charged only after successful pickup</p>
                  <p>• 100% satisfaction guarantee</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12">
            <Link 
              to="/order/address"
              state={{ selectedServices, totalPrice, schedule }}
              className="px-6 py-3 border border-gray-300 rounded-full font-medium text-black hover:bg-gray-50 transition-colors"
            >
              ← Back to Address
            </Link>
            
            <button 
              onClick={handlePayment}
              disabled={!isFormValid() || isProcessing || (selectedPaymentMethod === 'wallet' && totalPrice > 45.50)}
              className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                `Complete Order → ${totalPrice.toFixed(2)}€`
              )}
            </button>
          </div>
        </div>
      </main>
      </div>
    </AuthGuard>
  );
}
