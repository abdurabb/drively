import { createApiError } from "@/src/lib/apiError";
import {
  getAccessTokenFromCookies,
  getServerCookieHeader,
} from "@/src/lib/authSession";

const DEFAULT_API_URL = "http://localhost:4000/api";

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
  retryOnAuthError?: boolean;
  accessToken?: string;
};

function getApiBaseUrl(path: string) {
  if (typeof window !== "undefined") {
    if (path.startsWith("/auth")) {
      return "/api";
    }
    return process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
  }

  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    DEFAULT_API_URL
  );
}

async function parseBody(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function buildHeaders(init: ApiFetchOptions, auth: boolean) {
  const headers = new Headers(init.headers);

  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (typeof window === "undefined") {
    const cookieHeader = await getServerCookieHeader();

    if (cookieHeader && !headers.has("Cookie")) {
      headers.set("Cookie", cookieHeader);
    }
  }

  if (auth && !headers.has("Authorization")) {
    let accessToken = init.accessToken;

    if (!accessToken) {
      if (typeof window !== "undefined") {
        try {
          const { store } = await import("@/src/redux/store");
          accessToken = store.getState().auth.accessToken ?? undefined;
        } catch {
          // ignore
        }
      } else {
        accessToken = await getAccessTokenFromCookies();
      }
    }

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  return headers;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}) {
  const { auth = true, retryOnAuthError = true, body, ...init } = options;
  const headers = await buildHeaders(options, auth);

  const response = await fetch(`${getApiBaseUrl(path)}${path}`, {
    ...init,
    headers,
    credentials: "include",
    cache: init.cache ?? "no-store",
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 401 && auth && retryOnAuthError) {
    try {
      const { refreshAccessToken } = await import("@/src/lib/auth");
      const refreshed = await refreshAccessToken();

      return apiFetch<T>(path, {
        ...options,
        accessToken: refreshed.accessToken,
        retryOnAuthError: false,
      });
    } catch {
      throw createApiError(
        401,
        await parseBody(response),
        "Session expired. Please sign in again.",
      );
    }
  }

  const payload = await parseBody(response);

  if (!response.ok) {
    throw createApiError(response.status, payload);
  }

  return payload as T;
}
