"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Mail, Phone, RotateCw } from "lucide-react";
import { OtpCodeInputs } from "@/src/components/auth/OtpCodeInputs";
import { getErrorMessage } from "@/src/lib/apiError";
import { isVerifyOtpAuthResponse } from "@/src/lib/auth";
import {
  buildVerifyOtpPath,
  clearPendingVerification,
  isValidPhone,
  loadPendingVerification,
  normalizePhone,
  parseFlowParam,
  parsePendingParam,
  savePendingVerification,
  type OtpType,
  type VerificationFlow,
} from "@/src/lib/otp";
import { useSendOtp } from "@/src/hooks/useSendOtp";
import { useVerifyOtp } from "@/src/hooks/useVerifyOtp";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setCredentials } from "@/src/redux/slices/authSlice";

function emptyDigits() {
  return ["", "", "", "", "", ""];
}

function channelDestination(channel: OtpType, emailValue: string, phoneValue: string) {
  return channel === "email" ? emailValue.trim() : normalizePhone(phoneValue);
}

function channelIsReady(channel: OtpType, emailValue: string, phoneValue: string) {
  const destination = channelDestination(channel, emailValue, phoneValue);

  if (channel === "email") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destination);
  }

  return isValidPhone(destination);
}

function sentCodeMessage(channel: OtpType, emailValue: string, phoneValue: string) {
  const destination = channelDestination(channel, emailValue, phoneValue);
  return `A 6-digit code was sent to ${destination}. Enter it below to continue.`;
}

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();

  const initialEmail = searchParams.get("email") ?? "";
  const initialPhone = searchParams.get("phone") ?? "";
  const initialFlow = parseFlowParam(searchParams.get("flow"));
  const initialPending =
    initialFlow === "login" && (searchParams.get("pending") === "email" || searchParams.get("pending") === "phone")
      ? [searchParams.get("pending") as OtpType]
      : parsePendingParam(searchParams.get("pending"));
  const initialChannel = initialPending[0] ?? "email";
  const initialReady = channelIsReady(initialChannel, initialEmail, initialPhone);

  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [pending, setPending] = useState<OtpType[]>(initialPending);
  const [flow, setFlow] = useState<VerificationFlow>(initialFlow);
  const [activeChannel, setActiveChannel] = useState<OtpType>(initialChannel);
  const [hydratedFromSession, setHydratedFromSession] = useState(false);
  const [otpDigits, setOtpDigits] = useState(emptyDigits());
  const [formError, setFormError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(
    initialReady ? sentCodeMessage(initialChannel, initialEmail, initialPhone) : null,
  );
  const [countdown, setCountdown] = useState(initialReady ? 45 : 0);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (hydratedFromSession) {
      return;
    }

    const stored = loadPendingVerification();
    setHydratedFromSession(true);

    if (!stored) {
      return;
    }

    if (!searchParams.get("email") && stored.email) {
      setEmail(stored.email);
    }
    if (!searchParams.get("phone") && stored.phone) {
      setPhone(stored.phone);
    }
    if (!searchParams.get("pending") && stored.pending.length) {
      setPending(stored.pending);
      setActiveChannel(stored.pending[0] ?? "email");
    }
    if (!searchParams.get("flow") && stored.flow) {
      setFlow(stored.flow);
    }

    const urlHasDestination = Boolean(searchParams.get("email") || searchParams.get("phone"));

    if (!urlHasDestination && (stored.email || stored.phone)) {
      const channel = stored.pending[0] ?? "email";

      if (channelIsReady(channel, stored.email ?? "", stored.phone ?? "")) {
        setCountdown((current) => (current > 0 ? current : 45));
        setInfoMessage(sentCodeMessage(channel, stored.email ?? "", stored.phone ?? ""));
      }
    }
  }, [hydratedFromSession, searchParams]);

  useEffect(() => {
    savePendingVerification({
      email: email.trim() || undefined,
      phone: phone.trim() ? normalizePhone(phone) : undefined,
      pending,
      flow,
    });
  }, [email, phone, pending, flow]);

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  const destination = useMemo(() => {
    return activeChannel === "email" ? email.trim() : normalizePhone(phone);
  }, [activeChannel, email, phone]);

  const destinationReady = channelIsReady(activeChannel, email, phone);

  async function requestCode(channel: OtpType = activeChannel) {
    const nextDestination =
      channel === "email" ? email.trim() : normalizePhone(phone);

    if (channel === "email") {
      if (!nextDestination || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextDestination)) {
        setFormError("Enter the email address on your account.");
        return;
      }
    } else if (!isValidPhone(nextDestination)) {
      setFormError("Enter the phone number on your account, including country code.");
      return;
    }

    setFormError(null);
    setInfoMessage(null);

    try {
      await sendOtpMutation.mutateAsync(
        channel === "email"
          ? { otpType: "email", email: nextDestination }
          : { otpType: "phone", phone: nextDestination },
      );
      setCountdown(45);
      setOtpDigits(emptyDigits());
      setInfoMessage(
        `A 6-digit code was sent to ${nextDestination}. Enter it below to continue.`,
      );
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = otpDigits.join("");

    if (code.length !== 6) {
      setFormError("Please enter the complete 6-digit verification code.");
      return;
    }

    setFormError(null);

    try {
      const response = await verifyOtpMutation.mutateAsync(
        activeChannel === "email"
          ? { otpType: "email", email: destination, code }
          : { otpType: "phone", phone: destination, code },
      );

      if (isVerifyOtpAuthResponse(response)) {
        clearPendingVerification();
        dispatch(
          setCredentials({
            user: response.data.user,
            accessToken: response.data.accessToken,
          }),
        );
        router.push("/");
        router.refresh();
        return;
      }

      const remaining: OtpType[] = [];
      if (!response.data.isEmailVerified) {
        remaining.push("email");
      }
      if (!response.data.isPhoneVerified) {
        remaining.push("phone");
      }

      if (remaining.length === 0) {
        clearPendingVerification();
        router.push("/login?registered=1");
        return;
      }

      const nextEmail = response.data.email || email;
      const nextPhone = response.data.phone || phone;
      const nextChannel = remaining[0];

      setEmail(nextEmail);
      setPhone(nextPhone);
      setPending(remaining);
      setFlow("account");
      setOtpDigits(emptyDigits());
      setActiveChannel(nextChannel);
      setCountdown(45);
      setInfoMessage(
        response.message ??
          (activeChannel === "email"
            ? "Email verified. Enter the phone code to continue."
            : "Phone verified. Enter the email code to continue."),
      );
      savePendingVerification({
        email: nextEmail.trim() || undefined,
        phone: nextPhone.trim() ? normalizePhone(nextPhone) : undefined,
        pending: remaining,
        flow: "account",
      });
      router.replace(
        buildVerifyOtpPath({
          email: nextEmail.trim() || undefined,
          phone: nextPhone.trim() ? normalizePhone(nextPhone) : undefined,
          pending: remaining,
          flow: "account",
        }),
      );
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  const pendingLabel =
    pending.length === 2
      ? "email and phone"
      : activeChannel === "email"
        ? "email"
        : "phone";

  const loading = sendOtpMutation.isPending || verifyOtpMutation.isPending;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-[#0b1220] sm:text-3xl">
          {flow === "login" ? "Enter your code" : "Verify your account"}
        </h2>
        <p className="mt-1.5 text-sm text-gray-500">
          {flow === "login"
            ? `Enter the 6-digit ${activeChannel} code to sign in.`
            : `Registration requires both email and phone verification. Complete the ${pendingLabel} step${pending.length === 2 ? "s" : ""} to continue.`}
        </p>
      </div>

      {flow === "account" ? (
        <div className="mb-5 grid grid-cols-2 gap-2">
          {(["email", "phone"] as const).map((channel) => {
            const done = !pending.includes(channel);
            const active = activeChannel === channel;
            return (
              <button
                key={channel}
                type="button"
                disabled={done || loading || !channelIsReady(channel, email, phone)}
                onClick={() => {
                  setActiveChannel(channel);
                  setOtpDigits(emptyDigits());
                  setFormError(null);
                  if (channelIsReady(channel, email, phone)) {
                    setInfoMessage(sentCodeMessage(channel, email, phone));
                  }
                }}
                className={`rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition ${
                  done
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : active
                      ? "border-[#f5b544] bg-[#fff8eb] text-[#0b1220]"
                      : "border-gray-200 bg-white text-gray-500"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  {channel === "email" ? (
                    <Mail className="h-3.5 w-3.5" />
                  ) : (
                    <Phone className="h-3.5 w-3.5" />
                  )}
                  {channel === "email" ? "Email" : "Phone"}
                </span>
                <span className="mt-1 block font-medium text-[11px]">
                  {done ? "Verified" : active ? "In progress" : "Required"}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {formError ? (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
          <span>{formError}</span>
        </div>
      ) : null}

      {infoMessage ? (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          <span>{infoMessage}</span>
        </div>
      ) : null}

      {destinationReady ? (
        <form className="space-y-4" onSubmit={handleVerify} noValidate>
          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-center">
            <p className="text-xs text-gray-600">Enter the 6-digit code sent to</p>
            <p className="mt-0.5 text-xs font-semibold text-[#0b1220] truncate">
              {destination}
            </p>
          </div>

          <OtpCodeInputs
            value={otpDigits}
            onChange={(digits) => {
              setOtpDigits(digits);
              setFormError(null);
            }}
            disabled={loading}
          />

          <div className="text-xs text-gray-500">
            {countdown > 0 ? (
              <span>
                Resend code in <strong className="text-gray-800">{countdown}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => void requestCode()}
                disabled={loading}
                className="font-semibold text-[#c58a16] hover:text-[#a9720e]"
              >
                Resend code
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || otpDigits.join("").length !== 6}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0b1220] px-5 text-sm font-semibold text-white shadow-md shadow-[#0b1220]/10 transition hover:bg-[#16233a] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {verifyOtpMutation.isPending ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : pending.length > 1 ? (
              "Verify and continue"
            ) : (
              "Verify and sign in"
            )}
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500">
          We couldn&apos;t find the {activeChannel} saved on this account.{" "}
          <Link href="/login" className="font-semibold text-[#c58a16] hover:text-[#a9720e]">
            Back to sign in
          </Link>
        </p>
      )}

      <p className="mt-6 text-center text-xs text-gray-500 sm:text-sm">
        Need to start over?{" "}
        <Link href="/login" className="font-semibold text-[#c58a16] hover:text-[#a9720e]">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
