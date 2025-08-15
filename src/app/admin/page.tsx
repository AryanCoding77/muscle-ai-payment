"use client";

import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const router = useRouter();

  // Check if user is admin
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("You must be logged in to view this page");
      router.push("/login");
    } else if (user && !user.email?.endsWith("@muscleai.site")) {
      toast.error("You don't have permission to access this page");
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, [user, isAuthenticated, authLoading, router]);

  // Apply database migrations
  const applyMigration = async () => {
    try {
      const response = await fetch("/api/admin/apply-migration", {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error("Failed to apply migration");
      }
      
      const data = await response.json();
      toast.success("Migration applied successfully");
      console.log("Migration result:", data);
    } catch (err) {
      toast.error("Failed to apply migration");
      console.error("Migration error:", err);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Admin Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Referral Stats Card */}
          <Link href="/admin/referrals" className="block">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                Referral Statistics
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                View statistics about referral codes and their performance
              </p>
            </div>
          </Link>
          
          {/* Update Prices Card */}
          <Link href="/admin/update-prices" className="block">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                Update Prices
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Manage subscription plan pricing
              </p>
            </div>
          </Link>
          
          {/* Feedback Card */}
          <Link href="/admin/feedback" className="block">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                User Feedback
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Review feedback submitted by users
              </p>
            </div>
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Admin Actions
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={applyMigration}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Apply Database Migrations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 