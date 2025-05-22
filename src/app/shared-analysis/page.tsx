"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AnalysisDashboard from "@/components/AnalysisDashboard";
import type { MuscleData } from "@/types/muscle";

export default function SharedAnalysis() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header */}
      <header className="bg-white border-b border-gray-200 py-4 px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <div className="w-8 h-8 mr-3">
            <img src="/muscle-logo.svg" alt="MuscleAI Logo" className="w-full h-full" />
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
          {loading ? (
            <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-lg font-medium text-gray-800">
                  Loading shared analysis...
                </p>
              </div>
            </div>
          ) : error ? (
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
          ) : analysisData ? (
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
          ) : null}
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