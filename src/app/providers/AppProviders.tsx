"use client";

import { ReactNode } from "react";
import Auth0ProviderWithNavigate from "./Auth0Provider";
import { UserProvider } from "@/context/UserContext";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Auth0ProviderWithNavigate>
      <UserProvider>{children}</UserProvider>
    </Auth0ProviderWithNavigate>
  );
}
