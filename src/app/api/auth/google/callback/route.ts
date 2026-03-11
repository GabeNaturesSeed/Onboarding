import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/get-user";
import { updateUserConnection } from "@/lib/user-store";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const demo = searchParams.get("demo");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.redirect(`${baseUrl}/auth/login`);
  }

  if (demo) {
    updateUserConnection(user.id, "google", {
      accessToken: "demo_access_token",
      refreshToken: "demo_refresh_token",
      expiresAt: Date.now() + 3600 * 1000,
      email: "you@gmail.com",
      scopes: ["analytics.readonly", "adwords", "webmasters.readonly", "userinfo.email"],
    });
    return NextResponse.redirect(`${baseUrl}/connections?google=connected`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/connections?error=no_code`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${baseUrl}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokenRes.ok) {
      return NextResponse.redirect(`${baseUrl}/connections?error=token_exchange`);
    }

    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const googleUser = await userRes.json();

    updateUserConnection(user.id, "google", {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
      email: googleUser.email,
      scopes: (tokens.scope || "").split(" "),
    });

    return NextResponse.redirect(`${baseUrl}/connections?google=connected`);
  } catch {
    return NextResponse.redirect(`${baseUrl}/connections?error=google_auth_failed`);
  }
}
