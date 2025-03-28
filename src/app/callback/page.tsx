"use client";

import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";

export default function Callback() {
  const { isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/main");
      } else {
        router.push("/login");
      }
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
