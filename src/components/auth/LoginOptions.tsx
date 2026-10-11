"use client";

import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent, type ClipboardEvent } from "react";
import { Mail, Phone, ArrowLeft, RotateCw, CheckCircle2 } from "lucide-react";

export type RequestOtpPayload =
  | {
      loginType: "otp";
      otpType: "email";
      email: string;
    }
  | {
      loginType: "otp";
      otpType: "phone";
      phone: string;
    };

export type VerifyOtpPayload = {
  loginType: "otp";
  otpType: "email" | "phone";
  destination: string;
  code: string;
};

export type LoginOptionsProps = {
  onGoogleLogin?: () => void;
  onFacebookLogin?: () => void;
  onRequestOtp: (payload: RequestOtpPayload) => Promise<{ success: boolean; message?: string } | void>;
  onVerifyOtp?: (payload: VerifyOtpPayload) => Promise<{ success: boolean; message?: string } | void>;
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
  onVerifyOtp,
  showSocial = false,
}: LoginOptionsProps) {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [otpType, setOtpType] = useState<OtpType>("phone");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 6-digit OTP state
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown effect
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const activeDestination = otpType === "email" ? email.trim() : phone.trim();

  async function handleSendOtp(event?: FormEvent) {
    if (event) event.preventDefault();
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
      payload = { loginType: "otp", otpType: "email", email: normalizedEmail };
    } else {
      const normalizedPhone = phone.trim();
      if (!normalizedPhone) {
        setError("Please enter your mobile number.");
        return;
      }
      if (!/^\+?[1-9]\d{6,14}$/.test(normalizedPhone.replace(/\s+/g, ""))) {
        setError("Enter a valid phone number with country code, e.g. +971 50 123 4567");
        return;
      }
      payload = { loginType: "otp", otpType: "phone", phone: normalizedPhone };
    }

    setLoading(true);

    try {
      await onRequestOtp(payload);
      setStep("verify");
      setCountdown(45);
      setOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleOtpDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setError("");

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setOtpDigits(newDigits);
    setError("");

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  }

  async function handleVerifySubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    const code = otpDigits.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      if (onVerifyOtp) {
        await onVerifyOtp({
          loginType: "otp",
          otpType,
          destination: activeDestination,
          code,
        });
      } else {
        setError("OTP verification handler is not configured.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code. Please try again.");
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

      {step === "request" ? (
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
      ) : (
        /* Step 2: 6-digit Verification */
        <form onSubmit={handleVerifySubmit} className="space-y-4" noValidate>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setStep("request");
                setError("");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Edit {otpType === "email" ? "Email" : "Phone"}
            </button>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-0.5 inline-flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Code Sent
            </span>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-center">
            <p className="text-xs text-gray-600">
              Enter the 6-digit verification code sent to
            </p>
            <p className="mt-0.5 text-xs font-semibold text-[#0b1220] truncate">
              {activeDestination}
            </p>
          </div>

          {/* 6 Discrete Digit Inputs */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                onPaste={idx === 0 ? handleOtpPaste : undefined}
                className="h-12 w-11 sm:h-12 sm:w-12 rounded-xl border border-gray-200 bg-white text-center text-lg font-bold text-gray-900 shadow-xs outline-none transition focus:border-[#f5b544] focus:ring-4 focus:ring-[#f5b544]/15"
              />
            ))}
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 text-center">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            {countdown > 0 ? (
              <span>Resend code in <strong className="text-gray-800">{countdown}s</strong></span>
            ) : (
              <button
                type="button"
                onClick={() => handleSendOtp()}
                disabled={loading}
                className="font-semibold text-[#c58a16] hover:text-[#a9720e] transition"
              >
                Resend code now
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setStep("request");
                setError("");
              }}
              className="text-gray-500 hover:text-gray-800 transition"
            >
              Didn&apos;t get code?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || otpDigits.join("").length !== 6}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0b1220] px-4 text-sm font-semibold text-white shadow-md shadow-[#0b1220]/10 transition hover:bg-[#16233a] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Sign In"
            )}
          </button>
        </form>
      )}
    </div>
  );
}