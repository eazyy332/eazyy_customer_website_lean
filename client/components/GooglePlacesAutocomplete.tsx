import React, { useEffect, useRef, useState } from 'react';

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
}

declare global {
  interface Window {
    google: typeof google;
    initGooglePlaces: () => void;
  }
}

export default function GooglePlacesAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Enter address",
  className = "",
  label,
  required = false
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Google Places API script
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    
    console.log('Google Places API Key:', apiKey ? 'Present' : 'Missing');
    
    if (!apiKey || apiKey === 'your_google_places_api_key_here') {
      console.warn('Google Places API key not configured. Using fallback input.');
      setIsLoaded(true);
      return;
    }

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Wait a bit for Google Maps to fully initialize
        setTimeout(() => {
          if (window.google && window.google.maps && window.google.maps.places) {
            setIsLoaded(true);
            initializeAutocomplete();
          } else {
            // Retry after a longer delay
            setTimeout(() => {
              setIsLoaded(true);
              initializeAutocomplete();
            }, 500);
          }
        }, 100);
      };
      script.onerror = () => {
        console.error('Failed to load Google Places API');
        setIsLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
      initializeAutocomplete();
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google || !window.google.maps || !window.google.maps.places) {
      console.warn('Google Maps Places API not fully loaded yet');
      return;
    }

    try {
      const options: google.maps.places.AutocompleteOptions = {
        componentRestrictions: { country: ['nl', 'be', 'de', 'fr', 'gb'] }, // Restrict to European countries
        types: ['address'],
        fields: ['address_components', 'formatted_address', 'geometry', 'name'],
      };

      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, options);

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (place && place.geometry) {
        onPlaceSelect(place);
        
        // Extract address components
        const addressComponents = place.address_components || [];
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

        // Update the input with formatted address
        onChange(place.formatted_address || value);
      }
    });
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
      setIsLoaded(true);
    }
  };

  // Fallback to regular input if Google Places API is not available
  if (!isLoaded || !import.meta.env.VITE_GOOGLE_PLACES_API_KEY || import.meta.env.VITE_GOOGLE_PLACES_API_KEY === 'your_google_places_api_key_here') {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-black mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors ${className}`}
        />
        <div className="mt-2 text-sm text-gray-500">
          Address autocomplete not available. Please enter your address manually.
        </div>
      </div>
    );
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-black mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors ${className}`}
        disabled={!isLoaded}
      />
      {!isLoaded && (
        <div className="mt-2 text-sm text-gray-500">
          Loading address suggestions...
        </div>
      )}
    </div>
  );
}
