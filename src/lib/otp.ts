export type OtpType = "email" | "phone";
export type VerificationFlow = "account" | "login";

export const PENDING_VERIFY_KEY = "drively.pendingVerification";

export type PendingVerification = {
  email?: string;
  phone?: string;
  pending: OtpType[];
  flow?: VerificationFlow;
};

export function normalizePhone(phone: string) {
  return phone.replace(/[\s()-]/g, "");
}

export function isValidPhone(phone: string) {
  return /^\+?[1-9]\d{7,14}$/.test(normalizePhone(phone));
}

export function savePendingVerification(data: PendingVerification) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(PENDING_VERIFY_KEY, JSON.stringify(data));
}

export function loadPendingVerification(): PendingVerification | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = sessionStorage.getItem(PENDING_VERIFY_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as PendingVerification;
    if (!parsed || !Array.isArray(parsed.pending)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingVerification() {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(PENDING_VERIFY_KEY);
}

export function buildVerifyOtpPath(data: PendingVerification) {
  const params = new URLSearchParams();

  if (data.email) {
    params.set("email", data.email);
  }

  if (data.phone) {
    params.set("phone", data.phone);
  }

  if (data.pending.length === 2) {
    params.set("pending", "both");
  } else if (data.pending[0]) {
    params.set("pending", data.pending[0]);
  }

  if (data.flow === "login") {
    params.set("flow", "login");
  }

  const query = params.toString();
  return query ? `/verify-otp?${query}` : "/verify-otp";
}

export function parseFlowParam(value?: string | null): VerificationFlow {
  return value === "login" ? "login" : "account";
}

export function pendingChannelsFromFlags(
  flags: { isEmailVerified?: boolean; isPhoneVerified?: boolean },
  fallback: OtpType,
): OtpType[] {
  const pending: OtpType[] = [];

  if (flags.isEmailVerified === false) {
    pending.push("email");
  }

  if (flags.isPhoneVerified === false) {
    pending.push("phone");
  }

  return pending.length ? pending : [fallback];
}

export function unverifiedChannelFromMessage(message: string): OtpType | null {
  const normalized = message.toLowerCase();

  if (normalized.includes("email not verified")) {
    return "email";
  }

  if (normalized.includes("phone not verified")) {
    return "phone";
  }

  return null;
}

export function parsePendingParam(value?: string | null): OtpType[] {
  if (value === "both") {
    return ["email", "phone"];
  }

  if (value === "email" || value === "phone") {
    return [value];
  }

  return ["email", "phone"];
}
