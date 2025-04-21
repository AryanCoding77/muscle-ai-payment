"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import { UserProvider } from "@/context/UserContext";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: "http://localhost:3000/callback",
      }}
    >
      <UserProvider>{children}</UserProvider>
    </Auth0Provider>
  );
}
