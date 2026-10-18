import { proxyAuthRequest } from "@/src/lib/authProxy";

export async function POST(request: Request) {
  return proxyAuthRequest(request, "/auth/verify-otp", {
    setAccessTokenCookie: true,
  });
}
