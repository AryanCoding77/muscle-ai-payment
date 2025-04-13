"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/main");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/main",
      },
    });
  };

  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/main",
      },
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden py-16 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-[180px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-[180px] opacity-20 animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center mb-8">
          <div className="w-10 h-10 flex items-center justify-center">
            <Image
              src="/images/icon.png"
              alt="Muscle AI Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 bg-clip-text text-transparent ml-3">
            MuscleAI
          </span>
        </Link>

        {/* Auth Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 p-8"
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            Welcome to MuscleAI
          </h2>

          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>

            <button
              onClick={handleSignUp}
              className="w-full py-3 px-4 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors text-white font-medium"
            >
              Create Account
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-400">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-blue-400 hover:text-blue-300">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
