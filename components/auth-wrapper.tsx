"use client";

import { useAuthRedirect } from "@/hooks/use-auth-redirect";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  useAuthRedirect();
  return <>{children}</>;
}