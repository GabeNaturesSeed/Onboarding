import { NextRequest, NextResponse } from "next/server";
import { clearGoogleAuth, clearKlaviyoAuth } from "@/lib/auth-store";

export async function POST(request: NextRequest) {
  const { platform } = await request.json();

  if (platform === "google") {
    clearGoogleAuth();
  } else if (platform === "klaviyo") {
    clearKlaviyoAuth();
  }

  return NextResponse.json({ success: true });
}
