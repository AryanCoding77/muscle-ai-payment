"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface UserInfo {
  name: string;
  email: string;
  picture: string;
  created_at: string;
  last_login: string;
}

interface UserContextType {
  userInfo: UserInfo;
  updateUserInfo: (updates: Partial<UserInfo>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth0();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    picture: "",
    created_at: "",
    last_login: "",
  });

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
    <UserContext.Provider value={{ userInfo, updateUserInfo }}>
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
