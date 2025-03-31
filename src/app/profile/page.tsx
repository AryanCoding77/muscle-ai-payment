"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth0 } from "@auth0/auth0-react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/context/UserContext";

export default function ProfilePage() {
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const { userInfo, updateUserInfo } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(userInfo.name || "");
    }
  }, [user, userInfo.name]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // In a real app, you would make an API call to update the user profile
      // and upload the profile photo
      // const token = await getAccessTokenSilently();
      // const formData = new FormData();
      // formData.append("name", displayName);
      // if (profilePhoto) {
      //   formData.append("photo", profilePhoto);
      // }

      // const response = await fetch("/api/updateProfile", {
      //   method: "POST",
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: formData,
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update global user context instead of local state
      updateUserInfo({
        name: displayName,
        picture: previewUrl || userInfo.picture,
      });

      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <nav className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
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
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  href="/main"
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => logout({ returnTo: window.location.origin })}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 md:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

            <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-800">
                  {userInfo.picture ? (
                    <Image
                      src={userInfo.picture}
                      alt={userInfo.name || "Profile picture"}
                      fill
                      sizes="(max-width: 768px) 96px, 96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center text-2xl font-bold">
                      {userInfo.name?.charAt(0) ||
                        userInfo.email?.charAt(0) ||
                        "U"}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-6 mb-4">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-800">
                          {previewUrl ? (
                            <Image
                              src={previewUrl}
                              alt="Profile preview"
                              fill
                              sizes="(max-width: 768px) 96px, 96px"
                              className="object-cover"
                            />
                          ) : userInfo.picture ? (
                            <Image
                              src={userInfo.picture}
                              alt={userInfo.name || "Profile picture"}
                              fill
                              sizes="(max-width: 768px) 96px, 96px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-blue-600 flex items-center justify-center text-2xl font-bold">
                              {userInfo.name?.charAt(0) ||
                                userInfo.email?.charAt(0) ||
                                "U"}
                            </div>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="photo"
                            className="block text-sm text-gray-400 mb-1"
                          >
                            Profile Photo
                          </label>
                          <input
                            type="file"
                            id="photo"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 
                            file:rounded-lg file:border-0 file:text-sm file:font-medium
                            file:bg-blue-600 file:text-white hover:file:bg-blue-700 
                            cursor-pointer focus:outline-none"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            JPG, PNG or GIF up to 5MB
                          </p>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm text-gray-400 mb-1"
                        >
                          Display Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-colors"
                        >
                          {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setDisplayName(userInfo.name);
                            setProfilePhoto(null);
                            setPreviewUrl(null);
                          }}
                          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>

                      {error && <p className="text-red-500 text-sm">{error}</p>}

                      {successMessage && (
                        <p className="text-green-500 text-sm">
                          {successMessage}
                        </p>
                      )}
                    </form>
                  ) : (
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold">
                        {userInfo.name || "User"}
                      </h2>
                      <p className="text-gray-400">{userInfo.email}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-400">
                        <div>
                          <span className="block">Member since</span>
                          <span className="text-white">
                            {new Date(userInfo.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="block">Last login</span>
                          <span className="text-white">
                            {new Date(userInfo.last_login).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 text-sm transition-colors mt-2"
                      >
                        Edit Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
