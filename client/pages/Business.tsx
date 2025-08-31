import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase";
import EazyyIcon from "@/components/EazyyIcon";

export default function Business() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    businessType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('business_inquiries')
        .insert({
          company_name: formData.companyName,
          business_type: formData.businessType,
          contact_name: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          additional_info: formData.message,
          status: 'pending'
        });

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        businessType: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Business inquiry submission error:', error);
      setSubmitStatus('error');
      setErrorMessage(error?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-form');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Business Solutions | eazyy</title>
        <meta name="description" content="Professional laundry solutions for hotels, restaurants, gyms, and offices. Flexible pickup, delivery, and transparent pricing." />
        <meta property="og:title" content="Business Laundry Solutions | eazyy" />
        <meta property="og:description" content="Reliable laundry services for your business with professional care and dedicated support." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="relative rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(17,24,39,0.15)]">
            {/* Background Image */}
            <img
              src="https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop"
              alt="Business laundry service"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
            
            {/* Content */}
            <div className="relative z-10 px-6 md:px-10 lg:px-16 py-16 md:py-20 text-white">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-3 h-10 px-4 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                  <EazyyIcon className="w-6 h-7 text-white" />
                  <span className="text-white font-medium">Business Solutions</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 leading-tight">
                  Laundry Solutions for Your Business
                </h1>
                
                <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-2xl">
                  Eazyy helps hotels, gyms, offices, and more with fast, reliable laundry services that keep your business running smoothly.
                </p>
                
                <button
                  onClick={scrollToContact}
                  className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Get in Touch
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 h-10 px-4 rounded-full bg-accent mb-6">
              <EazyyIcon className="w-6 h-7 text-primary" />
              <span className="text-primary font-medium">Why Choose Eazyy</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium text-black mb-6 leading-tight">
              Business Benefits
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your operations with our professional laundry services designed for businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Flexible Pickup & Delivery */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Flexible Pickup & Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                Schedule pickups and deliveries that work with your business hours. Daily, weekly, or on-demand service available.
              </p>
            </div>

            {/* Professional Care & Quality */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Professional Care & Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                Commercial-grade equipment and expert staff ensure consistent, high-quality results for all your business linens.
              </p>
            </div>

            {/* Transparent Pricing */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Transparent Pricing</h3>
              <p className="text-gray-600 leading-relaxed">
                Clear, upfront pricing with volume discounts. No hidden fees or surprise charges on your monthly invoice.
              </p>
            </div>

            {/* Dedicated Business Support */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Dedicated Business Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Dedicated account manager and priority support to ensure your business operations never skip a beat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="px-4 md:px-8 py-16 md:py-20 bg-gray-50">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-medium text-black mb-6 leading-tight">
              Industries We Serve
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From hospitality to healthcare, we provide tailored laundry solutions for diverse business needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Hotels */}
            <div className="bg-white rounded-3xl p-8 text-center shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all group">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🏨</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Hotels</h3>
              <p className="text-gray-600 leading-relaxed">
                Bed linens, towels, uniforms, and guest laundry services with quick turnaround times.
              </p>
            </div>

            {/* Restaurants */}
            <div className="bg-white rounded-3xl p-8 text-center shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all group">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🍽️</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Restaurants</h3>
              <p className="text-gray-600 leading-relaxed">
                Chef uniforms, aprons, table linens, and kitchen towels cleaned to food service standards.
              </p>
            </div>

            {/* Gyms & Spas */}
            <div className="bg-white rounded-3xl p-8 text-center shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all group">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🏋️</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Gyms & Spas</h3>
              <p className="text-gray-600 leading-relaxed">
                Towels, robes, workout gear, and spa linens with antimicrobial treatment options.
              </p>
            </div>

            {/* Offices */}
            <div className="bg-white rounded-3xl p-8 text-center shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all group">
              <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">💼</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Offices</h3>
              <p className="text-gray-600 leading-relaxed">
                Employee uniforms, corporate apparel, and office cleaning supplies with convenient scheduling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-medium text-black mb-6 leading-tight">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, streamlined process designed for busy businesses
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 transform -translate-y-1/2"></div>
            
            <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
              {/* Step 1 */}
              <div className="text-center relative">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white border-4 border-primary rounded-full flex items-center justify-center z-20">
                  <span className="text-primary font-bold text-sm">1</span>
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">Schedule Your Pickups</h3>
                <p className="text-gray-600 leading-relaxed">
                  Set up regular pickup schedules that work with your business operations. Daily, weekly, or custom frequency.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center relative">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white border-4 border-primary rounded-full flex items-center justify-center z-20">
                  <span className="text-primary font-bold text-sm">2</span>
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">We Process Your Laundry</h3>
                <p className="text-gray-600 leading-relaxed">
                  Professional cleaning using commercial-grade equipment and industry-specific protocols for optimal results.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center relative">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white border-4 border-primary rounded-full flex items-center justify-center z-20">
                  <span className="text-primary font-bold text-sm">3</span>
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">Reliable Delivery</h3>
                <p className="text-gray-600 leading-relaxed">
                  Clean, pressed, and folded items delivered exactly when you need them. Real-time tracking included.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 md:px-8 py-16 md:py-20 bg-gray-50">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-medium text-black mb-6 leading-tight">
              What Our Business Clients Say
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <img
                  src="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                  alt="Sarah Johnson"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-black">Sarah Johnson</div>
                  <div className="text-sm text-gray-600">Hotel Manager, Grand Plaza</div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 italic leading-relaxed">
                "Eazyy has transformed our hotel's laundry operations. Consistent quality, reliable timing, and excellent customer service. Our guests notice the difference."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <img
                  src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                  alt="Marcus Chen"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-black">Marcus Chen</div>
                  <div className="text-sm text-gray-600">Owner, FitLife Gym</div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 italic leading-relaxed">
                "The antimicrobial treatment and fast turnaround keep our gym towels fresh and ready. Professional service that our members appreciate."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <img
                  src="https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                  alt="Elena Rodriguez"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-black">Elena Rodriguez</div>
                  <div className="text-sm text-gray-600">Operations Manager, TechCorp</div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 italic leading-relaxed">
                "Eazyy handles all our corporate uniform cleaning. The dedicated account manager makes everything seamless and stress-free."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 h-10 px-4 rounded-full bg-accent mb-6">
              <EazyyIcon className="w-6 h-7 text-primary" />
              <span className="text-primary font-medium">Get Started</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium text-black mb-6 leading-tight">
              Ready to Partner with Eazyy?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tell us about your business needs and we'll create a custom solution for you
            </p>
          </div>

          <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                    placeholder="your.email@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                    placeholder="+31 20 123 4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Business Type *</label>
                <select
                  required
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                >
                  <option value="">Select your business type</option>
                  <option value="hotel">Hotel</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="gym">Gym/Fitness Center</option>
                  <option value="spa">Spa/Wellness Center</option>
                  <option value="office">Office/Corporate</option>
                  <option value="healthcare">Healthcare Facility</option>
                  <option value="retail">Retail Store</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Tell us about your needs</label>
                <textarea
                  rows={5}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors resize-none"
                  placeholder="Describe your laundry volume, frequency needs, special requirements, or any questions you have..."
                />
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-800 font-medium">Thank you! We'll contact you within 24 hours to discuss your business needs.</span>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-red-800">{errorMessage}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Business Inquiry'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="relative rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(17,24,39,0.15)]">
            <img
              src="https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop"
              alt="Professional laundry service"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-blue-700/90"></div>
            
            <div className="relative z-10 px-6 md:px-10 lg:px-16 py-12 md:py-16 text-white text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-4 leading-tight">
                Ready to Make Laundry Hassle-Free for Your Business?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join hundreds of businesses that trust Eazyy for their professional laundry needs
              </p>
              <button
                onClick={scrollToContact}
                className="inline-flex items-center bg-white text-primary px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Contact Us Today
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}