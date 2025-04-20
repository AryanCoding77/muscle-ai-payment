"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface Subscription {
  id: string;
  plan: string;
  planId: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: string;
  features: string[];
}

interface UserInfo {
  name: string;
  email: string;
  picture: string;
  created_at: string;
  last_login: string;
  subscription: Subscription | null;
}

interface UserContextType {
  userInfo: UserInfo;
  updateUserInfo: (updates: Partial<UserInfo>) => void;
  fetchUserSubscription: () => Promise<void>;
  isLoading: boolean;
}

const emptySubscription = {
  id: "",
  plan: "",
  planId: "",
  amount: 0,
  startDate: "",
  endDate: "",
  status: "",
  features: [],
};

const defaultUserInfo: UserInfo = {
  name: "",
  email: "",
  picture: "",
  created_at: "",
  last_login: "",
  subscription: null,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const [userInfo, setUserInfo] = useState<UserInfo>(defaultUserInfo);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved user info from localStorage on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUserInfo = localStorage.getItem("userInfo");
      if (savedUserInfo) {
        try {
          const parsed = JSON.parse(savedUserInfo);
          setUserInfo(parsed);
        } catch (e) {
          console.error("Failed to parse saved user info:", e);
        }
      }
      setIsLoading(false);
    }
  }, []);

  // Update from Auth0 user info if we don't have a saved version
  useEffect(() => {
    if (user) {
      const savedUserInfo = localStorage.getItem("userInfo");

      // Only update from Auth0 if we don't have saved data or email has changed
      // This prevents Auth0 from overwriting our custom edits on refresh
      if (
        !savedUserInfo ||
        !JSON.parse(savedUserInfo).email ||
        JSON.parse(savedUserInfo).email !== user.email
      ) {
        const newUserInfo = {
          ...userInfo,
          name: user.name || "",
          email: user.email || "",
          picture: user.picture || "",
          created_at: user.updated_at || "",
          last_login: user.updated_at || "",
        };

        setUserInfo(newUserInfo);

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
        }
      }
    }
  }, [user]);

  // Fetch subscription data when the user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && user.sub) {
      fetchUserSubscription();
    }
  }, [isAuthenticated, user]);

  const fetchUserSubscription = async () => {
    if (!user || !user.sub) return;

    try {
      setIsLoading(true);
      console.log("Fetching subscription for user:", user.sub);

      const response = await fetch(
        `/api/get-user-subscription?userId=${user.sub}`
      );
      const data = await response.json();

      if (response.ok && data.subscription) {
        console.log("Fetched subscription:", data.subscription);

        // Update userInfo with subscription
        updateUserInfo({
          subscription: data.subscription,
        });
      } else {
        console.log("No active subscription found:", data.message);
        updateUserInfo({ subscription: null });
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserInfo = (updates: Partial<UserInfo>) => {
    setUserInfo((prev) => {
      const updated = { ...prev, ...updates };

      // Save to localStorage whenever updated
      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo", JSON.stringify(updated));
      }

      return updated;
    });
  };

  return (
    <UserContext.Provider
      value={{ userInfo, updateUserInfo, fetchUserSubscription, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
