import { NextResponse } from "next/server";

// Google OAuth 2.0 authorization endpoint
// In production, set these in .env.local:
//   GOOGLE_CLIENT_ID=your-client-id
//   GOOGLE_CLIENT_SECRET=your-client-secret
//   NEXT_PUBLIC_BASE_URL=http://localhost:3000

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",        // GA4
  "https://www.googleapis.com/auth/adwords",                    // Google Ads
  "https://www.googleapis.com/auth/webmasters.readonly",        // Search Console
  "https://www.googleapis.com/auth/userinfo.email",             // Email
  "https://www.googleapis.com/auth/userinfo.profile",           // Profile
].join(" ");

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (!clientId) {
    // Demo mode: simulate the OAuth redirect
    const demoCallbackUrl = `${baseUrl}/api/auth/google/callback?demo=true`;
    return NextResponse.redirect(demoCallbackUrl);
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${baseUrl}/api/auth/google/callback`,
    response_type: "code",
    scope: SCOPES,
    access_type: "offline",
    prompt: "consent",
    state: crypto.randomUUID(),
  });

  return NextResponse.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
}
