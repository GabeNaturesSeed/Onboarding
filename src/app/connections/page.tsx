"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface AuthStatus {
  google: { connected: boolean; email?: string; scopes?: string[] };
  klaviyo: { connected: boolean; companyName?: string };
  shopify: { connected: boolean; storeDomain?: string };
  woocommerce: { connected: boolean; siteUrl?: string };
  github: { connected: boolean; username?: string; avatarUrl?: string };
}

export default function ConnectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f172a]" />}>
      <ConnectionsContent />
    </Suspense>
  );
}

function ConnectionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Form states
  const [klaviyoKey, setKlaviyoKey] = useState("");
  const [klaviyoLoading, setKlaviyoLoading] = useState(false);
  const [shopifyDomain, setShopifyDomain] = useState("");
  const [shopifyToken, setShopifyToken] = useState("");
  const [shopifyLoading, setShopifyLoading] = useState(false);
  const [wooUrl, setWooUrl] = useState("");
  const [wooKey, setWooKey] = useState("");
  const [wooSecret, setWooSecret] = useState("");
  const [wooLoading, setWooLoading] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const fetchStatus = useCallback(async () => {
    const res = await fetch("/api/auth/status");
    if (res.status === 401) {
      router.push("/auth/login");
      return;
    }
    const data = await res.json();
    setAuthStatus(data);
  }, [router]);

  useEffect(() => {
    fetchStatus();
    const googleStatus = searchParams.get("google");
    const error = searchParams.get("error");
    if (googleStatus === "connected") showToast("Google account connected!");
    if (error) showToast(`Connection error: ${error}`);
  }, [searchParams, fetchStatus]);

  const connectKlaviyo = async () => {
    if (!klaviyoKey.trim()) return;
    setKlaviyoLoading(true);
    try {
      const res = await fetch("/api/auth/klaviyo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: klaviyoKey }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Klaviyo connected: ${data.companyName}${data.demo ? " (demo)" : ""}`);
        setKlaviyoKey("");
        fetchStatus();
      }
    } catch {
      showToast("Failed to connect Klaviyo");
    }
    setKlaviyoLoading(false);
  };

  const connectShopify = async () => {
    if (!shopifyDomain.trim() || !shopifyToken.trim()) return;
    setShopifyLoading(true);
    try {
      const res = await fetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: "shopify", storeDomain: shopifyDomain, accessToken: shopifyToken }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Shopify connected: ${data.shopName}${data.demo ? " (demo)" : ""}`);
        setShopifyDomain("");
        setShopifyToken("");
        fetchStatus();
      }
    } catch {
      showToast("Failed to connect Shopify");
    }
    setShopifyLoading(false);
  };

  const connectWoo = async () => {
    if (!wooUrl.trim() || !wooKey.trim() || !wooSecret.trim()) return;
    setWooLoading(true);
    try {
      const res = await fetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: "woocommerce", siteUrl: wooUrl, consumerKey: wooKey, consumerSecret: wooSecret }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`WooCommerce connected: ${data.siteUrl}${data.demo ? " (demo)" : ""}`);
        setWooUrl("");
        setWooKey("");
        setWooSecret("");
        fetchStatus();
      }
    } catch {
      showToast("Failed to connect WooCommerce");
    }
    setWooLoading(false);
  };

  const disconnect = async (platform: string) => {
    await fetch("/api/auth/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform }),
    });
    showToast(`${platform} disconnected`);
    fetchStatus();
  };

  const googleScopes = [
    { scope: "analytics.readonly", label: "Google Analytics (GA4)", desc: "Sessions, traffic, conversions" },
    { scope: "adwords", label: "Google Ads", desc: "Campaigns, ad spend, ROAS" },
    { scope: "webmasters.readonly", label: "Search Console", desc: "Rankings, impressions, CTR" },
  ];

  const connectedCount = authStatus
    ? [authStatus.google, authStatus.klaviyo, authStatus.shopify, authStatus.woocommerce, authStatus.github].filter((p) => p.connected).length
    : 0;

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1e293b] border border-[#334155] rounded-xl px-5 py-3 shadow-xl">
          <p className="text-sm text-white">{toast}</p>
        </div>
      )}

      <header className="border-b border-[#334155] bg-[#1e293b]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#94a3b8] hover:text-white text-sm transition-colors">&larr; Dashboard</Link>
            <div className="h-5 w-px bg-[#334155]" />
            <h1 className="text-lg font-bold text-white">My Connections</h1>
            <span className="text-xs text-[#64748b]">{connectedCount}/5 connected</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/vibe-coder" className="px-3 py-1.5 text-sm text-[#94a3b8] hover:text-white border border-[#334155] rounded-lg transition-colors">
              Vibe Coder
            </Link>
            <Link href="/report" className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-[#2563eb] transition-colors">
              Overall Report
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <p className="text-[#94a3b8]">
          Connect your platforms to pull data and manage your store. All credentials are stored securely per account.
        </p>

        {/* Step 1: Data Platforms */}
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider">Step 1 — Data Platforms</h2>
          <p className="text-xs text-[#475569]">Approve data access from Google and Klaviyo</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Google */}
          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#4285f4]/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Google</h3>
                  <p className="text-xs text-[#94a3b8]">Analytics, Ads, Search Console</p>
                </div>
              </div>
              {authStatus?.google.connected ? (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#10b981]/20 text-[#10b981] rounded-full text-xs font-medium">Connected</span>
                  <button onClick={() => disconnect("google")} className="text-xs text-[#ef4444] hover:bg-[#ef4444]/10 px-2 py-1 rounded">Disconnect</button>
                </div>
              ) : (
                <a href="/api/auth/google" className="px-4 py-2 bg-white text-[#1f2937] rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors">
                  Sign in with Google
                </a>
              )}
            </div>
            {authStatus?.google.connected && (
              <div className="bg-[#0f172a] rounded-lg p-3">
                <p className="text-xs text-[#94a3b8] mb-2">Signed in as <span className="text-[#3b82f6]">{authStatus.google.email}</span></p>
                <div className="space-y-1">
                  {googleScopes.map((s) => {
                    const has = authStatus.google.scopes?.some((sc) => sc.includes(s.scope));
                    return (
                      <div key={s.scope} className="flex items-center justify-between text-xs">
                        <span className="text-[#e2e8f0]">{s.label}</span>
                        <span className={has ? "text-[#10b981]" : "text-[#64748b]"}>{has ? "Authorized" : "N/A"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Klaviyo */}
          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#24ce7b]/20 flex items-center justify-center text-lg">K</div>
                <div>
                  <h3 className="font-semibold text-white">Klaviyo</h3>
                  <p className="text-xs text-[#94a3b8]">Email/SMS, flows, campaigns</p>
                </div>
              </div>
              {authStatus?.klaviyo.connected && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#10b981]/20 text-[#10b981] rounded-full text-xs font-medium">Connected</span>
                  <button onClick={() => disconnect("klaviyo")} className="text-xs text-[#ef4444] hover:bg-[#ef4444]/10 px-2 py-1 rounded">Disconnect</button>
                </div>
              )}
            </div>
            {authStatus?.klaviyo.connected ? (
              <div className="bg-[#0f172a] rounded-lg p-3">
                <p className="text-xs text-[#94a3b8]">Connected to <span className="text-[#24ce7b]">{authStatus.klaviyo.companyName}</span></p>
                <div className="space-y-1 mt-2">
                  {["Subscribers & Lists", "Flows & Automations", "Campaigns & Revenue"].map((item) => (
                    <div key={item} className="flex items-center justify-between text-xs">
                      <span className="text-[#e2e8f0]">{item}</span>
                      <span className="text-[#10b981]">Authorized</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="password"
                  value={klaviyoKey}
                  onChange={(e) => setKlaviyoKey(e.target.value)}
                  placeholder="pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#24ce7b] font-mono"
                />
                <button
                  onClick={connectKlaviyo}
                  disabled={klaviyoLoading || !klaviyoKey.trim()}
                  className="w-full py-2 bg-[#24ce7b] text-white rounded-lg text-xs font-medium hover:bg-[#1fb968] disabled:opacity-40"
                >
                  {klaviyoLoading ? "Connecting..." : "Connect Klaviyo"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Store API */}
        <div className="space-y-1 pt-4">
          <h2 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider">Step 2 — Store Connection</h2>
          <p className="text-xs text-[#475569]">Connect your Shopify or WooCommerce store API</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Shopify */}
          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#96bf48]/20 flex items-center justify-center text-lg font-bold text-[#96bf48]">S</div>
                <div>
                  <h3 className="font-semibold text-white">Shopify</h3>
                  <p className="text-xs text-[#94a3b8]">Admin API access token</p>
                </div>
              </div>
              {authStatus?.shopify?.connected && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#10b981]/20 text-[#10b981] rounded-full text-xs font-medium">Connected</span>
                  <button onClick={() => disconnect("shopify")} className="text-xs text-[#ef4444] hover:bg-[#ef4444]/10 px-2 py-1 rounded">Disconnect</button>
                </div>
              )}
            </div>
            {authStatus?.shopify?.connected ? (
              <div className="bg-[#0f172a] rounded-lg p-3">
                <p className="text-xs text-[#94a3b8]">Store: <span className="text-[#96bf48]">{authStatus.shopify.storeDomain}</span></p>
                <div className="space-y-1 mt-2">
                  {["Orders & Products", "Customers & Analytics", "Theme Files"].map((item) => (
                    <div key={item} className="flex items-center justify-between text-xs">
                      <span className="text-[#e2e8f0]">{item}</span>
                      <span className="text-[#10b981]">Available</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={shopifyDomain}
                  onChange={(e) => setShopifyDomain(e.target.value)}
                  placeholder="your-store.myshopify.com"
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#96bf48] font-mono"
                />
                <input
                  type="password"
                  value={shopifyToken}
                  onChange={(e) => setShopifyToken(e.target.value)}
                  placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#96bf48] font-mono"
                />
                <button
                  onClick={connectShopify}
                  disabled={shopifyLoading || !shopifyDomain.trim() || !shopifyToken.trim()}
                  className="w-full py-2 bg-[#96bf48] text-white rounded-lg text-xs font-medium hover:bg-[#88b03a] disabled:opacity-40"
                >
                  {shopifyLoading ? "Connecting..." : "Connect Shopify"}
                </button>
              </div>
            )}
          </div>

          {/* WooCommerce */}
          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#7f54b3]/20 flex items-center justify-center text-lg font-bold text-[#7f54b3]">W</div>
                <div>
                  <h3 className="font-semibold text-white">WooCommerce</h3>
                  <p className="text-xs text-[#94a3b8]">REST API consumer keys</p>
                </div>
              </div>
              {authStatus?.woocommerce?.connected && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#10b981]/20 text-[#10b981] rounded-full text-xs font-medium">Connected</span>
                  <button onClick={() => disconnect("woocommerce")} className="text-xs text-[#ef4444] hover:bg-[#ef4444]/10 px-2 py-1 rounded">Disconnect</button>
                </div>
              )}
            </div>
            {authStatus?.woocommerce?.connected ? (
              <div className="bg-[#0f172a] rounded-lg p-3">
                <p className="text-xs text-[#94a3b8]">Site: <span className="text-[#7f54b3]">{authStatus.woocommerce.siteUrl}</span></p>
                <div className="space-y-1 mt-2">
                  {["Orders & Products", "Customers & Coupons", "Reports & Settings"].map((item) => (
                    <div key={item} className="flex items-center justify-between text-xs">
                      <span className="text-[#e2e8f0]">{item}</span>
                      <span className="text-[#10b981]">Available</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={wooUrl}
                  onChange={(e) => setWooUrl(e.target.value)}
                  placeholder="https://yourstore.com"
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#7f54b3] font-mono"
                />
                <input
                  type="text"
                  value={wooKey}
                  onChange={(e) => setWooKey(e.target.value)}
                  placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#7f54b3] font-mono"
                />
                <input
                  type="password"
                  value={wooSecret}
                  onChange={(e) => setWooSecret(e.target.value)}
                  placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#7f54b3] font-mono"
                />
                <button
                  onClick={connectWoo}
                  disabled={wooLoading || !wooUrl.trim() || !wooKey.trim() || !wooSecret.trim()}
                  className="w-full py-2 bg-[#7f54b3] text-white rounded-lg text-xs font-medium hover:bg-[#6f46a3] disabled:opacity-40"
                >
                  {wooLoading ? "Connecting..." : "Connect WooCommerce"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Vibe Coder */}
        <div className="space-y-1 pt-4">
          <h2 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider">Step 3 — Vibe Coder</h2>
          <p className="text-xs text-[#475569]">Connect GitHub and download your theme for local development</p>
        </div>

        <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#f0f6fc]/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">GitHub + Local Vibe Coder</h3>
                <p className="text-xs text-[#94a3b8]">Create a repo from your theme and download it for local coding</p>
              </div>
            </div>
            {authStatus?.github?.connected ? (
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#10b981]/20 text-[#10b981] rounded-full text-xs font-medium">@{authStatus.github.username}</span>
                <button onClick={() => disconnect("github")} className="text-xs text-[#ef4444] hover:bg-[#ef4444]/10 px-2 py-1 rounded">Disconnect</button>
              </div>
            ) : (
              <a href="/api/auth/github" className="px-4 py-2 bg-[#f0f6fc] text-[#1f2937] rounded-lg text-xs font-medium hover:bg-white transition-colors">
                Connect GitHub
              </a>
            )}
          </div>
          {(authStatus?.shopify?.connected || authStatus?.woocommerce?.connected) && authStatus?.github?.connected && (
            <div className="mt-4 bg-[#0f172a] rounded-lg p-4">
              <p className="text-sm text-white mb-2">Ready to vibe code your theme!</p>
              <Link
                href="/vibe-coder"
                className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Launch Vibe Coder &rarr;
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
