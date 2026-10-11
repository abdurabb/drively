"use client";

import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/src/lib/auth";
import type { RegisterInput } from "@/src/types/auth";

export function useRegister() {
  return useMutation({
    mutationKey: ["auth", "register"],
    mutationFn: (input: RegisterInput) => registerUser(input),
  });
}
