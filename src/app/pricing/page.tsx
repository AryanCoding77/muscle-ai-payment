"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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

export default function PricingPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.5 11.5h-1.8v-4h1.8c.6 0 1-.4 1-1s-.4-1-1-1h-2.6c-.1-1.3-.7-2.4-1.8-3.2-.4-.3-1.1-.2-1.4.2-.3.4-.2 1.1.2 1.4.6.4.9 1 .9 1.7v11.9c0 .7-.3 1.3-.9 1.7-.4.3-.5.9-.2 1.4.2.3.5.4.8.4.2 0 .4-.1.6-.2 1.1-.8 1.7-1.9 1.8-3.2h2.6c.6 0 1-.4 1-1s-.4-1-1-1h-1.8v-4h1.8c.6 0 1-.4 1-1s-.4-1-1-1zM3.5 11.5h1.8v-4H3.5c-.6 0-1 .4-1 1s.4 1 1 1h1.8v4H3.5c-.6 0-1 .4-1 1s.4 1 1 1h2.6c.1 1.3.7 2.4 1.8 3.2.2.1.4.2.6.2.3 0 .6-.1.8-.4.3-.4.2-1.1-.2-1.4-.6-.4-.9-1-.9-1.7V7.5c0-.7.3-1.3.9-1.7.4-.3.5-.9.2-1.4-.3-.4-.9-.5-1.4-.2-1.1.8-1.7 1.9-1.8 3.2H3.5c-.6 0-1 .4-1 1s.4 1 1 1z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                MuscleAI
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center">
                <button className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors border border-gray-700 text-sm font-medium flex items-center space-x-2">
                  <svg
                    className="w-4 h-4"
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
                  <span>Home</span>
                </button>
              </Link>

              <Link href="/login" className="flex items-center">
                <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Login</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Add margin-top to account for fixed navbar */}
      <div className="pt-16">
        {/* Pricing Section */}
        <section className="py-36 relative overflow-hidden bg-gradient-to-b from-gray-950 to-gray-900">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-950 to-transparent backdrop-filter backdrop-blur-md z-10"></div>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-40 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-[180px] opacity-10"></div>
            <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-emerald-500 rounded-full filter blur-[180px] opacity-10"></div>
          </div>

          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-6"
                variants={fadeIn}
              >
                Find the right plan that suits
              </motion.h2>
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-8"
                variants={fadeIn}
              >
                your needs
              </motion.h2>
              <motion.p className="text-xl text-gray-300" variants={fadeIn}>
                Our wide range of plans ensures that you find the perfect match,
                giving you the confidence and support you need.
              </motion.p>
            </motion.div>

            {/* Pricing Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
            >
              {/* Starter Plan */}
              <motion.div
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden"
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="px-8 py-6">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4"
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
                    <h3 className="text-xl font-bold">Starter</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-6">
                    For small teams billed monthly.
                  </p>

                  <div className="mb-6">
                    <div className="flex items-end">
                      <span className="text-4xl font-bold">$25</span>
                      <span className="text-gray-400 ml-2">/ per month</span>
                    </div>
                  </div>

                  <Link href="/signup" className="block">
                    <button className="w-full py-3 rounded-md border border-gray-700 hover:bg-gray-800 transition-colors mb-6">
                      Get Started
                    </button>
                  </Link>

                  <div>
                    <h4 className="font-semibold mb-4">Features:</h4>
                    <ul className="space-y-4">
                      <li className="flex items-center">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-300">
                          Financial Workflows
                        </span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-300">
                          Analytics & Reporting
                        </span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-300">
                          24/7 Customer Support
                        </span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-300">
                          Secure Transactions
                        </span>
                      </li>
                    </ul>
                    <div className="mt-6 text-gray-400 text-sm">
                      and 2 more <span className="inline-block ml-1">→</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Enterprise Plan */}
              <motion.div
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden transform scale-105 shadow-xl relative"
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="absolute top-5 right-5 bg-gray-800 rounded-full px-3 py-1 text-xs font-medium">
                  Popular
                </div>
                <div className="px-8 py-6">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Enterprise</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-6">
                    For growing startups billed monthly.
                  </p>

                  <div className="mb-6">
                    <div className="flex items-end">
                      <span className="text-4xl font-bold">$60</span>
                      <span className="text-gray-400 ml-2">/ per month</span>
                    </div>
                  </div>

                  <Link href="/signup" className="block">
                    <button className="w-full py-3 rounded-md bg-white text-gray-900 hover:bg-gray-200 transition-colors mb-6">
                      Get Started
                    </button>
                  </Link>

                  <div>
                    <h4 className="font-semibold mb-4">Features:</h4>
                    <ul className="space-y-4">
                      <li className="flex items-center">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-300">
                          Financial Workflows
                        </span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-300">
                          Analytics & Reporting
                        </span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-300">
                          24/7 Customer Support
                        </span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-300">
                          Secure Transactions
                        </span>
                      </li>
                    </ul>
                    <div className="mt-6 text-gray-400 text-sm">
                      and 4 more <span className="inline-block ml-1">→</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Business Plan */}
              <motion.div
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden"
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="px-8 py-6">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4"
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
                    <h3 className="text-xl font-bold">Business</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-6">
                    For large companies billed monthly.
                  </p>

                  <div className="mb-6">
                    <div className="flex items-end">
                      <span className="text-4xl font-bold">$90</span>
                      <span className="text-gray-400 ml-2">/ per month</span>
                    </div>
                  </div>

                  <Link href="/signup" className="block">
                    <button className="w-full py-3 rounded-md border border-gray-700 hover:bg-gray-800 transition-colors mb-6">
                      Get Started
                    </button>
                  </Link>

                  <div>
                    <h4 className="font-semibold mb-4">Features:</h4>
                    <ul className="space-y-4">
                      <li className="flex items-center">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-300">
                          Financial Workflows
                        </span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-300">
                          Analytics & Reporting
                        </span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-300">
                          24/7 Customer Support
                        </span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-300">
                          Secure Transactions
                        </span>
                      </li>
                    </ul>
                    <div className="mt-6 text-gray-400 text-sm">
                      and 6 more <span className="inline-block ml-1">→</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
