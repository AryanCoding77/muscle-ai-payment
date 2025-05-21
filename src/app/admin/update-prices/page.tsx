"use client";

import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function UpdatePricesPage() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState("");

  const updatePlanPrices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Call the API endpoint to update prices
      const response = await fetch("/api/admin/update-plan-prices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminKey}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to update plan prices");
      }
      
      setResult(data);
    } catch (err: any) {
      console.error("Error updating prices:", err);
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 max-w-lg w-full">
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Admin Tools - Please Log In
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            You need to be logged in to access admin tools.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Update Plan Prices
        </h1>
        
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This tool will update the subscription plan prices in the database:
          </p>
          
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-md">
              <h3 className="font-medium text-blue-800 dark:text-blue-300">Pro Plan</h3>
              <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">₹999 → ₹599</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-md">
              <h3 className="font-medium text-green-800 dark:text-green-300">Ultimate Plan</h3>
              <p className="text-green-600 dark:text-green-400 text-sm mt-1">₹1999 → ₹999</p>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="adminKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Admin API Key
            </label>
            <input
              id="adminKey"
              type="password"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
            />
          </div>
          
          <button
            onClick={updatePlanPrices}
            disabled={isLoading || !adminKey}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Update Plan Prices"}
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}
        
        {result && (
          <div className="p-4 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-md">
            <h3 className="font-bold mb-2">Update Successful</h3>
            <p>✅ {result.message}</p>
            
            {result.results?.map((item: any, index: number) => (
              <div key={index} className="mt-2 border-t border-green-200 dark:border-green-800 pt-2">
                <p className="font-medium">{item.plan} Plan</p>
                <p className="text-sm">• New price: ₹{item.price}</p>
                <p className="text-sm">• Updated {item.plansUpdated} plan configuration(s)</p>
                <p className="text-sm">• Affects {item.activeSubscriptions} active subscription(s)</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 