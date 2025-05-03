"use client";

import React, { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import QuotaDisplay from "@/components/QuotaDisplay";

export default function MyPlanPage() {
  const { userInfo, fetchUserSubscription, isLoading } = useUser();
  const { subscription } = userInfo;

  useEffect(() => {
    // Fetch subscription data when the component mounts
    fetchUserSubscription();
  }, []);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/main" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.5 11.5h-1.8v-4h1.8c.6 0 1-.4 1-1s-.4-1-1-1h-2.6c-.1-1.3-.7-2.4-1.8-3.2-.4-.3-1.1-.2-1.4.2-.3.4-.2 1.1.2 1.4.6.4.9 1 .9 1.7v11.9c0 .7-.3 1.3-.9 1.7-.4.3-.5.9-.2 1.4.2.3.5.4.8.4.2 0 .4-.1.6-.2 1.1-.8 1.7-1.9 1.8-3.2h2.6c.6 0 1-.4 1-1s-.4-1-1-1h-1.8v-4h1.8c.6 0 1-.4 1-1s-.4-1-1-1zM3.5 11.5h1.8v-4H3.5c-.6 0-1 .4-1 1s.4 1 1 1h1.8v4H3.5c-.6 0-1 .4-1 1s.4 1 1 1h2.6c.1 1.3.7 2.4 1.8 3.2.2.1.4.2.6.2.3 0 .6-.1.8-.4.3-.4.2-1.1-.2-1.4-.6-.4-.9-1-.9-1.7V7.5c0-.7.3-1.3.9-1.7.4-.3.5-.9.2-1.4-.3-.4-.9-.5-1.4-.2-1.1.8-1.7 1.9-1.8 3.2H3.5c-.6 0-1 .4-1 1s.4 1 1 1z" />
                  </svg>
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-white">
                  MuscleAI
                </span>
              </Link>

              {/* Home Button */}
              <Link href="/main">
                <button className="flex items-center px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors text-sm font-medium">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Home
                </button>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 md:px-6 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Subscription Plan
              </h1>
              <button
                onClick={() => fetchUserSubscription()}
                disabled={isLoading}
                className="flex items-center px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-gray-500 dark:text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-300"
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
                )}
                <span className="ml-1.5">
                  {isLoading ? "Refreshing..." : "Refresh"}
                </span>
              </button>
            </div>

            {isLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-6 flex justify-center items-center h-64">
                  <div className="flex flex-col items-center">
                    <svg
                      className="animate-spin h-10 w-10 text-blue-500 mb-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p className="text-gray-600 dark:text-gray-300">
                      Loading subscription data...
                    </p>
                  </div>
                </div>
              </div>
            ) : subscription && subscription.status === "active" ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {subscription.plan} Plan
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        Active Subscription
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 my-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Subscription Cost
                        </p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                          ₹{subscription.amount}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Start Date
                        </p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                          {formatDate(subscription.startDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                            Plan benefits
                          </h3>
                          <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                            <ul className="list-disc pl-5 space-y-1">
                              {subscription.features &&
                              subscription.features.length > 0 ? (
                                subscription.features.map((feature, index) => (
                                  <li key={index}>{feature}</li>
                                ))
                              ) : (
                                <>
                                  <li>Advanced muscle analysis</li>
                                  <li>Personalized workout recommendations</li>
                                  <li>Unlimited access to premium features</li>
                                  <li>Priority customer support</li>
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-500 dark:text-gray-400"
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
                  <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    No Active Subscription
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    You don't have an active subscription plan. Purchase a plan
                    to unlock all features.
                  </p>
                  <Link href="/main">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      View Plans
                    </button>
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
