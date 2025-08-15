"use client";

import { useEffect, useState } from "react";
import { getSavedReferral, hasValidReferral, clearReferral } from "@/utils/referral";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function TestReferralPage() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [referralDate, setReferralDate] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const code = getSavedReferral();
      setReferralCode(code);
      setIsValid(hasValidReferral());
      setReferralDate(localStorage.getItem('muscleai_referral_date'));
    }
  }, []);

  const handleClearReferral = () => {
    clearReferral();
    setReferralCode(null);
    setIsValid(false);
    setReferralDate(null);
    toast.success('Referral data cleared');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Referral Tracking Test
        </h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Current Referral Status
          </h2>
          
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-gray-600 dark:text-gray-400 mb-1">Referral Code:</span>
              <span className="text-lg font-medium text-gray-800 dark:text-white">
                {referralCode || 'No referral code found'}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-gray-600 dark:text-gray-400 mb-1">Is Valid:</span>
              <span className={`text-lg font-medium ${isValid ? 'text-green-500' : 'text-red-500'}`}>
                {isValid ? 'Yes' : 'No'}
              </span>
            </div>
            
            {referralDate && (
              <div className="flex flex-col">
                <span className="text-gray-600 dark:text-gray-400 mb-1">Stored Date:</span>
                <span className="text-lg font-medium text-gray-800 dark:text-white">
                  {new Date(referralDate).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleClearReferral}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Clear Referral Data
          </button>
          
          <Link 
            href="/?ref=testcreator123" 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Test With Sample Referral
          </Link>
          
          <Link 
            href="/" 
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 