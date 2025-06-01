"use client";

import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useUser } from "@/context/UserContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// Define feedback item type
interface FeedbackItem {
  id: string;
  user_id: string | null;
  user_name: string;
  user_email: string | null;
  category: string;
  rating: number | null;
  feedback: string;
  subscription_plan: string;
  submitted_at: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

export default function AdminFeedbackPage() {
  const { user, isLoading: authLoading } = useAuth0();
  const { userInfo, isLoading: userLoading } = useUser();
  const router = useRouter();
  
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Check if user is an admin
  // For demonstration purposes, we're always treating the user as an admin
  const isAdmin = true; // In a real app, you would check userInfo.role or similar

  useEffect(() => {
    if (authLoading || userLoading) return;
    
    if (!isAdmin) {
      toast.error("You don't have permission to access this page");
      return;
    }
    
    const fetchFeedback = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/get-feedback");
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch feedback");
        }
        
        const data = await response.json();
        setFeedback(data.feedback || []);
      } catch (err: any) {
        console.error("Error fetching feedback:", err);
        setError(err.message || "Failed to load feedback");
        toast.error("Failed to load feedback entries");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeedback();
  }, [authLoading, userLoading, isAdmin]);

  const handleStatusChange = async (feedbackId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/update-feedback-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedbackId, status: newStatus }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update status");
      }
      
      // Update local state
      setFeedback(prevFeedback => 
        prevFeedback.map(item => 
          item.id === feedbackId ? { ...item, status: newStatus } : item
        )
      );
      
      toast.success("Feedback status updated");
    } catch (err: any) {
      console.error("Error updating status:", err);
      toast.error("Failed to update feedback status");
    }
  };

  // Filter feedback based on selected filters
  const filteredFeedback = feedback.filter(item => {
    const categoryMatch = filter === "all" || item.category === filter;
    const statusMatch = statusFilter === "all" || item.status === statusFilter;
    return categoryMatch && statusMatch;
  });

  const renderStatusBadge = (status: string) => {
    let bgColor = "bg-gray-200";
    let textColor = "text-gray-800";
    
    switch (status) {
      case "pending":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        break;
      case "in-progress":
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        break;
      case "completed":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        break;
      case "dismissed":
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        break;
      default:
        break;
    }
    
    return (
      <span className={`${bgColor} ${textColor} px-2 py-1 rounded-full text-xs font-medium`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!isAdmin && !userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-center mb-4">Access Denied</h1>
          <p className="text-gray-600 text-center mb-6">You don't have permission to access this admin page.</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-800 text-white">
              <h1 className="text-2xl font-bold">User Feedback Management</h1>
              <p className="text-gray-300 mt-1">View and manage user feedback submissions</p>
            </div>
            
            {/* Filters */}
            <div className="p-4 flex flex-wrap gap-4 border-b border-gray-200 bg-gray-50">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="general">General Feedback</option>
                  <option value="subscription">Subscription & Payment</option>
                  <option value="analysis">Muscle Analysis</option>
                  <option value="ui">User Interface</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Bug Report</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>
              
              <div className="ml-auto flex items-end">
                <span className="text-sm text-gray-500">
                  {filteredFeedback.length} feedback entries
                </span>
              </div>
            </div>
            
            {/* Feedback entries */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading feedback entries...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <div className="text-red-500 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-800 font-medium">{error}</p>
                  <p className="text-gray-600 mt-1">Please try again later or contact the system administrator.</p>
                </div>
              ) : filteredFeedback.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No feedback entries found.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFeedback.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.user_name || "Anonymous"}</div>
                              <div className="text-sm text-gray-500">{item.user_email || "No email"}</div>
                              <div className="text-xs text-gray-400">{item.subscription_plan}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs overflow-hidden text-ellipsis">
                            {item.feedback.length > 100 
                              ? `${item.feedback.substring(0, 100)}...` 
                              : item.feedback}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.rating ? `${item.rating}/5` : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(item.submitted_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStatusBadge(item.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <select 
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            className="block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="dismissed">Dismissed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 