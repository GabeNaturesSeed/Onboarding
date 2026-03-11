import { NextRequest, NextResponse } from "next/server";
import { setGoogleAuth } from "@/lib/auth-store";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const demo = searchParams.get("demo");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (demo) {
    // Demo mode: simulate a successful OAuth with mock data
    setGoogleAuth({
      accessToken: "demo_access_token",
      refreshToken: "demo_refresh_token",
      expiresAt: Date.now() + 3600 * 1000,
      email: "you@gmail.com",
      scopes: [
        "analytics.readonly",
        "adwords",
        "webmasters.readonly",
        "userinfo.email",
      ],
    });
    return NextResponse.redirect(`${baseUrl}/connections?google=connected`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/connections?error=no_code`);
  }

  // Exchange the authorization code for tokens
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

    // Get user info
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const user = await userRes.json();

    setGoogleAuth({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
      email: user.email,
      scopes: (tokens.scope || "").split(" "),
    });

    return NextResponse.redirect(`${baseUrl}/connections?google=connected`);
  } catch {
    return NextResponse.redirect(`${baseUrl}/connections?error=google_auth_failed`);
  }
}
