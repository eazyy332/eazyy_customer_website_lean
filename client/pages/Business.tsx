import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function Business() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Business Solutions | eazyy</title>
        <meta name="description" content="Professional laundry services for businesses, hotels, restaurants, and corporate clients." />
      </Helmet>

      {/* Hero Section */}
      <section className="px-4 md:px-8 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 h-9 px-4 rounded-[10px] bg-[#E9F1FF] mb-6">
              <svg className="w-4 h-4 text-[#1D62DB]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
              </svg>
              <span className="text-[#1D62DB] font-medium">Business Solutions</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-medium text-black mb-6 leading-tight">
              Professional Laundry for Your Business
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Streamline your business operations with our commercial laundry services. 
              From hotels to restaurants, we handle your textile needs so you can focus on your customers.
            </p>
          </div>
        </div>
      </section>

      {/* Business Types */}
      <section className="px-4 md:px-8 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium text-black mb-4">Industries We Serve</h2>
            <p className="text-lg text-gray-600">Tailored solutions for every business type</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-black mb-3">Hotels & Hospitality</h3>
              <p className="text-gray-600 mb-4">Bed linens, towels, uniforms, and guest laundry services with quick turnaround times.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Same-day service available</li>
                <li>• Bulk pricing discounts</li>
                <li>• Quality assurance programs</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-black mb-3">Restaurants & Food Service</h3>
              <p className="text-gray-600 mb-4">Chef uniforms, aprons, table linens, and kitchen textiles with food-safe cleaning.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Food-safe cleaning processes</li>
                <li>• Stain removal expertise</li>
                <li>• Flexible pickup schedules</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-black mb-3">Corporate Offices</h3>
              <p className="text-gray-600 mb-4">Employee uniforms, executive dry cleaning, and office textile maintenance.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Executive dry cleaning</li>
                <li>• Employee uniform programs</li>
                <li>• Convenient office pickup</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-black mb-3">Healthcare & Medical</h3>
              <p className="text-gray-600 mb-4">Medical scrubs, lab coats, and healthcare textiles with sanitization protocols.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Medical-grade sanitization</li>
                <li>• Infection control protocols</li>
                <li>• Regulatory compliance</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-black mb-3">Education & Schools</h3>
              <p className="text-gray-600 mb-4">School uniforms, sports team gear, and institutional laundry services.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Student uniform programs</li>
                <li>• Sports team equipment</li>
                <li>• Bulk processing discounts</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-black mb-3">Retail & Fashion</h3>
              <p className="text-gray-600 mb-4">Store uniforms, display garments, and retail textile maintenance.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Retail uniform cleaning</li>
                <li>• Display garment care</li>
                <li>• Brand standard compliance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Business Benefits */}
      <section className="px-4 md:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium text-black mb-4">Why Choose eazyy for Business?</h2>
            <p className="text-lg text-gray-600">Professional solutions designed for commercial needs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black mb-2">Reliable Scheduling</h3>
              <p className="text-gray-600 text-sm">Consistent pickup and delivery times that fit your business operations</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black mb-2">Quality Assurance</h3>
              <p className="text-gray-600 text-sm">Professional standards with quality control and satisfaction guarantees</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black mb-2">Cost Effective</h3>
              <p className="text-gray-600 text-sm">Volume discounts and competitive pricing for regular business accounts</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black mb-2">Detailed Reporting</h3>
              <p className="text-gray-600 text-sm">Track usage, costs, and service metrics with detailed business reports</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="px-4 md:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium text-black mb-4">Business Services</h2>
            <p className="text-lg text-gray-600">Comprehensive laundry solutions for commercial clients</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <h3 className="text-2xl font-medium text-black mb-4">Uniform Programs</h3>
              <p className="text-gray-700 mb-6">Complete uniform management including cleaning, repairs, and inventory tracking.</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Employee uniform cleaning</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Inventory management</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Repair and alterations</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Branded packaging</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
              <h3 className="text-2xl font-medium text-black mb-4">Linen Services</h3>
              <p className="text-gray-700 mb-6">Professional linen rental and cleaning for hospitality and healthcare.</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Bed linens and towels</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Table linens and napkins</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Medical linens</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Rental programs available</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="px-4 md:px-8 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium text-black mb-4">Business Pricing Plans</h2>
            <p className="text-lg text-gray-600">Flexible plans designed for businesses of all sizes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-xl font-medium text-black mb-2">Starter</h3>
              <p className="text-gray-600 mb-6">Perfect for small businesses and startups</p>
              <div className="text-3xl font-bold text-black mb-6">€199<span className="text-lg font-normal text-gray-600">/month</span></div>
              <ul className="space-y-3 text-gray-600 mb-8">
                <li>✓ Up to 50 lbs per week</li>
                <li>✓ 2 pickups per week</li>
                <li>✓ Standard turnaround</li>
                <li>✓ Basic reporting</li>
                <li>✓ Email support</li>
              </ul>
              <button className="w-full bg-gray-800 text-white py-3 rounded-full font-medium hover:bg-gray-700 transition-colors">
                Get Started
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-primary relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-xl font-medium text-black mb-2">Professional</h3>
              <p className="text-gray-600 mb-6">Ideal for growing businesses</p>
              <div className="text-3xl font-bold text-black mb-6">€399<span className="text-lg font-normal text-gray-600">/month</span></div>
              <ul className="space-y-3 text-gray-600 mb-8">
                <li>✓ Up to 150 lbs per week</li>
                <li>✓ Daily pickups available</li>
                <li>✓ Priority processing</li>
                <li>✓ Advanced reporting</li>
                <li>✓ Dedicated account manager</li>
                <li>✓ Phone & email support</li>
              </ul>
              <button className="w-full bg-primary text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-xl font-medium text-black mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">For large organizations with high volume needs</p>
              <div className="text-3xl font-bold text-black mb-6">Custom<span className="text-lg font-normal text-gray-600"> pricing</span></div>
              <ul className="space-y-3 text-gray-600 mb-8">
                <li>✓ Unlimited volume</li>
                <li>✓ Custom pickup schedules</li>
                <li>✓ Same-day service</li>
                <li>✓ Custom reporting</li>
                <li>✓ API integration</li>
                <li>✓ 24/7 priority support</li>
              </ul>
              <button className="w-full bg-gray-800 text-white py-3 rounded-full font-medium hover:bg-gray-700 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">Ready to Partner with eazyy?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of businesses that trust us with their laundry needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-primary px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Request Quote
              </Link>
              <button
                onClick={() => window.open('tel:1-800-329-9991')}
                className="bg-white/20 text-white px-8 py-3 rounded-full font-medium hover:bg-white/30 transition-colors"
              >
                Call Sales: 1-800-EAZZY-1
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}