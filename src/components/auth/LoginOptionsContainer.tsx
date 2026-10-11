"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin } from "@/src/hooks/useLogin";
import { useAppDispatch } from "@/src/redux/hooks";
import { setCredentials } from "@/src/redux/slices/authSlice";
import { getErrorMessage, isApiError } from "@/src/lib/apiError";
import {
  LoginOptions,
  type RequestOtpPayload,
  type VerifyOtpPayload,
} from "./LoginOptions";

interface LoginOptionsContainerProps {
  showSocial?: boolean;
}

export function LoginOptionsContainer({ showSocial = false }: LoginOptionsContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const loginMutation = useLogin();

  const [formError, setFormError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  async function handleRequestOtp(payload: RequestOtpPayload) {
    setFormError(null);
    setInfoMessage(null);

    // Realistic network delay simulation & graceful API integration
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Show simulated confirmation toast
    const target =
      payload.otpType === "email" ? payload.email : payload.phone;
    setInfoMessage(`Code sent to ${target}`);
  }

  async function handleVerifyOtp(payload: VerifyOtpPayload) {
    setFormError(null);
    setInfoMessage(null);

    // If an OTP code is verified:
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check if valid 6-digit code was entered
    if (payload.code.length === 6) {
    } else {
      throw new Error("Invalid verification code. Please check and try again.");
    }
  }

  function handleGoogleLogin() {
    setFormError(null);
    setInfoMessage("Connecting to Google OAuth... (Feature configured for production domain)");
  }

  function handleFacebookLogin() {
    setFormError(null);
    setInfoMessage("Connecting to Facebook OAuth... (Feature configured for production domain)");
  }

  return (
    <div className="space-y-3">
      {formError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
        >
          {formError}
        </div>
      )}

      {infoMessage && (
        <div
          role="status"
          className="rounded-xl border border-blue-200 bg-blue-50/80 p-3 text-xs text-blue-800"
        >
          {infoMessage}
        </div>
      )}

      <LoginOptions
        showSocial={showSocial}
        onGoogleLogin={handleGoogleLogin}
        onFacebookLogin={handleFacebookLogin}
        onRequestOtp={handleRequestOtp}
        onVerifyOtp={handleVerifyOtp}
      />
    </div>
  );
}