"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/src/redux/hooks";
import { useMounted } from "@/src/hooks/useMounted";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * AuthGuard ensures that only authenticated users can access the wrapped content.
 * If the user is not authenticated, they are redirected to `redirectTo` (default: "/login").
 */
export function AuthGuard({
  children,
  fallback = null,
  redirectTo = "/login",
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const mounted = useMounted();

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      const loginUrl = new URL(redirectTo, window.location.origin);
      if (pathname && pathname !== "/") {
        loginUrl.searchParams.set("redirect", pathname);
      }
      router.replace(loginUrl.pathname + loginUrl.search);
    }
  }, [mounted, isAuthenticated, redirectTo, pathname, router]);

  if (!mounted || !isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
