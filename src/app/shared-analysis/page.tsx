"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AnalysisDashboard from "@/components/AnalysisDashboard";
import type { MuscleData } from "@/types/muscle";

// Component to handle the search params logic
function AnalysisContent() {
  const searchParams = useSearchParams();
  const [analysisData, setAnalysisData] = useState<{
    parsedMuscles: MuscleData[];
    analysis: string;
    nonVisibleMuscles: string[];
    timestamp: number;
    id: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the analysis ID from the URL query parameter
    const id = searchParams.get("id");
    
    if (!id) {
      setError("No analysis ID provided");
      setLoading(false);
      return;
    }

    try {
      // Try to get the analysis data from localStorage
      const storedData = localStorage.getItem(id);
      
      if (!storedData) {
        setError("Analysis not found. The shared link may have expired or is invalid.");
        setLoading(false);
        return;
      }

      // Parse the stored data
      const parsedData = JSON.parse(storedData);
      setAnalysisData(parsedData);
    } catch (err) {
      console.error("Error retrieving shared analysis:", err);
      setError("Failed to load the shared analysis. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg font-medium text-gray-800">
            Loading shared analysis...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <svg 
            className="w-12 h-12 text-red-500 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <p className="text-lg font-medium text-gray-800 mb-2">
            {error}
          </p>
          <Link 
            href="/main" 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Analysis Page
          </Link>
        </div>
      </div>
    );
  }

  if (analysisData) {
    return (
      <div className="w-full">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg 
                className="h-5 w-5 text-blue-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Shared Muscle Analysis
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                This is a shared muscle analysis from MuscleAI. Create your own analysis by uploading your photo.
              </p>
              <div className="mt-3">
                <Link 
                  href="/main" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Create Your Own Analysis →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-blue-800">
          Muscle Analysis Results
        </h2>

        {/* Visibility note */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-500 shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-800">
                About This Analysis
              </h3>
              <p className="text-gray-800 mt-1">
                This analysis is based on{" "}
                <strong>
                  muscles visible in the provided image only
                </strong>
                . Some muscle groups may not be rated if they are not
                clearly visible from this angle.
              </p>
            </div>
          </div>
        </div>

        {/* Analysis Dashboard */}
        <AnalysisDashboard 
          data={analysisData.parsedMuscles}
          originalAnalysis={analysisData.analysis}
          nonVisibleMuscles={analysisData.nonVisibleMuscles}
        />
      </div>
    );
  }

  return null;
}

// Loading fallback for Suspense
function LoadingFallback() {
  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg font-medium text-gray-800">
          Loading...
        </p>
      </div>
    </div>
  );
}

export default function SharedAnalysis() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header */}
      <header className="bg-white border-b border-gray-200 py-4 px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-3">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.5 11.5h-1.8v-4h1.8c.6 0 1-.4 1-1s-.4-1-1-1h-2.6c-.1-1.3-.7-2.4-1.8-3.2-.4-.3-1.1-.2-1.4.2-.3.4-.2 1.1.2 1.4.6.4.9 1 .9 1.7v11.9c0 .7-.3 1.3-.9 1.7-.4.3-.5.9-.2 1.4.2.3.5.4.8.4.2 0 .4-.1.6-.2 1.1-.8 1.7-1.9 1.8-3.2h2.6c.6 0 1-.4 1-1s-.4-1-1-1h-1.8v-4h1.8c.6 0 1-.4 1-1s-.4-1-1-1zM3.5 11.5h1.8v-4H3.5c-.6 0-1 .4-1 1s.4 1 1 1h1.8v4H3.5c-.6 0-1 .4-1 1s.4 1 1 1h2.6c.1 1.3.7 2.4 1.8 3.2.2.1.4.2.6.2.3 0 .6-.1.8-.4.3-.4.2-1.1-.2-1.4-.6-.4-.9-1-.9-1.7V7.5c0-.7.3-1.3.9-1.7.4-.3.5-.9.2-1.4-.3-.4-.9-.5-1.4-.2-1.1.8-1.7 1.9-1.8 3.2H3.5c-.6 0-1 .4-1 1s.4 1 1 1z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-blue-800">
            MuscleAI
          </h1>
        </div>
        <Link href="/main" className="text-blue-600 hover:text-blue-800 font-medium">
          Create Your Analysis →
        </Link>
      </header>

      <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24 pt-8">
        <div className="z-10 max-w-6xl w-full items-center justify-center text-sm flex flex-col">
          <Suspense fallback={<LoadingFallback />}>
            <AnalysisContent />
          </Suspense>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="flex gap-4">
              <Link
                href="/terms"
                className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
              >
                Terms of Service
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
          <div className="text-center mt-2">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} MuscleAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 