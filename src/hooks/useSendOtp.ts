"use client";

import { useMutation } from "@tanstack/react-query";
import { sendOtp } from "@/src/lib/auth";
import type { SendOtpInput, SendOtpResponse } from "@/src/types/auth";

export function useSendOtp() {
  return useMutation<SendOtpResponse, Error, SendOtpInput>({
    mutationKey: ["auth", "send-otp"],
    mutationFn: (input) => sendOtp(input),
  });
}
