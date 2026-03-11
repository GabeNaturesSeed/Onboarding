"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "growth";
  const planName = plan.charAt(0).toUpperCase() + plan.slice(1).replace("-monthly", " Monthly");

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-brand flex items-center justify-center mx-auto glow-violet">
          <span className="text-4xl text-white">&#10003;</span>
        </div>

        <div>
          <h1 className="text-h2 font-extrabold text-text-primary mb-3">You&apos;re in.</h1>
          <p className="text-lg text-text-secondary">
            Your <span className="text-brand-violet font-semibold">{planName}</span> plan is active. Let&apos;s set everything up.
          </p>
        </div>

        <div className="border-gradient p-6 text-left space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">What happens next:</h3>
          <div className="space-y-3">
            {[
              { step: "1", title: "Connect your store & platforms", desc: "Shopify/WooCommerce, Klaviyo, Google, GitHub", time: "5 min" },
              { step: "2", title: "Choose your setup options", desc: "Klaviyo flows, Claude Code environment, lean theme audit", time: "1 min" },
              { step: "3", title: "Launch & clone your repo", desc: "Dashboard populates, flows generate, theme exports to GitHub", time: "2 min" },
              { step: "4", title: "Start vibing", desc: "Run `claude` in your repo, paste KICKSTART.md, and go", time: "Ongoing" },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-surface-3 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-brand-violet">{item.step}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-text-primary">{item.title}</p>
                    <span className="text-xs text-text-muted">{item.time}</span>
                  </div>
                  <p className="text-xs text-text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/onboarding" className="btn-accent text-base w-full block text-center">
            Start Onboarding
          </Link>
          <Link href="/connections" className="btn-secondary text-sm w-full block text-center">
            Go to Connections
          </Link>
        </div>

        <p className="text-xs text-text-dim">
          Questions? Check the <Link href="/setup-guide" className="text-brand-cyan hover:underline">Setup Guide</Link> or review your <Link href="/environments" className="text-brand-cyan hover:underline">Dashboard</Link>.
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen mesh-bg" />}>
      <SuccessContent />
    </Suspense>
  );
}
