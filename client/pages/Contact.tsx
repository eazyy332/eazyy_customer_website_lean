import { Link } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Contact | eazyy</title>
        <meta name="description" content="Get in touch with eazyy for support, quotes, and partnerships." />
      </Helmet>
      {/* Header */}
      <header className="hidden">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-black hover:text-primary transition-colors">Home</Link>
            <Link to="/services" className="text-black hover:text-primary transition-colors">Services</Link>
            <Link to="/about" className="text-black hover:text-primary transition-colors">About us</Link>
            <Link to="/contact" className="text-primary font-medium">Contact</Link>
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
            <div className="flex items-center space-x-3">
              <svg width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.32584 1.47739C6.1167 1.47739 4.32584 2.33683 4.32584 3.39699C4.32584 4.45715 6.1167 5.31659 8.32584 5.31659C10.535 5.31659 12.3258 4.45716 12.3258 3.39699C12.3258 2.33683 10.535 1.47739 8.32584 1.47739ZM11.9668 5.68581C13.4008 5.15965 14.3258 4.33016 14.3258 3.39699C14.3258 1.80674 11.6395 0.517593 8.32584 0.517593C5.01213 0.517593 2.32584 1.80674 2.32584 3.39699C2.32584 4.33016 3.25085 5.15965 4.68485 5.68581C3.67937 5.89926 2.75434 6.20132 1.96188 6.58162C1.34995 6.87529 0.835182 7.20692 0.42761 7.56497C-0.324507 8.2257 -0.0177813 8.89939 0.829231 9.37576C1.64464 9.83436 2.95086 10.1156 4.32584 10.1156H12.3258C13.7008 10.1156 15.007 9.83436 15.8224 9.37576C16.6695 8.89939 16.9762 8.2257 16.2241 7.56497C15.8165 7.20692 15.3017 6.87529 14.6898 6.58162C13.8973 6.20132 12.9723 5.89926 11.9668 5.68581ZM8.32584 6.27639C6.46932 6.27639 4.68885 6.63031 3.37609 7.2603C2.90009 7.48874 2.49977 7.74664 2.18279 8.02511C1.87583 8.29477 1.97485 8.54141 2.35064 8.75276C2.75804 8.98188 3.49168 9.15578 4.32584 9.15578H12.3258C13.16 9.15578 13.8936 8.98188 14.301 8.75276C14.6768 8.54141 14.7758 8.29477 14.4689 8.02511C14.1519 7.74664 13.7516 7.48874 13.2756 7.2603C11.9628 6.63031 10.1824 6.27639 8.32584 6.27639Z" fill="black"/>
              </svg>
              <svg width="20" height="11" viewBox="0 0 20 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M5.10002 2.43719C5.56329 1.34195 7.58104 0.517593 10 0.517593C12.419 0.517593 14.4367 1.34195 14.9 2.43719H15C17.7614 2.43719 20 3.51148 20 4.83669V7.71609C20 9.04129 17.7614 10.1156 15 10.1156H5C2.23858 10.1156 0 9.04129 0 7.71609V4.83669C0 3.51148 2.23858 2.43719 5 2.43719H5.10002ZM5 3.39699C3.34315 3.39699 2 4.04157 2 4.83669V7.71609C2 8.51121 3.34315 9.15578 5 9.15578H15C16.6569 9.15578 18 8.51121 18 7.71609V4.83669C18 4.04157 16.6569 3.39699 15 3.39699H5ZM12.8293 2.43719H7.17071C7.58254 1.87802 8.69378 1.47739 10 1.47739C11.3062 1.47739 12.4175 1.87802 12.8293 2.43719Z" fill="black"/>
              </svg>
              <svg width="21" height="11" viewBox="0 0 21 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0 0.997493C0 0.732452 0.447715 0.517593 1 0.517593H1.76393C2.90025 0.517593 3.93904 0.825692 4.44721 1.31344L4.61803 1.47739H17.5068C19.426 1.47739 20.8517 2.33029 20.4353 3.22941L19.3242 5.6289C19.0192 6.28762 17.8018 6.75629 16.3957 6.75629H7.60434C6.19825 6.75629 4.98081 6.28762 4.67578 5.6289L3.05052 2.11907L2.65836 1.74267C2.48897 1.58009 2.1427 1.47739 1.76393 1.47739H1C0.447715 1.47739 0 1.26253 0 0.997493ZM5.24662 2.43719L6.62816 5.42069C6.72983 5.64026 7.13564 5.79649 7.60434 5.79649H16.3957C16.8644 5.79649 17.2702 5.64026 17.3718 5.42069L18.483 3.0212C18.6217 2.72149 18.1465 2.43719 17.5068 2.43719H5.24662ZM8 8.19599C7.44772 8.19599 7 8.41084 7 8.67589C7 8.94093 7.44772 9.15578 8 9.15578C8.55228 9.15578 9 8.94093 9 8.67589C9 8.41084 8.55228 8.19599 8 8.19599ZM5 8.67589C5 7.88076 6.34315 7.23619 8 7.23619C9.65685 7.23619 11 7.88076 11 8.67589C11 9.47101 9.65685 10.1156 8 10.1156C6.34315 10.1156 5 9.47101 5 8.67589ZM16 8.19599C15.4477 8.19599 15 8.41084 15 8.67589C15 8.94093 15.4477 9.15578 16 9.15578C16.5523 9.15578 17 8.94093 17 8.67589C17 8.41084 16.5523 8.19599 16 8.19599ZM13 8.67589C13 7.88076 14.3431 7.23619 16 7.23619C17.6569 7.23619 19 7.88076 19 8.67589C19 9.47101 17.6569 10.1156 16 10.1156C14.3431 10.1156 13 9.47101 13 8.67589Z" fill="black"/>
              </svg>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-4 lg:px-16 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-accent rounded-lg mb-6">
            <svg className="w-3 h-2 mr-3 fill-primary" viewBox="0 0 8 6" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.93081 2.5385C6.27144 2.23578 5.37582 2.06384 4.45237 2.02552L4.45051 1.98728C4.44327 1.83309 4.43492 1.79953 4.39205 1.75449C4.31801 1.67652 4.20369 1.62177 3.92068 1.52878C3.78093 1.48277 3.63191 1.42952 3.58978 1.41035C3.46303 1.35286 3.43594 1.24892 3.52947 1.17978C3.54914 1.16521 3.62505 1.13907 3.69816 1.12167C3.92773 1.06701 4.22503 1.08175 4.40078 1.15646C4.51472 1.20486 4.54683 1.24831 4.56446 1.37688C4.57578 1.46007 4.58951 1.49133 4.62143 1.50679C4.77268 1.58 5.45321 1.56869 5.5382 1.49169C5.57105 1.46184 5.54526 1.26464 5.49533 1.16388C5.39586 0.963156 5.07425 0.769229 4.70049 0.68454C4.47204 0.632614 4.30372 0.615571 4.01681 0.615571C3.62467 0.615394 3.32069 0.659107 3.05754 0.753421C2.58282 0.923416 2.34992 1.19258 2.46813 1.43482C2.54867 1.59995 2.74149 1.72111 3.11785 1.84316C3.35985 1.92166 3.44262 1.96326 3.46006 2.03602C2.74576 2.08097 2.05985 2.20761 1.50051 2.41752C0.607492 2.75186 0.111247 3.24436 0.0173432 3.77766C-0.0570749 4.186 0.106051 4.61907 0.544394 4.97566C1.63339 5.85902 4.09271 6.11414 5.99622 5.70315C6.58303 5.57784 7.0802 5.37288 7.43744 5.11987C7.56568 5.02988 7.72732 4.92073 7.734 4.80522C7.734 4.7185 7.62599 4.65112 7.4573 4.62225C7.32925 4.59028 7.18747 4.59028 7.05923 4.59037H6.4251C6.26995 4.59054 6.10126 4.59054 5.95298 4.62251C5.76406 4.66446 5.64269 4.751 5.50109 4.82165C5.31217 4.91482 5.09633 4.99182 4.84673 5.04004C4.08844 5.1846 3.10894 5.09488 2.58579 4.79004C2.29814 4.62136 2.17621 4.42179 2.09493 4.21346L5.02748 4.21293L7.00355 4.21258C7.2398 4.21258 7.59723 4.24446 7.79562 4.17373C8.06545 4.08056 7.99771 3.84398 7.97748 3.70851C7.90325 3.27032 7.61245 2.85112 6.93081 2.5385ZM2.17213 3.59194C2.46182 2.91514 4.21148 2.58548 5.34798 3.03021C5.52354 3.09759 5.66514 3.18422 5.77315 3.27739C5.88765 3.37673 5.97525 3.47917 6.00253 3.59133L2.17194 3.59194H2.17213Z"/>
            </svg>
            <span className="text-primary font-medium">Contact Us</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-medium text-black mb-6 leading-tight">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Have questions about our services? Need help with an order? We're here to help you make laundry
          </p>
          <div className="flex items-center justify-center mt-4">
            <img 
              src="https://cdn.builder.io/api/v1/image/assets%2F0ba0452a2d1340e7b84136d8ed253a1b%2Fb6e642e462f04f14827396626baf4d5e?format=webp&width=800" 
              alt="eazyy logo" 
              className="h-8 w-auto"
            />
          </div>
        </div>
      </section>

      {/* Contact Methods & Form */}
      <section className="px-4 lg:px-16 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-medium text-black mb-6">Contact Information</h2>
                <p className="text-gray-600 mb-8">
                  Choose the method that works best for you. We're available 7 days a week to assist with all your laundry needs.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-black mb-2">Phone Support</h3>
                      <p className="text-gray-600 mb-2">Speak directly with our customer service team</p>
                      <p className="text-primary font-medium">1-800-EAZZY-1 (1-800-329-9991)</p>
                      <p className="text-sm text-gray-500">Monday - Sunday: 7 AM - 10 PM</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-black mb-2">Email Support</h3>
                      <p className="text-gray-600 mb-2">Send us a message and we'll respond within 2 hours</p>
                      <p className="text-primary font-medium">hello@eazyy.com</p>
                      <p className="text-sm text-gray-500">24/7 response time</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-black mb-2">Live Chat</h3>
                      <p className="text-gray-600 mb-2">Chat with our team in real-time</p>
                      <button onClick={() => alert('Live chat functionality coming soon! Please call 1-800-EAZZY-1 for immediate assistance.')} className="text-primary font-medium hover:underline">Start Live Chat</button>
                      <p className="text-sm text-gray-500">Available 24/7</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-black mb-2">Visit Our Office</h3>
                      <p className="text-gray-600 mb-2">Stop by our headquarters</p>
                      <p className="text-black">123 Clean Street<br />Laundry District, LD 12345</p>
                      <p className="text-sm text-gray-500">Monday - Friday: 9 AM - 6 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 rounded-3xl p-8">
              <div className="mb-6">
                <h2 className="text-3xl font-medium text-black mb-2">Send us a Message</h2>
                <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              <form
                className="space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSubmitting(true);
                  setSuccess(null);
                  setError(null);

                  const form = e.currentTarget as HTMLFormElement;
                  const formData = new FormData(form);
                  const payload = {
                    firstName: formData.get("firstName") as string,
                    lastName: formData.get("lastName") as string,
                    email: formData.get("email") as string,
                    phone: formData.get("phone") as string,
                    subject: formData.get("subject") as string,
                    message: formData.get("message") as string,
                  };

                  try {
                    const res = await fetch("/api/contact", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    const data = await res.json();
                    if (!res.ok || !data.ok) throw new Error(data.error || "Failed to send");
                    setSuccess("Message sent successfully! We will get back to you within 2 hours.");
                    form.reset();
                  } catch (err: any) {
                    setError(err?.message ?? "Something went wrong. Please try again.");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2" htmlFor="firstName">First Name</label>
                    <input
                      name="firstName"
                      id="firstName"
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2" htmlFor="lastName">Last Name</label>
                    <input
                      name="lastName"
                      id="lastName"
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2" htmlFor="email">Email Address</label>
                  <input
                    name="email"
                    id="email"
                    type="email"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2" htmlFor="phone">Phone Number</label>
                  <input
                    name="phone"
                    id="phone"
                    type="tel"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2" htmlFor="subject">Subject</label>
                  <select name="subject" id="subject" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors" required>
                    <option value="">Select a subject</option>
                    <option>General Inquiry</option>
                    <option>Service Question</option>
                    <option>Pricing Information</option>
                    <option>Order Support</option>
                    <option>Billing Question</option>
                    <option>Feedback/Complaint</option>
                    <option>Partnership Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2" htmlFor="message">Message</label>
                  <textarea
                    name="message"
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>

                {success && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-green-700">
                    {success}
                  </div>
                )}
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-white py-4 rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 lg:px-16 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-medium text-black mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-medium text-black mb-3">How do I schedule a pickup?</h3>
              <p className="text-gray-600">You can schedule a pickup through our website, mobile app, or by calling our customer service line. Simply choose your preferred time slot and we'll come to you.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-medium text-black mb-3">What areas do you serve?</h3>
              <p className="text-gray-600">We currently serve major metropolitan areas across the country. Enter your zip code on our website to check if we deliver to your location.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-medium text-black mb-3">How long does it take to get my clothes back?</h3>
              <p className="text-gray-600">Standard wash & fold service takes 24-48 hours. Dry cleaning typically takes 2-3 business days. Rush service is available for an additional fee.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-medium text-black mb-3">What if I'm not satisfied with the service?</h3>
              <p className="text-gray-600">We stand behind our work with a 100% satisfaction guarantee. If you're not happy with any item, we'll re-clean it for free or provide a full refund.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-medium text-black mb-3">Do you offer contactless pickup and delivery?</h3>
              <p className="text-gray-600">Yes! We offer completely contactless service. Leave your laundry in a designated spot and we'll pick it up and return it without any face-to-face contact.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link to="/help" className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors">
              Visit Help Center
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="hidden">
        <div className="bg-gray-100 rounded-3xl px-8 lg:px-16 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-semibold text-black mb-4">Sections</h3>
              <div className="space-y-3">
                <Link to="/personal" className="block text-black hover:text-primary transition-colors">Personal</Link>
                <Link to="/business" className="block text-black hover:text-primary transition-colors">Business</Link>
                <Link to="/company" className="block text-black hover:text-primary transition-colors">Company</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-4">Help</h3>
              <div className="space-y-3">
                <Link to="/privacy" className="block text-black hover:text-primary transition-colors">Privacy</Link>
                <Link to="/complaints" className="block text-black hover:text-primary transition-colors">Complaints</Link>
                <Link to="/cookie-policy" className="block text-black hover:text-primary transition-colors">Cookie Policy</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-4">Company policies</h3>
              <div className="space-y-3">
                <Link to="/website-terms" className="block text-black hover:text-primary transition-colors">website terms</Link>
                <Link to="/legal-agreements" className="block text-black hover:text-primary transition-colors">Legal Agreements</Link>
                <Link to="/modern-slavery-policy" className="block text-black hover:text-primary transition-colors">Modern Slavery Policy</Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center pt-8 border-t border-gray-200">
            <div className="mb-6 md:mb-0">
              <img 
                src="https://cdn.builder.io/api/v1/image/assets%2F0ba0452a2d1340e7b84136d8ed253a1b%2Fb6e642e462f04f14827396626baf4d5e?format=webp&width=800" 
                alt="eazyy logo" 
                className="h-8 w-auto"
              />
            </div>
            <div className="flex space-x-4">
              <a href="https://facebook.com/eazzy" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.99982 0C4.0294 0 0 4.04428 0 9.03306C0 13.2692 2.90586 16.8239 6.82582 17.8002V11.7936H4.97006V9.03306H6.82582V7.84359C6.82582 4.76909 8.21216 3.34404 11.2195 3.34404C11.7898 3.34404 12.7736 3.45641 13.1761 3.56842V6.07058C12.9637 6.04818 12.5947 6.03698 12.1364 6.03698C10.6608 6.03698 10.0906 6.59811 10.0906 8.05677V9.03306H13.0303L12.5252 11.7936H10.0906V18C14.5469 17.4598 18 13.6515 18 9.03306C17.9996 4.04428 13.9702 0 8.99982 0Z" fill="black"/>
                </svg>
              </a>
              <a href="https://instagram.com/eazzy" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.70461 1.56752C11.0304 1.56752 11.3059 1.57772 12.2205 1.61852C13.0706 1.65592 13.5296 1.79874 13.8356 1.91774C14.2403 2.07416 14.5327 2.26457 14.8353 2.56719C15.1413 2.87322 15.3284 3.16224 15.4848 3.56687C15.6038 3.87289 15.7466 4.33533 15.784 5.18199C15.8248 6.10006 15.835 6.37548 15.835 8.69786C15.835 11.0236 15.8248 11.2991 15.784 12.2137C15.7466 13.0638 15.6038 13.5228 15.4848 13.8288C15.3284 14.2335 15.1379 14.5259 14.8353 14.8285C14.5293 15.1345 14.2403 15.3216 13.8356 15.478C13.5296 15.597 13.0672 15.7398 12.2205 15.7772C11.3025 15.818 11.027 15.8282 8.70466 15.8282C6.37888 15.8282 6.10346 15.818 5.18879 15.7772C4.33873 15.7398 3.87969 15.597 3.57367 15.478C3.16904 15.3216 2.87662 15.1311 2.57399 14.8285C2.26797 14.5225 2.08096 14.2335 1.92455 13.8288C1.80554 13.5228 1.66273 13.0604 1.62532 12.2137C1.58452 11.2957 1.57432 11.0202 1.57432 8.69786C1.57432 6.37208 1.58452 6.09666 1.62532 5.18199C1.66273 4.33193 1.80554 3.87289 1.92455 3.56687C2.08096 3.16224 2.27137 2.86982 2.57399 2.56719C2.88002 2.26117 3.16904 2.07416 3.57367 1.91774C3.87969 1.79874 4.34213 1.65592 5.18879 1.61852C6.10346 1.57772 6.37888 1.56752 8.70466 1.56752ZM8.70466 0C6.34148 0 6.04566 0.0102008 5.11739 0.0510039C4.19252 0.0918069 3.55667 0.241418 3.00583 0.455634C2.43118 0.680051 1.94495 0.975874 1.46211 1.46211C0.975874 1.94495 0.680051 2.43118 0.455634 3.00243C0.241418 3.55667 0.0918069 4.18912 0.0510039 5.11399C0.0102008 6.04566 0 6.34148 0 8.70466C0 11.0678 0.0102008 11.3637 0.0510039 12.2919C0.0918069 13.2168 0.241418 13.8526 0.455634 14.4035C0.680051 14.9781 0.975874 15.4644 1.46211 15.9472C1.94495 16.43 2.43118 16.7293 3.00243 16.9503C3.55667 17.1645 4.18912 17.3141 5.11399 17.3549C6.04226 17.3957 6.33808 17.4059 8.70126 17.4059C11.0644 17.4059 11.3603 17.3957 12.2885 17.3549C13.2134 17.3141 13.8492 17.1645 14.4001 16.9503C14.9713 16.7293 15.4576 16.43 15.9404 15.9472C16.4232 15.4644 16.7225 14.9781 16.9435 14.4069C17.1577 13.8526 17.3073 13.2202 17.3481 12.2953C17.3889 11.3671 17.3991 11.0712 17.3991 8.70806C17.3991 6.34488 17.3889 6.04906 17.3481 5.12079C17.3073 4.19592 17.1577 3.56007 16.9435 3.00923C16.7293 2.43118 16.4334 1.94495 15.9472 1.46211C15.4644 0.979274 14.9781 0.680051 14.4069 0.459035C13.8526 0.244818 13.2202 0.0952072 12.2953 0.0544041C11.3637 0.0102008 11.0678 0 8.70466 0Z" fill="black"/>
                  <path d="M8.70461 4.2334C6.23603 4.2334 4.23328 6.23615 4.23328 8.70474C4.23328 11.1733 6.23603 13.1761 8.70461 13.1761C11.1732 13.1761 13.176 11.1733 13.176 8.70474C13.176 6.23615 11.1732 4.2334 8.70461 4.2334ZM8.70461 11.6052C7.10309 11.6052 5.80419 10.3063 5.80419 8.70474C5.80419 7.10322 7.10309 5.80432 8.70461 5.80432C10.3061 5.80432 11.605 7.10322 11.605 8.70474C11.605 10.3063 10.3061 11.6052 8.70461 11.6052Z" fill="black"/>
                  <path d="M14.3967 4.05658C14.3967 4.63462 13.9274 5.10046 13.3528 5.10046C12.7747 5.10046 12.3089 4.63122 12.3089 4.05658C12.3089 3.47853 12.7781 3.0127 13.3528 3.0127C13.9274 3.0127 14.3967 3.48193 14.3967 4.05658Z" fill="black"/>
                </svg>
              </a>
              <a href="https://tiktok.com/@eazzy" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.0287 0H8.06913V11.5797C8.06913 12.9594 6.93087 14.0928 5.51434 14.0928C4.09781 14.0928 2.95953 12.9594 2.95953 11.5797C2.95953 10.2246 4.07251 9.11592 5.43847 9.06667V6.15943C2.42833 6.20868 0 8.59855 0 11.5797C0 14.5855 2.47892 17 5.53964 17C8.60032 17 11.0792 14.5609 11.0792 11.5797V5.64202C12.1922 6.43044 13.5582 6.89855 15 6.9232V4.01594C12.774 3.94203 11.0287 2.16811 11.0287 0Z" fill="black"/>
                </svg>
              </a>
              <a href="https://pinterest.com/eazzy" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.5 0C3.80508 0 0 4.02891 0 9C0 12.8145 2.24121 16.0699 5.40215 17.3812C5.3291 16.6676 5.25938 15.5777 5.43203 14.8008C5.58809 14.0977 6.42813 10.3289 6.42813 10.3289C6.42813 10.3289 6.17246 9.79102 6.17246 8.99297C6.17246 7.74141 6.85644 6.80625 7.70976 6.80625C8.43359 6.80625 8.78555 7.38281 8.78555 8.07539C8.78555 8.84883 8.3207 10.002 8.08164 11.0707C7.88242 11.9672 8.50664 12.6984 9.34004 12.6984C10.8508 12.6984 12.0129 11.0109 12.0129 8.57812C12.0129 6.42305 10.552 4.91484 8.46348 4.91484C6.04629 4.91484 4.6252 6.83437 4.6252 8.8207C4.6252 9.59414 4.90742 10.4238 5.25937 10.8738C5.3291 10.9617 5.33906 11.0426 5.31914 11.1305C5.25605 11.4152 5.10996 12.027 5.0834 12.15C5.04688 12.3152 4.96055 12.3504 4.79785 12.2695C3.73535 11.7457 3.07129 10.1039 3.07129 8.78203C3.07129 5.94141 5.02031 3.33633 8.68594 3.33633C11.6344 3.33633 13.9254 5.56172 13.9254 8.53594C13.9254 11.6367 12.0793 14.1328 9.51602 14.1328C8.65606 14.1328 7.8459 13.6582 7.56699 13.0992C7.56699 13.0992 7.14199 14.8184 7.03906 15.2402C6.84648 16.0207 6.32852 17.0016 5.9832 17.5992C6.78008 17.8594 7.62344 18 8.5 18C13.1949 18 17 13.9711 17 9C17 4.02891 13.1949 0 8.5 0Z" fill="black"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
