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
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const loadGooglePlacesScript = () => {
      // Check if script is already loaded
      if (window.google?.maps?.places) {
        setScriptLoaded(true);
        setIsLoaded(true);
        initializeAutocomplete();
        return;
      }

      // Check if script is already in DOM
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          setScriptLoaded(true);
          setIsLoaded(true);
          initializeAutocomplete();
        });
        return;
      }

      // Load Google Places API script
      const apiKey = 'AIzaSyAj7-3lx0Iww-R6RZF2bOr6Qt35qifB9Tg';
    
      if (!apiKey) {
        console.warn('Google Places API key not configured. Using fallback input.');
        setIsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setScriptLoaded(true);
        setIsLoaded(true);
        initializeAutocomplete();
      };
      script.onerror = () => {
        console.error('Failed to load Google Places API');
        setScriptLoaded(false);
        setIsLoaded(true);
      };
      document.head.appendChild(script);
    };

    loadGooglePlacesScript();

    return () => {
      if (autocompleteRef.current) {
        try {
          google.maps.event.clearInstanceListeners(autocompleteRef.current);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  useEffect(() => {
    if (scriptLoaded && isLoaded) {
      initializeAutocomplete();
    }
  }, [scriptLoaded, isLoaded]);
  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps?.places) {
      return;
    }

    // Clear existing autocomplete if it exists
    if (autocompleteRef.current) {
      try {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      } catch (e) {
        // Ignore cleanup errors
      }
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
          
          // Update the input with formatted address
          if (place.formatted_address) {
            onChange(place.formatted_address);
          }
        }
      });
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
    }
  };

  // Show loading state while script loads
  if (!isLoaded || !scriptLoaded) {
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
          placeholder="Loading address autocomplete..."
          className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors ${className}`}
          disabled
        />
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
        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors ${className}`}
      />
    </div>
  );
}
