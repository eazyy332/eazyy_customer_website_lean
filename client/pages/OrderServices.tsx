import { useState } from "react";
import { Link } from "react-router-dom";

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  icon: string;
  quantity: number;
}

export default function OrderServices() {
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [step, setStep] = useState(1); // 1 = select services, 2 = review

  const services = [
    {
      id: "eazzy-bag",
      name: "eazzy Bag",
      description: "Fill our sturdy bag with a week's worth of laundry. We'll wash, dry, fold, and return everything fresh.",
      price: 24.99,
      unit: "per bag (up to 15 lbs)",
      icon: "🧺",
      quantity: 0
    },
    {
      id: "wash-iron",
      name: "Wash & Iron",
      description: "Daily laundry expertly washed and ironed for a crisp finish. Folded neatly and delivered to your door.",
      price: 3.99,
      unit: "per item",
      icon: "👔",
      quantity: 0
    },
    {
      id: "dry-cleaning",
      name: "Dry Cleaning",
      description: "Professional dry cleaning for delicate fabrics. Stains vanish, colors stay vibrant, garments look like new.",
      price: 12.99,
      unit: "per item",
      icon: "🧥",
      quantity: 0
    },
    {
      id: "repairs",
      name: "Repairs & Alterations",
      description: "Skilled tailors breathe new life into your garments. Mend tears, replace zippers, and secure hems.",
      price: 15.00,
      unit: "per item",
      icon: "✂️",
      quantity: 0
    }
  ];

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity < 0) return;
    
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    setSelectedServices(prev => {
      const existingIndex = prev.findIndex(s => s.id === serviceId);
      
      if (quantity === 0) {
        return prev.filter(s => s.id !== serviceId);
      }
      
      const updatedService = { ...service, quantity };
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = updatedService;
        return updated;
      } else {
        return [...prev, updatedService];
      }
    });
  };

  const getQuantity = (serviceId: string) => {
    const service = selectedServices.find(s => s.id === serviceId);
    return service?.quantity || 0;
  };

  const getTotalPrice = () => {
    return selectedServices.reduce((total, service) => total + (service.price * service.quantity), 0);
  };

  const canProceed = selectedServices.length > 0 && selectedServices.some(s => s.quantity > 0);

  if (step === 2) {
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
            </div>
          </nav>
        </header>

        {/* Order Review */}
        <main className="px-4 lg:px-16 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Services</span>
                <span>Scheduling</span>
                <span>Address</span>
                <span>Payment</span>
                <span>Confirmation</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: '20%' }}></div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-medium text-black mb-4">Review Your Selection</h1>
              <p className="text-gray-600">Confirm your services before proceeding to scheduling</p>
            </div>

            {/* Selected Services */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-medium text-black mb-4">Selected Services</h2>
              <div className="space-y-4">
                {selectedServices.map(service => (
                  <div key={service.id} className="flex items-center justify-between bg-white rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{service.icon}</span>
                      <div>
                        <h3 className="font-medium text-black">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.unit}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-600">×{service.quantity}</span>
                      <span className="font-medium text-black">${(service.price * service.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                <span className="text-lg font-medium text-black">Total</span>
                <span className="text-2xl font-bold text-primary">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button 
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 rounded-full font-medium text-black hover:bg-gray-50 transition-colors"
              >
                ← Back to Services
              </button>
              <Link 
                to="/order/scheduling" 
                state={{ selectedServices, totalPrice: getTotalPrice() }}
                className="inline-block px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                Continue to Scheduling →
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="px-4 lg:px-16 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span className="text-primary font-medium">Services</span>
              <span>Scheduling</span>
              <span>Address</span>
              <span>Payment</span>
              <span>Confirmation</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: '20%' }}></div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-medium text-black mb-6 leading-tight">
              Select Your Services
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Choose the services you need and specify quantities
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {services.map(service => {
              const quantity = getQuantity(service.id);
              return (
                <div key={service.id} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-2xl font-medium text-black mb-3">{service.name}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                    <div className="text-xl font-bold text-primary mb-6">
                      ${service.price.toFixed(2)} <span className="text-sm font-normal text-gray-600">{service.unit}</span>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <button 
                      onClick={() => updateQuantity(service.id, quantity - 1)}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      disabled={quantity === 0}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-16 text-center text-lg font-medium">{quantity}</span>
                    <button 
                      onClick={() => updateQuantity(service.id, quantity + 1)}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                      </svg>
                    </button>
                  </div>

                  {quantity > 0 && (
                    <div className="text-center bg-accent rounded-lg p-3">
                      <span className="text-primary font-medium">
                        Subtotal: ${(service.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          {selectedServices.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-black">Order Summary</h3>
                  <p className="text-gray-600">{selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">${getTotalPrice().toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total amount</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Link 
              to="/order/start"
              className="px-6 py-3 border border-gray-300 rounded-full font-medium text-black hover:bg-gray-50 transition-colors"
            >
              ← Back to Order Type
            </Link>
            
            {canProceed ? (
              <button 
                onClick={() => setStep(2)}
                className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                Review Selection →
              </button>
            ) : (
              <div className="text-gray-400 text-sm">Select at least one service to continue</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
