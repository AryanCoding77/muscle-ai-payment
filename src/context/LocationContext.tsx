"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserLocationInfo } from '@/utils/geolocation';

// Define the location context state type
interface LocationContextType {
  isLoading: boolean;
  countryCode: string;
  isIndia: boolean;
  currency: string;
  currencySymbol: string;
  conversionRate: number;
  refreshLocation: () => Promise<void>;
}

// Create a default context value
const defaultContextValue: LocationContextType = {
  isLoading: true,
  countryCode: 'US',
  isIndia: false,
  currency: 'USD',
  currencySymbol: '$',
  conversionRate: 80,
  refreshLocation: async () => {}
};

// Create the context
const LocationContext = createContext<LocationContextType>(defaultContextValue);

// Create a provider component
export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [locationInfo, setLocationInfo] = useState<Omit<LocationContextType, 'refreshLocation'>>(defaultContextValue);

  const loadLocationInfo = async () => {
    try {
      // Always make a fresh request with a cache-busting query parameter
      const timestamp = new Date().getTime();
      const info = await getUserLocationInfo(`?nocache=${timestamp}`);
      
      console.log('Location detection result:', info);
      
      setLocationInfo({
        isLoading: false,
        countryCode: info.countryCode,
        isIndia: info.isIndia,
        currency: info.currency,
        currencySymbol: info.currencySymbol,
        conversionRate: info.conversionRate
      });
    } catch (error) {
      console.error('Failed to load location info:', error);
      setLocationInfo({ ...defaultContextValue, isLoading: false });
    }
  };

  // Load location info when the component mounts
  useEffect(() => {
    loadLocationInfo();
  }, []);

  // Context value with the refresh function
  const contextValue: LocationContextType = {
    ...locationInfo,
    refreshLocation: loadLocationInfo
  };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
}

// Create a hook for accessing the context
export function useLocation() {
  return useContext(LocationContext);
} 