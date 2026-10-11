import { NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  sessionCookieOptions,
} from "@/src/lib/authSession";

function getUpstreamApiUrl() {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000/api"
  );
}

type ProxyAuthOptions = {
  setAccessTokenCookie?: boolean;
};

export async function proxyAuthRequest(
  request: Request,
  path: string,
  options: ProxyAuthOptions = {},
) {
  const incomingCookies = request.headers.get("cookie");
  const body = await request.text();
  const upstreamUrl = getUpstreamApiUrl();

  let upstream: Response;
  try {
    upstream = await fetch(`${upstreamUrl}${path}`, {
      method: request.method,
      headers: {
        "Content-Type": request.headers.get("content-type") ?? "application/json",
        ...(incomingCookies ? { Cookie: incomingCookies } : {}),
      },
      body: body || undefined,
      cache: "no-store",
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: `Failed to connect to backend API server at ${upstreamUrl}. Please check that your API server is running.`,
      },
      { status: 503 }
    );
  }

  const payload = await upstream.json().catch(() => null);
  const response = NextResponse.json(payload, { status: upstream.status });

  const setCookies =
    typeof upstream.headers.getSetCookie === "function"
      ? upstream.headers.getSetCookie()
      : [];

  for (const cookie of setCookies) {
    const [pair] = cookie.split(";");
    const separator = pair.indexOf("=");
    if (separator === -1) continue;

    const name = pair.slice(0, separator).trim();
    const value = pair.slice(separator + 1).trim();

    if (name === REFRESH_TOKEN_COOKIE) {
      response.cookies.set(name, value, {
        ...sessionCookieOptions,
        maxAge: 60 * 60 * 24 * 7,
      });
    }
  }

  if (
    options.setAccessTokenCookie &&
    payload &&
    typeof payload === "object" &&
    "accessToken" in payload &&
    typeof payload.accessToken === "string"
  ) {
    response.cookies.set(ACCESS_TOKEN_COOKIE, payload.accessToken, {
      ...sessionCookieOptions,
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  if (
    options.setAccessTokenCookie &&
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data &&
    typeof payload.data === "object" &&
    "accessToken" in payload.data &&
    typeof payload.data.accessToken === "string"
  ) {
    response.cookies.set(ACCESS_TOKEN_COOKIE, payload.data.accessToken, {
      ...sessionCookieOptions,
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return response;
}
