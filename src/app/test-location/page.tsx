"use client";

import { useLocation } from "@/context/LocationContext";
import { useState, useEffect } from "react";

export default function TestLocationPage() {
  const locationInfo = useLocation();
  const [debugData, setDebugData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forceIndia, setForceIndia] = useState(false);

  // Fetch debug information
  const fetchDebugInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/debug-location');
      const data = await response.json();
      setDebugData(data);
    } catch (error) {
      console.error('Error fetching debug info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDebugInfo();
  }, []);

  // Force the location context to update
  const forceUpdateLocation = async () => {
    setIsLoading(true);
    try {
      // First fetch the location directly to set the server-side state
      await fetch(`/api/get-location?forceIndia=${forceIndia}`);
      
      // Then update the context
      await locationInfo.refreshLocation();
      await fetchDebugInfo();
    } catch (error) {
      console.error('Error updating location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Location Detection Test</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Location Context Data</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify({
            isLoading: locationInfo.isLoading,
            countryCode: locationInfo.countryCode,
            isIndia: locationInfo.isIndia,
            currency: locationInfo.currency,
            currencySymbol: locationInfo.currencySymbol,
            conversionRate: locationInfo.conversionRate
          }, null, 2)}
        </pre>
        
        <div className="mt-4 flex items-center mb-4">
          <label className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={forceIndia}
              onChange={(e) => setForceIndia(e.target.checked)}
            />
            <span className="ml-2 text-gray-700">Force India Location</span>
          </label>
          
          <button 
            onClick={forceUpdateLocation}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? "Updating..." : "Update Location"}
          </button>
        </div>
        
        <div className="mt-2 px-4 py-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-yellow-700">
          <p>
            <strong>Note:</strong> The "Force India Location" option will override the 
            geolocation detection and set your location to India, showing INR prices.
            This is useful for testing and debugging purposes.
          </p>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">IP Detection Debug Data</h2>
        {isLoading ? (
          <p>Loading debug data...</p>
        ) : debugData ? (
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(debugData, null, 2)}
          </pre>
        ) : (
          <p>No debug data available</p>
        )}
        
        <button 
          onClick={fetchDebugInfo}
          disabled={isLoading}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
        >
          {isLoading ? "Refreshing..." : "Refresh Debug Data"}
        </button>
      </div>
    </div>
  );
} 