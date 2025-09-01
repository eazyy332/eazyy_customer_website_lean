import React from "react";
import { Link, useLocation } from "react-router-dom";
import EazyyIcon from "@/components/EazyyIcon";

export default function CustomQuoteSubmission() {
  const location = useLocation();
  const { quoteItems, totalItems } = location.state || { quoteItems: [], totalItems: 0 };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="px-4 md:px-8 lg:px-12 pt-8 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-5xl font-medium text-black mb-4 leading-tight">
              Custom Quote Request Submitted!
            </h1>
            <p className="text-black text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Thank you for your custom quote request. Our experts are reviewing your items and will provide detailed quotes within 2-4 hours.
            </p>
            <div className="bg-[#E9F1FF] rounded-[20px] p-8 inline-block border border-blue-100">
              <div className="text-sm text-gray-600 mb-1">Quote Requests</div>
              <div className="text-3xl font-bold text-primary">{totalItems}</div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-white rounded-[28px] border border-gray-200 p-8 mb-12 shadow-[0_8px_30px_rgba(17,24,39,0.08)]">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 h-10 px-4 rounded-full bg-accent mb-6">
                <EazyyIcon className="w-6 h-7 text-primary" />
                <span className="text-primary font-medium">What happens next</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-medium text-black mb-4 leading-tight">
                Your Quote Journey
              </h2>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                Here's what you can expect from our expert review process
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">Expert Review</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our cleaning specialists carefully examine your photos and descriptions to understand your specific needs.
                </p>
                <div className="mt-4 text-sm text-green-600 font-medium">✓ Complete</div>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">Custom Pricing</h3>
                <p className="text-gray-600 leading-relaxed">
                  We create detailed quotes with transparent pricing based on the complexity and care required for each item.
                </p>
                <div className="mt-4 text-sm text-orange-600 font-medium">⏳ In Progress</div>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">Quote Delivery</h3>
                <p className="text-gray-600 leading-relaxed">
                  You'll receive detailed quotes via email with pricing, timeline, and care recommendations for approval.
                </p>
                <div className="mt-4 text-sm text-gray-500 font-medium">Pending</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 rounded-[28px] p-8 mb-12">
            <h3 className="text-xl font-medium text-black mb-6 text-center">Expected Timeline</h3>
            
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary mb-2">2-4 hrs</div>
                <div className="text-sm text-gray-600">Initial Quote</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">24 hrs</div>
                <div className="text-sm text-gray-600">Your Decision</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">1-2 days</div>
                <div className="text-sm text-gray-600">Pickup Scheduled</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">3-7 days</div>
                <div className="text-sm text-gray-600">Expert Cleaning</div>
              </div>
            </div>
          </div>

          {/* Quote Items Summary */}
          {quoteItems && quoteItems.length > 0 && (
            <div className="bg-white rounded-[28px] border border-gray-200 p-8 mb-12 shadow-[0_8px_30px_rgba(17,24,39,0.08)]">
              <h3 className="text-xl font-medium text-black mb-6">Items Submitted for Quote</h3>
              
              <div className="space-y-4">
                {quoteItems.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      {item.icon && (
                        <img 
                          src={item.icon} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <div className="font-medium text-black">{item.name}</div>
                        <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="text-sm text-orange-600 font-medium">
                      Quote Pending
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What's Included */}
          <div className="bg-white rounded-[28px] border border-gray-200 p-8 mb-12 shadow-[0_8px_30px_rgba(17,24,39,0.08)]">
            <h3 className="text-xl font-medium text-black mb-6">Your Custom Quote Will Include</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-2">Detailed Pricing</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Transparent breakdown of all costs with no hidden fees or surprise charges.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-2">Realistic Timeline</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Accurate completion timeframe based on your item's specific requirements.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-2">Expert Recommendations</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Professional advice on the best cleaning methods for your specific items.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-2">No Obligation</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Free to review and decline if the quote doesn't meet your expectations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-[#E9F1FF] rounded-[28px] p-8 mb-12 border border-blue-100">
            <h3 className="text-xl font-medium text-black mb-6 text-center">What Happens Next?</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-1">Expert Review (2-4 hours)</h4>
                  <p className="text-gray-600 text-sm">
                    Our cleaning specialists analyze your photos and descriptions to understand the specific care requirements.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-1">Quote Delivery (Email)</h4>
                  <p className="text-gray-600 text-sm">
                    You'll receive detailed quotes with pricing, timeline, and care recommendations via email.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 text-gray-600 font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-1">Your Decision (24 hours)</h4>
                  <p className="text-gray-600 text-sm">
                    Review the quotes and decide which items you'd like us to clean. No payment required until you approve.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 text-gray-600 font-bold text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-1">Schedule & Process</h4>
                  <p className="text-gray-600 text-sm">
                    Once approved, we'll schedule pickup and delivery, then provide expert cleaning for your items.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-[28px] p-8 mb-12">
            <div className="text-center mb-6">
              <h3 className="text-xl font-medium text-black mb-2">Questions About Your Quote?</h3>
              <p className="text-gray-600">Our customer service team is here to help</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h4 className="font-medium text-black mb-1">Call Us</h4>
                <p className="text-primary font-medium">1-800-EAZZY-1</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-medium text-black mb-1">Email</h4>
                <p className="text-primary font-medium">hello@eazyy.com</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h4 className="font-medium text-black mb-1">Live Chat</h4>
                <p className="text-primary font-medium">Available 24/7</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/orders"
                className="inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View My Orders
              </Link>
              <Link
                to="/order/start"
                className="inline-flex items-center justify-center border border-gray-300 text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Place Another Order
              </Link>
            </div>
            
            <Link
              to="/"
              className="inline-block text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}