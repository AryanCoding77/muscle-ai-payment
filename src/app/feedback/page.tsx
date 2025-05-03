"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useAuth0 } from "@auth0/auth0-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function FeedbackPage() {
  const router = useRouter();
  const { userInfo } = useUser();
  const { user } = useAuth0();
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState("general");
  const [customCategory, setCustomCategory] = useState("");
  const [rating, setRating] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast.error("Please enter your feedback");
      return;
    }
    
    if (category === "other" && !customCategory.trim()) {
      toast.error("Please specify your custom category");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/submit-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.sub,
          userName: userInfo?.name || user?.name || "Anonymous",
          userEmail: userInfo?.email || user?.email,
          category: category === "other" ? customCategory : category,
          rating,
          feedback,
          plan: userInfo?.subscription?.plan || "None",
          submittedAt: new Date().toISOString(),
        }),
      });
      
      if (response.ok) {
        toast.success("Feedback submitted successfully! Thank you for helping us improve.");
        setFeedback("");
        setCategory("general");
        setCustomCategory("");
        setRating(3);
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("There was a problem submitting your feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => router.push("/main")}
              className="flex items-center space-x-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors shadow-md"
            >
              <svg 
                className="w-5 h-5" 
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
              <span>Back to Home</span>
            </button>
          </div>
          
          <div className="bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-700">
            <div className="px-6 py-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-0">
                  Help Us Improve MuscleAI
                </h1>
              </div>
              
              <p className="text-gray-300 mb-8 text-lg">
                Your feedback is valuable to us. Please let us know your thoughts on how we can improve your experience.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-gray-700/50 p-6 rounded-xl">
                  <label htmlFor="category" className="block text-base font-medium text-gray-200 mb-2">
                    Feedback Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                  >
                    <option value="general">General Feedback</option>
                    <option value="subscription">Subscription & Payment</option>
                    <option value="analysis">Muscle Analysis</option>
                    <option value="ui">User Interface</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="other">Other (specify)</option>
                  </select>
                  
                  {category === "other" && (
                    <div className="mt-4">
                      <label htmlFor="customCategory" className="block text-sm font-medium text-gray-200 mb-2">
                        Please specify your category
                      </label>
                      <input
                        id="customCategory"
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Enter your custom category"
                        className="w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                      />
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-700/50 p-6 rounded-xl">
                  <label className="block text-base font-medium text-gray-200 mb-3">
                    How would you rate your experience?
                  </label>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-sm text-gray-400">Poor</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <svg 
                            className={`w-8 h-8 ${rating >= value ? 'text-yellow-400' : 'text-gray-600'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">Excellent</span>
                  </div>
                  <div className="text-center text-gray-400 text-sm mt-1">
                    Selected: {rating === 1 ? "Poor" : rating === 2 ? "Fair" : rating === 3 ? "Good" : rating === 4 ? "Very Good" : "Excellent"}
                  </div>
                </div>
                
                <div className="bg-gray-700/50 p-6 rounded-xl">
                  <label htmlFor="feedback" className="block text-base font-medium text-gray-200 mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                    placeholder="Please share your thoughts, suggestions, or report issues..."
                  ></textarea>
                  <div className="text-right mt-2">
                    <span className={`text-sm ${feedback.length > 0 ? 'text-gray-300' : 'text-gray-500'}`}>
                      {feedback.length} characters
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-lg font-medium shadow-lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Submitting...</span>
                      </div>
                    ) : "Submit Feedback"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>We review all feedback within 24-48 hours. Thank you for helping us improve!</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 