import { NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  sessionCookieOptions,
} from "@/src/lib/authSession";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });

  response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
    ...sessionCookieOptions,
    maxAge: 0,
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE, "", {
    ...sessionCookieOptions,
    maxAge: 0,
  });

  return response;
}
