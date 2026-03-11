import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/user-store";

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return null;
  return getUserFromToken(token);
}
