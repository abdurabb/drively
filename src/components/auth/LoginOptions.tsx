"use client";

import { useState, type FormEvent } from "react";
import { Mail, Phone, RotateCw } from "lucide-react";
import { isValidPhone, normalizePhone } from "@/src/lib/otp";

export type RequestOtpPayload =
  | {
      otpType: "email";
      email: string;
    }
  | {
      otpType: "phone";
      phone: string;
    };

export type LoginOptionsProps = {
  onGoogleLogin?: () => void;
  onFacebookLogin?: () => void;
  onRequestOtp: (payload: RequestOtpPayload) => Promise<{ success: boolean; message?: string } | void>;
  showSocial?: boolean;
};

type OtpType = "email" | "phone";

export function SocialLoginButtons({
  onGoogleLogin,
  onFacebookLogin,
}: {
  onGoogleLogin?: () => void;
  onFacebookLogin?: () => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Google Login */}
      <button
        type="button"
        onClick={onGoogleLogin}
        className="group relative flex h-11 items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-700 shadow-xs transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-[0.99] sm:text-sm"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
          <path
            fill="#4285F4"
            d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.93-4.18 2.93-7.39Z"
          />
          <path
            fill="#34A853"
            d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.5A9.75 9.75 0 0 0 12 21.5Z"
          />
          <path
            fill="#FBBC05"
            d="M6.53 13.6A5.86 5.86 0 0 1 6.23 12c0-.56.1-1.1.3-1.6V7.9H3.28A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.03 4.1l3.25-2.5Z"
          />
          <path
            fill="#EA4335"
            d="M12 6.37c1.43 0 2.7.49 3.71 1.45l2.78-2.78C16.83 3.45 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.72 5.4l3.25 2.5c.77-2.31 2.93-4.03 5.47-4.03Z"
          />
        </svg>
        <span className="truncate">Google</span>
      </button>

      {/* Facebook Login */}
      <button
        type="button"
        onClick={onFacebookLogin}
        className="group relative flex h-11 items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-700 shadow-xs transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-[0.99] sm:text-sm"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0 text-[#1877F2]">
          <path
            fill="currentColor"
            d="M24 12a12 12 0 1 0-13.875 11.85v-8.38H7.078V12h3.047V9.356c0-3.008 1.792-4.67 4.533-4.67 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.49 0-1.956.925-1.956 1.875V12h3.328l-.532 3.47h-2.796v8.38A12.003 12.003 0 0 0 24 12Z"
          />
        </svg>
        <span className="truncate">Facebook</span>
      </button>
    </div>
  );
}

export function LoginOptions({
  onGoogleLogin,
  onFacebookLogin,
  onRequestOtp,
  showSocial = false,
}: LoginOptionsProps) {
  const [otpType, setOtpType] = useState<OtpType>("phone");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendOtp(event: FormEvent) {
    event.preventDefault();
    setError("");

    let payload: RequestOtpPayload;

    if (otpType === "email") {
      const normalizedEmail = email.trim();
      if (!normalizedEmail) {
        setError("Please enter your email address.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        setError("Please enter a valid email address.");
        return;
      }
      payload = { otpType: "email", email: normalizedEmail };
    } else {
      const normalizedPhone = phone.trim();
      if (!normalizedPhone) {
        setError("Please enter your mobile number.");
        return;
      }
      if (!isValidPhone(normalizedPhone)) {
        setError("Enter a valid phone number with country code, e.g. +971501234567");
        return;
      }
      payload = { otpType: "phone", phone: normalizePhone(normalizedPhone) };
    }

    setLoading(true);

    try {
      await onRequestOtp(payload);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send verification code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {showSocial && (
        <>
          <SocialLoginButtons onGoogleLogin={onGoogleLogin} onFacebookLogin={onFacebookLogin} />
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <span className="relative bg-[#f8fafc] px-3 text-xs uppercase tracking-wider text-gray-400">
              or continue with OTP
            </span>
          </div>
        </>
      )}

      <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
          {/* Channel Selector: Phone or Email */}
          <div className="flex rounded-xl bg-gray-100/90 p-1">
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setOtpType("phone");
                setError("");
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
                otpType === "phone"
                  ? "bg-white text-[#0b1220] shadow-xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Phone className="h-3.5 w-3.5" />
              Mobile SMS
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setOtpType("email");
                setError("");
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
                otpType === "email"
                  ? "bg-white text-[#0b1220] shadow-xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Mail className="h-3.5 w-3.5" />
              Email Code
            </button>
          </div>

          {otpType === "phone" ? (
            <div>
              <label htmlFor="otp-phone" className="mb-1.5 block text-xs font-medium text-gray-700">
                Mobile Number
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  id="otp-phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+971 50 123 4567"
                  disabled={loading}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#f5b544] focus:ring-4 focus:ring-[#f5b544]/10"
                />
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                Include country code (e.g. +971 for UAE). We&apos;ll send a 6-digit code.
              </p>
            </div>
          ) : (
            <div>
              <label htmlFor="otp-email" className="mb-1.5 block text-xs font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="otp-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={loading}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#f5b544] focus:ring-4 focus:ring-[#f5b544]/10"
                />
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                A verification code will be sent to your inbox.
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0b1220] px-4 text-sm font-semibold text-white shadow-md shadow-[#0b1220]/10 transition hover:bg-[#16233a] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin" />
                Sending code...
              </>
            ) : (
              "Send Verification Code"
            )}
          </button>
        </form>
    </div>
  );
}