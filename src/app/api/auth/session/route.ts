import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken, getConnectionStatus } from "@/lib/user-store";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("session_token")?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = getUserFromToken(token);
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const connections = getConnectionStatus(user.id);

  return NextResponse.json({
    authenticated: true,
    user: { id: user.id, email: user.email, name: user.name },
    connections,
  });
}
