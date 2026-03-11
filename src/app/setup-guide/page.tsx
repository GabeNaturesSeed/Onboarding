"use client";

import { useState } from "react";
import Link from "next/link";

export default function SetupGuidePage() {
  const [platform, setPlatform] = useState<"shopify" | "woocommerce">("shopify");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const repoUrl = "git@github.com:your-org/your-store-theme.git";

  return (
    <div className="min-h-screen mesh-bg">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center mx-auto glow-violet">
            <span className="text-3xl text-white">&#9889;</span>
          </div>
          <h1 className="text-h2 font-extrabold text-text-primary">Your Setup Guide</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Clone your repo, run Claude Code, and paste the kickstart prompt. That&apos;s it &mdash; you&apos;re building.
          </p>
        </div>

        {/* Platform Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex bg-surface-2 rounded-lg p-1 border border-border">
            <button
              onClick={() => setPlatform("shopify")}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                platform === "shopify"
                  ? "bg-brand-violet text-white"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              Shopify
            </button>
            <button
              onClick={() => setPlatform("woocommerce")}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                platform === "woocommerce"
                  ? "bg-brand-violet text-white"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              WooCommerce
            </button>
          </div>
        </div>

        {/* Prerequisites */}
        <div className="border-gradient p-6">
          <h2 className="text-lg font-bold text-text-primary mb-4">Prerequisites</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: "Node.js 18+", check: "node --version", icon: "N" },
              { name: "Git", check: "git --version", icon: "G" },
              { name: "Claude Code", check: "claude --version", icon: "C" },
            ].map((req) => (
              <div key={req.name} className="bg-surface-2 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-3 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-brand-cyan">{req.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{req.name}</p>
                  <code className="text-xs text-text-muted">{req.check}</code>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-surface-0 rounded-lg p-3">
            <p className="text-xs text-text-muted">
              Don&apos;t have Claude Code?{" "}
              <span className="text-brand-cyan">npm install -g @anthropic-ai/claude-code</span>
            </p>
          </div>
        </div>

        {/* Step-by-step */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-text-primary">Get Started in 3 Steps</h2>

          {/* Step 1 */}
          <div className="border-gradient p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-violet/20 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-brand-violet">1</span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary">Clone your repo</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Your theme has been exported to GitHub with all Claude Code configs pre-installed: CLAUDE.md, MCP servers, skills, rules, and the KICKSTART.md prompt.
            </p>
            <div className="bg-surface-0 rounded-lg p-4 flex items-center justify-between gap-4 border border-border">
              <code className="text-sm text-brand-cyan overflow-x-auto whitespace-nowrap">
                git clone {repoUrl}
              </code>
              <button
                onClick={() => copy(`git clone ${repoUrl}`, "clone")}
                className="text-xs px-3 py-1.5 rounded-md bg-surface-3 text-text-secondary hover:text-text-primary transition-colors shrink-0"
              >
                {copied === "clone" ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="bg-surface-0 rounded-lg p-4 border border-border">
              <p className="text-xs text-text-muted mb-2">Your repo includes:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span className="text-text-secondary">CLAUDE.md</span>
                <span className="text-text-muted">Lean philosophy + project rules</span>
                <span className="text-text-secondary">.mcp.json</span>
                <span className="text-text-muted">6 MCP servers configured</span>
                <span className="text-text-secondary">.claude/skills/</span>
                <span className="text-text-muted">8 slash commands</span>
                <span className="text-text-secondary">.claude/rules/</span>
                <span className="text-text-muted">4 rule sets</span>
                <span className="text-text-secondary">HANDOFF.md</span>
                <span className="text-text-muted">Client documentation</span>
                <span className="text-text-secondary">KICKSTART.md</span>
                <span className="text-text-muted">First session prompt</span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="border-gradient p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-indigo/20 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-brand-indigo">2</span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary">Open Claude Code</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Navigate into your project and launch Claude Code. It will automatically detect CLAUDE.md and configure itself.
            </p>
            <div className="space-y-2">
              {[
                { cmd: `cd ${platform === "shopify" ? "your-store-theme" : "your-woo-theme"}`, id: "cd" },
                { cmd: "claude", id: "claude" },
              ].map((item) => (
                <div key={item.id} className="bg-surface-0 rounded-lg p-4 flex items-center justify-between gap-4 border border-border">
                  <code className="text-sm text-brand-cyan">{item.cmd}</code>
                  <button
                    onClick={() => copy(item.cmd, item.id)}
                    className="text-xs px-3 py-1.5 rounded-md bg-surface-3 text-text-secondary hover:text-text-primary transition-colors shrink-0"
                  >
                    {copied === item.id ? "Copied!" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
            {platform === "shopify" && (
              <div className="bg-surface-0 rounded-lg p-3 border border-border">
                <p className="text-xs text-text-muted">
                  Optional: Run <span className="text-brand-cyan">shopify theme dev</span> in another terminal for live preview.
                </p>
              </div>
            )}
          </div>

          {/* Step 3 */}
          <div className="border-gradient p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-cyan/20 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-brand-cyan">3</span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary">Paste the KICKSTART prompt</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Open <code className="text-brand-violet">KICKSTART.md</code> in your repo, copy its contents, and paste it into Claude Code. This triggers your first lean theme audit and teaches you the workflow by doing it.
            </p>
            <div className="bg-surface-0 rounded-lg p-4 border border-border space-y-3">
              <p className="text-xs text-text-muted">The kickstart prompt will walk you through:</p>
              <div className="space-y-2">
                {[
                  "Full theme file audit — identify dead code, unused CSS/JS, bloated sections",
                  "Performance baseline — measure current load times and set targets",
                  "Strip plan — prioritized list of what to remove, refactor, or optimize",
                  "First optimization — Claude Code starts cleaning immediately",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs text-success mt-0.5">&#10003;</span>
                    <span className="text-xs text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* What you can do section */}
        <div className="border-gradient p-6 space-y-5">
          <h2 className="text-lg font-bold text-text-primary">What You Can Do After Setup</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                cmd: "/strip",
                desc: "Analyze and remove unused code, CSS, JS, and dead sections",
                color: "text-error",
              },
              {
                cmd: "/cro-review",
                desc: "Run a conversion rate optimization audit on any page",
                color: "text-success",
              },
              {
                cmd: "/perf",
                desc: "Check performance metrics and identify bottlenecks",
                color: "text-brand-cyan",
              },
              {
                cmd: "/audit",
                desc: "Full accessibility and SEO audit with fix suggestions",
                color: "text-brand-violet",
              },
              {
                cmd: "Ask anything",
                desc: "\"What was our AOV last month?\" — Claude has MCP access to your data",
                color: "text-accent",
              },
              {
                cmd: "Build anything",
                desc: "\"Add a sticky cart bar\" — Claude edits all necessary files at once",
                color: "text-brand-indigo",
              },
            ].map((item) => (
              <div key={item.cmd} className="bg-surface-2 rounded-lg p-4">
                <code className={`text-sm font-semibold ${item.color}`}>{item.cmd}</code>
                <p className="text-xs text-text-muted mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Self-evolving note */}
        <div className="bg-surface-1 rounded-xl border border-brand-violet/20 p-6">
          <h3 className="text-sm font-bold text-brand-violet mb-2">Self-Evolving System</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Your Claude Code environment learns and grows. Every session adds to its memory. Rules and skills are editable markdown files &mdash; customize them for your workflow. CLAUDE.md is your living project document. The more you use it, the smarter it gets about your specific store.
          </p>
        </div>

        {/* Bottom CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/vibe-coder" className="btn-primary text-center">
            Download Theme + Configs
          </Link>
          <Link href="/klaviyo-flows" className="btn-secondary text-center">
            View Klaviyo Flow Plan
          </Link>
          <Link href="/environments" className="btn-secondary text-center">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
