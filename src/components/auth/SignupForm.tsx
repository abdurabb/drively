"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { getErrorMessage, isApiError } from "@/src/lib/apiError";
import { useRegister } from "@/src/hooks/useRegister";
import { useAppSelector } from "@/src/redux/hooks";
import type { FieldErrors } from "@/src/types/apiError";

const inputClassName =
  "h-12 w-full rounded-xl border bg-white px-4 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-[#f5b544] focus:ring-4 focus:ring-[#f5b544]/10";

function fieldClass(hasError: boolean) {
  return `${inputClassName} ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
      : "border-gray-200"
  }`;
}

export function SignupForm() {
  const router = useRouter();
  const register = useRegister();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);


  function validateForm(form: FormData): FieldErrors {
    const errors: FieldErrors = {};

    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const termsAccepted = form.get("terms") === "on";

    // Full name validation
    if (!name) {
      errors.name = "Full name is required.";
    } else if (name.length < 3) {
      errors.name = "Full name must be at least 3 characters.";
    }

    // Email validation
    if (!email) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    // Phone validation
    if (!phone) {
      errors.phone = "Phone number is required.";
    } else if (!/^[+]?[0-9\s()-]{7,20}$/.test(phone)) {
      errors.phone = "Please enter a valid phone number.";
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    // Terms validation
    if (!termsAccepted) {
      errors.terms = "You must agree to the Terms of Service and Privacy Policy.";
    }

    return errors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormError(null);
    setFieldErrors({});

    const form = new FormData(event.currentTarget);

    // Validate on the frontend BEFORE calling the API
    const errors = validateForm(form);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    register.mutate(
      {
        name: String(form.get("name") ?? "").trim(),
        email: String(form.get("email") ?? "").trim(),
        phone: String(form.get("phone") ?? "").trim(),
        password: String(form.get("password") ?? ""),
        role: "customer",
      },
      {
        onSuccess: () => {
          router.push("/login?registered=1");
        },

        onError: (error) => {
          if (isApiError(error) && Object.keys(error.fields).length > 0) {
            setFieldErrors(error.fields);
          }

          setFormError(getErrorMessage(error));
        },
      },
    );
  }

  const pending = register.isPending;

  return (
    <>
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#0b1220]">
          Create your account
        </h2>

        <p className="mt-2 text-gray-500">
          Join Drively and start your journey.
        </p>
      </div>

      <form className="mt-7 space-y-4" onSubmit={handleSubmit} noValidate>
        {formError ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {formError}
          </div>
        ) : null}

        {/* Full Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Full name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            required
            minLength={3}
            disabled={pending}
            className={fieldClass(Boolean(fieldErrors.name))}
          />

          {fieldErrors.name ? (
            <p className="mt-1 text-xs text-red-600">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            disabled={pending}
            className={fieldClass(Boolean(fieldErrors.email))}
          />

          {fieldErrors.email ? (
            <p className="mt-1 text-xs text-red-600">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Phone number
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+971 50 123 4567"
            required
            disabled={pending}
            className={fieldClass(Boolean(fieldErrors.phone))}
          />

          {fieldErrors.phone ? (
            <p className="mt-1 text-xs text-red-600">
              {fieldErrors.phone}
            </p>
          ) : null}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            required
            minLength={6}
            disabled={pending}
            className={fieldClass(Boolean(fieldErrors.password))}
          />

          {fieldErrors.password ? (
            <p className="mt-1 text-xs text-red-600">
              {fieldErrors.password}
            </p>
          ) : (
            <p className="mt-2 text-xs text-gray-400">
              Use at least 6 characters.
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 pt-1">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            disabled={pending}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#f5b544]"
          />

          <div>
            <label
              htmlFor="terms"
              className="text-xs leading-5 text-gray-500"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-medium text-gray-700 underline underline-offset-2"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-gray-700 underline underline-offset-2"
              >
                Privacy Policy
              </Link>
              .
            </label>

            {fieldErrors.terms ? (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.terms}
              </p>
            ) : null}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={pending}
          className="mt-2 h-12 w-full rounded-xl bg-[#0b1220] px-5 text-sm font-semibold text-white shadow-lg shadow-[#0b1220]/10 transition hover:bg-[#16233a] focus:outline-none focus:ring-4 focus:ring-[#0b1220]/10 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Creating account..." : "Create account"}
        </button>
      </form>
    </>
  );
}
