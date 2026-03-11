import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/get-user";
import { getConnectionStatus } from "@/lib/user-store";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json(getConnectionStatus(user.id));
}
