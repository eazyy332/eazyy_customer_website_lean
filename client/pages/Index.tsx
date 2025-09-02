import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import EazyyIcon from "@/components/EazyyIcon";

export default function Index() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        console.log('Loading services from database...');
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("status", true)
          .order("sequence", { ascending: true })
          .limit(10);

        if (error) {
          console.error('Error loading services:', error.message);
          return;
        }
        
        if (data) {
          setServices(data);
          console.log('Services loaded successfully:', data.length, data);
        }
      } catch (err) {
        console.error('Error loading services:', err);
      }
    };

    loadServices();
  }, []);

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
              <EazyyIcon className="w-5 h-6 text-[#1D62DB]" />
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
                <EazyyIcon className="w-6 h-7 text-white" />
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
                  {services.find(s => s.service_identifier === 'eazyy-bag')?.icon && (
                    <img
                      src={services.find(s => s.service_identifier === 'eazyy-bag')?.icon}
                      alt="eazzy bag icon"
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                    <EazyyIcon className="w-5 h-6" />
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
                  {services.find(s => s.service_identifier === 'dry-cleaning')?.icon && (
                    <img
                      src={services.find(s => s.service_identifier === 'dry-cleaning')?.icon}
                      alt="Dry Clean"
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                    <EazyyIcon className="w-5 h-6" />
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
                  {services.find(s => s.service_identifier === 'wash-iron')?.icon && (
                    <img
                      src={services.find(s => s.service_identifier === 'wash-iron')?.icon}
                      alt="Wash and Iron"
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-sm font-medium">
                    <EazyyIcon className="w-5 h-6" />
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
                  {services.find(s => s.service_identifier === 'repairs')?.icon && (
                    <img
                      src={services.find(s => s.service_identifier === 'repairs')?.icon}
                      alt="Repair"
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-medium">
                    <EazyyIcon className="w-5 h-6" />
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
              <EazyyIcon className="w-5 h-6 text-[#1D62DB]" />
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