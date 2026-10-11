"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/redux/hooks";
import { useMounted } from "@/src/hooks/useMounted";

interface GuestGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * GuestGuard ensures that only unauthenticated users (guests) can access
 * the wrapped content (e.g. Login, Signup). If the user is authenticated,
 * they are redirected to `redirectTo` (default: "/").
 */
export function GuestGuard({
  children,
  fallback = null,
  redirectTo = "/",
}: GuestGuardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const mounted = useMounted();

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [mounted, isAuthenticated, redirectTo, router]);

  if (!mounted) {
    return <>{children}</>;
  }

  if (isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
