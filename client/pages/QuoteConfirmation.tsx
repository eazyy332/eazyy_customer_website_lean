import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function QuoteConfirmation() {
  const location = useLocation();
  const { quoteId, quoteRequest, estimatedTime } = location.state || {};
  
  const [quoteStatus, setQuoteStatus] = useState<'pending' | 'received' | 'accepted' | 'declined'>('pending');

  // Mock quote response (would come from backend)
  const mockQuote = {
    price: 45.00,
    timeline: '3-4 business days',
    notes: 'Based on the photos provided, we can safely clean this silk dress using our specialized gentle cleaning process. The stain appears to be wine-based and should come out completely with our treatment.',
    breakdown: [
      { item: 'Silk dress cleaning', price: 35.00 },
      { item: 'Stain treatment', price: 10.00 }
    ]
  };

  // Simulate receiving quote after a delay
  setTimeout(() => {
    if (quoteStatus === 'pending') {
      setQuoteStatus('received');
    }
  }, 5000);

  const acceptQuote = () => {
    setQuoteStatus('accepted');
  };

  const declineQuote = () => {
    setQuoteStatus('declined');
  };

  return (
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
          {quoteStatus === 'pending' && (
            <>
              {/* Success Message */}
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-4xl lg:text-5xl font-medium text-black mb-4 leading-tight">
                  Quote Request Submitted!
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                  Thank you for your custom quote request. Our experts are reviewing your item.
                </p>
                <div className="bg-accent rounded-2xl p-6 inline-block">
                  <div className="text-sm text-gray-600 mb-1">Quote Request ID</div>
                  <div className="text-2xl font-bold text-primary">{quoteId}</div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-gray-50 rounded-2xl p-8 mb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="mx-4 h-0.5 bg-gray-300 flex-1"></div>
                  <div className="text-lg font-medium text-primary">Under Review</div>
                </div>
                <p className="text-center text-gray-600">
                  Our cleaning experts are carefully reviewing your photos and description. 
                  You'll receive a detailed quote within <strong>{estimatedTime}</strong>.
                </p>
              </div>

              {/* What's Included */}
              <div className="bg-gray-50 rounded-2xl p-8 mb-8">
                <h3 className="text-lg font-medium text-black mb-4">Your quote will include:</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-black">Detailed price breakdown</div>
                      <div className="text-sm text-gray-600">Transparent pricing for all services</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-black">Estimated timeline</div>
                      <div className="text-sm text-gray-600">Realistic completion timeframe</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-black">Expert recommendations</div>
                      <div className="text-sm text-gray-600">Professional advice for your item</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-black">No obligation</div>
                      <div className="text-sm text-gray-600">Free to decline if not satisfied</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {quoteStatus === 'received' && (
            <>
              {/* Quote Received */}
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h1 className="text-4xl lg:text-5xl font-medium text-black mb-4 leading-tight">
                  Quote Ready!
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                  Our experts have reviewed your item and prepared a detailed quote.
                </p>
              </div>

              {/* Quote Details */}
              <div className="bg-gray-50 rounded-2xl p-8 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-black">Quote Details</h3>
                  <div className="text-3xl font-bold text-primary">€{mockQuote.price.toFixed(2)}</div>
                </div>

                <div className="space-y-4 mb-6">
                  {mockQuote.breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.item}</span>
                      <span className="text-black">€{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Timeline</span>
                    <span className="font-medium text-black">{mockQuote.timeline}</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-black mb-2">Expert Notes</h4>
                  <p className="text-gray-600 text-sm">{mockQuote.notes}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-lg font-medium text-black mb-6">Accept or Decline Quote</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={acceptQuote}
                    className="flex-1 bg-primary text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Accept Quote & Schedule Pickup
                  </button>
                  <button 
                    onClick={declineQuote}
                    className="flex-1 bg-gray-200 text-gray-800 py-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Decline Quote
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-4 text-center">
                  No payment required until after pickup and inspection
                </p>
              </div>
            </>
          )}

          {quoteStatus === 'accepted' && (
            <>
              {/* Quote Accepted */}
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-4xl lg:text-5xl font-medium text-black mb-4 leading-tight">
                  Quote Accepted!
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                  Great! Let's schedule your pickup and delivery.
                </p>
              </div>

              <div className="bg-accent rounded-2xl p-8 text-center">
                <h3 className="text-lg font-medium text-black mb-4">Next Steps</h3>
                <p className="text-gray-600 mb-6">
                  We'll now proceed to schedule your pickup and delivery, just like a standard order.
                </p>
                <Link 
                  to="/order/scheduling"
                  state={{ 
                    selectedServices: [{ 
                      id: 'custom-quote', 
                      name: 'Custom Quote Item', 
                      price: mockQuote.price, 
                      quantity: 1 
                    }], 
                    totalPrice: mockQuote.price 
                  }}
                  className="inline-block bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
                >
                  Schedule Pickup & Delivery
                </Link>
              </div>
            </>
          )}

          {quoteStatus === 'declined' && (
            <>
              {/* Quote Declined */}
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h1 className="text-4xl lg:text-5xl font-medium text-black mb-4 leading-tight">
                  Quote Declined
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                  No problem! Your quote request has been cancelled.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 text-center">
                <h3 className="text-lg font-medium text-black mb-4">What would you like to do next?</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/order/custom-quote"
                    className="inline-block bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
                  >
                    Submit New Quote
                  </Link>
                  <Link 
                    to="/order/start"
                    className="inline-block bg-gray-800 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-700 transition-colors"
                  >
                    Standard Order
                  </Link>
                  <Link 
                    to="/contact"
                    className="inline-block border border-gray-300 text-black px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* Request Summary */}
          {quoteRequest && (
            <div className="bg-gray-50 rounded-2xl p-6 mt-8">
              <h3 className="text-lg font-medium text-black mb-4">Request Summary</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Quote ID:</span>
                  <span className="ml-2 font-medium text-black">{quoteId}</span>
                </div>
                <div>
                  <span className="text-gray-600">Item Type:</span>
                  <span className="ml-2 font-medium text-black capitalize">{quoteRequest.itemType?.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-gray-600">Material:</span>
                  <span className="ml-2 font-medium text-black">{quoteRequest.material}</span>
                </div>
                <div>
                  <span className="text-gray-600">Urgency:</span>
                  <span className="ml-2 font-medium text-black capitalize">{quoteRequest.urgency?.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-center mt-12">
            <Link 
              to="/"
              className="px-6 py-3 border border-gray-300 rounded-full font-medium text-black hover:bg-gray-50 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
