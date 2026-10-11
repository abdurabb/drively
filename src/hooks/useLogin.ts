"use client";

import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/src/lib/auth";
import type { LoginInput, LoginResponse } from "@/src/types/auth";

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginInput>({
    mutationKey: ["auth", "login"],
    mutationFn: (input: LoginInput) => loginUser(input),
  });
}
