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
        <section className="py-36 relative overflow-hidden bg-gray-950">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-950 to-transparent backdrop-filter backdrop-blur-md z-10"></div>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-40 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-[180px] opacity-10"></div>
            <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-emerald-500 rounded-full filter blur-[180px] opacity-10"></div>
            <div className="absolute opacity-20 inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]"></div>
          </div>

          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 px-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              <motion.h2
                className="text-3xl md:text-5xl font-bold mb-4"
                variants={fadeIn}
              >
                Find the right plan that suits
              </motion.h2>
              <motion.h2
                className="text-3xl md:text-5xl font-bold mb-6 sm:mb-8"
                variants={fadeIn}
              >
                your needs
              </motion.h2>
              <motion.p className="text-lg md:text-xl text-gray-300" variants={fadeIn}>
                Our wide range of plans ensures that you find the perfect match,
                giving you the confidence and support you need.
              </motion.p>
            </motion.div>

            {/* Pricing Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
            >
              {/* Starter Plan */}
              <motion.div
                className="bg-blue-950/20 backdrop-blur-sm border border-blue-800/20 rounded-xl overflow-hidden p-4 sm:p-8 relative shadow-[0_0_25px_rgba(30,64,175,0.15)]"
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent pointer-events-none"></div>
                <div className="absolute -top-24 -left-20 w-40 h-40 bg-blue-500/30 rounded-full filter blur-[50px]"></div>
                <div className="absolute bottom-10 right-0 w-32 h-32 bg-blue-500/20 rounded-full filter blur-[40px]"></div>

                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(59,130,246,0.7)]">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-white"
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
                  <h3 className="text-xl sm:text-2xl font-bold">Starter</h3>
                </div>

                <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                  For small teams billed monthly.
                </p>

                <div className="mb-6 sm:mb-8">
                  <div className="flex items-baseline">
                    <span className="text-4xl sm:text-5xl font-bold">$25</span>
                    <span className="text-gray-400 ml-2 text-sm sm:text-base">/ per month</span>
                  </div>
                </div>

                <Link href="/signup" className="block mb-8 sm:mb-10">
                  <button className="w-full py-3 sm:py-4 rounded-md border border-blue-700/50 bg-blue-900/20 hover:bg-blue-800/30 transition-colors font-medium shadow-[0_0_10px_rgba(59,130,246,0.3)] text-sm sm:text-base">
                    Get Started
                  </button>
                </Link>

                <div>
                  <h4 className="font-bold mb-4 sm:mb-6 text-lg sm:text-xl">Features:</h4>
                  <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-500 mr-3"
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
                      <span className="text-gray-300">Financial Workflows</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-500 mr-3"
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
                      <span className="text-gray-300">
                        Analytics & Reporting
                      </span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-500 mr-3"
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
                      <span className="text-gray-300">
                        24/7 Customer Support
                      </span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-500 mr-3"
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
                      <span className="text-gray-300">Secure Transactions</span>
                    </li>
                  </ul>

                  <div className="mt-6 text-gray-400">and 2 more →</div>
                </div>
              </motion.div>

              {/* Enterprise Plan - Popular */}
              <motion.div
                className="bg-purple-950/30 backdrop-blur-sm border border-purple-700/30 rounded-xl overflow-hidden p-8 relative shadow-[0_0_25px_rgba(88,28,135,0.2)]"
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-blue-500/10 pointer-events-none"></div>
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/30 rounded-full filter blur-[60px]"></div>
                <div className="absolute -bottom-32 right-0 w-56 h-56 bg-blue-500/30 rounded-full filter blur-[50px]"></div>
                <div className="absolute top-20 right-10 w-20 h-20 bg-indigo-500/30 rounded-full filter blur-[30px]"></div>

                <div className="absolute top-0 right-0 left-0">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-1 px-4 rounded-b-lg mx-auto w-fit text-sm font-medium shadow-lg shadow-purple-500/20">
                    Popular
                  </div>
                </div>

                <div className="mb-6 flex items-center mt-6">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3 shadow-[0_0_20px_rgba(147,51,234,0.7)]">
                    <svg
                      className="w-5 h-5 text-white"
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
                  <h3 className="text-2xl font-bold">Enterprise</h3>
                </div>

                <p className="text-gray-400 mb-6">
                  For growing startups billed monthly.
                </p>

                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold">$60</span>
                    <span className="text-gray-400 ml-2">/ per month</span>
                  </div>
                </div>

                <Link href="/signup" className="block mb-10">
                  <button className="w-full py-4 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors font-medium shadow-[0_0_20px_rgba(147,51,234,0.4)]">
                    Get Started
                  </button>
                </Link>

                <div>
                  <h4 className="font-bold mb-6 text-xl">Features:</h4>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-purple-500 mr-3"
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
                      <span className="text-gray-300">Financial Workflows</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-purple-500 mr-3"
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
                      <span className="text-gray-300">
                        Analytics & Reporting
                      </span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-purple-500 mr-3"
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
                      <span className="text-gray-300">
                        24/7 Customer Support
                      </span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-purple-500 mr-3"
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
                      <span className="text-gray-300">Secure Transactions</span>
                    </li>
                  </ul>

                  <div className="mt-6 text-gray-400">and 4 more →</div>
                </div>
              </motion.div>

              {/* Business Plan */}
              <motion.div
                className="bg-emerald-950/20 backdrop-blur-sm border border-emerald-800/20 rounded-xl overflow-hidden p-8 relative shadow-[0_0_25px_rgba(4,120,87,0.15)]"
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-transparent pointer-events-none"></div>
                <div className="absolute -bottom-24 -right-20 w-48 h-48 bg-emerald-500/30 rounded-full filter blur-[50px]"></div>
                <div className="absolute top-10 left-0 w-32 h-32 bg-emerald-500/20 rounded-full filter blur-[40px]"></div>

                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(16,185,129,0.7)]">
                    <svg
                      className="w-5 h-5 text-white"
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
                  <h3 className="text-2xl font-bold">Business</h3>
                </div>

                <p className="text-gray-400 mb-6">
                  For large companies billed monthly.
                </p>

                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold">$90</span>
                    <span className="text-gray-400 ml-2">/ per month</span>
                  </div>
                </div>

                <Link href="/signup" className="block mb-10">
                  <button className="w-full py-4 rounded-md border border-emerald-700/50 bg-emerald-900/20 hover:bg-emerald-800/30 transition-colors font-medium shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    Get Started
                  </button>
                </Link>

                <div>
                  <h4 className="font-bold mb-6 text-xl">Features:</h4>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-emerald-500 mr-3"
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
                      <span className="text-gray-300">Financial Workflows</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-emerald-500 mr-3"
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
                      <span className="text-gray-300">
                        Analytics & Reporting
                      </span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-emerald-500 mr-3"
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
                      <span className="text-gray-300">
                        24/7 Customer Support
                      </span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-emerald-500 mr-3"
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
                      <span className="text-gray-300">Secure Transactions</span>
                    </li>
                  </ul>

                  <div className="mt-6 text-gray-400">and 6 more →</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
