import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function OrderStart() {
  const [services, setServices] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("services")
      .select("id, name, service_identifier, description, short_description, icon, image_url")
      .order("sequence", { ascending: true })
      .then(({ data }) => setServices(data || []));
  }, []);

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
            <div className="flex items-center space-x-3">
              {/* User and Cart Icons */}
              <svg width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.32584 1.47739C6.1167 1.47739 4.32584 2.33683 4.32584 3.39699C4.32584 4.45715 6.1167 5.31659 8.32584 5.31659C10.535 5.31659 12.3258 4.45716 12.3258 3.39699C12.3258 2.33683 10.535 1.47739 8.32584 1.47739ZM11.9668 5.68581C13.4008 5.15965 14.3258 4.33016 14.3258 3.39699C14.3258 1.80674 11.6395 0.517593 8.32584 0.517593C5.01213 0.517593 2.32584 1.80674 2.32584 3.39699C2.32584 4.33016 3.25085 5.15965 4.68485 5.68581C3.67937 5.89926 2.75434 6.20132 1.96188 6.58162C1.34995 6.87529 0.835182 7.20692 0.42761 7.56497C-0.324507 8.2257 -0.0177813 8.89939 0.829231 9.37576C1.64464 9.83436 2.95086 10.1156 4.32584 10.1156H12.3258C13.7008 10.1156 15.007 9.83436 15.8224 9.37576C16.6695 8.89939 16.9762 8.2257 16.2241 7.56497C15.8165 7.20692 15.3017 6.87529 14.6898 6.58162C13.8973 6.20132 12.9723 5.89926 11.9668 5.68581ZM8.32584 6.27639C6.46932 6.27639 4.68885 6.63031 3.37609 7.2603C2.90009 7.48874 2.49977 7.74664 2.18279 8.02511C1.87583 8.29477 1.97485 8.54141 2.35064 8.75276C2.75804 8.98188 3.49168 9.15578 4.32584 9.15578H12.3258C13.16 9.15578 13.8936 8.98188 14.301 8.75276C14.6768 8.54141 14.7758 8.29477 14.4689 8.02511C14.1519 7.74664 13.7516 7.48874 13.2756 7.2603C11.9628 6.63031 10.1824 6.27639 8.32584 6.27639Z" fill="black"/>
              </svg>
              <svg width="21" height="11" viewBox="0 0 21 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0 0.997493C0 0.732452 0.447715 0.517593 1 0.517593H1.76393C2.90025 0.517593 3.93904 0.825692 4.44721 1.31344L4.61803 1.47739H17.5068C19.426 1.47739 20.8517 2.33029 20.4353 3.22941L19.3242 5.6289C19.0192 6.28762 17.8018 6.75629 16.3957 6.75629H7.60434C6.19825 6.75629 4.98081 6.28762 4.67578 5.6289L3.05052 2.11907L2.65836 1.74267C2.48897 1.58009 2.1427 1.47739 1.76393 1.47739H1C0.447715 1.47739 0 1.26253 0 0.997493ZM5.24662 2.43719L6.62816 5.42069C6.72983 5.64026 7.13564 5.79649 7.60434 5.79649H16.3957C16.8644 5.79649 17.2702 5.64026 17.3718 5.42069L18.483 3.0212C18.6217 2.72149 18.1465 2.43719 17.5068 2.43719H5.24662ZM8 8.19599C7.44772 8.19599 7 8.41084 7 8.67589C7 8.94093 7.44772 9.15578 8 9.15578C8.55228 9.15578 9 8.94093 9 8.67589C9 8.41084 8.55228 8.19599 8 8.19599ZM5 8.67589C5 7.88076 6.34315 7.23619 8 7.23619C9.65685 7.23619 11 7.88076 11 8.67589C11 9.47101 9.65685 10.1156 8 10.1156C6.34315 10.1156 5 9.47101 5 8.67589ZM16 8.19599C15.4477 8.19599 15 8.41084 15 8.67589C15 8.94093 15.4477 9.15578 16 9.15578C16.5523 9.15578 17 8.94093 17 8.67589C17 8.41084 16.5523 8.19599 16 8.19599ZM13 8.67589C13 7.88076 14.3431 7.23619 16 7.23619C17.6569 7.23619 19 7.88076 19 8.67589C19 9.47101 17.6569 10.1156 16 10.1156C14.3431 10.1156 13 9.47101 13 8.67589Z" fill="black"/>
              </svg>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="px-4 lg:px-16 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-accent rounded-lg mb-6">
              <svg className="w-3 h-2 mr-3 fill-primary" viewBox="0 0 8 6" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.93081 2.5385C6.27144 2.23578 5.37582 2.06384 4.45237 2.02552L4.45051 1.98728C4.44327 1.83309 4.43492 1.79953 4.39205 1.75449C4.31801 1.67652 4.20369 1.62177 3.92068 1.52878C3.78093 1.48277 3.63191 1.42952 3.58978 1.41035C3.46303 1.35286 3.43594 1.24892 3.52947 1.17978C3.54914 1.16521 3.62505 1.13907 3.69816 1.12167C3.92773 1.06701 4.22503 1.08175 4.40078 1.15646C4.51472 1.20486 4.54683 1.24831 4.56446 1.37688C4.57578 1.46007 4.58951 1.49133 4.62143 1.50679C4.77268 1.58 5.45321 1.56869 5.5382 1.49169C5.57105 1.46184 5.54526 1.26464 5.49533 1.16388C5.39586 0.963156 5.07425 0.769229 4.70049 0.68454C4.47204 0.632614 4.30372 0.615571 4.01681 0.615571C3.62467 0.615394 3.32069 0.659107 3.05754 0.753421C2.58282 0.923416 2.34992 1.19258 2.46813 1.43482C2.54867 1.59995 2.74149 1.72111 3.11785 1.84316C3.35985 1.92166 3.44262 1.96326 3.46006 2.03602C2.74576 2.08097 2.05985 2.20761 1.50051 2.41752C0.607492 2.75186 0.111247 3.24436 0.0173432 3.77766C-0.0570749 4.186 0.106051 4.61907 0.544394 4.97566C1.63339 5.85902 4.09271 6.11414 5.99622 5.70315C6.58303 5.57784 7.0802 5.37288 7.43744 5.11987C7.56568 5.02988 7.72732 4.92073 7.734 4.80522C7.734 4.7185 7.62599 4.65112 7.4573 4.62225C7.32925 4.59028 7.18747 4.59028 7.05923 4.59037H6.4251C6.26995 4.59054 6.10126 4.59054 5.95298 4.62251C5.76406 4.66446 5.64269 4.751 5.50109 4.82165C5.31217 4.91482 5.09633 4.99182 4.84673 5.04004C4.08844 5.1846 3.10894 5.09488 2.58579 4.79004C2.29814 4.62136 2.17621 4.42179 2.09493 4.21346L5.02748 4.21293L7.00355 4.21258C7.2398 4.21258 7.59723 4.24446 7.79562 4.17373C8.06545 4.08056 7.99771 3.84398 7.97748 3.70851C7.90325 3.27032 7.61245 2.85112 6.93081 2.5385ZM2.17213 3.59194C2.46182 2.91514 4.21148 2.58548 5.34798 3.03021C5.52354 3.09759 5.66514 3.18422 5.77315 3.27739C5.88765 3.37673 5.97525 3.47917 6.00253 3.59133L2.17194 3.59194H2.17213Z"/>
              </svg>
              <span className="text-primary font-medium">Start Your Order</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-medium text-black mb-6 leading-tight">
              Choose a Service Category
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Select a service to see all available items and pricing
            </p>
          </div>

          {/* Service Categories (from DB) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => navigate(`/order/items/${s.service_identifier}`)}
                className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100 hover:border-primary transition-colors group text-left"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <img src={s.icon || s.image_url || '/placeholder.svg'} alt={s.name} className="w-10 h-10 object-contain" />
                  </div>
                  <h3 className="text-xl font-medium text-black mb-3">{s.name}</h3>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {s.short_description || s.description}
                  </p>
                  <span className="inline-block w-full bg-primary text-white py-3 rounded-full font-medium group-hover:bg-blue-700 transition-colors text-center">
                    Select Items
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Additional Options */}
          <div className="text-center mt-12">
            <div className="bg-gray-50 rounded-2xl p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-medium text-black mb-4">Need Something Special?</h3>
              <p className="text-gray-600 mb-6">
                For unique items or special cleaning needs that don't fit our standard categories
              </p>
              <Link to="/order/custom-quote" className="inline-block bg-gray-800 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-700 transition-colors mr-4">
                Get Custom Quote
              </Link>
              <Link to="/contact" className="inline-block text-primary font-medium hover:underline">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
