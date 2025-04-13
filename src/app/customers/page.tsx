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

export default function CustomersPage() {
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
        <section className="py-20 relative overflow-hidden bg-[#0d1117]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute opacity-20 inset-0 bg-[radial-gradient(#151e2d_1px,transparent_1px)] [background-size:16px_16px]"></div>
          </div>

          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-6 text-white"
                variants={fadeIn}
              >
                Don't just take our word for it...
              </motion.h2>
              <motion.p className="text-xl text-gray-300" variants={fadeIn}>
                Explore what developers and fitness enthusiasts say about why
                they're fans of our AI-powered fitness analysis platform
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-10 bg-[#0d1117]">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* First Testimonial */}
              <motion.div
                className="bg-[#131c2e] rounded-xl overflow-hidden shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-5">
                    <svg
                      className="w-12 h-12 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                    Just integrated MuscleAI into my fitness app. The AI
                    analysis is incredibly accurate and the API is so easy to
                    work with! 👍
                  </p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-2xl">
                        A
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-white text-lg">
                        Alex Thompson
                      </h4>
                      <p className="text-sm text-gray-400">@devAlex</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Second Testimonial */}
              <motion.div
                className="bg-[#131c2e] rounded-xl overflow-hidden shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-5">
                    <svg
                      className="w-12 h-12 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                    The real-time muscle analysis has completely transformed how
                    I track my clients' progress. Game-changing technology! 🚀
                  </p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-2xl">
                        S
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-white text-lg">
                        Sarah Chen
                      </h4>
                      <p className="text-sm text-gray-400">Fitness Coach</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Third Testimonial */}
              <motion.div
                className="bg-[#131c2e] rounded-xl overflow-hidden shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-5">
                    <svg
                      className="w-12 h-12 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                    Finally, an AI platform that understands the nuances of
                    muscle development. The insights are incredibly detailed! 📊
                  </p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-2xl">
                        M
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-white text-lg">
                        Mike Rodriguez
                      </h4>
                      <p className="text-sm text-gray-400">Personal Trainer</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Second Row of Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Fourth Testimonial */}
              <motion.div
                className="bg-[#131c2e] rounded-xl overflow-hidden shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-5">
                    <svg
                      className="w-12 h-12 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                    The accuracy of MuscleAI's body composition analysis is
                    unlike anything I've seen. My clients love seeing their real
                    progress! 💯
                  </p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-2xl">
                        J
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-white text-lg">
                        Jennifer Zhang
                      </h4>
                      <p className="text-sm text-gray-400">
                        Fitness Studio Owner
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Fifth Testimonial */}
              <motion.div
                className="bg-[#131c2e] rounded-xl overflow-hidden shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-5">
                    <svg
                      className="w-12 h-12 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                    As a developer who built health apps for years, MuscleAI's
                    API is by far the most comprehensive and reliable in the
                    fitness space. 👨‍💻
                  </p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-2xl">
                        D
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-white text-lg">
                        David Park
                      </h4>
                      <p className="text-sm text-gray-400">Software Engineer</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Sixth Testimonial */}
              <motion.div
                className="bg-[#131c2e] rounded-xl overflow-hidden shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-5">
                    <svg
                      className="w-12 h-12 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                    The personalized workout recommendations have helped me
                    break through plateaus I've been stuck at for months. Thank
                    you MuscleAI! 💪
                  </p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-2xl">
                        R
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-white text-lg">
                        Rachel Johnson
                      </h4>
                      <p className="text-sm text-gray-400">
                        Fitness Enthusiast
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
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
                Join our growing community of satisfied users
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Experience the power of AI-driven fitness analysis and
                personalized workout recommendations today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Try MuscleAI Free
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                >
                  View Pricing
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
                  href="/customers"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Customers
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
