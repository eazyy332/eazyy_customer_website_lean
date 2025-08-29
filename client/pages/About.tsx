import { Link } from "react-router-dom";

// Assets provided by you (stored under public/images_devlopment)
const aboutBanner = "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop"; // blue gradient banner
const aboutPhoto = "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"; // eazyy van photo (updated)

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="hidden">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-black hover:text-primary transition-colors">Home</Link>
            <Link to="/services" className="text-black hover:text-primary transition-colors">Services</Link>
            <Link to="/about" className="text-primary font-medium">About us</Link>
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
          <div className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-accent mb-4">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-primary text-sm font-medium">About Us</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-[40px] font-medium text-black mb-3 leading-tight">
            Making Laundry <span className="text-primary">eazyy</span>
          </h1>
          <p className="text-black/70 text-[13px] md:text-[14px] leading-relaxed max-w-xl mx-auto">
            We believe everyone deserves more time for what matters most. That's why we've reinvented laundry into a smooth, door-to-door experience—easy booking, on-time pickups and careful, professional care. Reliable service, real-time updates, and results you can trust.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="px-4 lg:px-16 pt-16 pb-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-accent mb-4">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-primary text-sm font-medium">Story of eazyy</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-medium text-black mb-4 leading-tight">
                Our Story
              </h2>
              <p className="text-[13px] text-black/70 mb-4 leading-relaxed">
                It began with a simple frustration: weekends lost to laundry. In a world where almost anything can be delivered, expert garment care should be just as effortless.
              </p>
              <p className="text-[13px] text-black/70 mb-4 leading-relaxed">
                Since 2020, we've focused on giving people their time back while upholding the highest standards of cleaning and finishing. What started as a local service has grown into a trusted partner for thousands of families and professionals.
              </p>
              <p className="text-[13px] text-black/70 leading-relaxed">
                Today, we combine smart technology with skilled craftsmanship to ensure every item is treated with care and returned on time—consistently and confidently, order after order.
              </p>
            </div>
            <div className="relative">
              <div className="w-full h-96 lg:h-[440px] rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(17,24,39,0.15)]">
                <img
                  src={aboutPhoto}
                  alt="Eazyy delivery van"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 lg:px-16 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl lg:text-5xl font-medium text-black mb-2">Our Values</h2>
            <p className="text-black/60">The principles that guide everything we do</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 className="text-[15px] font-semibold text-black mb-1">Quality First</h3>
              <p className="text-[12px] text-black/70 leading-relaxed">Every garment receives meticulous attention, using only the finest product and techniques</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v6l4 2" />
                </svg>
              </div>
              <h3 className="text-[15px] font-semibold text-black mb-1">Reliability</h3>
              <p className="text-[12px] text-black/70 leading-relaxed">Consistent service you can count on, with transparent tracking and timely delivery</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l-5 7h3l-4 6h6v5h2v-5h6l-4-6h3l-5-7z" />
                </svg>
              </div>
              <h3 className="text-[15px] font-semibold text-black mb-1">Sustainability</h3>
              <p className="text-[12px] text-black/70 leading-relaxed">Eco-friendly practices and product that care for your clothes and our planet</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4 8.04 4 9.54 4.81 10.5 6.09 11.46 4.81 12.96 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <h3 className="text-[15px] font-semibold text-black mb-1">Care</h3>
              <p className="text-[12px] text-black/70 leading-relaxed">We treat every item as if it were our own, with genuine and respect</p>
            </div>
          </div>
        </div>
      </section>



      {/* Stats Section */}
      <section className="px-4 lg:px-16 pt-10 pb-20">
        <div className="max-w-6xl mx-auto">
                      <div className="text-center mb-4">
            <h2 className="text-4xl lg:text-5xl font-medium text-black mb-2">By The Numbers</h2>
            <p className="text-black/60">Our impact in our community</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-1">50K+</div>
              <p className="text-[12px] text-black/70">Happy Customers</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-1">500K+</div>
              <p className="text-[12px] text-black/70">Items Cleaned</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-1">100K+</div>
              <p className="text-[12px] text-black/70">Hours Saved</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-1">98%</div>
              <p className="text-[12px] text-black/70">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 lg:px-16 py-10 lg:py-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="relative rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(17,24,39,0.15)]">
            <img src={aboutBanner} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative z-10 px-6 md:px-10 lg:px-16 py-12 md:py-16 text-white text-center">
              <div className="inline-flex items-center gap-2 h-8 px-3 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                <span className="text-sm">Join us</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-3">Join thousands who trust Eazyy</h2>
              <p className="max-w-2xl mx-auto text-white/90 text-base md:text-lg mb-6">
                Door-to-door laundry with flexible pickup, careful cleaning, and reliable drop-off.
              </p>
              <Link to="/order/start" className="inline-flex items-center justify-center bg-black/80 hover:bg-black text-white px-6 py-3 rounded-full font-medium transition">
                Get started
              </Link>
            </div>
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
              <a href="#" className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.99982 0C4.0294 0 0 4.04428 0 9.03306C0 13.2692 2.90586 16.8239 6.82582 17.8002V11.7936H4.97006V9.03306H6.82582V7.84359C6.82582 4.76909 8.21216 3.34404 11.2195 3.34404C11.7898 3.34404 12.7736 3.45641 13.1761 3.56842V6.07058C12.9637 6.04818 12.5947 6.03698 12.1364 6.03698C10.6608 6.03698 10.0906 6.59811 10.0906 8.05677V9.03306H13.0303L12.5252 11.7936H10.0906V18C14.5469 17.4598 18 13.6515 18 9.03306C17.9996 4.04428 13.9702 0 8.99982 0Z" fill="black"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.70461 1.56752C11.0304 1.56752 11.3059 1.57772 12.2205 1.61852C13.0706 1.65592 13.5296 1.79874 13.8356 1.91774C14.2403 2.07416 14.5327 2.26457 14.8353 2.56719C15.1413 2.87322 15.3284 3.16224 15.4848 3.56687C15.6038 3.87289 15.7466 4.33533 15.784 5.18199C15.8248 6.10006 15.835 6.37548 15.835 8.69786C15.835 11.0236 15.8248 11.2991 15.784 12.2137C15.7466 13.0638 15.6038 13.5228 15.4848 13.8288C15.3284 14.2335 15.1379 14.5259 14.8353 14.8285C14.5293 15.1345 14.2403 15.3216 13.8356 15.478C13.5296 15.597 13.0672 15.7398 12.2205 15.7772C11.3025 15.818 11.027 15.8282 8.70466 15.8282C6.37888 15.8282 6.10346 15.818 5.18879 15.7772C4.33873 15.7398 3.87969 15.597 3.57367 15.478C3.16904 15.3216 2.87662 15.1311 2.57399 14.8285C2.26797 14.5225 2.08096 14.2335 1.92455 13.8288C1.80554 13.5228 1.66273 13.0604 1.62532 12.2137C1.58452 11.2957 1.57432 11.0202 1.57432 8.69786C1.57432 6.37208 1.58452 6.09666 1.62532 5.18199C1.66273 4.33193 1.80554 3.87289 1.92455 3.56687C2.08096 3.16224 2.27137 2.86982 2.57399 2.56719C2.88002 2.26117 3.16904 2.07416 3.57367 1.91774C3.87969 1.79874 4.34213 1.65592 5.18879 1.61852C6.10346 1.57772 6.37888 1.56752 8.70466 1.56752ZM8.70466 0C6.34148 0 6.04566 0.0102008 5.11739 0.0510039C4.19252 0.0918069 3.55667 0.241418 3.00583 0.455634C2.43118 0.680051 1.94495 0.975874 1.46211 1.46211C0.975874 1.94495 0.680051 2.43118 0.455634 3.00243C0.241418 3.55667 0.0918069 4.18912 0.0510039 5.11399C0.0102008 6.04566 0 6.34148 0 8.70466C0 11.0678 0.0102008 11.3637 0.0510039 12.2919C0.0918069 13.2168 0.241418 13.8526 0.455634 14.4035C0.680051 14.9781 0.975874 15.4644 1.46211 15.9472C1.94495 16.43 2.43118 16.7293 3.00243 16.9503C3.55667 17.1645 4.18912 17.3141 5.11399 17.3549C6.04226 17.3957 6.33808 17.4059 8.70126 17.4059C11.0644 17.4059 11.3603 17.3957 12.2885 17.3549C13.2134 17.3141 13.8492 17.1645 14.4001 16.9503C14.9713 16.7293 15.4576 16.43 15.9404 15.9472C16.4232 15.4644 16.7225 14.9781 16.9435 14.4069C17.1577 13.8526 17.3073 13.2202 17.3481 12.2953C17.3889 11.3671 17.3991 11.0712 17.3991 8.70806C17.3991 6.34488 17.3889 6.04906 17.3481 5.12079C17.3073 4.19592 17.1577 3.56007 16.9435 3.00923C16.7293 2.43118 16.4334 1.94495 15.9472 1.46211C15.4644 0.979274 14.9781 0.680051 14.4069 0.459035C13.8526 0.244818 13.2202 0.0952072 12.2953 0.0544041C11.3637 0.0102008 11.0678 0 8.70466 0Z" fill="black"/>
                  <path d="M8.70461 4.2334C6.23603 4.2334 4.23328 6.23615 4.23328 8.70474C4.23328 11.1733 6.23603 13.1761 8.70461 13.1761C11.1732 13.1761 13.176 11.1733 13.176 8.70474C13.176 6.23615 11.1732 4.2334 8.70461 4.2334ZM8.70461 11.6052C7.10309 11.6052 5.80419 10.3063 5.80419 8.70474C5.80419 7.10322 7.10309 5.80432 8.70461 5.80432C10.3061 5.80432 11.605 7.10322 11.605 8.70474C11.605 10.3063 10.3061 11.6052 8.70461 11.6052Z" fill="black"/>
                  <path d="M14.3967 4.05658C14.3967 4.63462 13.9274 5.10046 13.3528 5.10046C12.7747 5.10046 12.3089 4.63122 12.3089 4.05658C12.3089 3.47853 12.7781 3.0127 13.3528 3.0127C13.9274 3.0127 14.3967 3.48193 14.3967 4.05658Z" fill="black"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.0287 0H8.06913V11.5797C8.06913 12.9594 6.93087 14.0928 5.51434 14.0928C4.09781 14.0928 2.95953 12.9594 2.95953 11.5797C2.95953 10.2246 4.07251 9.11592 5.43847 9.06667V6.15943C2.42833 6.20868 0 8.59855 0 11.5797C0 14.5855 2.47892 17 5.53964 17C8.60032 17 11.0792 14.5609 11.0792 11.5797V5.64202C12.1922 6.43044 13.5582 6.89855 15 6.9232V4.01594C12.774 3.94203 11.0287 2.16811 11.0287 0Z" fill="black"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
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
