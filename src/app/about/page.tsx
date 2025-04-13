"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

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

export default function AboutPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <Image
                  src="/images/icon.png"
                  alt="Muscle AI Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
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
        {/* Hero Section */}
        <section className="py-36 relative overflow-hidden bg-gray-950">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-950 to-transparent backdrop-filter backdrop-blur-md z-10"></div>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-40 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-[180px] opacity-20"></div>
            <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-[180px] opacity-20"></div>
            <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-emerald-500 rounded-full filter blur-[150px] opacity-10"></div>
            <div className="absolute opacity-30 inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]"></div>
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
                className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 inline-block text-transparent bg-clip-text"
                variants={fadeIn}
              >
                About MuscleAI
              </motion.h2>
              <motion.p className="text-xl text-gray-300" variants={fadeIn}>
                Revolutionizing fitness through artificial intelligence
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-bold">Our Story</h2>
                <div className="w-20 h-1 bg-blue-500"></div>
                <p className="text-gray-300 text-lg">
                  MuscleAI was born from a simple yet powerful idea: make
                  personalized fitness accessible to everyone. Founded in 2023,
                  our team of fitness experts and AI specialists came together
                  with a shared vision of democratizing expert-level fitness
                  guidance.
                </p>
                <p className="text-gray-300 text-lg">
                  We believe that everyone deserves a fitness plan tailored to
                  their unique body, goals, and lifestyle—not just those who can
                  afford personal trainers or have extensive knowledge of
                  exercise science.
                </p>
                <p className="text-gray-300 text-lg">
                  Today, MuscleAI helps thousands of users achieve their fitness
                  goals through cutting-edge AI technology that adapts and grows
                  with them on their journey to better health.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="rounded-xl overflow-hidden relative h-[400px] md:h-[500px] shadow-xl shadow-blue-900/10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 z-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                  {/* Fallback content in case image is missing */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <svg
                      className="w-16 h-16 text-blue-500 mb-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="text-xl font-semibold text-white mb-2">
                      Our Team
                    </div>
                    <p className="text-gray-400">
                      A diverse group of fitness experts, AI specialists, and
                      health professionals
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#101010_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our Mission
              </h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto mb-6"></div>
              <p className="text-xl text-gray-300 mb-8">
                To empower individuals to reach their fitness potential through
                personalized, AI-driven solutions that make expert guidance
                accessible to everyone, regardless of their experience level or
                background.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                <motion.div
                  className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700"
                  whileHover={{
                    y: -10,
                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <svg
                      className="w-8 h-8 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-center">
                    Personalization
                  </h3>
                  <p className="text-gray-400 text-center">
                    Every workout and nutrition plan is tailored to your unique
                    body, goals, and preferences.
                  </p>
                </motion.div>

                <motion.div
                  className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700"
                  whileHover={{
                    y: -10,
                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <svg
                      className="w-8 h-8 text-purple-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-center">
                    Innovation
                  </h3>
                  <p className="text-gray-400 text-center">
                    Cutting-edge AI technology that continuously learns and
                    adapts to maximize your results.
                  </p>
                </motion.div>

                <motion.div
                  className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700"
                  whileHover={{
                    y: -10,
                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <svg
                      className="w-8 h-8 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-center">
                    Accessibility
                  </h3>
                  <p className="text-gray-400 text-center">
                    Making expert-level fitness guidance available to everyone
                    at a fraction of traditional costs.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Technology Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="order-2 md:order-1 rounded-xl overflow-hidden bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-gray-800 p-1"
              >
                <div className="rounded-lg overflow-hidden relative h-[400px] bg-gray-900">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
                  <div className="p-6 h-full flex flex-col">
                    <h3 className="text-2xl font-bold mb-4 text-blue-400">
                      Our AI Engine
                    </h3>
                    <p className="text-gray-400 mb-6">
                      MuscleAI's proprietary artificial intelligence engine
                      analyzes thousands of data points to create fitness plans
                      that are perfectly suited to your:
                    </p>
                    <ul className="space-y-4 text-gray-300">
                      <li className="flex items-start">
                        <svg
                          className="w-5 h-5 text-blue-500 mr-2 mt-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Body type and current physique</span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          className="w-5 h-5 text-blue-500 mr-2 mt-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Fitness goals and timeline</span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          className="w-5 h-5 text-blue-500 mr-2 mt-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Exercise history and experience level</span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          className="w-5 h-5 text-blue-500 mr-2 mt-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Available equipment and time constraints</span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          className="w-5 h-5 text-blue-500 mr-2 mt-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Injury history and movement limitations</span>
                      </li>
                    </ul>
                    <div className="mt-auto pt-6">
                      <div className="text-sm text-gray-500">
                        Powered by deep learning neural networks
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="order-1 md:order-2 space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-bold">
                  Our Technology
                </h2>
                <div className="w-20 h-1 bg-blue-500"></div>
                <p className="text-gray-300 text-lg">
                  At the heart of MuscleAI is our proprietary artificial
                  intelligence system that combines the latest advances in
                  machine learning with decades of exercise science research.
                </p>
                <p className="text-gray-300 text-lg">
                  Unlike generic fitness apps that offer one-size-fits-all
                  solutions, our AI analyzes your unique data to create truly
                  personalized workout plans that adapt as you progress.
                </p>
                <p className="text-gray-300 text-lg">
                  The system continuously learns from user feedback and results,
                  becoming more intelligent and effective with every workout
                  completed on our platform.
                </p>
                <div className="pt-4">
                  <Link
                    href="/pricing"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <span>Experience the difference</span>
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-12 rounded-2xl border border-blue-800/30 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to transform your fitness journey?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of users who have revolutionized their approach
                to fitness with MuscleAI.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-gray-950 border-t border-gray-800">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-6 md:mb-0">
                <div className="w-8 h-8 flex items-center justify-center">
                  <Image
                    src="/images/icon.png"
                    alt="Muscle AI Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                  MuscleAI
                </span>
              </div>

              <div className="flex space-x-6">
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/pricing"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms
                </Link>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy
                </Link>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} MuscleAI. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
