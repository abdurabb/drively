"use client";

import { useRouter } from "next/navigation";
import { sendOtp } from "@/src/lib/auth";
import {
  buildVerifyOtpPath,
  savePendingVerification,
} from "@/src/lib/otp";
import {
  LoginOptions,
  type RequestOtpPayload,
} from "./LoginOptions";

interface LoginOptionsContainerProps {
  showSocial?: boolean;
}

export function LoginOptionsContainer({ showSocial = false }: LoginOptionsContainerProps) {
  const router = useRouter();

  async function handleRequestOtp(payload: RequestOtpPayload) {
    await sendOtp(payload);

    const next = {
      email: payload.otpType === "email" ? payload.email : undefined,
      phone: payload.otpType === "phone" ? payload.phone : undefined,
      pending: [payload.otpType],
      flow: "login" as const,
    };

    savePendingVerification(next);
    router.push(buildVerifyOtpPath(next));
  }

  return (
    <LoginOptions
      showSocial={showSocial}
      onRequestOtp={handleRequestOtp}
    />
  );
}
