"use client";

import { useRouter } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, ReactNode } from "react";
import { getReferralFromUrl, saveReferral } from "@/utils/referral";
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

const buttonHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

// Create a ClientOnly component that renders children only on the client side
const ClientOnly = ({ children }: { children: ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? children : null;
};

export function ArcadeEmbed() {
  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "calc(51.90972222222222% + 41px)",
        height: 0,
        width: "100%",
      }}
    >
      <iframe
        src="https://demo.arcade.software/y7FloeGxaLcXOgdXBK30?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
        title="Get Comprehensive Muscle Insights with Ease"
        frameBorder="0"
        loading="lazy"
        allowFullScreen
        allow="clipboard-write"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          colorScheme: "light",
        }}
      />
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currency, setCurrency] = useState("USD"); // Add currency state

  // Check for referral parameter in URL
  useEffect(() => {
    const referralCode = getReferralFromUrl();
    if (referralCode) {
      saveReferral(referralCode);
      console.log(`Referral tracked: ${referralCode}`);
      
      // Show a toast notification
      toast.success(`Welcome from ${referralCode}!`, {
        duration: 3000,
        position: 'bottom-center',
        style: {
          background: '#4B5563',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
        },
        icon: '🎉',
      });
    }
  }, []);

  // USD to INR conversion rate
  const exchangeRate = 80; // 1 USD = 80 INR (adjusted to match requested INR prices)

  // Function to convert price based on selected currency
  const convertPrice = (usdPrice: number) => {
    if (currency === "USD") {
      return `$${usdPrice}`;
    } else {
      return `₹${Math.round(usdPrice * exchangeRate)}`;
    }
  };

  // Transform navbar background opacity based on scroll position
  const navbarBgOpacity = useTransform(scrollY, [0, 50], [0, 1]);

  // Check if page has scrolled to update navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Show scroll to top button when user has scrolled down a bit
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Function to scroll to pricing section smoothly
  const scrollToPricing = () => {
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Function to scroll to contact section smoothly
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-black text-white overflow-x-hidden">
      {/* Floating Navbar */}
      <motion.div className="fixed top-6 left-0 right-0 w-full z-50 px-4">
        <motion.div
          className="mx-auto max-w-7xl rounded-full transition-all duration-300 border border-gray-800"
          style={{
            backgroundColor: isScrolled
              ? "rgba(0, 0, 0, 0.85)"
              : "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(12px)",
            boxShadow: isScrolled
              ? "0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(59, 130, 246, 0.2)"
              : "0 4px 20px rgba(0, 0, 0, 0.2), 0 0 10px rgba(59, 130, 246, 0.1)",
          }}
        >
          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20"
              animate={{
                backgroundPosition: ["0% 0%", "100% 0%"],
                opacity: isScrolled ? [0.6, 0.8] : [0.3, 0.5],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          <div className="flex items-center justify-between px-6 py-3 relative">
            {/* Logo with glow effect */}
            <div className="flex items-center relative group">
              <motion.div
                className="absolute -inset-1 bg-blue-500/20 rounded-full blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="w-10 h-10 relative mr-2">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Horizontal bar */}
                  <motion.rect
                    x="25"
                    y="45"
                    width="50"
                    height="10"
                    fill="white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />

                  {/* Left weight */}
                  <motion.rect
                    x="10"
                    y="30"
                    width="15"
                    height="40"
                    rx="5"
                    fill="white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.3,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Right weight */}
                  <motion.rect
                    x="75"
                    y="30"
                    width="15"
                    height="40"
                    rx="5"
                    fill="white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.3,
                      ease: "easeInOut",
                    }}
                  />
                </svg>
              </div>
              <Link href="/" className="text-xl font-bold relative">
                Muscle<span className="text-blue-500">AI</span>
                <motion.div
                  className="absolute -inset-1 bg-blue-500/20 rounded-lg blur-sm -z-10 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Glowing navigation link items */}
              <Link
                href="/customers"
                className="text-gray-300 hover:text-white transition-colors relative group px-3 py-2"
              >
                Customers
                <motion.div
                  className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 rounded-lg -z-10 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.div className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" />
              </Link>
              <Link
                href="#pricing"
                onClick={(e) => {
                  scrollToPricing();
                  toggleMobileMenu();
                }}
                className="text-gray-300 hover:text-white transition-colors relative group px-3 py-2"
              >
                Pricing
                <motion.div
                  className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 rounded-lg -z-10 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.div className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" />
              </Link>
              <Link
                href="/contact"
                onClick={toggleMobileMenu}
                className="text-gray-300 hover:text-white transition-colors relative group px-3 py-2"
              >
                Contact
                <motion.div
                  className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 rounded-lg -z-10 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.div className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" />
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/login" className="relative group">
                <motion.div
                  className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-all duration-300 animate-gradient-x"
                  initial={{ opacity: 0.75 }}
                  animate={{ opacity: [0.75, 0.9, 0.75] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                  className="relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-medium shadow-lg group-hover:shadow-blue-500/40 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center">
                    <span className="mr-1.5">Login</span>
                    <motion.span
                      className="inline-block"
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      →
                    </motion.span>
                  </div>
                </motion.div>
              </Link>

              {/* Mobile menu button */}
              <motion.button
                onClick={toggleMobileMenu}
                className="md:hidden flex items-center relative group"
                aria-label="Toggle mobile menu"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile Menu */}
      <motion.div
        className={`fixed inset-0 bg-black/95 backdrop-blur-lg z-40 md:hidden ${
          isMobileMenuOpen ? "flex" : "hidden"
        } flex-col items-center justify-center`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[100px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              rotate: [0, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-[100px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
              rotate: [360, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Animated particles */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.button
          onClick={toggleMobileMenu}
          className="absolute top-6 right-6 p-2 text-white rounded-full group"
          aria-label="Close menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/20 rounded-full -z-10 transition-all duration-300"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </motion.button>

        <div className="flex flex-col items-center space-y-6 text-xl relative z-10">
          <motion.div
            className="mb-8 flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-blue-500/20">
              <svg
                className="w-10 h-10 text-white"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
              >
                <rect x="25" y="45" width="50" height="10" fill="white" />
                <rect
                  x="10"
                  y="30"
                  width="15"
                  height="40"
                  rx="5"
                  fill="white"
                />
                <rect
                  x="75"
                  y="30"
                  width="15"
                  height="40"
                  rx="5"
                  fill="white"
                />
              </svg>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              MuscleAI
            </span>
          </motion.div>

          {/* Mobile menu links with animations */}
          <Link
            href="/customers"
            className="relative group"
            onClick={toggleMobileMenu}
          >
            <motion.div
              className="text-white group-hover:text-blue-400 transition-colors py-2 px-8 relative"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Customers
              <motion.div 
                className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                layoutId="mobileUnderline"
              />
            </motion.div>
          </Link>
          <Link
            href="#pricing"
            onClick={(e) => {
              scrollToPricing();
              toggleMobileMenu();
            }}
            className="relative group"
          >
            <motion.div
              className="text-white group-hover:text-blue-400 transition-colors py-2 px-8 relative"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Pricing
              <motion.div className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" />
            </motion.div>
          </Link>
          <Link
            href="/contact"
            onClick={toggleMobileMenu}
            className="relative group"
          >
            <motion.div
              className="text-white group-hover:text-blue-400 transition-colors py-2 px-8 relative"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Contact
              <motion.div className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" />
            </motion.div>
          </Link>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/login"
              className="relative group overflow-hidden inline-block"
              onClick={toggleMobileMenu}
            >
              <div className="relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium transition-all duration-300 overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Login
                  <motion.svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </motion.svg>
                </span>
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Back to top button */}
      <motion.button
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gray-900/80 backdrop-blur-md border border-gray-800 shadow-lg z-50 flex items-center justify-center text-white hover:bg-gray-800 transition-all duration-300"
        onClick={scrollToTop}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          y: showScrollTop ? 0 : 20,
          pointerEvents: showScrollTop ? "auto" : "none",
        }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Scroll to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </motion.button>

      {/* Hero Section - Add top padding to account for the navbar */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-8 py-28 pt-32 bg-gradient-to-b from-black via-gray-950 to-gray-900">
        <div className="absolute inset-0 overflow-hidden">
          {/* Main background glows */}
          <motion.div
            className="absolute top-40 left-1/4 w-72 h-72 bg-blue-500 rounded-full filter blur-[150px] opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-40 right-1/4 w-80 h-80 bg-purple-500 rounded-full filter blur-[150px] opacity-20"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/3 w-64 h-64 bg-emerald-500 rounded-full filter blur-[120px] opacity-10"
            animate={{
              scale: [0.9, 1.1, 0.9],
              opacity: [0.05, 0.15, 0.05],
              y: [-20, 20, -20],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          {/* Moving stars/particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 0.7, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Animated grid pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:20px_20px] opacity-25"></div>

          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-900 to-transparent backdrop-filter backdrop-blur-md"></div>
        </div>

        <motion.div
          className="container mx-auto max-w-5xl z-10 text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 mt-16"
            variants={fadeIn}
          >
            <div className="mb-2">
              Fix Your <span className="text-blue-500">Weaknesses</span>
            </div>
            <div className="mb-2">
              Know <span className="text-blue-500">Strengths</span>
            </div>
            <div>
              Train <span className="text-blue-500">Smarter</span>
            </div>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10"
            variants={fadeIn}
          >
            Upload a photo, get instant muscle analysis, with exercise
            recommendations on weak muscles and improve faster.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            variants={fadeIn}
          >
            <motion.button
              variants={buttonHover}
              initial="rest"
              whileHover="hover"
              onClick={() => router.push("/main")}
              className="px-8 py-4 text-lg font-semibold rounded-md bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg"
            >
              GET STARTED
            </motion.button>

            <motion.button
              variants={buttonHover}
              initial="rest"
              whileHover="hover"
              className="px-8 py-4 text-lg font-semibold rounded-md border border-gray-700 hover:bg-gray-800 transition-colors"
              onClick={scrollToPricing}
            >
              SEE PLANS
            </motion.button>
          </motion.div>

          {/* Demo Embed */}
          <motion.div
            className="hidden md:block mb-16 relative rounded-xl overflow-hidden border border-gray-800 shadow-2xl"
            variants={fadeIn}
          >
            <ArcadeEmbed />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-b from-gray-900 via-blue-950/10 to-indigo-950/10 relative">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-900 to-transparent backdrop-filter z-10"></div>
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4"
              variants={fadeIn}
            >
              <span className="text-blue-500">Strong</span> Muscle Analysis with
              AI
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 max-w-2xl mx-auto"
              variants={fadeIn}
            >
              Get real-time insights, personalized plans, and smart workout
              recommendations to maximize your gains.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {[
              {
                title: "Personalized Plans",
                description: "Custom workouts based on your muscle analysis",
                icon: (
                  <svg
                    className="w-10 h-10 text-blue-500 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                ),
                gradient: "from-blue-600 to-indigo-700",
              },
              {
                title: "Real-time Analysis",
                description:
                  "Enable instant muscle assessment with advanced AI technology",
                icon: (
                  <svg
                    className="w-10 h-10 text-purple-500 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                ),
                gradient: "from-purple-600 to-pink-700",
              },
              {
                title: "Progress Tracking",
                description:
                  "Visual dashboard to track muscle development over time",
                icon: (
                  <svg
                    className="w-10 h-10 text-emerald-500 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                ),
                gradient: "from-emerald-600 to-teal-700",
              },
              {
                title: "Exercise Recommendations",
                description: "Smart suggestions for muscle improvement",
                icon: (
                  <svg
                    className="w-10 h-10 text-amber-500 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
                gradient: "from-amber-600 to-orange-700",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group relative backdrop-blur-sm border border-gray-800 rounded-xl p-8 overflow-hidden"
                variants={fadeIn}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                {/* Gradient background that reveals on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                ></div>

                {/* Glowing dot in corner */}
                <div
                  className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-${
                    feature.gradient.split(" ")[1].split("-")[0]
                  }-500`}
                >
                  <div
                    className={`absolute inset-0 bg-${
                      feature.gradient.split(" ")[1].split("-")[0]
                    }-500 rounded-full animate-ping opacity-75`}
                    style={{ animationDuration: "3s" }}
                  ></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {feature.icon}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom accent line that animates on hover */}
                <motion.div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.gradient}`}
                  initial={{ width: "30%" }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Part of your fitness journey section */}
      <section className="py-24 bg-black relative overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[120px]"
            animate={{
              x: [0, 30, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full filter blur-[100px]"
            animate={{
              x: [0, -20, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute top-2/3 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-[90px]"
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <motion.div
            className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-blue-900/5 to-transparent opacity-30"
            animate={{
              opacity: [0.3, 0.2, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="absolute opacity-10 inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left content */}
            <div className="max-w-2xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-6xl md:text-7xl font-bold mb-8 tracking-tight"
              >
                <motion.span
                  className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600"
                  animate={{
                    backgroundPosition: [
                      "0% center",
                      "100% center",
                      "0% center",
                    ],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ backgroundSize: "200% auto" }}
                >
                  Part
                </motion.span>{" "}
                <span className="text-white">of your</span>{" "}
                <span className="inline-block relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                    Fitness Journey
                  </span>
                  <motion.span
                    className="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.8 }}
                    viewport={{ once: true }}
                  ></motion.span>
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-xl text-gray-300 leading-relaxed mb-10 max-w-xl"
              >
                <span className="text-blue-400 font-medium">MuscleAI</span> fits
                right into your daily routine. Whether you're a beginner or a
                pro, it gives you{" "}
                <span className="text-purple-400 font-medium">
                  clear, AI-powered guidance
                </span>{" "}
                to build muscle effectively —{" "}
                <motion.span
                  className="italic"
                  animate={{ color: ["#9ca3af", "#a5b4fc", "#9ca3af"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  no extra apps required
                </motion.span>
                .
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Link href="/login" className="group inline-flex items-center">
                  <motion.span
                    className="relative px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full text-white font-bold text-lg shadow-lg group-hover:shadow-blue-500/40 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    GET STARTED
                    <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <motion.span
                      className="absolute inset-0 rounded-full border-2 border-white/30"
                      animate={{
                        opacity: [0, 0.5, 0],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    ></motion.span>
                  </motion.span>
                </Link>
              </motion.div>
            </div>

            {/* Right content */}
            <motion.div
              className="lg:w-1/2 relative"
              initial={{ opacity: 0 }}
              whileInView={{
                opacity: 1,
                transition: { duration: 0.8, delay: 0.3 },
              }}
              viewport={{ once: true }}
            >
              <div className="relative w-64 h-64 mx-auto">
                {/* Central logo */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gray-900 rounded-full flex items-center justify-center z-20 shadow-xl overflow-hidden">
                  <span className="text-white font-bold text-lg">MuscleAI</span>

                  {/* Adding the animated gradient glow effect */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to right, #4f46e5, #ff8a00)",
                      opacity: 0.2,
                    }}
                    animate={{
                      background: [
                        "linear-gradient(to right, #4f46e5, #ff8a00)",
                        "linear-gradient(to right, #ff8a00, #4f46e5)",
                        "linear-gradient(to right, #4f46e5, #ff8a00)",
                      ],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>

                {/* Adding outer glow effect */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
                  animate={{
                    boxShadow: [
                      "0 0 15px 2px rgba(79, 70, 229, 0.5), 0 0 30px 5px rgba(79, 70, 229, 0.3)",
                      "0 0 20px 3px rgba(255, 138, 0, 0.5), 0 0 40px 7px rgba(255, 138, 0, 0.3)",
                      "0 0 15px 2px rgba(79, 70, 229, 0.5), 0 0 30px 5px rgba(79, 70, 229, 0.3)",
                    ],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Background subtle glow */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-blue-500 rounded-full filter blur-xl opacity-10"
                  animate={{
                    opacity: [0.05, 0.1, 0.05],
                    scale: [0.95, 1.05, 0.95],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Floating icons */}
                <motion.div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg"
                  animate={{
                    y: [-6, -8, -6],
                    boxShadow: [
                      "0 0 5px 1px rgba(245, 158, 11, 0.1)",
                      "0 0 8px 3px rgba(245, 158, 11, 0.2)",
                      "0 0 5px 1px rgba(245, 158, 11, 0.1)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="text-xl">💪</span>
                </motion.div>

                <motion.div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg"
                  animate={{
                    y: [6, 8, 6],
                    boxShadow: [
                      "0 0 5px 1px rgba(59, 130, 246, 0.1)",
                      "0 0 8px 3px rgba(59, 130, 246, 0.2)",
                      "0 0 5px 1px rgba(59, 130, 246, 0.1)",
                    ],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="text-xl">📊</span>
                </motion.div>

                <motion.div
                  className="absolute left-0 top-1/2 transform -translate-x-6 -translate-y-1/2 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg"
                  animate={{
                    x: [-6, -8, -6],
                    boxShadow: [
                      "0 0 5px 1px rgba(52, 211, 153, 0.1)",
                      "0 0 8px 3px rgba(52, 211, 153, 0.2)",
                      "0 0 5px 1px rgba(52, 211, 153, 0.1)",
                    ],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="text-xl">🥗</span>
                </motion.div>

                <motion.div
                  className="absolute right-0 top-1/2 transform translate-x-6 -translate-y-1/2 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg"
                  animate={{
                    x: [6, 8, 6],
                    boxShadow: [
                      "0 0 5px 1px rgba(239, 68, 68, 0.1)",
                      "0 0 8px 3px rgba(239, 68, 68, 0.2)",
                      "0 0 5px 1px rgba(239, 68, 68, 0.1)",
                    ],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="text-xl">⏱️</span>
                </motion.div>

                <motion.div
                  className="absolute top-1/4 right-1/4 transform translate-x-5 -translate-y-5 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg"
                  animate={{
                    x: [5, 7, 5],
                    y: [-5, -7, -5],
                    boxShadow: [
                      "0 0 5px 1px rgba(139, 92, 246, 0.1)",
                      "0 0 8px 3px rgba(139, 92, 246, 0.2)",
                      "0 0 5px 1px rgba(139, 92, 246, 0.1)",
                    ],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="text-lg">🏃</span>
                </motion.div>

                <motion.div
                  className="absolute bottom-1/4 left-1/4 transform -translate-x-5 translate-y-5 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg"
                  animate={{
                    x: [-5, -7, -5],
                    y: [5, 7, 5],
                    boxShadow: [
                      "0 0 5px 1px rgba(251, 191, 36, 0.1)",
                      "0 0 8px 3px rgba(251, 191, 36, 0.2)",
                      "0 0 5px 1px rgba(251, 191, 36, 0.1)",
                    ],
                  }}
                  transition={{
                    duration: 3.7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="text-lg">⚡</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Code Showcase Section */}
      <section className="py-24 bg-gradient-to-b from-gray-950 via-blue-950/5 to-gray-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-950 to-transparent backdrop-filter backdrop-blur-md z-10"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-1/3 w-96 h-96 bg-blue-600 rounded-full filter blur-[150px] opacity-5"></div>
          <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-purple-600 rounded-full filter blur-[150px] opacity-5"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-blue-900/10 to-transparent opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 md:px-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            {/* Animated Analysis Display */}
            <motion.div
              className="lg:w-3/5 relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-800 bg-gray-900/70 backdrop-blur-sm p-8">
                {/* Header with Stats */}
                <div className="flex justify-between items-center mb-8">
                  <motion.div
                    className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Muscle Analysis
                  </motion.div>
                  <motion.div
                    className="relative"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                      8.6/10
                    </div>
                    <motion.div
                      className="absolute -inset-4 bg-blue-500/20 rounded-full blur-md"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.3, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                </div>

                {/* Animated Progress Bars */}
                <div className="space-y-6 mb-8">
                  {[
                    {
                      muscle: "Quads",
                      score: 90,
                      colors: ["from-emerald-400", "to-emerald-600"],
                    },
                    {
                      muscle: "Biceps",
                      score: 85,
                      colors: ["from-blue-400", "to-blue-600"],
                    },
                    {
                      muscle: "Chest",
                      score: 88,
                      colors: ["from-purple-400", "to-purple-600"],
                    },
                  ].map((item, index) => (
                    <div key={item.muscle} className="relative">
                      <div className="flex justify-between mb-2">
                        <motion.span
                          className="font-medium"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {item.muscle}
                        </motion.span>
                        <motion.span
                          className={`text-gray-400 bg-gradient-to-r ${item.colors[0]} ${item.colors[1]} bg-clip-text text-transparent`}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {item.score}%
                        </motion.span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-700/50 backdrop-blur-sm overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${item.colors[0]} ${item.colors[1]}`}
                          initial={{ width: "0%" }}
                          whileInView={{ width: `${item.score}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                        >
                          <motion.div
                            className="w-full h-full"
                            animate={{
                              background: [
                                `linear-gradient(90deg, ${item.colors[0]}, ${item.colors[1]})`,
                                `linear-gradient(90deg, ${item.colors[1]}, ${item.colors[0]})`,
                                `linear-gradient(90deg, ${item.colors[0]}, ${item.colors[1]})`,
                              ],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                          />
                        </motion.div>
                      </div>
                      <motion.div
                        className="absolute -inset-2 bg-gradient-to-r from-white/5 to-transparent rounded-lg opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  ))}
                </div>

                {/* Animated Radar Chart */}
                <motion.div
                  className="relative h-96 mb-8 group perspective-1000"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full max-w-2xl relative">
                      <svg className="w-full h-full" viewBox="0 0 400 400">
                        <defs>
                          {/* Gradient definitions */}
                          <linearGradient
                            id="gridGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              stopColor="rgba(59, 130, 246, 0.1)"
                            />
                            <stop
                              offset="50%"
                              stopColor="rgba(139, 92, 246, 0.1)"
                            />
                            <stop
                              offset="100%"
                              stopColor="rgba(59, 130, 246, 0.1)"
                            />
                          </linearGradient>

                          <radialGradient
                            id="radarGradient"
                            cx="50%"
                            cy="50%"
                            r="50%"
                          >
                            <stop
                              offset="0%"
                              stopColor="rgba(99, 102, 241, 0.15)"
                            />
                            <stop
                              offset="100%"
                              stopColor="rgba(99, 102, 241, 0)"
                            />
                          </radialGradient>

                          <filter id="glow">
                            <feGaussianBlur
                              stdDeviation="3"
                              result="coloredBlur"
                            />
                            <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>

                        {/* Background hexagon layers */}
                        {[0.8, 0.6, 0.4, 0.2].map((scale, i) => (
                          <motion.path
                            key={i}
                            d={`M200 ${40 + i * 20} L${360 - i * 40} ${
                              150 + i * 10
                            } L${360 - i * 40} ${250 - i * 10} L200 ${
                              360 - i * 20
                            } L${40 + i * 40} ${250 - i * 10} L${40 + i * 40} ${
                              150 + i * 10
                            } Z`}
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="0.5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{
                              pathLength: 1,
                              opacity: 0.5,
                              rotate: [0, 360],
                            }}
                            transition={{
                              pathLength: { duration: 2, delay: i * 0.2 },
                              opacity: { duration: 1, delay: i * 0.2 },
                              rotate: {
                                duration: 30,
                                repeat: Infinity,
                                ease: "linear",
                              },
                            }}
                          />
                        ))}

                        {/* Main radar area */}
                        <motion.path
                          d="M200 40 L360 150 L360 250 L200 360 L40 250 L40 150 Z"
                          fill="url(#radarGradient)"
                          stroke="rgba(147, 197, 253, 0.3)"
                          strokeWidth="1"
                          filter="url(#glow)"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{
                            scale: 1,
                            opacity: 1,
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 2,
                            rotate: {
                              duration: 60,
                              repeat: Infinity,
                              ease: "linear",
                            },
                          }}
                        />

                        {/* Grid lines */}
                        <g>
                          {[...Array(6)].map((_, i) => (
                            <motion.line
                              key={`horizontal-${i}`}
                              x1="40"
                              y1={100 + i * 40}
                              x2="360"
                              y2={100 + i * 40}
                              stroke="rgba(255,255,255,0.1)"
                              strokeWidth="0.5"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 1.5, delay: i * 0.1 }}
                            />
                          ))}
                          {[...Array(6)].map((_, i) => (
                            <motion.line
                              key={`vertical-${i}`}
                              x1={100 + i * 40}
                              y1="40"
                              x2={100 + i * 40}
                              y2="360"
                              stroke="rgba(255,255,255,0.1)"
                              strokeWidth="0.5"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 1.5, delay: i * 0.1 }}
                            />
                          ))}
                        </g>

                        {/* Data points and connections */}
                        <motion.g
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 1, delay: 2 }}
                        >
                          {[
                            { x: 200, y: 80, value: 90, label: "Quads" },
                            { x: 320, y: 150, value: 85, label: "Biceps" },
                            { x: 280, y: 280, value: 88, label: "Chest" },
                            { x: 120, y: 280, value: 82, label: "Back" },
                            { x: 80, y: 150, value: 87, label: "Core" },
                          ].map((point, index, points) => (
                            <g key={index}>
                              {/* Connection lines */}
                              <motion.line
                                x1={point.x}
                                y1={point.y}
                                x2={points[(index + 1) % points.length].x}
                                y2={points[(index + 1) % points.length].y}
                                stroke="rgba(147, 197, 253, 0.3)"
                                strokeWidth="1"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{
                                  duration: 1,
                                  delay: 2 + index * 0.2,
                                }}
                              />

                              {/* Data points */}
                              <motion.g
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  duration: 0.5,
                                  delay: 2.5 + index * 0.1,
                                }}
                              >
                                <circle
                                  cx={point.x}
                                  cy={point.y}
                                  r="4"
                                  fill="#60A5FA"
                                  filter="url(#glow)"
                                />
                                <motion.circle
                                  cx={point.x}
                                  cy={point.y}
                                  r="8"
                                  fill="transparent"
                                  stroke="rgba(147, 197, 253, 0.3)"
                                  strokeWidth="1"
                                  animate={{
                                    r: [8, 12, 8],
                                    opacity: [0.5, 0, 0.5],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                  }}
                                />
                                <text
                                  x={point.x}
                                  y={point.y - 15}
                                  textAnchor="middle"
                                  fill="white"
                                  fontSize="12"
                                  opacity="0.8"
                                >
                                  {point.label}
                                </text>
                                <text
                                  x={point.x}
                                  y={point.y + 20}
                                  textAnchor="middle"
                                  fill="#60A5FA"
                                  fontSize="10"
                                  opacity="0.8"
                                >
                                  {point.value}%
                                </text>
                              </motion.g>
                            </g>
                          ))}
                        </motion.g>
                      </svg>

                      {/* Floating particles */}
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-blue-400 rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            y: [0, -20, 0],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                          }}
                          transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Ambient glow effects */}
                  <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-[80px]" />
                  </div>
                </motion.div>

                {/* Animated Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Strength Score", value: "92%", color: "blue" },
                    { label: "Balance", value: "88%", color: "emerald" },
                    { label: "Symmetry", value: "95%", color: "purple" },
                  ].map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      className={`relative overflow-hidden bg-gray-800/50 rounded-lg p-4 text-center group hover:bg-gray-800/70 transition-colors duration-300`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <div className="relative z-10">
                        <div className="text-gray-400 text-sm mb-1">
                          {metric.label}
                        </div>
                        <motion.div
                          className={`text-2xl font-bold bg-gradient-to-r from-${metric.color}-400 to-${metric.color}-600 bg-clip-text text-transparent`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {metric.value}
                        </motion.div>
                      </div>

                      {/* Animated background effect */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r from-${metric.color}-500/10 via-${metric.color}-500/5 to-transparent`}
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                      />

                      {/* Pulsing border effect */}
                      <motion.div
                        className={`absolute inset-0 rounded-lg border border-${metric.color}-500/20`}
                        animate={{
                          scale: [1, 1.02, 1],
                          opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Enhanced ambient glow effect */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-xl blur-xl"
                  animate={{
                    background: [
                      "linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1), rgba(16, 185, 129, 0.1))",
                      "linear-gradient(to right, rgba(139, 92, 246, 0.1), rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))",
                      "linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))",
                    ],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ opacity: 0.6, zIndex: -1 }}
                />
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              className="lg:w-2/5"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                AI-Powered Muscle Analysis
              </h2>

              <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                Get detailed insights into your muscle development with our
                advanced AI analysis. Track your progress, identify imbalances,
                and receive personalized recommendations for optimal growth.
              </p>

              <motion.button
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                onClick={() => router.push("/main")}
                className="px-10 py-5 text-lg font-semibold rounded-md bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg"
              >
                ANALYZE NOW
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-gray-950 via-purple-950/5 to-gray-950">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-950 to-transparent backdrop-filter backdrop-blur-md z-10"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 -right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[100px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              rotate: [0, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-[100px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
              rotate: [360, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
              variants={fadeIn}
            >
              Don't just take our word for it...
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              variants={fadeIn}
            >
              Explore what developers and fitness enthusiasts say about why
              they're fans of our AI-powered fitness analysis platform
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {[
              {
                quote:
                  "Just integrated MuscleAI into my fitness app. The AI analysis is incredibly accurate and the API is so easy to work with! 💪",
                author: "Alex Thompson",
                handle: "@devAlex",
                role: "Developer",
                avatar: "👨‍💻",
                gradient: "from-blue-500/20 to-purple-500/20",
              },
              {
                quote:
                  "The real-time muscle analysis has completely transformed how I track my clients' progress. Game-changing technology! 🚀",
                author: "Sarah Chen",
                handle: "Fitness Coach",
                role: "Fitness Coach",
                avatar: "💪",
                gradient: "from-purple-500/20 to-pink-500/20",
              },
              {
                quote:
                  "Finally, an AI platform that understands the nuances of muscle development. The insights are incredibly detailed! 📊",
                author: "Mike Rodriguez",
                handle: "Personal Trainer",
                role: "Personal Trainer",
                avatar: "🏋️‍♂️",
                gradient: "from-emerald-500/20 to-blue-500/20",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="relative group"
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                {/* Card background with gradient border */}
                <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-gray-800 to-gray-700 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none"></div>

                  {/* Card content */}
                  <div className="relative bg-gray-900/90 backdrop-blur-xl p-8 rounded-2xl h-full">
                    {/* Quote mark */}
                    <div className="absolute top-4 right-4 text-4xl text-gray-700 font-serif">
                      "
                    </div>

                    {/* Testimonial content */}
                    <div className="relative z-10">
                      <motion.p
                        className="text-lg mb-6 text-gray-300"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        {testimonial.quote}
                      </motion.p>

                      <div className="flex items-center">
                        <motion.div
                          className="w-12 h-12 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full flex items-center justify-center mr-4 text-2xl"
                          whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.3 }}
                        >
                          <span>{testimonial.avatar}</span>
                        </motion.div>
                        <div>
                          <h4 className="font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            {testimonial.author}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {testimonial.handle}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Animated gradient background */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${testimonial.gradient} rounded-2xl opacity-0 group-hover:opacity-10`}
                      animate={{
                        scale: [1, 1.02, 1],
                        opacity: [0, 0.1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      whileHover={{ scale: 1.02 }}
                    />
                  </div>
                </div>

                {/* Glow effect */}
                <motion.div
                  className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ zIndex: -1 }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Additional decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none"></div>

          {/* Floating shapes */}
          <motion.div
            className="absolute top-20 left-10 w-4 h-4 border border-blue-500/30 rounded-full"
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 180],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-6 h-6 border border-purple-500/30 rotate-45"
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
              rotate: [45, 225],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>
      </section>

      {/* Coding Comparison Section */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-gray-950 via-purple-950/5 to-gray-950">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-950 to-transparent backdrop-filter backdrop-blur-md z-10"></div>
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-12 flex flex-col items-center justify-center gap-4"
              variants={fadeIn}
            >
              <div className="flex items-center gap-4">
                <span className="text-white">What happens when your </span>
                <span className="text-pink-400 italic">workout</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white">is built by </span>
                <span className="text-emerald-400 italic">computer</span>
                <span className="text-white"> vision?</span>
              </div>
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Software Engineer Approach */}
            <motion.div
              className="relative bg-gray-900/30 backdrop-blur-sm border border-pink-500/20 rounded-3xl p-8 overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-6 right-6">
                <svg
                  className="w-8 h-8 text-pink-500"
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
              </div>
              <h3 className="text-2xl font-bold mb-6 text-pink-400">
                Without MuscleAI
              </h3>
              <ul className="space-y-4 text-lg text-gray-300">
                <li className="flex items-start gap-3">
                  • Train the wrong muscles and waste months of effort
                </li>
                <li className="flex items-start gap-3">
                  • No idea where your weak points are
                </li>
                <li className="flex items-start gap-3">
                  • Generic workouts that don't match your body
                </li>
                <li className="flex items-start gap-3">
                  • Slow or no visible progress = low motivation
                </li>
                <li className="flex items-start gap-3">
                  • High risk of imbalances and injuries
                </li>
              </ul>
            </motion.div>

            {/* Entrepreneur Approach */}
            <motion.div
              className="relative bg-gray-900/30 backdrop-blur-sm border border-emerald-500/20 rounded-3xl p-8 overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-6 right-6">
                <svg
                  className="w-8 h-8 text-emerald-500"
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
              </div>
              <h3 className="text-2xl font-bold mb-6 text-emerald-400">
                With MuscleAI
              </h3>
              <ul className="space-y-4 text-lg text-gray-300">
                <li className="flex items-start gap-3">
                  • Instantly see which muscles need improvement
                </li>
                <li className="flex items-start gap-3">
                  • Get AI-personalized workout plans for your body
                </li>
                <li className="flex items-start gap-3">
                  • Track real visual progress and stay motivated
                </li>
                <li className="flex items-start gap-3">
                  • Save time by training smart, not just hard
                </li>
                <li className="flex items-start gap-3">
                  • Build a balanced physique, faster and safer
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-36 relative overflow-hidden bg-gradient-to-b from-gray-950 to-gray-900"
      >
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-950 to-transparent backdrop-filter backdrop-blur-md z-10"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-40 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-[180px] opacity-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05],
              rotate: [0, 180],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-40 right-1/4 w-96 h-96 bg-emerald-500 rounded-full filter blur-[180px] opacity-10"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.15, 0.1],
              rotate: [180, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 0.7, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
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
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
              variants={fadeIn}
            >
              Find the right plan that suits
            </motion.h2>
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
              variants={fadeIn}
            >
              your needs
            </motion.h2>
            <motion.p className="text-xl text-gray-300" variants={fadeIn}>
              Our wide range of plans ensures that you find the perfect match,
              giving you the confidence and support you need.
            </motion.p>
            
            {/* Currency Toggle */}
            <div className="flex justify-center mt-6">
              <div className="bg-gray-800 rounded-full p-1 inline-flex">
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    currency === "USD"
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setCurrency("USD")}
                >
                  USD
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    currency === "INR"
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setCurrency("INR")}
                >
                  INR
                </button>
              </div>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {/* Starter Plan */}
            <motion.div
              className="relative group"
              variants={fadeIn}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 to-blue-600/0 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-8 py-6">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center mr-3 shadow-lg shadow-blue-500/20">
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
                    <h3 className="text-xl font-bold">Starter</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-6">
                    For individuals starting their fitness journey.
                  </p>

                  <div className="mb-6 relative">
                    <div className="flex items-end">
                      <motion.span
                        className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {convertPrice(4)}
                      </motion.span>
                      <span className="text-gray-400 ml-2">pay once</span>
                    </div>
                    <motion.div
                      className="absolute -inset-1 bg-blue-500/10 rounded-lg blur-sm"
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>

                  <motion.button
                    className="w-full py-3 rounded-md border border-gray-700 hover:bg-gray-800 transition-colors mb-6 relative overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/main")}
                  >
                    <span className="relative z-10">Get Started</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/20"
                      initial={{ x: "-100%", opacity: 0 }}
                      whileHover={{ x: "100%", opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.button>

                  <div>
                    <h4 className="font-semibold mb-4">Features:</h4>
                    <ul className="space-y-4">
                      {[
                        "Basic muscle analysis",
                        "5 analyses",
                        "Workout recommendations",
                        "Email support"
                      ].map((feature, index) => (
                        <motion.li
                          key={index}
                          className="flex items-center"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <motion.div
                            className="w-6 h-6 rounded-full flex items-center justify-center mr-3 bg-blue-500/10"
                            whileHover={{
                              scale: 1.2,
                              backgroundColor: "rgba(59, 130, 246, 0.3)",
                            }}
                          >
                            <svg
                              className="w-4 h-4 text-blue-400"
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
                          </motion.div>
                          <span className="text-gray-300">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <div className="mt-6 text-gray-400 text-sm">
                      and 2 more <span className="inline-block ml-1">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              className="relative group z-20"
              variants={fadeIn}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              initial={{ scale: 1.05 }}
            >
              {/* Popular tag */}
              <div className="absolute -top-4 right-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-4 py-1 text-xs font-bold shadow-lg z-20">
                Popular
              </div>

              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse"></div>

              <div className="relative bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-30"></div>

                <div className="px-8 py-6 relative">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3 shadow-lg shadow-purple-500/20">
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
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Pro</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-6">
                    For dedicated fitness enthusiasts.
                  </p>

                  <div className="mb-6 relative">
                    <div className="flex items-end">
                      <motion.span
                        className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {convertPrice(7)}
                      </motion.span>
                      <span className="text-gray-400 ml-2">pay once</span>
                    </div>
                    <motion.div
                      className="absolute -inset-1 bg-purple-500/10 rounded-lg blur-sm"
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>

                  <motion.button
                    className="w-full py-3 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all mb-6 relative overflow-hidden shadow-lg shadow-purple-500/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/main")}
                  >
                    <span className="relative z-10">Get Started</span>
                    <motion.div
                      className="absolute inset-0 bg-white"
                      initial={{ x: "-100%", opacity: 0 }}
                      whileHover={{ x: "100%", opacity: 0.2 }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.button>

                  <div>
                    <h4 className="font-semibold mb-4">Features:</h4>
                    <ul className="space-y-4">
                      {[
                        "Advanced muscle analysis",
                        "20 analyses",
                        "Workout recommendations",
                        "Email support"
                      ].map((feature, index) => (
                        <motion.li
                          key={index}
                          className="flex items-center"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <motion.div
                            className="w-6 h-6 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                            whileHover={{
                              scale: 1.2,
                              backgroundImage:
                                "linear-gradient(to bottom right, rgba(59, 130, 246, 0.4), rgba(168, 85, 247, 0.4))",
                            }}
                          >
                            <svg
                              className="w-4 h-4 text-purple-400"
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
                          </motion.div>
                          <span className="text-gray-300">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <div className="mt-6 text-gray-400 text-sm">
                      and 4 more <span className="inline-block ml-1">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Business Plan */}
            <motion.div
              className="relative group"
              variants={fadeIn}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600/20 to-emerald-600/0 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-8 py-6">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-400 rounded-full flex items-center justify-center mr-3 shadow-lg shadow-emerald-500/20">
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
                    <h3 className="text-xl font-bold">Ultimate</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-6">
                    For professional fitness trainers.
                  </p>

                  <div className="mb-6 relative">
                    <div className="flex items-end">
                      <motion.span
                        className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {convertPrice(14)}
                      </motion.span>
                      <span className="text-gray-400 ml-2">pay once</span>
                    </div>
                    <motion.div
                      className="absolute -inset-1 bg-emerald-500/10 rounded-lg blur-sm"
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>

                  <motion.button
                    className="w-full py-3 rounded-md border border-gray-700 hover:bg-gray-800 transition-colors mb-6 relative overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/main")}
                  >
                    <span className="relative z-10">Get Started</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-emerald-400/20"
                      initial={{ x: "-100%", opacity: 0 }}
                      whileHover={{ x: "100%", opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.button>

                  <div>
                    <h4 className="font-semibold mb-4">Features:</h4>
                    <ul className="space-y-4">
                      {[
                        "Premium muscle analysis",
                        "100 analyses",
                        "24/7 support",
                        "Custom workout plans"
                      ].map((feature, index) => (
                        <motion.li
                          key={index}
                          className="flex items-center"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <motion.div
                            className="w-6 h-6 rounded-full flex items-center justify-center mr-3 bg-emerald-500/10"
                            whileHover={{
                              scale: 1.2,
                              backgroundColor: "rgba(16, 185, 129, 0.3)",
                            }}
                          >
                            <svg
                              className="w-4 h-4 text-emerald-400"
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
                          </motion.div>
                          <span className="text-gray-300">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <div className="mt-6 text-gray-400 text-sm">
                      and 6 more <span className="inline-block ml-1">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Additional decorative elements */}
          <motion.div
            className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-3/4 h-40 bg-gradient-to-t from-gray-900 via-blue-900/5 to-transparent opacity-50 filter blur-3xl"
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="py-48 relative bg-gradient-to-b from-gray-900 to-black"
      >
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-gray-900 to-transparent backdrop-filter backdrop-blur-md z-10"></div>

        {/* Cosmic Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Background gradients */}
          <div className="absolute w-full h-full bg-gradient-to-b from-transparent via-blue-950/20 to-black"></div>

          {/* Stars */}
          <ClientOnly>
            <div className="absolute inset-0">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </ClientOnly>

          {/* Larger glowing stars */}
          <ClientOnly>
            <div className="absolute inset-0">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    boxShadow: "0 0 10px 2px rgba(96, 165, 250, 0.3)",
                  }}
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: Math.random() * 4 + 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </ClientOnly>

          {/* Nebula-like gradients */}
          <motion.div
            className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[100px]"
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-[100px]"
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
          />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built for transformation, ready when you are
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Get AI-powered muscle analysis & personalized workouts. No more
              guessing. Just results.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                onClick={() => router.push("/main")}
                className="px-8 py-4 text-lg font-semibold rounded-md bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg"
              >
                GET STARTED
              </motion.button>
              <motion.button
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                className="px-8 py-4 text-lg font-semibold rounded-md border border-gray-700 hover:bg-gray-800 transition-colors"
                onClick={scrollToPricing}
              >
                PRICING
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">
                Muscle<span className="text-blue-500">AI</span>
              </h2>
              <p className="text-gray-400 mt-2">
                Transforming fitness with artificial intelligence
              </p>
            </div>

            <div className="flex gap-6">
              <Link
                href="/customers"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Customers
              </Link>
              <Link
                href="#pricing"
                onClick={scrollToPricing}
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
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">
              © 2025 MuscleAI. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="/terms"
                className="text-gray-500 hover:text-white transition-colors text-sm"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-white transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/refund"
                className="text-gray-500 hover:text-white transition-colors text-sm"
              >
                Refund & Cancellation Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
