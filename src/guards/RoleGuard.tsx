"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/redux/hooks";
import { useMounted } from "@/src/hooks/useMounted";
import type { UserRole } from "@/src/types/auth";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * RoleGuard ensures that only authenticated users with specific roles can access
 * the wrapped content.
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
  redirectTo = "/",
}: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const mounted = useMounted();

  const hasAccess = isAuthenticated && user && allowedRoles.includes(user.role);

  useEffect(() => {
    if (mounted && (!isAuthenticated || (user && !allowedRoles.includes(user.role)))) {
      router.replace(redirectTo);
    }
  }, [mounted, isAuthenticated, user, allowedRoles, redirectTo, router]);

  if (!mounted || !hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
