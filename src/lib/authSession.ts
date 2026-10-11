export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export async function getServerCookieHeader() {
  if (typeof window !== "undefined") {
    return undefined;
  }

  const { cookies } = await import("next/headers");
  const store = await cookies();
  const serialized = store.toString();
  return serialized || undefined;
}

export async function getAccessTokenFromCookies() {
  if (typeof window !== "undefined") {
    return undefined;
  }

  const { cookies } = await import("next/headers");
  const store = await cookies();
  return store.get(ACCESS_TOKEN_COOKIE)?.value;
}
