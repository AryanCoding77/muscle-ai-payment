"use client";

import { useState } from "react";
import { formatDate } from "@/utils/date-utils";
import { useUser } from "@/context/UserContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { formatCurrency } from "@/utils/currency-utils";

export default function MyPlanPage() {
  const { userInfo, fetchUserSubscription, isLoading } = useUser();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh subscription data
  const refreshSubscription = async () => {
    setIsRefreshing(true);
    await fetchUserSubscription();
    setIsRefreshing(false);
  };

  // Format amount for display - ensure it's in USD
  const displayAmount = userInfo.subscription ? 
    formatCurrency(userInfo.subscription.amount) : "$0";
    
  // Safe access to quota values with null checks  
  const quotaUsed = userInfo.subscription?.quotaUsed || 0;
  const monthlyQuota = userInfo.subscription?.monthlyQuota || 0;
  const quotaPercentage = monthlyQuota ? 
    Math.min((quotaUsed / monthlyQuota) * 100, 100) : 0;

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <main className="container mx-auto py-6 sm:py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link 
                href="/main" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium shadow-sm hover:bg-blue-700 transition-colors"
              >
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                  />
                </svg>
                Back to Home
              </Link>
            </div>

            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Subscription
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Manage your subscription plan and billing details
              </p>
            </div>

            {isLoading || isRefreshing ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 mb-6">
                <div className="animate-pulse flex flex-col">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-4"></div>
                </div>
              </div>
            ) : userInfo?.subscription &&
              userInfo.subscription.status === "active" ? (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                      <div
                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mr-4 ${
                          userInfo.subscription.plan === "Starter"
                            ? "bg-blue-100 text-blue-600"
                            : userInfo.subscription.plan === "Pro"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {userInfo.subscription.plan === "Starter" ? (
                          <svg
                            className="w-6 h-6 sm:w-8 sm:h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        ) : userInfo.subscription.plan === "Pro" ? (
                          <svg
                            className="w-6 h-6 sm:w-8 sm:h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-6 h-6 sm:w-8 sm:h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                          {userInfo.subscription.plan} Plan
                        </h2>
                        <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                          Active
                        </p>
                      </div>
                      <button
                        onClick={refreshSubscription}
                        disabled={isRefreshing}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <svg
                          className={`w-5 h-5 ${
                            isRefreshing ? "animate-spin" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
                        <div className="mb-2 md:mb-0">
                          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Analyses Used
                          </h3>
                          <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                            {quotaUsed} / {monthlyQuota || "∞"}
                          </p>
                        </div>
                        <div className="w-full md:w-64">
                          <div className="w-full h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div
                              className="h-3 sm:h-4 bg-blue-500 rounded-full"
                              style={{
                                width: `${quotaPercentage}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 my-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Subscription Cost
                          </p>
                          <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                            {displayAmount} USD
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Start Date
                          </p>
                          <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                            {formatDate(userInfo.subscription.startDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Your plan will automatically renew on{" "}
                        <span className="font-medium">
                          {formatDate(userInfo.subscription.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Payment History
                    </h2>
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Amount
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          <tr>
                            <td className="px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 dark:text-white whitespace-nowrap">
                              {formatDate(userInfo.subscription.startDate)}
                            </td>
                            <td className="px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 dark:text-white whitespace-nowrap">
                              {displayAmount} USD
                            </td>
                            <td className="px-4 py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap">
                              <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                Completed
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No Active Subscription
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto text-sm sm:text-base">
                    You don't have an active subscription plan yet. Choose a plan to get started with premium features.
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors text-sm sm:text-base"
                  >
                    View Plans
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
