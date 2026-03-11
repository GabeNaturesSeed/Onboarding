import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/get-user";
import { merchantProducts, feedSummary } from "@/lib/mock-merchant-center";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({
    products: merchantProducts,
    summary: feedSummary,
  });
}
