import { apiFetch } from "@/src/lib/api";
import type {
  LoginInput,
  LoginResponse,
  RefreshResponse,
  RegisterInput,
  RegisterResponse,
} from "@/src/types/auth";

export function registerUser(input: RegisterInput) {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: input,
    auth: false,
    retryOnAuthError: false,
  });
}

export function loginUser(input: LoginInput) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: input,
    auth: false,
    retryOnAuthError: false,
  });
}

export function logoutUser() {
  return apiFetch<{ success: true; message: string }>("/auth/logout", {
    method: "POST",
    auth: false,
    retryOnAuthError: false,
  });
}

export function refreshAccessToken() {
  return apiFetch<RefreshResponse>("/auth/refresh-token", {
    method: "POST",
    auth: false,
    retryOnAuthError: false,
  });
}

