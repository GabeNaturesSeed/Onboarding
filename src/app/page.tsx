"use client";

import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<"one-time" | "monthly">("one-time");

  return (
    <div className="min-h-screen mesh-bg">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-surface-0/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <span className="text-white text-sm font-bold">G</span>
            </div>
            <span className="text-lg font-bold text-text-primary tracking-tight">GabeGS</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-text-secondary hover:text-text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors px-3 py-2">
              Log In
            </Link>
            <a href="#pricing" className="btn-primary text-sm !py-2 !px-4">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="pt-32 pb-20 px-6 grid-pattern">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface-1/80 mb-8">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-text-secondary">Built for Shopify & WooCommerce stores</span>
            </div>
          </div>

          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight mb-6 animate-fade-up animate-fade-up-delay-1">
            Stop paying agencies.<br />
            <span className="text-gradient">Start vibing with AI.</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up animate-fade-up-delay-2">
            The BI dashboard, Klaviyo automation, and Claude Code development environment that replaces your agency stack. One setup. Infinite leverage.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animate-fade-up-delay-3">
            <a href="#pricing" className="btn-accent text-base">
              Start for $1,997
            </a>
            <a href="#how-it-works" className="btn-secondary text-base">
              See How It Works
            </a>
          </div>

          {/* Social proof bar */}
          <div className="mt-16 flex items-center justify-center gap-8 flex-wrap animate-fade-up animate-fade-up-delay-4">
            {[
              { value: "90+", label: "Lighthouse scores" },
              { value: "$5.5K+", label: "in equivalent value" },
              { value: "9", label: "Klaviyo flows auto-generated" },
              { value: "18", label: "Claude Code files installed" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                <p className="text-xs text-text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── What You Get ─── */}
      <section className="py-24 px-6 bg-gradient-subtle" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-brand-violet uppercase tracking-wider mb-3">Everything in one platform</p>
            <h2 className="text-h2 font-bold tracking-tight">Three pillars. Zero agency fees.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "📊",
                title: "BI Dashboard",
                subtitle: "See everything. Act on anything.",
                color: "brand-cyan",
                features: [
                  "Sales, traffic, retention, P&L — 5 dashboard views",
                  "RFM customer segmentation with thresholds",
                  "Marketing efficiency ratio (MER) tracking",
                  "Merchant Center product feed QA",
                  "Client health reports with priority actions",
                  "Google Analytics, Ads, Search Console unified",
                ],
              },
              {
                icon: "📧",
                title: "Klaviyo Automation",
                subtitle: "9 flows. Auto-generated from your data.",
                color: "brand-violet",
                features: [
                  "Welcome series tuned to your brand",
                  "Abandoned cart with social proof emails",
                  "Post-purchase nurture with review collection",
                  "Win-back campaign for at-risk customers",
                  "VIP loyalty flow for Champions segment",
                  "All flows as .md plans — you approve before deploy",
                ],
              },
              {
                icon: "⚡",
                title: "Vibe Coder",
                subtitle: "Claude Code. Your theme. Lean and fast.",
                color: "accent",
                features: [
                  "Theme export to GitHub with full Claude Code setup",
                  "CLAUDE.md with lean code philosophy + CRO principles",
                  "6 MCP servers: filesystem, Puppeteer, API, memory",
                  "8 slash commands: /strip, /cro-review, /deploy...",
                  "KICKSTART.md — first prompt does full theme audit",
                  "Self-evolving: learns your store, gets smarter each session",
                ],
              },
            ].map((pillar) => (
              <div key={pillar.title} className="border-gradient p-6 space-y-4">
                <div className="text-4xl">{pillar.icon}</div>
                <div>
                  <h3 className="text-h4 font-bold text-text-primary">{pillar.title}</h3>
                  <p className={`text-sm text-${pillar.color}`}>{pillar.subtitle}</p>
                </div>
                <ul className="space-y-2.5">
                  {pillar.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-text-dim mt-2 shrink-0" />
                      <span className="text-sm text-text-secondary leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-24 px-6" id="how-it-works">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-brand-cyan uppercase tracking-wider mb-3">From zero to running in 30 minutes</p>
            <h2 className="text-h2 font-bold tracking-tight">How it works</h2>
          </div>

          <div className="space-y-0">
            {[
              {
                step: "01",
                title: "Sign up & connect your store",
                desc: "Link your Shopify or WooCommerce store, Klaviyo, Google Analytics, and GitHub. Takes 5 minutes.",
                detail: "We pull your customer data, product catalog, analytics, and current theme.",
              },
              {
                step: "02",
                title: "We analyze your data",
                desc: "RFM segmentation runs on your customer base. Your dashboard populates with real insights.",
                detail: "Champions, At Risk, One-Timers — you see exactly who your customers are and what to do with each segment.",
              },
              {
                step: "03",
                title: "Klaviyo flows generated",
                desc: "9 email flows auto-generated based on YOUR segments. Welcome, abandoned cart, win-back, VIP — all tailored to your data.",
                detail: "Everything saved as a plan. You review, approve, then deploy to Klaviyo. Nothing goes live without your OK.",
              },
              {
                step: "04",
                title: "Clone your Vibe Coder repo",
                desc: "Your theme is exported to GitHub with a complete Claude Code environment. 18 files. 8 commands. 6 MCP servers.",
                detail: "Run `git clone`, open Claude Code, paste the KICKSTART prompt. Your first theme audit begins automatically.",
              },
              {
                step: "05",
                title: "Start vibing",
                desc: "Ask Claude to strip your theme, audit your conversion rate, fix mobile layout, add sections — all in plain English.",
                detail: "The system gets smarter each session. Memory persists. Rules evolve. Your store gets faster and converts better.",
              },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-8 py-8 group">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                  {i < 4 && <div className="w-px h-full bg-border mt-4" />}
                </div>
                <div className="pb-4">
                  <h3 className="text-h4 font-bold text-text-primary mb-2">{item.title}</h3>
                  <p className="text-text-secondary mb-2">{item.desc}</p>
                  <p className="text-sm text-text-muted">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Value Comparison ─── */}
      <section className="py-24 px-6 bg-gradient-subtle">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">The math is simple</p>
            <h2 className="text-h2 font-bold tracking-tight">$5,500+ in agency value.<br /><span className="text-gradient-warm">One-time $1,997.</span></h2>
          </div>

          <div className="border-gradient p-1">
            <div className="bg-surface-0 rounded-[calc(var(--radius-xl)-1px)] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">What You Get</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-text-muted">Agency / SaaS Cost</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-brand-violet">GabeGS</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { item: "Unified BI Dashboard (5 views)", agency: "$500/mo", ours: "Included" },
                    { item: "Merchant Center / Feed QA", agency: "$200/mo", ours: "Included" },
                    { item: "RFM Segmentation + MER Analytics", agency: "$300/mo", ours: "Included" },
                    { item: "Klaviyo Flow Templates (9 flows)", agency: "$1,500 one-time", ours: "Included" },
                    { item: "Theme Dev Environment + Claude AI", agency: "$2,000+ in dev hours", ours: "Included" },
                    { item: "CRO Audit + Theme Stripping", agency: "$1,000+ one-time", ours: "Included" },
                  ].map((row) => (
                    <tr key={row.item} className="border-b border-border/50">
                      <td className="px-6 py-3.5 text-text-secondary">{row.item}</td>
                      <td className="px-6 py-3.5 text-center text-text-muted line-through">{row.agency}</td>
                      <td className="px-6 py-3.5 text-center text-success font-semibold">{row.ours}</td>
                    </tr>
                  ))}
                  <tr className="bg-surface-1">
                    <td className="px-6 py-4 font-bold text-text-primary">Total Equivalent Value</td>
                    <td className="px-6 py-4 text-center font-bold text-text-muted">$5,500+</td>
                    <td className="px-6 py-4 text-center font-bold text-gradient-warm text-lg">$1,997</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section className="py-24 px-6" id="pricing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-brand-violet uppercase tracking-wider mb-3">Simple pricing</p>
            <h2 className="text-h2 font-bold tracking-tight mb-4">Choose your plan</h2>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setBillingCycle("one-time")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  billingCycle === "one-time" ? "bg-surface-3 text-text-primary" : "text-text-muted hover:text-text-secondary"
                }`}
              >
                One-Time
              </button>
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  billingCycle === "monthly" ? "bg-surface-3 text-text-primary" : "text-text-muted hover:text-text-secondary"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="card-glass rounded-xl p-6 space-y-6">
              <div>
                <h3 className="text-h4 font-bold text-text-primary">Starter</h3>
                <p className="text-sm text-text-muted mt-1">Dashboard + connections</p>
              </div>
              <div>
                <span className="text-4xl font-extrabold text-text-primary">
                  {billingCycle === "one-time" ? "$497" : "$97"}
                </span>
                <span className="text-text-muted text-sm ml-1">
                  {billingCycle === "one-time" ? "one-time" : "/mo"}
                </span>
              </div>
              <ul className="space-y-3">
                {[
                  "BI Dashboard (all 5 views)",
                  "2 platform connections",
                  "Merchant Center (view only)",
                  "Client reporting",
                  "Quick start docs",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-text-secondary">
                    <span className="text-success text-xs">&#10003;</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup?plan=starter" className="block text-center btn-secondary !w-full">
                Get Started
              </Link>
            </div>

            {/* Growth — featured */}
            <div className="border-gradient p-px rounded-xl glow-violet">
              <div className="bg-surface-1 rounded-[calc(var(--radius-xl)-1px)] p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-h4 font-bold text-text-primary">Growth</h3>
                    <p className="text-sm text-text-muted mt-1">Full platform + Vibe Coder</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-brand-violet/20 text-brand-violet text-xs font-semibold">Popular</span>
                </div>
                <div>
                  <span className="text-4xl font-extrabold text-text-primary">
                    {billingCycle === "one-time" ? "$1,997" : "$297"}
                  </span>
                  <span className="text-text-muted text-sm ml-1">
                    {billingCycle === "one-time" ? "one-time" : "/mo"}
                  </span>
                </div>
                <ul className="space-y-3">
                  {[
                    "Everything in Starter",
                    "All platform connections",
                    "Merchant Center (full QA + fixes)",
                    "Klaviyo Flow Plan (9 flows)",
                    "Vibe Coder + Claude Code setup",
                    "Lean theme audit + stripping",
                    "RFM segmentation + MER analytics",
                    "HANDOFF.md + KICKSTART.md",
                    "8 slash commands + 4 rule sets",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-text-secondary">
                      <span className="text-success text-xs">&#10003;</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup?plan=growth" className="block text-center btn-accent !w-full">
                  Get Started
                </Link>
              </div>
            </div>

            {/* Scale */}
            <div className="card-glass rounded-xl p-6 space-y-6">
              <div>
                <h3 className="text-h4 font-bold text-text-primary">Scale</h3>
                <p className="text-sm text-text-muted mt-1">Multi-store + premium support</p>
              </div>
              <div>
                <span className="text-4xl font-extrabold text-text-primary">
                  {billingCycle === "one-time" ? "$4,997" : "$497"}
                </span>
                <span className="text-text-muted text-sm ml-1">
                  {billingCycle === "one-time" ? "one-time" : "/mo"}
                </span>
              </div>
              <ul className="space-y-3">
                {[
                  "Everything in Growth",
                  "Up to 5 stores",
                  "Priority support + 1:1 setup call",
                  "Custom Klaviyo flow templates",
                  "Quarterly performance reviews",
                  "Custom MCP server integrations",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-text-secondary">
                    <span className="text-success text-xs">&#10003;</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup?plan=scale" className="block text-center btn-secondary !w-full">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── The Quick Start ─── */}
      <section className="py-24 px-6 bg-gradient-subtle">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-brand-cyan uppercase tracking-wider mb-3">After you sign up</p>
          <h2 className="text-h2 font-bold tracking-tight mb-12">You&apos;re three commands away</h2>

          <div className="border-gradient p-6 text-left">
            <div className="space-y-4 font-mono text-sm">
              <div className="flex items-start gap-3">
                <span className="text-brand-violet font-bold shrink-0">$</span>
                <div>
                  <span className="text-text-primary">git clone https://github.com/you/your-store-theme.git</span>
                  <p className="text-text-muted text-xs mt-1 font-sans">Your theme + CLAUDE.md + MCP servers + skills + rules — all pre-configured</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-violet font-bold shrink-0">$</span>
                <div>
                  <span className="text-text-primary">cd your-store-theme && claude</span>
                  <p className="text-text-muted text-xs mt-1 font-sans">Claude Code opens with full context: your store, your conventions, your tools</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-cyan font-bold shrink-0">&gt;</span>
                <div>
                  <span className="text-accent">Paste KICKSTART.md</span>
                  <p className="text-text-muted text-xs mt-1 font-sans">Claude audits your theme, identifies bloat, creates a performance baseline, and recommends a plan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-32 px-6 text-center mesh-bg">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight tracking-tight mb-6">
            Your store deserves<br />
            <span className="text-gradient">better than an agency.</span>
          </h2>
          <p className="text-lg text-text-secondary mb-10 max-w-xl mx-auto">
            Dashboard. Klaviyo flows. Claude Code. All set up in 30 minutes. All learning and evolving for your store.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup?plan=growth" className="btn-accent text-lg">
              Get Started — $1,997
            </Link>
            <Link href="/auth/login" className="btn-secondary text-base">
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-brand flex items-center justify-center">
              <span className="text-white text-xs font-bold">G</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">GabeGS</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <Link href="/auth/login" className="hover:text-text-secondary transition-colors">Log In</Link>
            <Link href="/auth/signup" className="hover:text-text-secondary transition-colors">Sign Up</Link>
            <Link href="/setup-guide" className="hover:text-text-secondary transition-colors">Setup Guide</Link>
          </div>
          <p className="text-xs text-text-dim">&copy; {new Date().getFullYear()} GabeGS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
