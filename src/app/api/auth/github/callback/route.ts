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
    updateUserConnection(user.id, "github", {
      accessToken: "demo_github_token",
      username: "demo-user",
      avatarUrl: "",
      connectedAt: Date.now(),
    });
    return NextResponse.redirect(`${baseUrl}/vibe-coder?github=connected`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/vibe-coder?error=no_code`);
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokens.access_token) {
      return NextResponse.redirect(`${baseUrl}/vibe-coder?error=token_exchange`);
    }

    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const ghUser = await userRes.json();

    updateUserConnection(user.id, "github", {
      accessToken: tokens.access_token,
      username: ghUser.login,
      avatarUrl: ghUser.avatar_url || "",
      connectedAt: Date.now(),
    });

    return NextResponse.redirect(`${baseUrl}/vibe-coder?github=connected`);
  } catch {
    return NextResponse.redirect(`${baseUrl}/vibe-coder?error=github_auth_failed`);
  }
}
