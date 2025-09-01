import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import GooglePlacesAutocomplete from "../components/GooglePlacesAutocomplete";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "../hooks/useAuth";

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
  const { user } = useAuth();
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
  const [saveThisAddress, setSaveThisAddress] = useState(false);
  const [addressName, setAddressName] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);

  // Initialize email with authenticated user's email
  useEffect(() => {
    if (user?.email) {
      setAddress(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [user]);

  // Load user profile for name information
  useEffect(() => {
    if (!user) return;
    
    const loadUserProfile = async () => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .maybeSingle();
        
        if (profile) {
          setUserProfile(profile);
          setAddress(prev => ({
            ...prev,
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            fullName: `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
          }));
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };
    
    loadUserProfile();
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    async function loadAddresses() {
      if (!user) {
        if (isMounted) {
          setSavedAddresses([]);
          setLoading(false);
        }
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('user_addresses')
          .select('id, name, street, house_number, additional_info, city, postal_code, is_default')
          .eq('user_id', user.id)
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
  }, [user]);

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
        email: user?.email || prev.email || '',
        specialInstructions: ''
      }));
    }
  };

  const isFormValid = () => {
    // Email is automatically set from user account, no need to validate
    const hasValidContact = true;
    
    if (!useNewAddress && selectedSavedAddress) {
      return hasValidContact;
    }
    
    return address.streetAddress.trim() !== '' &&
           address.city.trim() !== '' &&
           address.postalCode.trim() !== '' &&
           true;
  };

  const suggestedInstructions = [
    "Ring the bell",
    "Call when you arrive",
    "Leave with concierge",
    "Building code: 1234",
    "Use side entrance",
    "Apartment buzzer broken - call phone"
  ];

  const saveNewAddress = async () => {
    if (!user || !useNewAddress || !addressName.trim()) return;
    
    try {
      const { error } = await supabase
        .from('user_addresses')
        .insert({
          user_id: user.id,
          name: addressName.trim(),
          street: address.streetAddress,
          house_number: '', 
          additional_info: address.apartment,
          city: address.city,
          postal_code: address.postalCode,
          is_default: savedAddresses.length === 0 // Make first address default
        });
      
      if (error) throw error;
      
      // Reload addresses to show the new one
      const { data } = await supabase
        .from('user_addresses')
        .select('id, name, street, house_number, additional_info, city, postal_code, is_default')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });
      
      if (data) {
        const mapped: SavedAddress[] = data.map((a: any) => ({
          id: a.id,
          name: a.name || 'Saved Address',
          fullAddress: `${a.house_number} ${a.street}, ${a.additional_info ? a.additional_info + ', ' : ''}${a.city} ${a.postal_code}`.trim(),
          isDefault: !!a.is_default
        }));
        setSavedAddresses(mapped);
      }
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const handleContinueToPayment = async () => {
    // Save address if requested
    if (saveThisAddress && useNewAddress && addressName.trim()) {
      await saveNewAddress();
    }
    
    // Continue to payment
    const addressData = useNewAddress ? address : savedAddresses.find(a => a.id === selectedSavedAddress);
    
    // Navigate to payment with proper address data
    const navigate = (await import('react-router-dom')).useNavigate();
    navigate('/order/payment', {
      state: {
        selectedServices: services,
        totalPrice: calculatedTotalPrice,
        schedule,
        address: addressData,
        sourceQuoteId
      }
    });
  };
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
        <div className="max-w-[960px] mx-auto">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
              <span className="text-gray-400">Services</span>
              <span className="text-gray-400">Scheduling</span>
              <span className="text-primary font-semibold">Address</span>
              <span>Payment</span>
              <span>Confirmation</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-gradient-to-r from-primary to-blue-500 h-1.5 rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 h-9 px-4 rounded-[10px] bg-[#E9F1FF] mb-6">
              <svg className="w-5 h-6 text-[#1D62DB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="text-[#1D62DB] font-medium">delivery address</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-medium text-black mb-4 leading-tight">
              Where Should We
            </h1>
            <h1 className="text-3xl md:text-5xl font-medium text-black mb-6 leading-tight">
              Pick Up & Deliver?
            </h1>
            <p className="text-black text-base md:text-lg leading-relaxed max-w-md mx-auto">
              Enter your address details for pickup and delivery
            </p>
          </div>

          {/* Address Selection */}
          <div className="space-y-8">
            {/* Saved Addresses */}
            {savedAddresses.length > 0 && (
              <div className="bg-white rounded-[28px] border border-gray-200 p-8 shadow-[0_8px_30px_rgba(17,24,39,0.08)]">
                <h3 className="text-lg font-medium text-black mb-4">Saved Addresses</h3>
                <div className="space-y-3">
                  {savedAddresses.map(addr => (
                    <button
                      key={addr.id}
                      onClick={() => handleSavedAddressSelect(addr.id)}
                      className={`w-full p-4 rounded-lg text-left transition-colors ${
                        selectedSavedAddress === addr.id && !useNewAddress
                          ? 'bg-primary text-white shadow-lg'
                          : 'bg-gray-50 border border-gray-200 hover:border-primary hover:shadow-md text-black'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium flex items-center">
                            {addr.name}
                            {addr.isDefault && (
                              <span className={`ml-2 text-xs px-2 py-1 rounded ${
                                selectedSavedAddress === addr.id && !useNewAddress
                                  ? 'bg-white/25 text-white'
                                  : 'bg-primary/10 text-primary'
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
                    className={`text-sm font-semibold ${
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
              <div className="bg-white rounded-[28px] border border-gray-200 p-8 shadow-[0_8px_30px_rgba(17,24,39,0.08)]">
                <h3 className="text-xl font-medium text-black mb-8">Enter New Address</h3>
                
                <div className="space-y-6">
                  {/* Save Address Option */}
                  {user && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={saveThisAddress}
                          onChange={(e) => setSaveThisAddress(e.target.checked)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-blue-900">Save this address for future orders</span>
                          <p className="text-xs text-blue-700 mt-1">Make ordering faster next time</p>
                        </div>
                      </label>
                      
                      {saveThisAddress && (
                        <div className="mt-3">
                          <input
                            type="text"
                            value={addressName}
                            onChange={(e) => setAddressName(e.target.value)}
                            placeholder="Address name (e.g., Home, Work, Apartment)"
                            className="w-full px-4 py-3 bg-white border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* User Info Display */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-blue-900">
                          {userProfile?.first_name && userProfile?.last_name 
                            ? `${userProfile.first_name} ${userProfile.last_name}`
                            : user?.email?.split('@')[0]?.charAt(0).toUpperCase() + user?.email?.split('@')[0]?.slice(1) || 'User'
                          }
                        </div>
                        <div className="text-sm text-blue-700">{user?.email}</div>
                      </div>
                    </div>
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
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
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Postal Code *</label>
                      <input 
                        type="text" 
                        value={address.postalCode}
                        onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                    >
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  {/* Phone Number */}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="bg-white rounded-[28px] border border-gray-200 p-8 shadow-[0_8px_30px_rgba(17,24,39,0.08)]">
              <h3 className="text-xl font-medium text-black mb-8">Delivery Notes (Optional)</h3>
              
              {/* Quick Suggestions */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-3">Quick suggestions:</label>
                <div className="flex flex-wrap gap-2">
                  {suggestedInstructions.map(instruction => (
                    <button
                      key={instruction}
                      onClick={() => handleAddressChange('specialInstructions', instruction)}
                      className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm hover:border-primary hover:bg-primary hover:text-white text-black transition-all"
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
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors resize-none"
                  placeholder="Any special instructions for pickup or delivery (building codes, access instructions, etc.)"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-[#E9F1FF] rounded-[28px] p-8 border border-blue-100">
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
              className="inline-flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              ← Back to Scheduling
            </Link>
            
            {isFormValid() ? (
              <button
                onClick={handleContinueToPayment}
                className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Continue to Payment →
              </button>
            ) : (
              <div className="text-sm text-gray-500 text-center">Complete address information to continue</div>
            )}
          </div>
        </div>
      </main>
      </div>
    </AuthGuard>
  );
}