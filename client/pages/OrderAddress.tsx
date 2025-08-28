import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import GooglePlacesAutocomplete from "../components/GooglePlacesAutocomplete";
import AuthGuard from "@/components/AuthGuard";

interface AddressData {
  fullName: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  apartment: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  email: string;
  specialInstructions: string;
}

interface SavedAddress {
  id: string;
  name: string;
  fullAddress: string;
  isDefault: boolean;
}

export default function OrderAddress() {
  const location = useLocation();
  const { selectedServices, totalPrice, schedule, sourceQuoteId } = location.state || {
    selectedServices: [],
    totalPrice: 0,
    schedule: {},
    sourceQuoteId: null
  };

  // Also check localStorage for cart items
  const [cartItems] = useState(() => {
    const savedCart = localStorage.getItem('eazzy-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Use either passed services or cart items
  const services = selectedServices.length > 0 ? selectedServices : cartItems;
  const calculatedTotalPrice = totalPrice > 0 ? totalPrice : services.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
  
  const [address, setAddress] = useState<AddressData>({
    fullName: '',
    firstName: '',
    lastName: '',
    streetAddress: '',
    apartment: '',
    city: '',
    postalCode: '',
    country: 'Netherlands',
    phoneNumber: '',
    email: '',
    specialInstructions: ''
  });

  const [useNewAddress, setUseNewAddress] = useState(true);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadAddresses() {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('user_addresses')
          .select('id, name, street, house_number, additional_info, city, postal_code, is_default')
          .order('is_default', { ascending: false });
        if (error) throw error;
        const mapped: SavedAddress[] = (data || []).map((a: any) => ({
          id: a.id,
          name: a.name || 'Saved Address',
          fullAddress: `${a.house_number} ${a.street}, ${a.additional_info ? a.additional_info + ', ' : ''}${a.city} ${a.postal_code}`.trim(),
          isDefault: !!a.is_default
        }));
        if (isMounted) setSavedAddresses(mapped);
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Failed to load addresses');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadAddresses();
    return () => { isMounted = false; };
  }, []);

  const countries = [
    'Netherlands',
    'Belgium',
    'Germany',
    'France',
    'United Kingdom'
  ];

  const handleAddressChange = (field: keyof AddressData, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    
    // Auto-update fullName when firstName or lastName changes
    if (field === 'firstName' || field === 'lastName') {
      const newFirstName = field === 'firstName' ? value : address.firstName;
      const newLastName = field === 'lastName' ? value : address.lastName;
      setAddress(prev => ({ 
        ...prev, 
        [field]: value,
        fullName: `${newFirstName} ${newLastName}`.trim()
      }));
    }
  };

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    const addressComponents = place.address_components || [];
    
    // Extract address components
    const streetNumber = addressComponents.find(component => 
      component.types.includes('street_number')
    )?.long_name || '';
    const route = addressComponents.find(component => 
      component.types.includes('route')
    )?.long_name || '';
    const city = addressComponents.find(component => 
      component.types.includes('locality')
    )?.long_name || '';
    const postalCode = addressComponents.find(component => 
      component.types.includes('postal_code')
    )?.long_name || '';
    const country = addressComponents.find(component => 
      component.types.includes('country')
    )?.long_name || '';

    // Update address fields
    setAddress(prev => ({
      ...prev,
      streetAddress: `${streetNumber} ${route}`.trim(),
      city: city,
      postalCode: postalCode,
      country: country || prev.country
    }));
  };

  const handleSavedAddressSelect = (addressId: string) => {
    setSelectedSavedAddress(addressId);
    setUseNewAddress(false);
    
    const selected = savedAddresses.find(a => a.id === addressId);
    if (selected) {
      // naive split for demo; ideally store structured fields
      setAddress(prev => ({
        ...prev,
        fullName: prev.fullName || '',
        firstName: prev.firstName || '',
        lastName: prev.lastName || '',
        streetAddress: selected.fullAddress,
        apartment: '',
        city: '',
        postalCode: '',
        country: 'Netherlands',
        phoneNumber: prev.phoneNumber || '',
        email: prev.email || '',
        specialInstructions: ''
      }));
    }
  };

  const isFormValid = () => {
    if (!useNewAddress && selectedSavedAddress) {
      return true;
    }
    
    return (address.firstName.trim() !== '' || address.fullName.trim() !== '') &&
           address.streetAddress.trim() !== '' &&
           address.city.trim() !== '' &&
           address.postalCode.trim() !== '' &&
           address.email.trim() !== '' &&
           address.phoneNumber.trim() !== '';
  };

  const suggestedInstructions = [
    "Ring the bell",
    "Call when you arrive",
    "Leave with concierge",
    "Building code: 1234",
    "Use side entrance",
    "Apartment buzzer broken - call phone"
  ];

  return (
    <AuthGuard redirectMessage="Please sign in to continue with your order">
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
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Services</span>
              <span>Scheduling</span>
              <span className="text-primary font-medium">Address</span>
              <span>Payment</span>
              <span>Confirmation</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: '60%' }}></div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-medium text-black mb-6 leading-tight">
              Delivery Address & Notes
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Where should we pick up and deliver your laundry?
            </p>
          </div>

          {/* Address Selection */}
          <div className="space-y-8">
            {/* Saved Addresses */}
            {savedAddresses.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-medium text-black mb-4">Saved Addresses</h3>
                <div className="space-y-3">
                  {savedAddresses.map(addr => (
                    <button
                      key={addr.id}
                      onClick={() => handleSavedAddressSelect(addr.id)}
                      className={`w-full p-4 rounded-lg text-left transition-colors ${
                        selectedSavedAddress === addr.id && !useNewAddress
                          ? 'bg-primary text-white'
                          : 'bg-white border border-gray-200 hover:border-primary text-black'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium flex items-center">
                            {addr.name}
                            {addr.isDefault && (
                              <span className={`ml-2 text-xs px-2 py-1 rounded ${
                                selectedSavedAddress === addr.id && !useNewAddress
                                  ? 'bg-white/20 text-white'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                Default
                              </span>
                            )}
                          </div>
                          <div className={`text-sm mt-1 ${
                            selectedSavedAddress === addr.id && !useNewAddress
                              ? 'text-white/80'
                              : 'text-gray-600'
                          }`}>
                            {addr.fullAddress}
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedSavedAddress === addr.id && !useNewAddress
                            ? 'bg-white border-white'
                            : 'border-gray-300'
                        }`}>
                          {selectedSavedAddress === addr.id && !useNewAddress && (
                            <div className="w-full h-full bg-primary rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-4">
                  <button
                    onClick={() => { setUseNewAddress(true); setSelectedSavedAddress(''); }}
                    className={`text-sm font-medium ${
                      useNewAddress ? 'text-primary' : 'text-gray-600 hover:text-primary'
                    } transition-colors`}
                  >
                    + Use a new address
                  </button>
                </div>
              </div>
            )}

            {/* New Address Form */}
            {useNewAddress && (
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-lg font-medium text-black mb-6">Enter New Address</h3>
                
                <div className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">First Name *</label>
                      <input 
                        type="text" 
                        value={address.firstName}
                        onChange={(e) => handleAddressChange('firstName', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Last Name *</label>
                      <input 
                        type="text" 
                        value={address.lastName}
                        onChange={(e) => handleAddressChange('lastName', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      value={address.email}
                      onChange={(e) => handleAddressChange('email', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Street Address */}
                  <div>
                    <GooglePlacesAutocomplete
                      value={address.streetAddress}
                      onChange={(value) => handleAddressChange('streetAddress', value)}
                      onPlaceSelect={handlePlaceSelect}
                      label="Street Address"
                      placeholder="Start typing your address..."
                      required
                    />
                  </div>

                  {/* Apartment/Unit */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Apartment, suite, unit (optional)</label>
                    <input 
                      type="text" 
                      value={address.apartment}
                      onChange={(e) => handleAddressChange('apartment', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                      placeholder="Apt, suite, unit, etc."
                    />
                  </div>

                  {/* City and Postal Code */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">City *</label>
                      <input 
                        type="text" 
                        value={address.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Postal Code *</label>
                      <input 
                        type="text" 
                        value={address.postalCode}
                        onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                        placeholder="Enter postal code"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Country *</label>
                    <select 
                      value={address.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                    >
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Phone Number *</label>
                    <input 
                      type="tel" 
                      value={address.phoneNumber}
                      onChange={(e) => handleAddressChange('phoneNumber', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                      placeholder="+31 6 12345678"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-lg font-medium text-black mb-6">Special Instructions (Optional)</h3>
              
              {/* Quick Suggestions */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-3">Quick suggestions:</label>
                <div className="flex flex-wrap gap-2">
                  {suggestedInstructions.map(instruction => (
                    <button
                      key={instruction}
                      onClick={() => handleAddressChange('specialInstructions', instruction)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-primary text-black transition-colors"
                    >
                      {instruction}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Instructions */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Custom instructions</label>
                <textarea 
                  rows={4}
                  value={address.specialInstructions}
                  onChange={(e) => handleAddressChange('specialInstructions', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors resize-none"
                  placeholder="Any special instructions for pickup or delivery (building codes, access instructions, etc.)"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-accent rounded-2xl p-6">
              <h3 className="text-lg font-medium text-black mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Services</span>
                  <span className="text-black">{services.reduce((total: number, item: any) => total + item.quantity, 0)} item{services.reduce((total: number, item: any) => total + item.quantity, 0) > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pickup</span>
                  <span className="text-black">
                    {schedule.pickupDate ? new Date(schedule.pickupDate).toLocaleDateString() : 'Not set'}
                    {schedule.pickupTime ? ` at ${schedule.pickupTime}` : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-black">
                    {schedule.deliveryDate ? new Date(schedule.deliveryDate).toLocaleDateString() : 'Not set'}
                    {schedule.deliveryTime ? ` at ${schedule.deliveryTime}` : ''}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                  <span className="font-medium text-black">Total</span>
                  <span className="font-bold text-primary">€{calculatedTotalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12">
            <Link
              to="/order/scheduling"
              state={{ selectedServices: services, totalPrice: calculatedTotalPrice }}
              className="px-6 py-3 border border-gray-300 rounded-full font-medium text-black hover:bg-gray-50 transition-colors"
            >
              ← Back to Scheduling
            </Link>
            
            {isFormValid() ? (
              <Link
                to="/order/payment"
                state={{
                  selectedServices: services,
                  totalPrice: calculatedTotalPrice,
                  schedule,
                  address: useNewAddress ? address : savedAddresses.find(a => a.id === selectedSavedAddress),
                  sourceQuoteId
                }}
                className="inline-block px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                Continue to Payment →
              </Link>
            ) : (
              <div className="text-gray-400 text-sm">Complete address information to continue</div>
            )}
          </div>
        </div>
      </main>
      </div>
    </AuthGuard>
  );
}
