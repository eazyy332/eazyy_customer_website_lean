import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function Company() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Company | eazyy</title>
        <meta name="description" content="Learn about eazyy's mission, leadership team, and commitment to revolutionizing laundry services." />
      </Helmet>

      {/* Hero Section */}
      <section className="px-4 md:px-8 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 h-9 px-4 rounded-[10px] bg-[#E9F1FF] mb-6">
              <svg className="w-4 h-4 text-[#1D62DB]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-[#1D62DB] font-medium">Company</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-medium text-black mb-6 leading-tight">
              Revolutionizing Laundry, One Load at a Time
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Founded with a simple mission: to give people their time back while delivering 
              exceptional laundry care through innovation, sustainability, and genuine service.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-4 md:px-8 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-medium text-black mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                To transform the laundry experience by combining cutting-edge technology 
                with traditional craftsmanship, making professional garment care accessible, 
                convenient, and environmentally responsible.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We believe everyone deserves more time for what matters most. That's why we've 
                reimagined laundry as a seamless, door-to-door service that fits into your life, 
                not the other way around.
              </p>
            </div>
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-primary/10 to-blue-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-black">Care & Quality</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="px-4 md:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium text-black mb-4">Leadership Team</h2>
            <p className="text-lg text-gray-600">The visionaries behind eazyy's innovation</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <h3 className="text-xl font-medium text-black mb-2">Sarah Chen</h3>
              <p className="text-primary font-medium mb-3">CEO & Co-Founder</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Former operations director at a major logistics company, Sarah brings 15 years 
                of experience in scaling service operations and customer experience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <h3 className="text-xl font-medium text-black mb-2">Marcus Rodriguez</h3>
              <p className="text-primary font-medium mb-3">CTO & Co-Founder</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Technology veteran with expertise in mobile apps and logistics platforms. 
                Marcus leads our tech innovation and platform development.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <h3 className="text-xl font-medium text-black mb-2">Elena Kowalski</h3>
              <p className="text-primary font-medium mb-3">Head of Operations</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Textile industry expert with 20+ years in garment care and quality control. 
                Elena ensures every item meets our high standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="px-4 md:px-8 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium text-black mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black mb-3">Excellence</h3>
              <p className="text-gray-600 text-sm">We strive for perfection in every aspect of our service, from pickup to delivery.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black mb-3">Sustainability</h3>
              <p className="text-gray-600 text-sm">Environmental responsibility through eco-friendly processes and packaging.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black mb-3">Innovation</h3>
              <p className="text-gray-600 text-sm">Continuously improving our technology and processes to serve you better.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black mb-3">Community</h3>
              <p className="text-gray-600 text-sm">Building strong relationships with customers, employees, and local communities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="px-4 md:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium text-black mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">From startup to industry leader</p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                2020
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Company Founded</h3>
                <p className="text-gray-600">
                  Sarah and Marcus launched eazyy with a single van and a vision to revolutionize laundry services. 
                  Started serving 50 customers in downtown Amsterdam.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                2021
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Technology Platform Launch</h3>
                <p className="text-gray-600">
                  Launched our mobile app and web platform, introducing real-time tracking and 
                  automated scheduling. Expanded to serve 1,000+ customers across 3 cities.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                2022
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Sustainability Initiative</h3>
                <p className="text-gray-600">
                  Introduced eco-friendly cleaning processes and biodegradable packaging. 
                  Achieved carbon-neutral delivery operations through electric vehicle fleet.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                2023
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">Business Services Launch</h3>
                <p className="text-gray-600">
                  Expanded into B2B services, partnering with hotels, restaurants, and corporate clients. 
                  Opened 5 processing facilities to handle increased demand.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                2024
              </div>
              <div>
                <h3 className="text-xl font-medium text-black mb-2">European Expansion</h3>
                <p className="text-gray-600">
                  Launched operations in Belgium, Germany, and France. Now serving 50,000+ customers 
                  across 25 cities with 24-48 hour turnaround guarantee.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="px-4 md:px-8 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium text-black mb-4">Impact by Numbers</h2>
            <p className="text-lg text-gray-600">Our growth reflects the trust our customers place in us</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50K+</div>
              <p className="text-gray-600">Active Customers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">25</div>
              <p className="text-gray-600">Cities Served</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500K+</div>
              <p className="text-gray-600">Items Cleaned</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">98%</div>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="px-4 md:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-black">Planet First</h3>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-medium text-black mb-6">Commitment to Sustainability</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We're committed to reducing our environmental impact while delivering exceptional service. 
                Our sustainability initiatives span every aspect of our operations.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Eco-Friendly Products</h4>
                    <p className="text-gray-600 text-sm">Biodegradable detergents and non-toxic cleaning solutions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Carbon Neutral Delivery</h4>
                    <p className="text-gray-600 text-sm">Electric vehicle fleet and optimized routing to minimize emissions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Waste Reduction</h4>
                    <p className="text-gray-600 text-sm">Reusable packaging and water recycling systems in our facilities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Careers */}
      <section className="px-4 md:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium text-black mb-4">Join Our Team</h2>
            <p className="text-lg text-gray-600">Help us revolutionize the laundry industry</p>
          </div>

          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-medium mb-4">Work with Purpose</h3>
                <p className="text-xl mb-6 opacity-90">
                  Join a team that's passionate about innovation, sustainability, and making people's lives easier.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Competitive salary and equity</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Comprehensive health benefits</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Remote-first culture</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Professional development budget</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-2xl p-6 mb-6">
                  <div className="text-3xl font-bold mb-2">50+</div>
                  <div className="text-white/80">Team Members</div>
                </div>
                <button className="bg-white text-primary px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
                  View Open Positions
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-4 md:px-8 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-medium text-black mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-8">
            Have questions about our company, partnerships, or career opportunities?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/about"
              className="border border-gray-300 text-black px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}