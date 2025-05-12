"use client";

import React from "react";
import { useUser } from "@/context/UserContext";

interface QuotaDisplayProps {
  compact?: boolean;
}

export default function QuotaDisplay({ compact = false }: QuotaDisplayProps) {
  const { userInfo } = useUser();
  const { subscription } = userInfo;

  if (!subscription) {
    return null;
  }

  // Calculate quota percentage
  const quotaUsed = subscription.quotaUsed || 0;
  const quotaLimit = subscription.monthlyQuota || 5; // Default to 5 for Starter plan
  const percentage = Math.min(100, Math.round((quotaUsed / quotaLimit) * 100));
  const remaining = Math.max(0, quotaLimit - quotaUsed);

  // Format reset date
  const formatResetDate = () => {
    if (!subscription.lastQuotaReset) return "Next month";
    
    const resetDate = new Date(subscription.lastQuotaReset);
    resetDate.setDate(resetDate.getDate() + 30); // 30 days from last reset
    
    return resetDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };

  if (compact) {
    // Compact version for header
    return (
      <div className="text-sm text-black bg-white px-3 py-1 rounded-md shadow-sm font-medium">
        <span className="font-bold">{remaining}</span>/{quotaLimit} analyses left
      </div>
    );
  }

  // Full version for profile/plan page
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gray-800">Monthly Analysis Quota</h3>
        <span className="text-sm text-gray-600">Resets: {formatResetDate()}</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div 
          className={`h-2.5 rounded-full ${
            percentage > 80 ? 'bg-red-500' : 
            percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{quotaUsed} used</span>
        <span className="font-medium">
          {remaining} remaining
        </span>
      </div>
    </div>
  );
} 