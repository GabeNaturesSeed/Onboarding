import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/get-user";
import { removeUserConnection } from "@/lib/user-store";

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { platform } = await request.json();
  const validPlatforms = ["google", "klaviyo", "shopify", "woocommerce", "github"];

  if (validPlatforms.includes(platform)) {
    removeUserConnection(user.id, platform as "google" | "klaviyo" | "shopify" | "woocommerce" | "github");
  }

  return NextResponse.json({ success: true });
}
