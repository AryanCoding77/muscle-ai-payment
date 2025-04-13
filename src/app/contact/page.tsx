"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Insert form data into Supabase "contact" table
      const { data, error } = await supabase.from("contact").insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Supabase error:", error);
        if (error.code === "23505") {
          // Unique violation
          throw new Error(
            "It appears you've already submitted this exact message. Please try a different message."
          );
        } else if (error.code === "42501") {
          // Permission denied
          throw new Error(
            "Sorry, you don't have permission to submit this form. Please contact us directly."
          );
        } else if (error.code === "23502") {
          // Not null violation
          throw new Error("Please fill out all required fields.");
        } else {
          throw new Error(`Database error: ${error.message}`);
        }
      }

      console.log("Form data stored in Supabase:", data);
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "There was an error submitting your message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-100 mb-6">Contact Us</h1>
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
        {/* Contact Section */}
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
                Get in touch with us
              </motion.h2>
              <motion.p className="text-xl text-gray-300" variants={fadeIn}>
                Have questions about MuscleAI? We're here to help and ready to
                assist you.
              </motion.p>
            </motion.div>

            <div className="max-w-5xl mx-auto space-y-12">
              {/* Contact Form Card - Full Width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-purple-950/40 to-blue-950/20 backdrop-blur-lg border border-purple-800/30 rounded-2xl overflow-hidden p-10 relative shadow-[0_0_30px_rgba(88,28,135,0.25)]"
              >
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full filter blur-[80px]"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full filter blur-[80px]"></div>

                <div className="relative">
                  <h3 className="text-3xl font-bold mb-10 relative inline-block">
                    Send us a message
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                  </h3>

                  {submitSuccess ? (
                    <motion.div
                      className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-600/30 rounded-xl p-10 text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-600/20">
                        <svg
                          className="w-10 h-10 text-white"
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
                      <h4 className="text-2xl font-semibold text-white mb-4">
                        Message Sent Successfully!
                      </h4>
                      <p className="text-gray-300 mb-8 max-w-lg mx-auto">
                        Thank you for reaching out. We've saved your message to
                        our database and will get back to you as soon as
                        possible. A confirmation has been sent to your email.
                      </p>
                      <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button
                          onClick={() => setSubmitSuccess(false)}
                          className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 rounded-lg text-white font-medium shadow-lg shadow-green-600/20 transform transition-all duration-300 hover:translate-y-[-2px]"
                        >
                          Send Another Message
                        </button>
                        <Link
                          href="/"
                          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium shadow-lg shadow-purple-600/20 transform transition-all duration-300 hover:translate-y-[-2px] inline-block text-center"
                        >
                          Return to Home
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-8 relative"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">
                            Your Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-4 bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-4 bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          placeholder="How can we help you?"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Message
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          className="w-full px-5 py-4 bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                          placeholder="Tell us about your inquiry..."
                        ></textarea>
                      </div>

                      {submitError && (
                        <div className="bg-red-900/30 border border-red-600/30 rounded-xl p-4 text-red-200">
                          <div className="flex items-center">
                            <svg
                              className="w-5 h-5 mr-2 text-red-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            {submitError}
                          </div>
                        </div>
                      )}

                      <div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg shadow-purple-600/20 transform hover:translate-y-[-2px] ${
                            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center">
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                              Sending...
                            </span>
                          ) : (
                            "Send Message"
                          )}
                        </button>
                      </div>

                      <div className="text-center text-gray-400 text-sm">
                        By submitting this form, you agree to our{" "}
                        <a
                          href="/privacy"
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          Privacy Policy
                        </a>{" "}
                        and{" "}
                        <a
                          href="/terms"
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          Terms of Service
                        </a>
                        .
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
