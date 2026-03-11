import { NextRequest, NextResponse } from "next/server";
import { setKlaviyoAuth } from "@/lib/auth-store";

// Klaviyo uses API key authentication (private key)
// In production you'd use Klaviyo's OAuth flow for partner apps,
// but most direct integrations use the private API key

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { apiKey } = body;

  if (!apiKey) {
    return NextResponse.json({ error: "API key required" }, { status: 400 });
  }

  // Validate the API key by making a test request to Klaviyo
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
        data?.data?.[0]?.attributes?.contact_information?.organization_name ||
        "Connected Account";

      setKlaviyoAuth({
        apiKey,
        companyName,
        connectedAt: Date.now(),
      });

      return NextResponse.json({
        success: true,
        companyName,
      });
    }

    // If we can't reach Klaviyo (no real key), store in demo mode
    setKlaviyoAuth({
      apiKey,
      companyName: "Demo Account",
      connectedAt: Date.now(),
    });

    return NextResponse.json({
      success: true,
      companyName: "Demo Account",
      demo: true,
    });
  } catch {
    // Network error — store anyway for demo purposes
    setKlaviyoAuth({
      apiKey,
      companyName: "Demo Account",
      connectedAt: Date.now(),
    });

    return NextResponse.json({
      success: true,
      companyName: "Demo Account",
      demo: true,
    });
  }
}
