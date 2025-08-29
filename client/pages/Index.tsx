import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import React from "react";

export default function Index() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Helmet>
        <title>eazyy | Laundry Pickup & Delivery in 24–48h</title>
        <meta name="description" content="Laundry pickup and delivery with 24–48h turnaround, eco-friendly cleaning, and satisfaction guarantee." />
        <meta property="og:title" content="eazyy | Laundry Pickup & Delivery" />
        <meta property="og:description" content="Fast, reliable laundry service. Schedule a pickup in minutes." />
      </Helmet>
      {/* Global header moved to SiteHeader */}

      {/* Hero Section */}
      <section className="px-4 md:px-8 py-10 md:py-14">
        <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 h-9 px-4 rounded-[10px] bg-[#E9F1FF]">
              <EazyyIcon className="w-4 h-4 text-[#1D62DB]" />
              <span className="text-[#1D62DB] font-medium">laundry service</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-medium text-black leading-tight">
                Enhancing Your
              </h1>
              <h1 className="text-3xl md:text-5xl font-medium text-black leading-tight">
                Laundry Experience
              </h1>
            </div>

            {/* Description */}
            <p className="text-black text-base md:text-lg leading-relaxed max-w-md">
              Discover the range of benefits and features that make our service
              stand out
            </p>

            {/* CTA Button */}
            <div className="flex">
              <Link
                to="/order/start"
                className="inline-block bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors text-center"
              >
                Order new service
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="w-full h-64 md:h-80 lg:h-[420px] bg-gray-300 rounded-xl md:rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* Services Section with Blue Background */}
      <section className="relative mt-10 md:mt-14 mb-16 md:mb-20">
        <div className="max-w-[1440px] mx-auto rounded-[28px] relative overflow-hidden shadow-[0_20px_60px_rgba(17,24,39,0.15)]">
          {/* Background Image */}
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0ba0452a2d1340e7b84136d8ed253a1b%2F6e03d684819a4711be2593327c0694f3?format=webp&width=1200"
            alt=""
            className="absolute inset-0 w-full h-full object-cover rounded-[28px]"
          />
          {/* Subtle vignette */}
          <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(1200px_480px_at_20%_10%,rgba(255,255,255,0.25)_0%,rgba(255,255,255,0)_60%),radial-gradient(800px_400px_at_80%_90%,rgba(13,71,161,0.25)_0%,rgba(13,71,161,0)_60%)]" />
          {/* Content Container */}
          <div className="relative z-10 px-6 md:px-8 lg:px-16 py-12 md:py-16 lg:py-20">
            {/* Section Header */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 h-10 px-4 rounded-full bg-[#2166DC] text-white mb-6 shadow-[0_8px_20px_rgba(29,98,219,0.35)]">
                <EazyyIcon className="w-5 h-5 text-white" />
                <span className="text-lg leading-none font-medium">The Services of eazyy</span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-medium text-white mb-2 leading-tight">
                Discover the Services
              </h2>
              <h2 className="text-5xl lg:text-6xl font-medium text-white leading-tight mb-4">
                of eazyy
              </h2>
              <p className="text-white/90 text-base lg:text-lg max-w-md">
                Explore eazyy services, from bags-based laundry to expert dry cleaning.
              </p>
            </div>

            {/* Service Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              {/* eazzy bag */}
              <div className="bg-white/95 border border-white/60 rounded-[24px] p-7 md:p-8 shadow-[0_8px_30px_rgba(17,24,39,0.1)] ring-1 ring-white/40">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl mb-5 flex items-center justify-center">
                  <img
                    src="https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
                    alt="eazzy bag icon"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                    <EazyyIcon className="w-4 h-4" />
                    eazyy bag
                  </span>
                </div>
                <p className="text-black text-base leading-relaxed mb-5">
                  Fill the sturdy eazzy Bag with a week's laundry; we clean and
                  return items fresh.
                </p>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center h-7 min-w-[140px] rounded-[7px] bg-[#1D62DB] text-white text-sm font-semibold px-5 transition-colors text-center hover:brightness-110"
                >
                  Go to service
                </Link>
              </div>

              {/* Dry Clean */}
              <div className="bg-white/95 border border-white/60 rounded-[24px] p-7 md:p-8 shadow-[0_8px_30px_rgba(17,24,39,0.1)] ring-1 ring-white/40">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl mb-5 flex items-center justify-center">
                  <img
                    src="https://images.pexels.com/photos/5591774/pexels-photo-5591774.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
                    alt="Dry Clean"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                    <EazyyIcon className="w-4 h-4" />
                    Dry clean
                  </span>
                </div>
                <p className="text-black text-base leading-relaxed mb-5">
                  Gentle dry cleaning for delicate fabrics stains vanish colours
                  stay vibrant and ready to wear
                </p>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center h-7 min-w-[140px] rounded-[7px] bg-[#1D62DB] text-white text-sm font-semibold px-5 transition-colors text-center hover:brightness-110"
                >
                  Go to service
                </Link>
              </div>

              {/* Wash and Iron */}
              <div className="bg-white/95 border border-white/60 rounded-[24px] p-7 md:p-8 shadow-[0_8px_30px_rgba(17,24,39,0.1)] ring-1 ring-white/40">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl mb-5 flex items-center justify-center">
                  <img
                    src="https://images.pexels.com/photos/5591728/pexels-photo-5591728.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
                    alt="Wash and Iron"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-sm font-medium">
                    <EazyyIcon className="w-4 h-4" />
                    Wash & Iron
                  </span>
                </div>
                <p className="text-black text-base leading-relaxed mb-5">
                  Daily laundry expertly washed ironed for a crisp finish folded
                  neatly and delivered to your door
                </p>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center h-7 min-w-[140px] rounded-[7px] bg-[#1D62DB] text-white text-sm font-semibold px-5 transition-colors text-center hover:brightness-110"
                >
                  Go to service
                </Link>
              </div>

              {/* Repair */}
              <div className="bg-white/95 border border-white/60 rounded-[24px] p-7 md:p-8 shadow-[0_8px_30px_rgba(17,24,39,0.1)] ring-1 ring-white/40">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl mb-5 flex items-center justify-center">
                  <img
                    src="https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
                    alt="Repair"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-medium">
                    <EazyyIcon className="w-4 h-4" />
                    Repair
                  </span>
                </div>
                <p className="text-black text-base leading-relaxed mb-5">
                  Skilled tailors renew garments mend tears replace zippers
                  secure hems bring life back
                </p>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center h-7 min-w-[140px] rounded-[7px] bg-[#1D62DB] text-white text-sm font-semibold px-5 transition-colors text-center hover:brightness-110"
                >
                  Go to service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="relative px-4 md:px-8 lg:px-16 py-14 md:py-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-50"></div>
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto grid md:grid-cols-2 gap-8 md:gap-16 lg:gap-20 items-center">
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-accent rounded-lg">
              <EazyyIcon className="w-4 h-4 text-[#1D62DB]" />
              <span className="text-primary font-medium">laundry service</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-medium text-black leading-tight">
                Discover The Advantages
              </h2>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl md:text-5xl font-medium text-black leading-tight">
                  Of Using
                </h2>
                <span className="text-3xl md:text-5xl font-medium text-primary leading-tight">eazyy</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-black text-base md:text-lg leading-relaxed max-w-md">
              The advantages of eazyy include speed, quality, trust, and more.
            </p>

            {/* CTA Button */}
            <Link
              to="/order/start"
              className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Order new service
            </Link>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {/* Quality */}
            <div className="bg-gray-100 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm">
              <div className="w-16 h-16 mb-4">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/8174fe185ec956090a9ec61d65499ee69dbb554d?width=112"
                  alt="Quality"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-medium text-black mb-3">Quality</h3>
              <p className="text-black text-sm leading-relaxed">
                Professionally cleaned with care and consistency. High-end
                results for every fabric and garment.
              </p>
            </div>

            {/* Tracking */}
            <div className="bg-gray-100 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm">
              <div className="w-16 h-16 mb-4">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/9ce1fc98e077dde3572ecff61f8e3d640bb8b73f?width=114"
                  alt="Tracking"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-medium text-black mb-3">Tracking</h3>
              <p className="text-black text-sm leading-relaxed">
                Live updates from pickup to drop-off. Stay informed every step
                with real-time notifications.
              </p>
            </div>

            {/* Speed */}
            <div className="bg-gray-100 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm">
              <div className="w-16 h-16 mb-4">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/63e21f8daeff046717d237dffe553f902b396645?width=114"
                  alt="Speed"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-medium text-black mb-3">Speed</h3>
              <p className="text-black text-sm leading-relaxed">
                Fast pickup and delivery across your entire city. Same-day
                collection and next-day return without delays.
              </p>
            </div>

            {/* Trust */}
            <div className="bg-gray-100 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm">
              <div className="w-16 h-16 mb-4">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/805b4b74f2257b828c16a070418e5476be3e5789?width=114"
                  alt="Trust"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-medium text-black mb-3">Trust</h3>
              <p className="text-black text-sm leading-relaxed">
                Handled by friendly drivers and skilled cleaners. Your clothes
                stay safe and in good hands throughout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global footer moved to SiteFooter */}
    </div>
  );
}

function EazyyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 10 14"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
    >
      <path d="M8.66351 5.09976C7.83929 4.29691 6.71977 3.84092 5.56546 3.73927L5.56314 3.63787C5.55409 3.22895 5.54365 3.13995 5.49007 3.02051C5.39751 2.81371 5.25461 2.6685 4.90085 2.42189C4.72617 2.29987 4.53989 2.15864 4.48723 2.10782C4.32879 1.95536 4.29492 1.6797 4.41184 1.49632C4.43643 1.45768 4.53131 1.38835 4.6227 1.34221C4.90966 1.19724 5.28129 1.23636 5.50097 1.43449C5.6434 1.56283 5.68354 1.67806 5.70557 2.01906C5.71972 2.23968 5.73689 2.32259 5.77679 2.36357C5.96585 2.55772 6.81651 2.52775 6.92275 2.32352C6.96381 2.24436 6.93157 1.72139 6.86917 1.45416C6.74483 0.921822 6.34281 0.407513 5.87561 0.182913C5.59005 0.0452024 5.37965 1.41355e-06 5.02101 1.41355e-06C4.53084 -0.000466991 4.15086 0.115463 3.82192 0.365591C3.22853 0.81643 2.93739 1.53028 3.08516 2.1727C3.18584 2.61065 3.42687 2.93198 3.89731 3.25565C4.19981 3.46385 4.30327 3.57416 4.32508 3.76714C3.4322 3.88635 2.57481 4.2222 1.87564 4.7789C0.759365 5.66559 0.139059 6.97173 0.021679 8.38608C-0.0713437 9.46903 0.132564 10.6176 0.680493 11.5633C2.04173 13.906 5.11589 14.5826 7.49527 13.4926C8.22878 13.1603 8.85025 12.6167 9.2968 11.9457C9.4571 11.7071 9.65915 11.4176 9.6675 11.1113C9.6675 10.8813 9.53249 10.7026 9.32163 10.626C9.16156 10.5412 8.98433 10.5412 8.82404 10.5414H8.03137C7.83744 10.5419 7.62657 10.5419 7.44122 10.6267C7.20507 10.7379 7.05336 10.9675 6.87636 11.1548C6.64021 11.4019 6.37042 11.6061 6.05841 11.734C5.11055 12.1174 3.88618 11.8794 3.23224 11.071C2.87267 10.6236 2.72026 10.0944 2.61866 9.54187L6.28435 9.54046L8.75444 9.53953C9.04975 9.53953 9.49654 9.62407 9.74452 9.43648C10.0818 9.1894 9.99714 8.56197 9.97186 8.2027C9.87907 7.04059 9.51556 5.92883 8.66351 5.09976ZM2.71516 7.89355C3.07728 6.09863 5.26435 5.22435 6.68498 6.40379C6.90443 6.58249 7.08143 6.81224 7.21644 7.05933C7.35957 7.3228 7.46906 7.59448 7.50316 7.89191L2.71516 7.89355Z"/>
    </svg>
  );
}