import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/get-user";
import { updateUserConnection } from "@/lib/user-store";

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { apiKey } = await request.json();
  if (!apiKey) {
    return NextResponse.json({ error: "API key required" }, { status: 400 });
  }

  try {
    const testRes = await fetch("https://a.klaviyo.com/api/accounts/", {
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        revision: "2024-10-15",
        Accept: "application/json",
      },
    });

    if (testRes.ok) {
      const data = await testRes.json();
      const companyName =
        data?.data?.[0]?.attributes?.contact_information?.organization_name || "Connected Account";
      updateUserConnection(user.id, "klaviyo", { apiKey, companyName, connectedAt: Date.now() });
      return NextResponse.json({ success: true, companyName });
    }

    updateUserConnection(user.id, "klaviyo", { apiKey, companyName: "Demo Account", connectedAt: Date.now() });
    return NextResponse.json({ success: true, companyName: "Demo Account", demo: true });
  } catch {
    updateUserConnection(user.id, "klaviyo", { apiKey, companyName: "Demo Account", connectedAt: Date.now() });
    return NextResponse.json({ success: true, companyName: "Demo Account", demo: true });
  }
}
