"use client";

import Link from "next/link";
import { mockEnvironments } from "@/lib/mock-environments";
import type { LocalEnvironment } from "@/types/environment";

function StatusDot({ status }: { status: LocalEnvironment["status"] }) {
  const colors = {
    running: "bg-[#10b981]",
    stopped: "bg-[#94a3b8]",
    error: "bg-[#ef4444]",
    provisioning: "bg-[#f59e0b] animate-pulse",
  };
  return <span className={`w-2.5 h-2.5 rounded-full ${colors[status]}`} />;
}

function SyncBadge({ syncs }: { syncs: LocalEnvironment["dataSyncs"] }) {
  const connected = syncs.filter((s) => s.status === "synced" || s.status === "syncing").length;
  const total = syncs.length;
  return (
    <span className="text-xs text-[#94a3b8]">
      {connected}/{total} data sources
    </span>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Top Bar */}
      <header className="border-b border-[#334155] bg-[#1e293b]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#3b82f6] flex items-center justify-center text-white font-bold text-sm">E</div>
            <div>
              <h1 className="text-lg font-bold text-white">Ecomm Local</h1>
              <p className="text-xs text-[#94a3b8]">Local development &amp; data hub</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/connections"
              className="px-3 py-1.5 text-sm text-[#94a3b8] hover:text-white transition-colors"
            >
              Connections
            </Link>
            <Link
              href="/merchant-center"
              className="px-3 py-1.5 text-sm text-[#94a3b8] hover:text-white transition-colors"
            >
              Merchant Center
            </Link>
            <Link
              href="/vibe-coder"
              className="px-3 py-1.5 text-sm text-[#94a3b8] hover:text-white transition-colors"
            >
              Vibe Coder
            </Link>
            <Link
              href="/admin"
              className="px-3 py-1.5 text-sm text-[#f59e0b] hover:text-white transition-colors font-medium"
            >
              Admin
            </Link>
            <Link
              href="/environment/new"
              className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-[#2563eb] transition-colors"
            >
              + New Site
            </Link>
          </div>
        </div>
      </header>

      {/* Environment List */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-3">
          {mockEnvironments.map((env) => (
            <Link
              key={env.id}
              href={`/environment/${env.id}`}
              className="block bg-[#1e293b] rounded-xl border border-[#334155] p-5 hover:border-[#3b82f6]/50 transition-all group"
            >
              <div className="flex items-center gap-5">
                {/* Platform icon + status */}
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                    env.platform === "woocommerce" ? "bg-[#7f54b3]/20" : "bg-[#96bf48]/20"
                  }`}>
                    {env.platform === "woocommerce" ? "🟣" : "🟢"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 p-0.5 bg-[#1e293b] rounded-full">
                    <StatusDot status={env.status} />
                  </div>
                </div>

                {/* Site info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-white group-hover:text-[#3b82f6] transition-colors">
                      {env.businessName}
                    </h2>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      env.status === "running"
                        ? "bg-[#10b981]/20 text-[#10b981]"
                        : env.status === "stopped"
                        ? "bg-[#334155] text-[#94a3b8]"
                        : env.status === "error"
                        ? "bg-[#ef4444]/20 text-[#ef4444]"
                        : "bg-[#f59e0b]/20 text-[#f59e0b]"
                    }`}>
                      {env.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#94a3b8] mt-0.5">{env.clientName} &middot; {env.domain}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-[#64748b]">
                    <span>{env.platform === "woocommerce" ? `WP ${env.wpVersion} / WC ${env.wcVersion} / PHP ${env.phpVersion}` : `Shopify CLI ${env.shopifyCli}`}</span>
                    <span>&middot;</span>
                    <span>{env.theme.name} v{env.theme.version}</span>
                    <span>&middot;</span>
                    <span>{env.theme.files} files</span>
                  </div>
                </div>

                {/* Right side info */}
                <div className="text-right space-y-1">
                  <SyncBadge syncs={env.dataSyncs} />
                  <p className="text-xs text-[#64748b]">{env.sitePath}</p>
                  {env.status === "running" && (
                    <p className="text-xs text-[#3b82f6] font-mono">{env.localUrl}</p>
                  )}
                </div>

                {/* Quick actions */}
                <div className="flex flex-col gap-1.5 ml-2" onClick={(e) => e.preventDefault()}>
                  {env.status === "running" ? (
                    <>
                      <button className="px-3 py-1.5 bg-[#0f172a] rounded text-xs text-[#94a3b8] hover:text-white hover:bg-[#334155] transition-colors">
                        Open Site
                      </button>
                      <button className="px-3 py-1.5 bg-[#0f172a] rounded text-xs text-[#94a3b8] hover:text-white hover:bg-[#334155] transition-colors">
                        {env.platform === "woocommerce" ? "WP Admin" : "Admin"}
                      </button>
                      <button className="px-3 py-1.5 bg-[#ef4444]/10 rounded text-xs text-[#ef4444] hover:bg-[#ef4444]/20 transition-colors">
                        Stop
                      </button>
                    </>
                  ) : (
                    <button className="px-3 py-1.5 bg-[#10b981]/10 rounded text-xs text-[#10b981] hover:bg-[#10b981]/20 transition-colors">
                      Start
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
