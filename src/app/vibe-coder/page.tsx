"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface AuthStatus {
  google: { connected: boolean };
  klaviyo: { connected: boolean };
  shopify: { connected: boolean; storeDomain?: string };
  woocommerce: { connected: boolean; siteUrl?: string };
  github: { connected: boolean; username?: string; avatarUrl?: string };
}

export default function VibeCoder() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f172a]" />}>
      <VibeCoderContent />
    </Suspense>
  );
}

function VibeCoderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Repo creation
  const [repoName, setRepoName] = useState("");
  const [repoCreating, setRepoCreating] = useState(false);
  const [repoCreated, setRepoCreated] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");

  // Theme download
  const [downloading, setDownloading] = useState(false);
  const [downloadStep, setDownloadStep] = useState(0);

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
    const ghStatus = searchParams.get("github");
    if (ghStatus === "connected") showToast("GitHub account connected!");
    const error = searchParams.get("error");
    if (error) showToast(`Error: ${error}`);
  }, [searchParams, fetchStatus]);

  const storePlatform = authStatus?.shopify?.connected ? "shopify" : authStatus?.woocommerce?.connected ? "woocommerce" : null;
  const storeName = authStatus?.shopify?.storeDomain || authStatus?.woocommerce?.siteUrl || "";

  const createRepo = async () => {
    if (!repoName.trim()) return;
    setRepoCreating(true);

    // Simulate repo creation (in production, POST to /api/github/create-repo)
    await new Promise((r) => setTimeout(r, 2000));
    const username = authStatus?.github?.username || "demo-user";
    setRepoUrl(`https://github.com/${username}/${repoName}`);
    setRepoCreated(true);
    showToast(`Repository created: ${username}/${repoName}`);
    setRepoCreating(false);
  };

  const downloadTheme = async () => {
    setDownloading(true);
    const steps = [
      "Connecting to store API...",
      "Fetching theme file list...",
      "Downloading templates & assets...",
      "Setting up local project structure...",
      "Installing dependencies...",
      "Initializing git repo...",
      "Ready to vibe code!",
    ];

    for (let i = 0; i < steps.length; i++) {
      setDownloadStep(i);
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 500));
    }
    setDownloading(false);
    showToast("Theme downloaded! Open the local builder to start coding.");
  };

  const downloadSteps = [
    "Connecting to store API...",
    "Fetching theme file list...",
    "Downloading templates & assets...",
    "Setting up local project structure...",
    "Installing dependencies...",
    "Initializing git repo...",
    "Ready to vibe code!",
  ];

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
            <Link href="/connections" className="text-[#94a3b8] hover:text-white text-sm transition-colors">&larr; Connections</Link>
            <div className="h-5 w-px bg-[#334155]" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center">
                <span className="text-white text-xs font-bold">&lt;/&gt;</span>
              </div>
              <h1 className="text-lg font-bold text-white">Vibe Coder</h1>
            </div>
          </div>
          <Link href="/report" className="px-3 py-1.5 text-sm text-[#94a3b8] hover:text-white border border-[#334155] rounded-lg transition-colors">
            Overall Report
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Prerequisites check */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-6">
          <h2 className="font-semibold text-white mb-4">Connection Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Store", connected: !!storePlatform, detail: storePlatform ? `${storePlatform} (${storeName})` : "Not connected", link: "/connections" },
              { label: "GitHub", connected: !!authStatus?.github?.connected, detail: authStatus?.github?.username ? `@${authStatus.github.username}` : "Not connected", link: "/api/auth/github" },
              { label: "Google", connected: !!authStatus?.google?.connected, detail: authStatus?.google?.connected ? "Connected" : "Optional", link: "/connections" },
              { label: "Klaviyo", connected: !!authStatus?.klaviyo?.connected, detail: authStatus?.klaviyo?.connected ? "Connected" : "Optional", link: "/connections" },
            ].map((item) => (
              <div key={item.label} className={`p-3 rounded-lg border ${item.connected ? "bg-[#10b981]/5 border-[#10b981]/20" : "bg-[#0f172a] border-[#334155]"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">{item.label}</span>
                  <span className={`w-2 h-2 rounded-full ${item.connected ? "bg-[#10b981]" : "bg-[#64748b]"}`} />
                </div>
                <p className="text-xs text-[#94a3b8] truncate">{item.detail}</p>
              </div>
            ))}
          </div>
          {!storePlatform && (
            <p className="mt-3 text-sm text-[#f59e0b]">
              Connect your Shopify or WooCommerce store first &rarr; <Link href="/connections" className="underline">Connections</Link>
            </p>
          )}
          {!authStatus?.github?.connected && (
            <p className="mt-2 text-sm text-[#f59e0b]">
              Connect GitHub to create repos and push code &rarr; <a href="/api/auth/github" className="underline">Connect GitHub</a>
            </p>
          )}
        </div>

        {/* Step 1: Create Repo from Theme */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <h2 className="font-semibold text-white">Create Repository from Your Theme</h2>
              <p className="text-xs text-[#94a3b8]">
                {storePlatform === "shopify" ? "Exports your active Shopify theme to a new GitHub repo" :
                 storePlatform === "woocommerce" ? "Exports your active WooCommerce/WordPress theme to a new GitHub repo" :
                 "Connect a store first to export your theme"}
              </p>
            </div>
          </div>

          {authStatus?.github?.connected && storePlatform ? (
            repoCreated ? (
              <div className="bg-[#10b981]/5 border border-[#10b981]/20 rounded-lg p-4">
                <p className="text-sm text-white mb-2">Repository created!</p>
                <p className="text-xs text-[#94a3b8] font-mono mb-3">{repoUrl}</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 bg-[#0f172a] text-[#e2e8f0] rounded-lg text-xs font-mono">
                    git clone {repoUrl}.git
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <div className="flex-1 flex items-center gap-2 bg-[#0f172a] border border-[#334155] rounded-lg px-3">
                  <span className="text-xs text-[#64748b] shrink-0">{authStatus.github.username}/</span>
                  <input
                    type="text"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value.replace(/\s/g, "-").toLowerCase())}
                    placeholder={`${storeName.split(".")[0]}-theme`}
                    className="flex-1 bg-transparent py-2.5 text-white text-sm focus:outline-none font-mono"
                  />
                </div>
                <button
                  onClick={createRepo}
                  disabled={repoCreating || !repoName.trim()}
                  className="px-5 py-2.5 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-[#2563eb] disabled:opacity-40 shrink-0"
                >
                  {repoCreating ? "Creating..." : "Create Repo"}
                </button>
              </div>
            )
          ) : (
            <div className="bg-[#0f172a] rounded-lg p-4">
              <p className="text-sm text-[#64748b]">Connect GitHub and a store to get started.</p>
            </div>
          )}
        </div>

        {/* Step 2: Download Theme to Local Builder */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#8b5cf6]/20 text-[#8b5cf6] flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <h2 className="font-semibold text-white">Download Theme to Local Builder</h2>
              <p className="text-xs text-[#94a3b8]">Pull a copy of your theme into the local vibe coding environment</p>
            </div>
          </div>

          {storePlatform ? (
            <div className="space-y-4">
              {downloading ? (
                <div className="bg-[#0f172a] rounded-lg p-4 space-y-3">
                  {downloadSteps.map((step, i) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        i < downloadStep ? "bg-[#10b981] text-white" :
                        i === downloadStep ? "bg-[#3b82f6] text-white animate-pulse" :
                        "bg-[#334155] text-[#64748b]"
                      }`}>
                        {i < downloadStep ? "!" : i + 1}
                      </div>
                      <span className={`text-sm ${i <= downloadStep ? "text-white" : "text-[#64748b]"}`}>{step}</span>
                    </div>
                  ))}
                </div>
              ) : downloadStep >= downloadSteps.length - 1 && !downloading ? (
                <div className="space-y-4">
                  <div className="bg-[#10b981]/5 border border-[#10b981]/20 rounded-lg p-4">
                    <p className="text-sm text-white mb-3">Theme downloaded! Your local project is ready.</p>
                    <div className="bg-[#0f172a] rounded-lg p-3 font-mono text-xs text-[#e2e8f0] space-y-1">
                      <p className="text-[#64748b]"># Project structure:</p>
                      {storePlatform === "shopify" ? (
                        <>
                          <p>theme/</p>
                          <p>&nbsp; assets/</p>
                          <p>&nbsp; config/</p>
                          <p>&nbsp; layout/</p>
                          <p>&nbsp; sections/</p>
                          <p>&nbsp; snippets/</p>
                          <p>&nbsp; templates/</p>
                          <p>&nbsp; locales/</p>
                        </>
                      ) : (
                        <>
                          <p>theme/</p>
                          <p>&nbsp; style.css</p>
                          <p>&nbsp; functions.php</p>
                          <p>&nbsp; header.php</p>
                          <p>&nbsp; footer.php</p>
                          <p>&nbsp; index.php</p>
                          <p>&nbsp; woocommerce/</p>
                          <p>&nbsp; assets/</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-2">Quick Start</h3>
                    <div className="space-y-2 font-mono text-xs">
                      <div className="bg-[#0f172a] rounded p-2 text-[#e2e8f0]">
                        <span className="text-[#64748b]">$</span> cd theme
                      </div>
                      {storePlatform === "shopify" ? (
                        <>
                          <div className="bg-[#0f172a] rounded p-2 text-[#e2e8f0]">
                            <span className="text-[#64748b]">$</span> shopify theme dev --store={storeName}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-[#0f172a] rounded p-2 text-[#e2e8f0]">
                            <span className="text-[#64748b]">$</span> npm run dev
                          </div>
                        </>
                      )}
                      <div className="bg-[#0f172a] rounded p-2 text-[#e2e8f0]">
                        <span className="text-[#64748b]">$</span> git add . && git commit -m &quot;Initial theme export&quot;
                      </div>
                      {repoCreated && (
                        <div className="bg-[#0f172a] rounded p-2 text-[#e2e8f0]">
                          <span className="text-[#64748b]">$</span> git remote add origin {repoUrl}.git && git push -u origin main
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={downloadTheme}
                  className="px-6 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Download {storePlatform === "shopify" ? "Shopify" : "WooCommerce"} Theme
                </button>
              )}
            </div>
          ) : (
            <div className="bg-[#0f172a] rounded-lg p-4">
              <p className="text-sm text-[#64748b]">Connect a store to download your theme.</p>
            </div>
          )}
        </div>

        {/* How Vibe Coder Works */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-6">
          <h2 className="font-semibold text-white mb-4">How the Vibe Coder Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: "1", title: "Connect Store", desc: "Link your Shopify or WooCommerce store via API credentials." },
              { step: "2", title: "Connect GitHub", desc: "Authorize GitHub to create repos and push your code." },
              { step: "3", title: "Create Repo", desc: "Export your live theme to a new GitHub repository." },
              { step: "4", title: "Vibe Code", desc: "Download the theme locally and start building. Push changes back to GitHub and deploy." },
            ].map((item) => (
              <div key={item.step} className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3b82f6]/20 to-[#8b5cf6]/20 text-[#8b5cf6] flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <h4 className="text-sm font-medium text-white">{item.title}</h4>
                <p className="text-xs text-[#94a3b8]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Env setup for production */}
        <div className="bg-[#0f172a] rounded-xl border border-[#334155] p-6">
          <h3 className="font-semibold text-white mb-2">Production Environment Variables</h3>
          <pre className="bg-[#1e293b] rounded-lg p-4 text-xs text-[#e2e8f0] font-mono overflow-x-auto">{`# Google OAuth
GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret

# GitHub OAuth (github.com/settings/developers)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Base URL
NEXT_PUBLIC_BASE_URL=https://app.gabegs.com`}</pre>
          <p className="text-xs text-[#64748b] mt-3">
            Without env vars, all OAuth flows run in demo mode with simulated data.
          </p>
        </div>
      </main>
    </div>
  );
}
