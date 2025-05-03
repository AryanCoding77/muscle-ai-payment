"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import RazorpayPayment from "./RazorpayPayment";
import { toast } from "react-hot-toast";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function PricingPlans() {
  const [isOpen, setIsOpen] = useState(false);

  const handlePaymentSuccess = () => {
    toast.success("Payment successful! Welcome to your new plan.");
    setIsOpen(false);
  };

  const handlePaymentFailure = () => {
    toast.error("Payment failed. Please try again.");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors text-sm font-medium"
      >
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Plans
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-6 md:p-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Choose your plan
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Select the perfect plan that suits your needs and elevate your
              fitness journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-white"
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
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Starter
                </h3>
              </div>

              <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                For individuals starting their fitness journey.
              </p>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ₹299
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">
                    / month
                  </span>
                </div>
              </div>

              <div className="block mb-6">
                <RazorpayPayment
                  planName="Starter"
                  amount={299}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                />
              </div>

              <div>
                <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
                  Features:
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">
                      Basic muscle analysis
                    </span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">
                      5 analyses per month
                    </span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">
                      Email support
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pro Plan - Popular */}
            <div className="bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-400 rounded-xl overflow-hidden p-6 hover:shadow-md transition-shadow relative">
              <div className="absolute top-0 right-0 left-0">
                <div className="bg-blue-500 text-white text-center py-1 px-3 text-xs font-medium">
                  Popular
                </div>
              </div>

              <div className="flex items-center mb-4 mt-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-white"
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
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Pro
                </h3>
              </div>

              <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                For dedicated fitness enthusiasts.
              </p>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ₹599
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">
                    / month
                  </span>
                </div>
              </div>

              <div className="block mb-6">
                <RazorpayPayment
                  planName="Pro"
                  amount={599}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                />
              </div>

              <div>
                <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
                  Features:
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">
                      Advanced muscle analysis
                    </span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">
                      20 analyses per month
                    </span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">
                      Priority support
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Ultimate Plan */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-white"
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
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Ultimate
                </h3>
              </div>

              <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                For professional fitness trainers.
              </p>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ₹999
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">
                    / month
                  </span>
                </div>
              </div>

              <div className="block mb-6">
                <RazorpayPayment
                  planName="Ultimate"
                  amount={999}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                />
              </div>

              <div>
                <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
                  Features:
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">
                      Premium muscle analysis
                    </span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">
                      Unlimited analyses
                    </span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">
                      24/7 premium support
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
