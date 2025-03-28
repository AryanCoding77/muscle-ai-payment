"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth0 } from "@auth0/auth0-react";

export default function DashboardPage() {
  const { user, logout } = useAuth0();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <nav className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
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
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-300">
                  Welcome, {user?.name || user?.email}
                </div>
                <button
                  onClick={() => logout({ returnTo: window.location.origin })}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 md:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          {/* Add your dashboard content here */}
        </main>
      </div>
    </ProtectedRoute>
  );
}
