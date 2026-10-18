"use client";

import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "@/src/lib/auth";
import type { VerifyOtpInput, VerifyOtpResponse } from "@/src/types/auth";

export function useVerifyOtp() {
  return useMutation<VerifyOtpResponse, Error, VerifyOtpInput>({
    mutationKey: ["auth", "verify-otp"],
    mutationFn: (input) => verifyOtp(input),
  });
}
