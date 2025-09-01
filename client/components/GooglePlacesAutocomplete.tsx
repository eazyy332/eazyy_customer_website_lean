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
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      // Check if Google Maps is already loaded
      if (window.google?.maps?.places?.Autocomplete) {
        setIsGoogleLoaded(true);
        return;
      }

      // Check if script is already loading
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => setIsGoogleLoaded(true));
        return;
      }

      // Load Google Maps script
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAj7-3lx0Iww-R6RZF2bOr6Qt35qifB9Tg&libraries=places';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Maps script loaded successfully');
        setIsGoogleLoaded(true);
      };
      
      script.onerror = () => {
        console.error('Failed to load Google Maps script');
        setIsGoogleLoaded(false);
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (!isGoogleLoaded || !inputRef.current) return;

    const initAutocomplete = () => {
      try {
        console.log('Initializing Google Places Autocomplete');
        
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current!, {
          componentRestrictions: { country: ['nl', 'be', 'de', 'fr', 'gb'] },
          types: ['address'],
          fields: ['address_components', 'formatted_address', 'geometry', 'name']
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          console.log('Place selected:', place);
          
          if (place && place.geometry) {
            onPlaceSelect(place);
            if (place.formatted_address) {
              onChange(place.formatted_address);
            }
          }
        });

        autocompleteRef.current = autocomplete;
        console.log('Autocomplete initialized successfully');
      } catch (error) {
        console.error('Error initializing autocomplete:', error);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initAutocomplete, 100);
    
    return () => {
      clearTimeout(timer);
      if (autocompleteRef.current) {
        try {
          google.maps.event.clearInstanceListeners(autocompleteRef.current);
        } catch (e) {
          console.log('Error clearing autocomplete listeners:', e);
        }
      }
    };
  }, [isGoogleLoaded, onPlaceSelect, onChange]);

  return (
    <>
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
          placeholder={isGoogleLoaded ? placeholder : "Loading address search..."}
          disabled={!isGoogleLoaded}
          className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors text-black placeholder-gray-500 ${className}`}
          style={{
            fontSize: '16px',
            lineHeight: '1.5'
          }}
        />
        {!isGoogleLoaded && (
          <div className="text-xs text-gray-500 mt-1">Loading address autocomplete...</div>
        )}
      </div>
      
      <style jsx global>{`
        .pac-container {
          z-index: 9999 !important;
          background: white !important;
          border: 1px solid #E5E7EB !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
          margin-top: 4px !important;
          overflow: hidden !important;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }
        
        .pac-item {
          padding: 12px 16px !important;
          border-bottom: 1px solid #F3F4F6 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          font-size: 14px !important;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
          line-height: 1.4 !important;
        }
        
        .pac-item:hover {
          background-color: #F8FAFC !important;
        }
        
        .pac-item-selected {
          background-color: #1D62DB !important;
          color: white !important;
        }
        
        .pac-item:last-child {
          border-bottom: none !important;
        }
        
        .pac-item-query {
          font-size: 14px !important;
          color: #111827 !important;
          font-weight: 500 !important;
        }
        
        .pac-item-selected .pac-item-query {
          color: white !important;
        }
        
        .pac-matched {
          font-weight: 600 !important;
          color: #1D62DB !important;
        }
        
        .pac-item-selected .pac-matched {
          color: white !important;
        }
        
        .pac-icon {
          margin-right: 12px !important;
          margin-top: 2px !important;
          width: 16px !important;
          height: 16px !important;
        }
        
        .pac-icon-marker {
          background-image: none !important;
          background-color: #1D62DB !important;
          border-radius: 50% !important;
          position: relative !important;
        }
        
        .pac-icon-marker::after {
          content: '📍' !important;
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          font-size: 10px !important;
        }
      `}</style>
    </>
  );
}