"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, KeyRound, Smartphone, RotateCw, CheckCircle2, AlertCircle } from "lucide-react";
import { getErrorMessage, isApiError } from "@/src/lib/apiError";
import { useLogin } from "@/src/hooks/useLogin";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setCredentials } from "@/src/redux/slices/authSlice";
import type { FieldErrors } from "@/src/types/apiError";
import { SocialLoginButtons } from "./LoginOptions";
import { LoginOptionsContainer } from "./LoginOptionsContainer";

export function LoginForm({ registered }: { registered?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const loginMutation = useLogin();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Login Mode: "password" or "otp"
  const [activeTab, setActiveTab] = useState<"password" | "otp">("password");

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Validation & Server feedback
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [socialFeedback, setSocialFeedback] = useState<string | null>(null);

  // If already authenticated on client, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get("redirect") || "/";
      router.replace(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  function validateForm(form: FormData): FieldErrors {
    const errors: FieldErrors = {};
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    // Email validation
    if (!email) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    return errors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormError(null);
    setSocialFeedback(null);
    setFieldErrors({});

    const form = new FormData(event.currentTarget);
    const errors = validateForm(form);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (response) => {
          if (response?.data?.accessToken && response?.data?.user) {
            dispatch(
              setCredentials({
                user: response.data.user,
                accessToken: response.data.accessToken,
              })
            );

            const redirect = searchParams.get("redirect") || "/";
            router.push(redirect);
            router.refresh();
          } else {
            setFormError("Unexpected response from server. Please try again.");
          }
        },
        onError: (error) => {
          if (isApiError(error) && Object.keys(error.fields).length > 0) {
            setFieldErrors(error.fields);
          }
          setFormError(getErrorMessage(error));
        },
      }
    );
  }

  const pending = loginMutation.isPending;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-[#0b1220] sm:text-3xl">
          Welcome back
        </h2>
        <p className="mt-1.5 text-sm text-gray-500">
          Sign in to access your Drively bookings and saved vehicles.
        </p>
      </div>

      {/* Registration Success Banner */}
      {registered === "1" ? (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/90 p-3.5 text-xs text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-900">Account created successfully</p>
            <p className="text-emerald-700">Please sign in with your credentials to continue.</p>
          </div>
        </div>
      ) : null}

      {/* Global Form Error Banner */}
      {formError ? (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
          <span>{formError}</span>
        </div>
      ) : null}

      {/* Social Feedback Banner */}
      {socialFeedback ? (
        <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50/80 p-3 text-xs text-blue-800">
          {socialFeedback}
        </div>
      ) : null}

      {/* Quick 1-Click Social Sign-in */}
      <div className="mb-5">
        <SocialLoginButtons
          onGoogleLogin={() => {
            setFormError(null);
            setSocialFeedback("Redirecting to Google OAuth... (Connecting production domain)");
          }}
          onFacebookLogin={() => {
            setFormError(null);
            setSocialFeedback("Redirecting to Facebook OAuth... (Connecting production domain)");
          }}
        />
      </div>

      {/* Subtle Divider */}
      <div className="relative mb-5 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <span className="relative bg-[#f5f7fa] lg:bg-white px-3 text-[11px] font-medium uppercase tracking-wider text-gray-400">
          or sign in with
        </span>
      </div>

      {/* Segmented Mode Selector: Password vs OTP */}
      <div className="mb-5 grid grid-cols-2 rounded-xl bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => {
            setActiveTab("password");
            setFormError(null);
          }}
          className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition ${activeTab === "password"
            ? "bg-white text-[#0b1220] shadow-xs"
            : "text-gray-500 hover:text-gray-800"
            }`}
        >
          <KeyRound className="h-3.5 w-3.5" />
          Password
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("otp");
            setFormError(null);
          }}
          className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition ${activeTab === "otp"
            ? "bg-white text-[#0b1220] shadow-xs"
            : "text-gray-500 hover:text-gray-800"
            }`}
        >
          <Smartphone className="h-3.5 w-3.5" />
          One-Time Code (OTP)
        </button>
      </div>

      {/* Tab 1: Password Form */}
      {activeTab === "password" ? (
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-medium text-gray-700"
            >
              Email address
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                disabled={pending}
                className={`h-11 w-full rounded-xl border bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-4 ${fieldErrors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                  : "border-gray-200 focus:border-[#f5b544] focus:ring-[#f5b544]/10"
                  }`}
              />
            </div>

            {fieldErrors.email ? (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
            ) : null}
          </div>

          {/* Password */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-700"
              >
                Password
              </label>

              <Link
                href="/forgot-password"
                className="text-xs font-medium text-[#c58a16] transition hover:text-[#a9720e]"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                disabled={pending}
                className={`h-11 w-full rounded-xl border bg-white pl-10 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-4 ${fieldErrors.password
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                  : "border-gray-200 focus:border-[#f5b544] focus:ring-[#f5b544]/10"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 transition hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {fieldErrors.password ? (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
            ) : null}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 pt-0.5">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              disabled={pending}
              defaultChecked
              className="h-4 w-4 rounded border-gray-300 text-[#f5b544] accent-[#f5b544] focus:ring-0"
            />
            <label htmlFor="remember" className="text-xs text-gray-600 select-none cursor-pointer">
              Remember my device
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={pending}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0b1220] px-5 text-sm font-semibold text-white shadow-md shadow-[#0b1220]/10 transition hover:bg-[#16233a] active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-[#0b1220]/10 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in to Drively"
            )}
          </button>
        </form>
      ) : (
        /* Tab 2: OTP Flow */
        <LoginOptionsContainer showSocial={false} />
      )}

      {/* Signup Link */}
      <p className="mt-6 text-center text-xs text-gray-500 sm:text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[#c58a16] transition hover:text-[#a9720e]"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
