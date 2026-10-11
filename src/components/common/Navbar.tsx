"use client";

import Link from "next/link";
import { useState } from "react";
import { Car, LogOut, Menu, User, X } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";

interface NavbarProps {
  variant?: "dark" | "light";
}

export function Navbar({ variant = "light" }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const isDark = variant === "dark";

  return (
    <header
      className={`relative z-40 transition ${
        isDark
          ? "border-b border-white/10 bg-[#071225]/80 backdrop-blur-md"
          : "border-b border-gray-100 bg-white"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5b544]">
            <Car className="h-5 w-5 text-[#071225]" />
          </div>
          <span
            className={`text-xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-[#071225]"
            }`}
          >
            Drive<span className="text-[#f5b544]">ly</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/cars"
            className={`text-sm font-medium transition ${
              isDark
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-[#071225]"
            }`}
          >
            Cars
          </Link>
          <Link
            href="/companies"
            className={`text-sm font-medium transition ${
              isDark
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-[#071225]"
            }`}
          >
            Companies
          </Link>
          <Link
            href="/#how-it-works"
            className={`text-sm font-medium transition ${
              isDark
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-[#071225]"
            }`}
          >
            How it works
          </Link>
        </nav>

        {/* Desktop Auth Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm ${
                  isDark
                    ? "bg-white/10 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f5b544] text-xs font-bold text-[#0b1220]">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="font-semibold text-xs">{user.name}</span>
                  <span className="text-[10px] capitalize text-[#d99a20] font-medium">
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => logout()}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isDark
                    ? "border border-white/15 bg-white/5 text-gray-200 hover:bg-white/10"
                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  isDark
                    ? "text-white hover:bg-white/10"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-[#f5b544] px-5 py-2.5 text-sm font-bold text-[#071225] shadow-lg shadow-amber-500/10 transition hover:bg-[#e4a331]"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`rounded-lg p-2 md:hidden ${
            isDark ? "text-white" : "text-gray-800"
          }`}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className={`border-b p-5 md:hidden ${
            isDark
              ? "border-white/10 bg-[#0b172d] text-white"
              : "border-gray-200 bg-white text-gray-900"
          }`}
        >
          <div className="flex flex-col gap-2">
            <Link
              href="/cars"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-500/10"
            >
              Cars
            </Link>
            <Link
              href="/companies"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-500/10"
            >
              Companies
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-500/10"
            >
              How it works
            </Link>

            <div className="mt-3 border-t border-gray-500/20 pt-4">
              {isAuthenticated && user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5b544] text-sm font-bold text-[#0b1220]">
                      {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{user.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-sm font-semibold text-red-600 hover:bg-red-500/20"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl border border-gray-300 py-2.5 text-sm font-semibold"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl bg-[#f5b544] py-2.5 text-sm font-bold text-[#071225]"
                  >
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
