"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";

interface AppState {
  returnTo?: string;
  [key: string]: any;
}

export default function Auth0ProviderWithNavigate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;

  const onRedirectCallback = (appState?: AppState) => {
    router.push(appState?.returnTo || "/main");
  };

  if (!(domain && clientId)) {
    return null;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri:
          typeof window !== "undefined"
            ? `${window.location.origin}/callback`
            : "",
        audience: `https://${domain}/api/v2/`,
        scope: "openid profile email",
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      {children}
    </Auth0Provider>
  );
}
