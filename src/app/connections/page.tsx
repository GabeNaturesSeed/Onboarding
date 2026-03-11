"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface AuthStatus {
  google: { connected: boolean; email?: string; scopes?: string[] };
  klaviyo: { connected: boolean; companyName?: string };
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
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [klaviyoKey, setKlaviyoKey] = useState("");
  const [klaviyoLoading, setKlaviyoLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    const res = await fetch("/api/auth/status");
    const data = await res.json();
    setAuthStatus(data);
  }, []);

  useEffect(() => {
    fetchStatus();
    // Check for OAuth callback params
    const googleStatus = searchParams.get("google");
    const error = searchParams.get("error");
    if (googleStatus === "connected") {
      setToast("Google account connected successfully!");
      setTimeout(() => setToast(null), 4000);
    }
    if (error) {
      setToast(`Connection error: ${error}`);
      setTimeout(() => setToast(null), 4000);
    }
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
        setToast(`Klaviyo connected: ${data.companyName}${data.demo ? " (demo mode)" : ""}`);
        setTimeout(() => setToast(null), 4000);
        setKlaviyoKey("");
        fetchStatus();
      }
    } catch {
      setToast("Failed to connect Klaviyo");
      setTimeout(() => setToast(null), 4000);
    }
    setKlaviyoLoading(false);
  };

  const disconnect = async (platform: string) => {
    await fetch("/api/auth/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform }),
    });
    setToast(`${platform} disconnected`);
    setTimeout(() => setToast(null), 4000);
    fetchStatus();
  };

  const googleScopes = [
    { scope: "analytics.readonly", label: "Google Analytics (GA4)", icon: "📊", desc: "Sessions, traffic sources, conversions, user behavior" },
    { scope: "adwords", label: "Google Ads", icon: "📢", desc: "Campaigns, ad spend, ROAS, keyword performance" },
    { scope: "webmasters.readonly", label: "Search Console", icon: "🔍", desc: "Organic search rankings, impressions, CTR, index status" },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1e293b] border border-[#334155] rounded-xl px-5 py-3 shadow-xl">
          <p className="text-sm text-white">{toast}</p>
        </div>
      )}

      <header className="border-b border-[#334155] bg-[#1e293b]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#94a3b8] hover:text-white text-sm transition-colors">&larr; All Sites</Link>
            <div className="h-5 w-px bg-[#334155]" />
            <h1 className="text-lg font-bold text-white">Platform Connections</h1>
          </div>
          <Link href="/report" className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-[#2563eb] transition-colors">
            View Overall Report
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <p className="text-[#94a3b8]">
          Connect your Google and Klaviyo accounts once — all client environments will use these credentials to sync data.
        </p>

        {/* Google OAuth */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#4285f4]/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Google Account</h2>
                  <p className="text-sm text-[#94a3b8]">Analytics, Ads, and Search Console access</p>
                </div>
              </div>
              {authStatus?.google.connected ? (
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#10b981]/20 text-[#10b981] rounded-full text-sm font-medium">Connected</span>
                  <button
                    onClick={() => disconnect("google")}
                    className="px-3 py-1.5 text-xs text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <a
                  href="/api/auth/google"
                  className="px-5 py-2.5 bg-white text-[#1f2937] rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </a>
              )}
            </div>

            {authStatus?.google.connected && (
              <div className="mt-4 p-4 bg-[#0f172a] rounded-lg">
                <p className="text-sm text-white mb-3">Signed in as <span className="text-[#3b82f6] font-medium">{authStatus.google.email}</span></p>
                <div className="grid grid-cols-3 gap-3">
                  {googleScopes.map((s) => {
                    const hasScope = authStatus.google.scopes?.some((sc) => sc.includes(s.scope));
                    return (
                      <div key={s.scope} className={`p-3 rounded-lg border ${hasScope ? "bg-[#10b981]/5 border-[#10b981]/20" : "bg-[#334155]/20 border-[#334155]"}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span>{s.icon}</span>
                          <span className="text-sm font-medium text-white">{s.label}</span>
                        </div>
                        <p className="text-xs text-[#94a3b8]">{s.desc}</p>
                        <p className={`text-xs mt-2 font-medium ${hasScope ? "text-[#10b981]" : "text-[#64748b]"}`}>
                          {hasScope ? "Access granted" : "Not authorized"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Klaviyo */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#24ce7b]/20 flex items-center justify-center text-xl">
                  📧
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Klaviyo</h2>
                  <p className="text-sm text-[#94a3b8]">Email/SMS marketing, flows, campaigns, and subscriber data</p>
                </div>
              </div>
              {authStatus?.klaviyo.connected && (
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#10b981]/20 text-[#10b981] rounded-full text-sm font-medium">Connected</span>
                  <button
                    onClick={() => disconnect("klaviyo")}
                    className="px-3 py-1.5 text-xs text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>

            {authStatus?.klaviyo.connected ? (
              <div className="mt-4 p-4 bg-[#0f172a] rounded-lg">
                <p className="text-sm text-white">
                  Connected to <span className="text-[#24ce7b] font-medium">{authStatus.klaviyo.companyName}</span>
                </p>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {[
                    { icon: "👥", label: "Subscribers & Lists", desc: "List growth, segments, profiles" },
                    { icon: "🔄", label: "Flows & Automations", desc: "Welcome, abandoned cart, post-purchase" },
                    { icon: "📬", label: "Campaigns", desc: "Open rates, click rates, revenue" },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-lg bg-[#10b981]/5 border border-[#10b981]/20">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{item.icon}</span>
                        <span className="text-sm font-medium text-white">{item.label}</span>
                      </div>
                      <p className="text-xs text-[#94a3b8]">{item.desc}</p>
                      <p className="text-xs mt-2 font-medium text-[#10b981]">Access granted</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-[#94a3b8]">
                  Enter your Klaviyo Private API Key. Find it in Klaviyo &rarr; Settings &rarr; API Keys.
                </p>
                <div className="flex gap-3">
                  <input
                    type="password"
                    value={klaviyoKey}
                    onChange={(e) => setKlaviyoKey(e.target.value)}
                    placeholder="pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="flex-1 bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24ce7b] font-mono"
                  />
                  <button
                    onClick={connectKlaviyo}
                    disabled={klaviyoLoading || !klaviyoKey.trim()}
                    className="px-5 py-2.5 bg-[#24ce7b] text-white rounded-lg text-sm font-medium hover:bg-[#1fb968] transition-colors disabled:opacity-40"
                  >
                    {klaviyoLoading ? "Connecting..." : "Connect Klaviyo"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-6">
          <h3 className="font-semibold text-white mb-4">How Authentication Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center text-sm font-bold">1</div>
              <h4 className="text-sm font-medium text-white">Connect Once</h4>
              <p className="text-xs text-[#94a3b8]">Sign in with Google OAuth or enter your Klaviyo API key. Your credentials are stored securely.</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center text-sm font-bold">2</div>
              <h4 className="text-sm font-medium text-white">Auto-Sync Per Client</h4>
              <p className="text-xs text-[#94a3b8]">Each client environment uses your auth to pull data from their specific GA4 properties, ad accounts, and Klaviyo lists.</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center text-sm font-bold">3</div>
              <h4 className="text-sm font-medium text-white">Overall Report</h4>
              <p className="text-xs text-[#94a3b8]">View aggregated data across all clients in one report — see who needs attention and where the opportunities are.</p>
            </div>
          </div>
        </div>

        {/* .env setup instructions */}
        <div className="bg-[#0f172a] rounded-xl border border-[#334155] p-6">
          <h3 className="font-semibold text-white mb-2">Production Setup</h3>
          <p className="text-sm text-[#94a3b8] mb-3">Create a <code className="text-[#3b82f6] bg-[#1e293b] px-1.5 py-0.5 rounded">.env.local</code> file with:</p>
          <pre className="bg-[#1e293b] rounded-lg p-4 text-sm text-[#e2e8f0] font-mono overflow-x-auto">{`# Google OAuth 2.0 (console.cloud.google.com)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000`}</pre>
          <p className="text-xs text-[#64748b] mt-3">
            Without these env vars, the app runs in demo mode with simulated auth.
          </p>
        </div>
      </main>
    </div>
  );
}
