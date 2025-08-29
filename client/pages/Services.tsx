import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Service {
  id: string;
  name: string;
  service_identifier: string;
  description: string;
  short_description: string;
  icon: string;
  image_url: string;
  price_starts_at: number;
  price_unit: string;
  features: string[];
  benefits: string[];
  color_hex: string;
  is_popular: boolean;
  status: boolean;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback service data when Supabase is not configured
  const fallbackServices: Service[] = [
    {
      id: 'eazyy-bag',
      name: 'eazyy Bag',
      service_identifier: 'eazyy-bag',
      description: 'Fill our sturdy bag with a week\'s worth of laundry. We\'ll wash, dry, fold, and return everything fresh and ready to wear.',
      short_description: 'Fill our sturdy bag with a week\'s worth of laundry. We\'ll wash, dry, fold, and return everything fresh.',
      icon: 'https://api.builder.io/api/v1/image/assets/TEMP/8053aaf5482c5a1eaffc8f5b8f8d52642ee84791?width=160',
      image_url: 'https://api.builder.io/api/v1/image/assets/TEMP/8053aaf5482c5a1eaffc8f5b8f8d52642ee84791?width=160',
      price_starts_at: 24.99,
      price_unit: 'per bag',
      features: ['Up to 15 lbs', 'Wash, dry, and fold', '24-48 hour turnaround', 'Free pickup & delivery'],
      benefits: ['Capacity: Up to 15 lbs', 'Turnaround: 24-48 hours', 'Starting at $24.99'],
      color_hex: '#1D62DB',
      is_popular: false,
      status: true
    },
    {
      id: 'dry-cleaning',
      name: 'Dry Cleaning',
      service_identifier: 'dry-cleaning',
      description: 'Professional dry cleaning for delicate fabrics. Stains vanish, colors stay vibrant, and garments look like new.',
      short_description: 'Professional dry cleaning for delicate fabrics. Stains vanish, colors stay vibrant.',
      icon: 'https://api.builder.io/api/v1/image/assets/TEMP/fce4d46b116b276f657742c2e7a9594f49ddecfa?width=160',
      image_url: 'https://api.builder.io/api/v1/image/assets/TEMP/fce4d46b116b276f657742c2e7a9594f49ddecfa?width=160',
      price_starts_at: 12.99,
      price_unit: 'per item',
      features: ['Suits, dresses, coats', 'Eco-friendly solvents', 'Expert stain removal'],
      benefits: ['Professional dry cleaning', 'Expert stain removal', 'Eco-friendly solvents', 'Careful pressing', 'Protective packaging'],
      color_hex: '#16A34A',
      is_popular: false,
      status: true
    },
    {
      id: 'wash-iron',
      name: 'Wash & Iron',
      service_identifier: 'wash-iron',
      description: 'Daily laundry expertly washed and ironed for a crisp finish. Folded neatly and delivered to your door.',
      short_description: 'Daily laundry expertly washed and ironed for a crisp finish.',
      icon: 'https://api.builder.io/api/v1/image/assets/TEMP/323ee1d10112f83f8a173fa73990b7e744464d8d?width=160',
      image_url: 'https://api.builder.io/api/v1/image/assets/TEMP/323ee1d10112f83f8a173fa73990b7e744464d8d?width=160',
      price_starts_at: 3.99,
      price_unit: 'per item',
      features: ['Shirts, trousers, linens', 'Professional pressing', 'Same-day service'],
      benefits: ['Everything in Basic', 'Delicate item care', 'Professional pressing', 'Stain treatment', 'Fabric softener'],
      color_hex: '#DC2626',
      is_popular: true,
      status: true
    },
    {
      id: 'repairs',
      name: 'Repairs & Alterations',
      service_identifier: 'repairs',
      description: 'Skilled tailors breathe new life into your garments. Mend tears, replace zippers, and secure hems.',
      short_description: 'Skilled tailors breathe new life into your garments.',
      icon: 'https://api.builder.io/api/v1/image/assets/TEMP/054342f0a30f3564e498e0898a4167eaae155932?width=160',
      image_url: 'https://api.builder.io/api/v1/image/assets/TEMP/054342f0a30f3564e498e0898a4167eaae155932?width=160',
      price_starts_at: 12.99,
      price_unit: 'per item',
      features: ['Hemming & alterations', 'Zipper replacement', 'Tear repairs'],
      benefits: ['Hemming & alterations', 'Zipper replacement', 'Tear repairs'],
      color_hex: '#F59E0B',
      is_popular: false,
      status: true
    }
  ];

  useEffect(() => {
    const loadServices = async () => {
      try {
        // Check if Supabase is properly configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl || supabaseUrl.includes('your_supabase_url_here') || !supabaseUrl.startsWith('https://')) {
          // Use fallback data when Supabase is not configured
          setServices(fallbackServices);
          setLoading(false);
          return;
        }

        try {
          const { data, error: fetchError } = await supabase
            .from("services")
            .select("*")
            .eq("status", true)
            .order("sequence", { ascending: true });

          if (fetchError) {
            console.error('Error fetching services:', fetchError);
            // Use fallback data on fetch error
            setServices(fallbackServices);
          } else {
            setServices(data || fallbackServices);
          }
        } catch (fetchErr) {
          console.error('Fetch error:', fetchErr);
          // Use fallback data on network error
          setServices(fallbackServices);
        }
      } catch (err) {
        console.error('Connection error:', err);
        // Use fallback data on any error
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header hidden (global header used) */}
      <header className="hidden">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-black hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link to="/services" className="text-primary font-medium">
              Services
            </Link>
            <Link
              to="/about"
              className="text-black hover:text-primary transition-colors"
            >
              About us
            </Link>
            <Link
              to="/contact"
              className="text-black hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0ba0452a2d1340e7b84136d8ed253a1b%2Fb6e642e462f04f14827396626baf4d5e?format=webp&width=800"
              alt="eazyy logo"
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center space-x-6">
            <Link
              to="/help"
              className="text-black hover:text-primary transition-colors"
            >
              Help
            </Link>
            <div className="text-black">EN</div>
            <div className="flex items-center space-x-4">
              {/* Login/Sign Up Icon */}
              <Link
                to="/login"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Login / Sign Up"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="group-hover:scale-110 transition-transform"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3 4C3 3.44772 3.44772 3 4 3H10C10.5523 3 11 3.44772 11 4C11 4.55228 10.5523 5 10 5H5V15H10C10.5523 15 11 15.4477 11 16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V4Z"
                    fill="currentColor"
                    className="text-black group-hover:text-primary"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.2929 6.29289C13.6834 5.90237 14.3166 5.90237 14.7071 6.29289L17.7071 9.29289C18.0976 9.68342 18.0976 10.3166 17.7071 10.7071L14.7071 13.7071C14.3166 14.0976 13.6834 14.0976 13.2929 13.7071C12.9024 13.3166 12.9024 12.6834 13.2929 12.2929L14.5858 11H8C7.44772 11 7 10.5523 7 10C7 9.44772 7.44772 9 8 9H14.5858L13.2929 7.70711C12.9024 7.31658 12.9024 6.68342 13.2929 6.29289Z"
                    fill="currentColor"
                    className="text-black group-hover:text-primary"
                  />
                </svg>
              </Link>

              {/* Order History Icon */}
              <Link
                to="/orders"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Order History"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="group-hover:scale-110 transition-transform"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2 4C2 3.44772 2.44772 3 3 3H17C17.5523 3 18 3.44772 18 4V16C18 16.5523 17.5523 17 17 17H3C2.44772 17 2 16.5523 2 16V4ZM4 5V15H16V5H4Z"
                    fill="currentColor"
                    className="text-black group-hover:text-primary"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6 7C6 6.44772 6.44772 6 7 6H13C13.5523 6 14 6.44772 14 7C14 7.55228 13.5523 8 13 8H7C6.44772 8 6 7.55228 6 7Z"
                    fill="currentColor"
                    className="text-black group-hover:text-primary"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6 10C6 9.44772 6.44772 9 7 9H11C11.5523 9 12 9.44772 12 10C12 10.5523 11.5523 11 11 11H7C6.44772 11 6 10.5523 6 10Z"
                    fill="currentColor"
                    className="text-black group-hover:text-primary"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6 13C6 12.4477 6.44772 12 7 12H9C9.55228 12 10 12.4477 10 13C10 13.5523 9.55228 14 9 14H7C6.44772 14 6 13.5523 6 13Z"
                    fill="currentColor"
                    className="text-black group-hover:text-primary"
                  />
                </svg>
              </Link>

              {/* Shopping Cart Icon */}
              <Link
                to="/cart"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group relative"
                title="Shopping Cart"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="group-hover:scale-110 transition-transform"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1 1C0.447715 1 0 1.44772 0 2C0 2.55228 0.447715 3 1 3H2.22222L3.95556 11.2222C4.14814 12.1111 4.96296 12.7222 5.88889 12.7222H14.3333C15.2593 12.7222 16.0741 12.1111 16.2667 11.2222L17.7778 5.22222C17.8889 4.77778 17.6667 4.33333 17.2222 4.11111C16.7778 3.88889 16.2222 4.11111 16 4.55556L14.7778 9.61111H6.55556L5.22222 3H1ZM6.11111 15.2778C6.11111 14.7222 6.55556 14.2778 7.11111 14.2778C7.66667 14.2778 8.11111 14.7222 8.11111 15.2778C8.11111 15.8333 7.66667 16.2778 7.11111 16.2778C6.55556 16.2778 6.11111 15.8333 6.11111 15.2778ZM7.11111 12.2778C5.45556 12.2778 4.11111 13.6222 4.11111 15.2778C4.11111 16.9333 5.45556 18.2778 7.11111 18.2778C8.76667 18.2778 10.1111 16.9333 10.1111 15.2778C10.1111 13.6222 8.76667 12.2778 7.11111 12.2778ZM13.5556 15.2778C13.5556 14.7222 14 14.2778 14.5556 14.2778C15.1111 14.2778 15.5556 14.7222 15.5556 15.2778C15.5556 15.8333 15.1111 16.2778 14.5556 16.2778C14 16.2778 13.5556 15.8333 13.5556 15.2778ZM14.5556 12.2778C12.9 12.2778 11.5556 13.6222 11.5556 15.2778C11.5556 16.9333 12.9 18.2778 14.5556 18.2778C16.2111 18.2778 17.5556 16.9333 17.5556 15.2778C17.5556 13.6222 16.2111 12.2778 14.5556 12.2778Z"
                    fill="currentColor"
                    className="text-black group-hover:text-primary"
                  />
                </svg>
                {/* Cart count badge */}
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-4 lg:px-16 py-12 lg:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-accent rounded-lg mb-6">
            <svg
              className="w-3 h-2 mr-3 fill-primary"
              viewBox="0 0 8 6"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6.93081 2.5385C6.27144 2.23578 5.37582 2.06384 4.45237 2.02552L4.45051 1.98728C4.44327 1.83309 4.43492 1.79953 4.39205 1.75449C4.31801 1.67652 4.20369 1.62177 3.92068 1.52878C3.78093 1.48277 3.63191 1.42952 3.58978 1.41035C3.46303 1.35286 3.43594 1.24892 3.52947 1.17978C3.54914 1.16521 3.62505 1.13907 3.69816 1.12167C3.92773 1.06701 4.22503 1.08175 4.40078 1.15646C4.51472 1.20486 4.54683 1.24831 4.56446 1.37688C4.57578 1.46007 4.58951 1.49133 4.62143 1.50679C4.77268 1.58 5.45321 1.56869 5.5382 1.49169C5.57105 1.46184 5.54526 1.26464 5.49533 1.16388C5.39586 0.963156 5.07425 0.769229 4.70049 0.68454C4.47204 0.632614 4.30372 0.615571 4.01681 0.615571C3.62467 0.615394 3.32069 0.659107 3.05754 0.753421C2.58282 0.923416 2.34992 1.19258 2.46813 1.43482C2.54867 1.59995 2.74149 1.72111 3.11785 1.84316C3.35985 1.92166 3.44262 1.96326 3.46006 2.03602C2.74576 2.08097 2.05985 2.20761 1.50051 2.41752C0.607492 2.75186 0.111247 3.24436 0.0173432 3.77766C-0.0570749 4.186 0.106051 4.61907 0.544394 4.97566C1.63339 5.85902 4.09271 6.11414 5.99622 5.70315C6.58303 5.57784 7.0802 5.37288 7.43744 5.11987C7.56568 5.02988 7.72732 4.92073 7.734 4.80522C7.734 4.7185 7.62599 4.65112 7.4573 4.62225C7.32925 4.59028 7.18747 4.59028 7.05923 4.59037H6.4251C6.26995 4.59054 6.10126 4.59054 5.95298 4.62251C5.76406 4.66446 5.64269 4.751 5.50109 4.82165C5.31217 4.91482 5.09633 4.99182 4.84673 5.04004C4.08844 5.1846 3.10894 5.09488 2.58579 4.79004C2.29814 4.62136 2.17621 4.42179 2.09493 4.21346L5.02748 4.21293L7.00355 4.21258C7.2398 4.21258 7.59723 4.24446 7.79562 4.17373C8.06545 4.08056 7.99771 3.84398 7.97748 3.70851C7.90325 3.27032 7.61245 2.85112 6.93081 2.5385ZM2.17213 3.59194C2.46182 2.91514 4.21148 2.58548 5.34798 3.03021C5.52354 3.09759 5.66514 3.18422 5.77315 3.27739C5.88765 3.37673 5.97525 3.47917 6.00253 3.59133L2.17194 3.59194H2.17213Z" />
            </svg>
            <span className="text-primary font-medium">Our Services</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-medium text-black mb-6 leading-tight">
            Professional Laundry Services
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            From everyday essentials to specialty care, we handle all your
            laundry needs with expertise and attention to detail.
          </p>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="px-4 lg:px-16 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            )
            )
            }
            <div key={service.id} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl mb-6 flex items-center justify-center">
                <img
                  src={service.icon || service.image_url}
                  alt={service.name}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="flex items-center mb-4">
                <img
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 lg:px-16 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-medium text-black mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, convenient, and reliable laundry service in just a few
              steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-medium text-black mb-4">
                Schedule Pickup
              </h3>
              <p className="text-gray-600">
                Choose your preferred pickup time through our app or website.
                We'll come to you.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-medium text-black mb-4">
                Professional Care
              </h3>
              <p className="text-gray-600">
                Our expert team handles your items with care, using premium
                products and techniques.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-medium text-black mb-4">
                Fresh Delivery
              </h3>
              <p className="text-gray-600">
                Receive your cleaned, pressed, and folded laundry delivered
                right to your door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 lg:px-16 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-medium text-black mb-6">
              Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              No hidden fees, no surprises. Just honest, upfront pricing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-medium text-black mb-4">
                Basic Wash & Fold
              </h3>
              <div className="text-4xl font-bold text-primary mb-6">
                $24.99
                <span className="text-lg font-normal text-gray-600">/bag</span>
              </div>
              <ul className="space-y-3 text-gray-600 mb-8">
                <li>✓ Up to 15 lbs of laundry</li>
                <li>✓ Wash, dry, and fold</li>
                <li>✓ 24-48 hour turnaround</li>
                <li>✓ Free pickup & delivery</li>
              </ul>
              <Link
                to="/order/items/eazzy-bag"
                className="block w-full bg-primary text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-colors text-center"
              >
                Choose Plan
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-primary relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-2xl font-medium text-black mb-4">
                Premium Care
              </h3>
              <div className="text-4xl font-bold text-primary mb-6">
                $39.99
                <span className="text-lg font-normal text-gray-600">/bag</span>
              </div>
              <ul className="space-y-3 text-gray-600 mb-8">
                <li>✓ Everything in Basic</li>
                <li>✓ Delicate item care</li>
                <li>✓ Professional pressing</li>
                <li>✓ Stain treatment</li>
                <li>✓ Fabric softener</li>
              </ul>
              <Link
                to="/order/items/eazzy-bag"
                className="block w-full bg-primary text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-colors text-center"
              >
                Choose Plan
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-medium text-black mb-4">
                Dry Clean Only
              </h3>
              <div className="text-4xl font-bold text-primary mb-6">
                $12.99
                <span className="text-lg font-normal text-gray-600">/item</span>
              </div>
              <ul className="space-y-3 text-gray-600 mb-8">
                <li>✓ Professional dry cleaning</li>
                <li>✓ Expert stain removal</li>
                <li>✓ Eco-friendly solvents</li>
                <li>✓ Careful pressing</li>
                <li>✓ Protective packaging</li>
              </ul>
              <Link
                to="/order/items/dry-cleaning"
                className="block w-full bg-primary text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-colors text-center"
              >
                Get Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 lg:px-16 py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-medium mb-6">
            Ready to Experience
          </h2>
          <div className="flex items-center justify-center mb-6">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0ba0452a2d1340e7b84136d8ed253a1b%2Fb6e642e462f04f14827396626baf4d5e?format=webp&width=800"
              alt="eazyy logo"
              className="h-12 w-auto filter brightness-0 invert"
            />
            <span className="text-4xl lg:text-5xl font-medium ml-4">?</span>
          </div>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who trust us with their
            laundry needs.
          </p>
          <Link
            to="/order/start"
            className="inline-block bg-white text-primary px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-100 transition-colors"
          >
            Schedule Your First Pickup
          </Link>
        </div>
      </section>

      {/* Footer hidden (global footer used) */}
      <footer className="hidden">
        <div>
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-semibold text-black mb-4">Sections</h3>
              <div className="space-y-3">
                <Link
                  to="/personal"
                  className="block text-black hover:text-primary transition-colors"
                >
                  Personal
                </Link>
                <Link
                  to="/business"
                  className="block text-black hover:text-primary transition-colors"
                >
                  Business
                </Link>
                <Link
                  to="/company"
                  className="block text-black hover:text-primary transition-colors"
                >
                  Company
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-4">Help</h3>
              <div className="space-y-3">
                <Link
                  to="/privacy"
                  className="block text-black hover:text-primary transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  to="/complaints"
                  className="block text-black hover:text-primary transition-colors"
                >
                  Complaints
                </Link>
                <Link
                  to="/cookie-policy"
                  className="block text-black hover:text-primary transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-4">
                Company policies
              </h3>
              <div className="space-y-3">
                <Link
                  to="/website-terms"
                  className="block text-black hover:text-primary transition-colors"
                >
                  website terms
                </Link>
                <Link
                  to="/legal-agreements"
                  className="block text-black hover:text-primary transition-colors"
                >
                  Legal Agreements
                </Link>
                <Link
                  to="/modern-slavery-policy"
                  className="block text-black hover:text-primary transition-colors"
                >
                  Modern Slavery Policy
                </Link>
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
              <a
                href="https://facebook.com/eazzy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.99982 0C4.0294 0 0 4.04428 0 9.03306C0 13.2692 2.90586 16.8239 6.82582 17.8002V11.7936H4.97006V9.03306H6.82582V7.84359C6.82582 4.76909 8.21216 3.34404 11.2195 3.34404C11.7898 3.34404 12.7736 3.45641 13.1761 3.56842V6.07058C12.9637 6.04818 12.5947 6.03698 12.1364 6.03698C10.6608 6.03698 10.0906 6.59811 10.0906 8.05677V9.03306H13.0303L12.5252 11.7936H10.0906V18C14.5469 17.4598 18 13.6515 18 9.03306C17.9996 4.04428 13.9702 0 8.99982 0Z"
                    fill="black"
                  />
                </svg>
              </a>
              <a
                href="https://instagram.com/eazzy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.70461 1.56752C11.0304 1.56752 11.3059 1.57772 12.2205 1.61852C13.0706 1.65592 13.5296 1.79874 13.8356 1.91774C14.2403 2.07416 14.5327 2.26457 14.8353 2.56719C15.1413 2.87322 15.3284 3.16224 15.4848 3.56687C15.6038 3.87289 15.7466 4.33533 15.784 5.18199C15.8248 6.10006 15.835 6.37548 15.835 8.69786C15.835 11.0236 15.8248 11.2991 15.784 12.2137C15.7466 13.0638 15.6038 13.5228 15.4848 13.8288C15.3284 14.2335 15.1379 14.5259 14.8353 14.8285C14.5293 15.1345 14.2403 15.3216 13.8356 15.478C13.5296 15.597 13.0672 15.7398 12.2205 15.7772C11.3025 15.818 11.027 15.8282 8.70466 15.8282C6.37888 15.8282 6.10346 15.818 5.18879 15.7772C4.33873 15.7398 3.87969 15.597 3.57367 15.478C3.16904 15.3216 2.87662 15.1311 2.57399 14.8285C2.26797 14.5225 2.08096 14.2335 1.92455 13.8288C1.80554 13.5228 1.66273 13.0604 1.62532 12.2137C1.58452 11.2957 1.57432 11.0202 1.57432 8.69786C1.57432 6.37208 1.58452 6.09666 1.62532 5.18199C1.66273 4.33193 1.80554 3.87289 1.92455 3.56687C2.08096 3.16224 2.27137 2.86982 2.57399 2.56719C2.88002 2.26117 3.16904 2.07416 3.57367 1.91774C3.87969 1.79874 4.34213 1.65592 5.18879 1.61852C6.10346 1.57772 6.37888 1.56752 8.70466 1.56752ZM8.70466 0C6.34148 0 6.04566 0.0102008 5.11739 0.0510039C4.19252 0.0918069 3.55667 0.241418 3.00583 0.455634C2.43118 0.680051 1.94495 0.975874 1.46211 1.46211C0.975874 1.94495 0.680051 2.43118 0.455634 3.00243C0.241418 3.55667 0.0918069 4.18912 0.0510039 5.11399C0.0102008 6.04566 0 6.34148 0 8.70466C0 11.0678 0.0102008 11.3637 0.0510039 12.2919C0.0918069 13.2168 0.241418 13.8526 0.455634 14.4035C0.680051 14.9781 0.975874 15.4644 1.46211 15.9472C1.94495 16.43 2.43118 16.7293 3.00243 16.9503C3.55667 17.1645 4.18912 17.3141 5.11399 17.3549C6.04226 17.3957 6.33808 17.4059 8.70126 17.4059C11.0644 17.4059 11.3603 17.3957 12.2885 17.3549C13.2134 17.3141 13.8492 17.1645 14.4001 16.9503C14.9713 16.7293 15.4576 16.43 15.9404 15.9472C16.4232 15.4644 16.7225 14.9781 16.9435 14.4069C17.1577 13.8526 17.3073 13.2202 17.3481 12.2953C17.3889 11.3671 17.3991 11.0712 17.3991 8.70806C17.3991 6.34488 17.3889 6.04906 17.3481 5.12079C17.3073 4.19592 17.1577 3.56007 16.9435 3.00923C16.7293 2.43118 16.4334 1.94495 15.9472 1.46211C15.4644 0.979274 14.9781 0.680051 14.4069 0.459035C13.8526 0.244818 13.2202 0.0952072 12.2953 0.0544041C11.3637 0.0102008 11.0678 0 8.70466 0Z"
                    fill="black"
                  />
                  <path
                    d="M8.70461 4.2334C6.23603 4.2334 4.23328 6.23615 4.23328 8.70474C4.23328 11.1733 6.23603 13.1761 8.70461 13.1761C11.1732 13.1761 13.176 11.1733 13.176 8.70474C13.176 6.23615 11.1732 4.2334 8.70461 4.2334ZM8.70461 11.6052C7.10309 11.6052 5.80419 10.3063 5.80419 8.70474C5.80419 7.10322 7.10309 5.80432 8.70461 5.80432C10.3061 5.80432 11.605 7.10322 11.605 8.70474C11.605 10.3063 10.3061 11.6052 8.70461 11.6052Z"
                    fill="black"
                  />
                  <path
                    d="M14.3967 4.05658C14.3967 4.63462 13.9274 5.10046 13.3528 5.10046C12.7747 5.10046 12.3089 4.63122 12.3089 4.05658C12.3089 3.47853 12.7781 3.0127 13.3528 3.0127C13.9274 3.0127 14.3967 3.48193 14.3967 4.05658Z"
                    fill="black"
                  />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@eazzy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <svg
                  width="15"
                  height="17"
                  viewBox="0 0 15 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.0287 0H8.06913V11.5797C8.06913 12.9594 6.93087 14.0928 5.51434 14.0928C4.09781 14.0928 2.95953 12.9594 2.95953 11.5797C2.95953 10.2246 4.07251 9.11592 5.43847 9.06667V6.15943C2.42833 6.20868 0 8.59855 0 11.5797C0 14.5855 2.47892 17 5.53964 17C8.60032 17 11.0792 14.5609 11.0792 11.5797V5.64202C12.1922 6.43044 13.5582 6.89855 15 6.9232V4.01594C12.774 3.94203 11.0287 2.16811 11.0287 0Z"
                    fill="black"
                  />
                </svg>
              </a>
              <a
                href="https://pinterest.com/eazzy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <svg
                  width="17"
                  height="18"
                  viewBox="0 0 17 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.5 0C3.80508 0 0 4.02891 0 9C0 12.8145 2.24121 16.0699 5.40215 17.3812C5.3291 16.6676 5.25938 15.5777 5.43203 14.8008C5.58809 14.0977 6.42813 10.3289 6.42813 10.3289C6.42813 10.3289 6.17246 9.79102 6.17246 8.99297C6.17246 7.74141 6.85644 6.80625 7.70976 6.80625C8.43359 6.80625 8.78555 7.38281 8.78555 8.07539C8.78555 8.84883 8.3207 10.002 8.08164 11.0707C7.88242 11.9672 8.50664 12.6984 9.34004 12.6984C10.8508 12.6984 12.0129 11.0109 12.0129 8.57812C12.0129 6.42305 10.552 4.91484 8.46348 4.91484C6.04629 4.91484 4.6252 6.83437 4.6252 8.8207C4.6252 9.59414 4.90742 10.4238 5.25937 10.8738C5.3291 10.9617 5.33906 11.0426 5.31914 11.1305C5.25605 11.4152 5.10996 12.027 5.0834 12.15C5.04688 12.3152 4.96055 12.3504 4.79785 12.2695C3.73535 11.7457 3.07129 10.1039 3.07129 8.78203C3.07129 5.94141 5.02031 3.33633 8.68594 3.33633C11.6344 3.33633 13.9254 5.56172 13.9254 8.53594C13.9254 11.6367 12.0793 14.1328 9.51602 14.1328C8.65606 14.1328 7.8459 13.6582 7.56699 13.0992C7.56699 13.0992 7.14199 14.8184 7.03906 15.2402C6.84648 16.0207 6.32852 17.0016 5.9832 17.5992C6.78008 17.8594 7.62344 18 8.5 18C13.1949 18 17 13.9711 17 9C17 4.02891 13.1949 0 8.5 0Z"
                    fill="black"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
  )
  )
  );
}
