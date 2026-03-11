"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getClaudeFiles, getClaudeFileSummary } from "@/lib/claude-config-templates";

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
  const [downloadComplete, setDownloadComplete] = useState(false);

  // Claude config preview
  const [previewFile, setPreviewFile] = useState<string | null>(null);

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

  const storePlatform = authStatus?.shopify?.connected ? "shopify" as const : authStatus?.woocommerce?.connected ? "woocommerce" as const : null;
  const storeName = authStatus?.shopify?.storeDomain || authStatus?.woocommerce?.siteUrl || "my-store";

  const createRepo = async () => {
    if (!repoName.trim()) return;
    setRepoCreating(true);
    await new Promise((r) => setTimeout(r, 2000));
    const username = authStatus?.github?.username || "demo-user";
    setRepoUrl(`https://github.com/${username}/${repoName}`);
    setRepoCreated(true);
    showToast(`Repository created: ${username}/${repoName}`);
    setRepoCreating(false);
  };

  const downloadSteps = [
    "Connecting to store API...",
    "Fetching theme file list...",
    "Downloading templates & assets...",
    "Setting up local project structure...",
    "Installing CLAUDE.md & Claude configs...",
    "Configuring MCP servers...",
    "Installing skills & rules...",
    "Installing dependencies...",
    "Initializing git repo...",
    "Ready to vibe code!",
  ];

  const downloadTheme = async () => {
    setDownloading(true);
    for (let i = 0; i < downloadSteps.length; i++) {
      setDownloadStep(i);
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    }
    setDownloading(false);
    setDownloadComplete(true);
    showToast("Theme downloaded with full Claude Code setup! Ready to vibe code.");
  };

  // Get Claude files for preview
  const platform = storePlatform || "shopify";
  const claudeFiles = getClaudeFiles(platform, storeName);
  const claudeFileSummary = getClaudeFileSummary(platform);
  const activePreview = claudeFiles.find((f) => f.path === previewFile);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1e293b] border border-[#334155] rounded-xl px-5 py-3 shadow-xl">
          <p className="text-sm text-white">{toast}</p>
        </div>
      )}

      <header className="border-b border-[#334155] bg-[#1e293b]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
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

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Connection Status */}
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

        {/* Step 1: Create Repo */}
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
                <span className="px-3 py-1.5 bg-[#0f172a] text-[#e2e8f0] rounded-lg text-xs font-mono">
                  git clone {repoUrl}.git
                </span>
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

        {/* Step 2: Download Theme + Claude Setup */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#8b5cf6]/20 text-[#8b5cf6] flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <h2 className="font-semibold text-white">Download Theme + Claude Code Setup</h2>
              <p className="text-xs text-[#94a3b8]">Pull your theme with a complete Claude Code environment — CLAUDE.md, MCP servers, rules, and skills pre-configured</p>
            </div>
          </div>

          {storePlatform ? (
            <div className="space-y-4">
              {downloading ? (
                <div className="bg-[#0f172a] rounded-lg p-4 space-y-2.5">
                  {downloadSteps.map((step, i) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
                        i < downloadStep ? "bg-[#10b981] text-white" :
                        i === downloadStep ? "bg-[#3b82f6] text-white animate-pulse" :
                        "bg-[#334155] text-[#64748b]"
                      }`}>
                        {i < downloadStep ? "\u2713" : i + 1}
                      </div>
                      <span className={`text-sm ${i <= downloadStep ? "text-white" : "text-[#64748b]"}`}>
                        {step}
                        {i === 4 && i <= downloadStep && <span className="ml-2 text-[#8b5cf6]">CLAUDE.md, settings.json, .mcp.json</span>}
                        {i === 5 && i <= downloadStep && <span className="ml-2 text-[#8b5cf6]">filesystem, puppeteer, fetch, {platform === "shopify" ? "shopify" : "mysql"}, memory</span>}
                        {i === 6 && i <= downloadStep && <span className="ml-2 text-[#8b5cf6]">6 skills, 3 rule sets</span>}
                      </span>
                    </div>
                  ))}
                </div>
              ) : downloadComplete ? (
                <div className="space-y-4">
                  <div className="bg-[#10b981]/5 border border-[#10b981]/20 rounded-lg p-4">
                    <p className="text-sm text-white mb-3">Theme downloaded with full Claude Code setup!</p>
                    <div className="bg-[#0f172a] rounded-lg p-3 font-mono text-xs text-[#e2e8f0] space-y-0.5">
                      <p className="text-[#64748b] mb-1"># Project structure:</p>
                      <p className="text-[#f59e0b]">CLAUDE.md</p>
                      <p className="text-[#f59e0b]">.mcp.json</p>
                      <p className="text-[#8b5cf6]">.claude/</p>
                      <p className="text-[#8b5cf6]">&nbsp; settings.json</p>
                      <p className="text-[#8b5cf6]">&nbsp; rules/</p>
                      <p className="text-[#8b5cf6]">&nbsp; &nbsp; theme-standards.md</p>
                      <p className="text-[#8b5cf6]">&nbsp; &nbsp; performance.md</p>
                      <p className="text-[#8b5cf6]">&nbsp; &nbsp; seo-accessibility.md</p>
                      <p className="text-[#8b5cf6]">&nbsp; skills/</p>
                      <p className="text-[#8b5cf6]">&nbsp; &nbsp; dev.md</p>
                      <p className="text-[#8b5cf6]">&nbsp; &nbsp; lint.md</p>
                      <p className="text-[#8b5cf6]">&nbsp; &nbsp; deploy.md</p>
                      <p className="text-[#8b5cf6]">&nbsp; &nbsp; new-section.md</p>
                      <p className="text-[#8b5cf6]">&nbsp; &nbsp; performance-audit.md</p>
                      <p className="text-[#8b5cf6]">&nbsp; &nbsp; seo-audit.md</p>
                      {storePlatform === "shopify" ? (
                        <>
                          <p className="text-[#e2e8f0] mt-1">assets/</p>
                          <p className="text-[#e2e8f0]">config/</p>
                          <p className="text-[#e2e8f0]">layout/</p>
                          <p className="text-[#e2e8f0]">sections/</p>
                          <p className="text-[#e2e8f0]">snippets/</p>
                          <p className="text-[#e2e8f0]">templates/</p>
                          <p className="text-[#e2e8f0]">locales/</p>
                        </>
                      ) : (
                        <>
                          <p className="text-[#e2e8f0] mt-1">style.css</p>
                          <p className="text-[#e2e8f0]">functions.php</p>
                          <p className="text-[#e2e8f0]">header.php</p>
                          <p className="text-[#e2e8f0]">footer.php</p>
                          <p className="text-[#e2e8f0]">index.php</p>
                          <p className="text-[#e2e8f0]">woocommerce/</p>
                          <p className="text-[#e2e8f0]">assets/</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-2">Quick Start</h3>
                    <div className="space-y-2 font-mono text-xs">
                      <div className="bg-[#0f172a] rounded p-2 text-[#e2e8f0]">
                        <span className="text-[#64748b]">$</span> cd {repoName || `${storeName.split(".")[0]}-theme`}
                      </div>
                      <div className="bg-[#0f172a] rounded p-2 text-[#e2e8f0]">
                        <span className="text-[#64748b]">$</span> claude <span className="text-[#94a3b8]"># Opens Claude Code with your theme context loaded</span>
                      </div>
                      {storePlatform === "shopify" ? (
                        <div className="bg-[#0f172a] rounded p-2 text-[#e2e8f0]">
                          <span className="text-[#64748b]">$</span> shopify theme dev --store={storeName}
                        </div>
                      ) : (
                        <div className="bg-[#0f172a] rounded p-2 text-[#e2e8f0]">
                          <span className="text-[#64748b]">$</span> npm run dev
                        </div>
                      )}
                      <div className="bg-[#0f172a] rounded p-2 text-[#e2e8f0]">
                        <span className="text-[#64748b]">$</span> git add . && git commit -m &quot;Initial theme export with Claude setup&quot;
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
                <div className="space-y-4">
                  <div className="bg-[#0f172a] rounded-lg p-4">
                    <p className="text-sm text-[#94a3b8] mb-3">
                      Your theme will be downloaded with a complete Claude Code environment pre-configured for {storePlatform === "shopify" ? "Shopify Liquid" : "WooCommerce/WordPress PHP"} development:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div className="bg-[#1e293b] rounded-lg p-3 border border-[#334155]">
                        <p className="text-xs font-semibold text-[#f59e0b] mb-1">CLAUDE.md</p>
                        <p className="text-xs text-[#94a3b8]">Full project context, commands, conventions, image handling, SEO, accessibility, and git workflow</p>
                      </div>
                      <div className="bg-[#1e293b] rounded-lg p-3 border border-[#334155]">
                        <p className="text-xs font-semibold text-[#8b5cf6] mb-1">MCP Servers</p>
                        <p className="text-xs text-[#94a3b8]">Filesystem, Puppeteer, Fetch, {storePlatform === "shopify" ? "Shopify API" : "MySQL + WC API"}, Sequential Thinking, Memory</p>
                      </div>
                      <div className="bg-[#1e293b] rounded-lg p-3 border border-[#334155]">
                        <p className="text-xs font-semibold text-[#3b82f6] mb-1">Skills & Rules</p>
                        <p className="text-xs text-[#94a3b8]">6 slash commands (/dev, /lint, /deploy, /new-section, /performance-audit, /seo-audit) + 3 rule sets</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={downloadTheme}
                    className="px-6 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Download {storePlatform === "shopify" ? "Shopify" : "WooCommerce"} Theme + Claude Setup
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#0f172a] rounded-lg p-4">
              <p className="text-sm text-[#64748b]">Connect a store to download your theme.</p>
            </div>
          )}
        </div>

        {/* Step 3: Claude Code Config Explorer */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <h2 className="font-semibold text-white">Claude Code Configuration</h2>
              <p className="text-xs text-[#94a3b8]">
                Preview all {claudeFileSummary.length} files that get installed with your theme — click any file to view its contents
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* File list */}
            <div className="lg:col-span-2 space-y-1">
              {claudeFileSummary.map((file) => (
                <button
                  key={file.path}
                  onClick={() => setPreviewFile(previewFile === file.path ? null : file.path)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors ${
                    previewFile === file.path
                      ? "bg-[#3b82f6]/10 border border-[#3b82f6]/30"
                      : "bg-[#0f172a] border border-[#334155] hover:border-[#475569]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`font-mono font-semibold ${
                      file.path === "CLAUDE.md" ? "text-[#f59e0b]" :
                      file.path === ".mcp.json" ? "text-[#10b981]" :
                      file.path.includes("skills/") ? "text-[#3b82f6]" :
                      file.path.includes("rules/") ? "text-[#f97316]" :
                      "text-[#8b5cf6]"
                    }`}>{file.path}</span>
                  </div>
                  <p className="text-[#94a3b8] leading-snug">{file.description}</p>
                </button>
              ))}
            </div>

            {/* File preview */}
            <div className="lg:col-span-3">
              {activePreview ? (
                <div className="bg-[#0f172a] rounded-lg border border-[#334155] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-[#334155] bg-[#1e293b]">
                    <span className="font-mono text-xs text-[#e2e8f0]">{activePreview.path}</span>
                    <span className="text-xs text-[#64748b]">{activePreview.description}</span>
                  </div>
                  <pre className="p-4 text-xs text-[#e2e8f0] font-mono overflow-auto max-h-[500px] whitespace-pre-wrap break-words leading-relaxed">
                    {activePreview.content}
                  </pre>
                </div>
              ) : (
                <div className="bg-[#0f172a] rounded-lg border border-[#334155] p-8 flex items-center justify-center min-h-[300px]">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3b82f6]/20 to-[#8b5cf6]/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-[#8b5cf6]">&lt;/&gt;</span>
                    </div>
                    <p className="text-sm text-[#94a3b8]">Click a file to preview its contents</p>
                    <p className="text-xs text-[#64748b] mt-1">All files are auto-configured for {platform === "shopify" ? "Shopify Liquid" : "WooCommerce PHP"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* What Claude Code Can Do */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-6">
          <h2 className="font-semibold text-white mb-4">What You Can Do with Claude Code</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Slash Commands",
                color: "#3b82f6",
                items: [
                  { cmd: "/dev", desc: `Start ${platform === "shopify" ? "Shopify theme" : "WooCommerce"} dev server` },
                  { cmd: "/lint", desc: `Run ${platform === "shopify" ? "theme check" : "PHPCS + ESLint"}` },
                  { cmd: "/deploy", desc: "Build and push theme to store" },
                  { cmd: "/new-section", desc: `Scaffold a new ${platform === "shopify" ? "Liquid section" : "template part"}` },
                  { cmd: "/performance-audit", desc: "Full Core Web Vitals audit" },
                  { cmd: "/seo-audit", desc: "SEO and structured data check" },
                ],
              },
              {
                title: "MCP-Powered Tools",
                color: "#10b981",
                items: [
                  { cmd: "Filesystem", desc: "Read, write, and search theme files" },
                  { cmd: "Puppeteer", desc: "Visual testing, screenshots, browser automation" },
                  { cmd: "Fetch", desc: `${platform === "shopify" ? "Shopify Admin" : "WooCommerce REST"} API calls` },
                  { cmd: platform === "shopify" ? "Shopify API" : "MySQL", desc: platform === "shopify" ? "Product data, metafields, store config" : "WordPress database queries and debugging" },
                  { cmd: "Memory", desc: "Persistent context across sessions" },
                  { cmd: "Sequential Thinking", desc: "Complex architecture decisions" },
                ],
              },
              {
                title: "Rule Sets",
                color: "#f97316",
                items: [
                  { cmd: "Theme Standards", desc: `${platform === "shopify" ? "Liquid" : "PHP/WordPress"} coding conventions enforced` },
                  { cmd: "Performance", desc: "Core Web Vitals targets, image/CSS/JS guidelines" },
                  { cmd: "SEO + A11y", desc: "Structured data, WCAG 2.1 AA compliance" },
                ],
              },
              {
                title: "Example Prompts",
                color: "#8b5cf6",
                items: [
                  { cmd: `"Add a ${platform === "shopify" ? "featured collection section" : "product grid component"}"`, desc: "Creates section with schema, CSS, and JS" },
                  { cmd: "\"Optimize images for performance\"", desc: "Audits and fixes lazy loading, srcset, WebP" },
                  { cmd: "\"Add product structured data\"", desc: "Generates JSON-LD for Google rich results" },
                  { cmd: "\"Fix mobile layout on product page\"", desc: "Inspects via Puppeteer, fixes responsive CSS" },
                  { cmd: "\"Run full audit before launch\"", desc: "Performance + SEO + accessibility checks" },
                ],
              },
            ].map((section) => (
              <div key={section.title} className="bg-[#0f172a] rounded-lg border border-[#334155] p-4">
                <h3 className="text-sm font-semibold mb-3" style={{ color: section.color }}>{section.title}</h3>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div key={item.cmd} className="flex gap-2">
                      <span className="font-mono text-xs text-[#e2e8f0] shrink-0 min-w-0">{item.cmd}</span>
                      <span className="text-xs text-[#64748b]">— {item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-6">
          <h2 className="font-semibold text-white mb-4">How the Vibe Coder Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: "1", title: "Connect Store", desc: "Link your Shopify or WooCommerce store via API credentials." },
              { step: "2", title: "Connect GitHub", desc: "Authorize GitHub to create repos and push your code." },
              { step: "3", title: "Create Repo", desc: "Export your live theme to a new GitHub repository." },
              { step: "4", title: "Download + Setup", desc: "Pull theme with CLAUDE.md, MCP servers, rules, and skills pre-installed." },
              { step: "5", title: "Vibe Code", desc: "Open Claude Code in the project. It knows your theme, your tools, and your standards." },
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

        {/* Env setup */}
        <div className="bg-[#0f172a] rounded-xl border border-[#334155] p-6">
          <h3 className="font-semibold text-white mb-2">Production Environment Variables</h3>
          <pre className="bg-[#1e293b] rounded-lg p-4 text-xs text-[#e2e8f0] font-mono overflow-x-auto">{`# Google OAuth
GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret

# GitHub OAuth (github.com/settings/developers)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Base URL
NEXT_PUBLIC_BASE_URL=https://app.gabegs.com${storePlatform === "shopify" ? `

# Shopify (for theme CLI)
SHOPIFY_CLI_THEME_TOKEN=your-theme-access-token
SHOPIFY_FLAG_STORE=${storeName}` : `

# WooCommerce
WC_CONSUMER_KEY=ck_your-key
WC_CONSUMER_SECRET=cs_your-secret

# WordPress Database (for MySQL MCP)
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_DATABASE=wordpress`}`}</pre>
          <p className="text-xs text-[#64748b] mt-3">
            Without env vars, all OAuth flows run in demo mode with simulated data.
          </p>
        </div>
      </main>
    </div>
  );
}
