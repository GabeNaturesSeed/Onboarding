import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/user-store";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("session_token")?.value;
  if (token) {
    deleteSession(token);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete("session_token");
  return response;
}
