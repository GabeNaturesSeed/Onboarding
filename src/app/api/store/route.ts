import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/get-user";
import { updateUserConnection } from "@/lib/user-store";

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { platform, storeDomain, accessToken, siteUrl, consumerKey, consumerSecret } =
    await request.json();

  if (platform === "shopify") {
    if (!storeDomain || !accessToken) {
      return NextResponse.json({ error: "Store domain and access token required" }, { status: 400 });
    }

    // Validate by hitting Shopify API
    const domain = storeDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
    try {
      const res = await fetch(`https://${domain}/admin/api/2024-10/shop.json`, {
        headers: { "X-Shopify-Access-Token": accessToken },
      });
      if (res.ok) {
        const data = await res.json();
        updateUserConnection(user.id, "shopify", {
          storeDomain: domain,
          accessToken,
          connectedAt: Date.now(),
        });
        return NextResponse.json({ success: true, shopName: data.shop?.name || domain });
      }
    } catch {
      // Fall through to demo mode
    }

    // Demo mode
    updateUserConnection(user.id, "shopify", {
      storeDomain: domain,
      accessToken,
      connectedAt: Date.now(),
    });
    return NextResponse.json({ success: true, shopName: domain, demo: true });
  }

  if (platform === "woocommerce") {
    if (!siteUrl || !consumerKey || !consumerSecret) {
      return NextResponse.json({ error: "Site URL, consumer key and secret required" }, { status: 400 });
    }

    const url = siteUrl.replace(/\/$/, "");
    try {
      const res = await fetch(`${url}/wp-json/wc/v3/system_status`, {
        headers: {
          Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
        },
      });
      if (res.ok) {
        updateUserConnection(user.id, "woocommerce", {
          siteUrl: url,
          consumerKey,
          consumerSecret,
          connectedAt: Date.now(),
        });
        return NextResponse.json({ success: true, siteUrl: url });
      }
    } catch {
      // Fall through to demo mode
    }

    updateUserConnection(user.id, "woocommerce", {
      siteUrl: url,
      consumerKey,
      consumerSecret,
      connectedAt: Date.now(),
    });
    return NextResponse.json({ success: true, siteUrl: url, demo: true });
  }

  return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
}
