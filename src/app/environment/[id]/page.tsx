"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { mockEnvironments, mockLogs } from "@/lib/mock-environments";
import { mockDashboardData } from "@/lib/mock-data";
import type { DataSync, LogEntry } from "@/types/environment";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ComposedChart, Line, Legend, PieChart, Pie, Cell,
} from "recharts";

type Tab = "overview" | "data" | "analytics" | "logs";

const SOURCE_LABELS: Record<string, string> = {
  "shopify-orders": "Orders",
  "shopify-products": "Products",
  "shopify-customers": "Customers",
  "woo-orders": "Orders",
  "woo-products": "Products",
  "woo-customers": "Customers",
  "klaviyo": "Klaviyo",
  "google-analytics": "Google Analytics",
  "google-ads": "Google Ads",
  "google-search-console": "Search Console",
};

const CHART_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];

function SyncStatusBadge({ status }: { status: DataSync["status"] }) {
  const styles = {
    synced: "bg-[#10b981]/20 text-[#10b981]",
    syncing: "bg-[#3b82f6]/20 text-[#3b82f6] animate-pulse",
    stale: "bg-[#f59e0b]/20 text-[#f59e0b]",
    never: "bg-[#334155] text-[#64748b]",
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>{status}</span>;
}

function LogLine({ log }: { log: LogEntry }) {
  const colors = { info: "text-[#3b82f6]", warn: "text-[#f59e0b]", error: "text-[#ef4444]", debug: "text-[#64748b]" };
  const time = new Date(log.timestamp).toLocaleTimeString();
  return (
    <div className="flex gap-3 text-xs font-mono py-1 hover:bg-[#334155]/30">
      <span className="text-[#64748b] w-20 shrink-0">{time}</span>
      <span className={`w-12 shrink-0 ${colors[log.level]}`}>{log.level.toUpperCase()}</span>
      <span className="text-[#94a3b8] w-24 shrink-0">[{log.source}]</span>
      <span className="text-[#e2e8f0]">{log.message}</span>
    </div>
  );
}

export default function EnvironmentDetail() {
  const params = useParams();
  const env = mockEnvironments.find((e) => e.id === params.id);
  const [tab, setTab] = useState<Tab>("overview");

  if (!env) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-white mb-2">Environment not found</p>
          <Link href="/" className="text-[#3b82f6] text-sm hover:underline">Back to sites</Link>
        </div>
      </div>
    );
  }

  const { sales, traffic, retention, pnl } = mockDashboardData;

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "data", label: "Data Sync" },
    { id: "analytics", label: "Analytics" },
    { id: "logs", label: "Logs" },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <header className="border-b border-[#334155] bg-[#1e293b]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-[#94a3b8] hover:text-white text-sm transition-colors">&larr; All Sites</Link>
              <div className="h-5 w-px bg-[#334155]" />
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                  env.platform === "woocommerce" ? "bg-[#7f54b3]/20" : "bg-[#96bf48]/20"
                }`}>
                  {env.platform === "woocommerce" ? "🟣" : "🟢"}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">{env.businessName}</h1>
                  <p className="text-xs text-[#94a3b8]">{env.clientName} &middot; {env.domain}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  env.status === "running" ? "bg-[#10b981]/20 text-[#10b981]" : "bg-[#334155] text-[#94a3b8]"
                }`}>
                  {env.status}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {env.status === "running" ? (
                <>
                  <button className="px-3 py-1.5 bg-[#0f172a] rounded-lg text-sm text-[#94a3b8] hover:text-white hover:bg-[#334155] border border-[#334155] transition-colors">
                    Open Site
                  </button>
                  <button className="px-3 py-1.5 bg-[#0f172a] rounded-lg text-sm text-[#94a3b8] hover:text-white hover:bg-[#334155] border border-[#334155] transition-colors">
                    {env.platform === "woocommerce" ? "WP Admin" : "Shopify Admin"}
                  </button>
                  <button className="px-3 py-1.5 bg-[#0f172a] rounded-lg text-sm text-[#94a3b8] hover:text-white hover:bg-[#334155] border border-[#334155] transition-colors">
                    Terminal
                  </button>
                  <button className="px-3 py-1.5 bg-[#ef4444]/10 rounded-lg text-sm text-[#ef4444] hover:bg-[#ef4444]/20 border border-[#ef4444]/20 transition-colors">
                    Stop Site
                  </button>
                </>
              ) : (
                <button className="px-4 py-1.5 bg-[#10b981] rounded-lg text-sm text-white font-medium hover:bg-[#059669] transition-colors">
                  Start Site
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "bg-[#0f172a] text-white"
                    : "text-[#94a3b8] hover:text-white hover:bg-[#334155]/50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* Site info cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
                <h3 className="text-sm font-medium text-[#94a3b8] mb-3">Environment</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[#64748b]">Platform</span><span className="text-white capitalize">{env.platform}</span></div>
                  {env.phpVersion && <div className="flex justify-between"><span className="text-[#64748b]">PHP</span><span className="text-white">{env.phpVersion}</span></div>}
                  {env.wpVersion && <div className="flex justify-between"><span className="text-[#64748b]">WordPress</span><span className="text-white">{env.wpVersion}</span></div>}
                  {env.wcVersion && <div className="flex justify-between"><span className="text-[#64748b]">WooCommerce</span><span className="text-white">{env.wcVersion}</span></div>}
                  {env.shopifyCli && <div className="flex justify-between"><span className="text-[#64748b]">Shopify CLI</span><span className="text-white">{env.shopifyCli}</span></div>}
                  <div className="flex justify-between"><span className="text-[#64748b]">Node.js</span><span className="text-white">{env.nodeVersion}</span></div>
                  <div className="flex justify-between"><span className="text-[#64748b]">SSL</span><span className="text-white">{env.ssl ? "Trusted" : "Off"}</span></div>
                </div>
              </div>

              <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
                <h3 className="text-sm font-medium text-[#94a3b8] mb-3">Network</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[#64748b]">Local URL</span><span className="text-[#3b82f6] font-mono text-xs">{env.localUrl}</span></div>
                  <div className="flex justify-between"><span className="text-[#64748b]">Web Port</span><span className="text-white">{env.ports.web}</span></div>
                  {env.ports.db && <div className="flex justify-between"><span className="text-[#64748b]">DB Port</span><span className="text-white">{env.ports.db}</span></div>}
                  {env.ports.mailhog && <div className="flex justify-between"><span className="text-[#64748b]">Mail Port</span><span className="text-white">{env.ports.mailhog}</span></div>}
                  {env.dbName && <div className="flex justify-between"><span className="text-[#64748b]">Database</span><span className="text-white font-mono text-xs">{env.dbName}</span></div>}
                  <div className="flex justify-between"><span className="text-[#64748b]">Site Path</span><span className="text-white font-mono text-xs">{env.sitePath}</span></div>
                </div>
              </div>

              <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
                <h3 className="text-sm font-medium text-[#94a3b8] mb-3">Theme</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[#64748b]">Name</span><span className="text-white">{env.theme.name}</span></div>
                  <div className="flex justify-between"><span className="text-[#64748b]">Version</span><span className="text-white">{env.theme.version}</span></div>
                  <div className="flex justify-between"><span className="text-[#64748b]">Files</span><span className="text-white">{env.theme.files}</span></div>
                  <div className="flex justify-between"><span className="text-[#64748b]">Last Modified</span><span className="text-white">{new Date(env.theme.lastModified).toLocaleDateString()}</span></div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="px-3 py-1.5 bg-[#0f172a] rounded text-xs text-[#94a3b8] hover:text-white hover:bg-[#334155] transition-colors">
                    Open in VS Code
                  </button>
                  <button className="px-3 py-1.5 bg-[#0f172a] rounded text-xs text-[#94a3b8] hover:text-white hover:bg-[#334155] transition-colors">
                    Claude Code
                  </button>
                </div>
              </div>
            </div>

            {/* Data sync quick view */}
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[#94a3b8]">Data Sources</h3>
                <button onClick={() => setTab("data")} className="text-xs text-[#3b82f6] hover:underline">
                  Manage Syncs &rarr;
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {env.dataSyncs.map((sync) => (
                  <div key={sync.source} className={`rounded-lg p-3 text-center ${
                    sync.status === "synced" ? "bg-[#10b981]/10 border border-[#10b981]/20" :
                    sync.status === "syncing" ? "bg-[#3b82f6]/10 border border-[#3b82f6]/20" :
                    sync.status === "stale" ? "bg-[#f59e0b]/10 border border-[#f59e0b]/20" :
                    "bg-[#0f172a] border border-[#334155]"
                  }`}>
                    <p className="text-xs font-medium text-white">{SOURCE_LABELS[sync.source]}</p>
                    <SyncStatusBadge status={sync.status} />
                    {sync.recordCount && (
                      <p className="text-[10px] text-[#64748b] mt-1">{sync.recordCount.toLocaleString()} records</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent logs */}
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[#94a3b8]">Recent Activity</h3>
                <button onClick={() => setTab("logs")} className="text-xs text-[#3b82f6] hover:underline">
                  All Logs &rarr;
                </button>
              </div>
              <div className="bg-[#0f172a] rounded-lg p-3 space-y-0.5 max-h-48 overflow-y-auto">
                {mockLogs.slice(0, 6).map((log, i) => (
                  <LogLine key={i} log={log} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DATA SYNC TAB */}
        {tab === "data" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#94a3b8]">Manage data sources synced to your local environment</p>
              <button className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-[#2563eb] transition-colors">
                Sync All Now
              </button>
            </div>

            <div className="space-y-3">
              {env.dataSyncs.map((sync) => (
                <div key={sync.source} className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#0f172a] flex items-center justify-center">
                        <span className="text-lg">
                          {sync.source.includes("order") ? "📦" :
                           sync.source.includes("product") ? "🏷️" :
                           sync.source.includes("customer") ? "👤" :
                           sync.source.includes("klaviyo") ? "📧" :
                           sync.source.includes("analytics") ? "📊" :
                           sync.source.includes("ads") ? "📢" : "🔍"}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white">{SOURCE_LABELS[sync.source]}</h4>
                          <SyncStatusBadge status={sync.status} />
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-[#64748b]">
                          {sync.recordCount && <span>{sync.recordCount.toLocaleString()} records</span>}
                          {sync.lastSync && <span>Last sync: {new Date(sync.lastSync).toLocaleString()}</span>}
                          {sync.syncSchedule && <span>Schedule: {sync.syncSchedule}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {sync.status === "never" ? (
                        <button className="px-3 py-1.5 bg-[#3b82f6] rounded-lg text-xs text-white font-medium hover:bg-[#2563eb] transition-colors">
                          Connect & Sync
                        </button>
                      ) : (
                        <>
                          <select
                            defaultValue={sync.syncSchedule || "manual"}
                            className="bg-[#0f172a] border border-[#334155] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#3b82f6]"
                          >
                            <option value="manual">Manual</option>
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                          </select>
                          <button className="px-3 py-1.5 bg-[#0f172a] rounded-lg text-xs text-[#94a3b8] hover:text-white border border-[#334155] hover:bg-[#334155] transition-colors">
                            Sync Now
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Progress bar for syncing items */}
                  {sync.status === "syncing" && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-[#94a3b8] mb-1">
                        <span>Syncing...</span>
                        <span>67%</span>
                      </div>
                      <div className="w-full bg-[#0f172a] rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-[#3b82f6] animate-pulse" style={{ width: "67%" }} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add new data source */}
            <div className="bg-[#1e293b] rounded-xl border-2 border-dashed border-[#334155] p-8 text-center">
              <p className="text-[#94a3b8] text-sm mb-3">Connect additional data sources</p>
              <div className="flex justify-center gap-2">
                {["Klaviyo", "GA4", "Google Ads", "Search Console"].map((name) => (
                  <button
                    key={name}
                    className="px-3 py-1.5 bg-[#0f172a] rounded-lg text-xs text-[#94a3b8] border border-[#334155] hover:text-white hover:border-[#3b82f6] transition-colors"
                  >
                    + {name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {tab === "analytics" && (
          <div className="space-y-6">
            <p className="text-sm text-[#94a3b8]">Analytics pulled from your locally synced data</p>

            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: "Revenue", value: `$${(sales.totalRevenue / 1000).toFixed(0)}K`, change: "+18.3%" },
                { label: "Orders", value: sales.totalOrders.toLocaleString(), change: "+14.7%" },
                { label: "Conversion", value: `${traffic.conversionRate}%`, change: "+0.4%" },
                { label: "LTV", value: `$${retention.customerLifetimeValue}`, change: "+12.1%" },
                { label: "Net Margin", value: `${pnl.netMargin}%`, change: "+2.3%" },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
                  <p className="text-xs text-[#94a3b8]">{kpi.label}</p>
                  <p className="text-xl font-bold text-white">{kpi.value}</p>
                  <p className="text-xs text-[#10b981]">{kpi.change}</p>
                </div>
              ))}
            </div>

            {/* Revenue trend */}
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
              <h3 className="font-semibold text-white mb-1">Revenue Trend</h3>
              <p className="text-xs text-[#94a3b8] mb-4">From local order data</p>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={sales.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} interval={3} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Traffic by source */}
              <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
                <h3 className="font-semibold text-white mb-1">Traffic Sources</h3>
                <p className="text-xs text-[#94a3b8] mb-4">From GA4 sync</p>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={traffic.trafficByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 10 }} interval={4} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
                    <Legend />
                    <Area type="monotone" dataKey="organic" name="Organic" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="paid" name="Paid" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="direct" name="Direct" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* P&L snapshot */}
              <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
                <h3 className="font-semibold text-white mb-1">P&L Snapshot</h3>
                <p className="text-xs text-[#94a3b8] mb-4">Revenue vs costs</p>
                <ResponsiveContainer width="100%" height={250}>
                  <ComposedChart data={pnl.monthlyPnL}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 10 }} interval={4} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
                    <Legend />
                    <Bar dataKey="netProfit" name="Net Profit" fill="#10b981" radius={[2, 2, 0, 0]} />
                    <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Email & Retention */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
                <h3 className="font-semibold text-white mb-1">Email Performance</h3>
                <p className="text-xs text-[#94a3b8] mb-4">From Klaviyo sync</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Subscribers", value: `${(retention.emailMetrics.subscribers / 1000).toFixed(1)}K` },
                    { label: "Open Rate", value: `${retention.emailMetrics.openRate}%` },
                    { label: "Click Rate", value: `${retention.emailMetrics.clickRate}%` },
                    { label: "Email Revenue", value: `$${(retention.emailMetrics.revenueFromEmail / 1000).toFixed(0)}K` },
                    { label: "Flow Revenue", value: `$${(retention.emailMetrics.flowRevenue / 1000).toFixed(0)}K` },
                    { label: "Campaign Revenue", value: `$${(retention.emailMetrics.campaignRevenue / 1000).toFixed(0)}K` },
                  ].map((m) => (
                    <div key={m.label} className="bg-[#0f172a] rounded-lg p-3">
                      <p className="text-xs text-[#94a3b8]">{m.label}</p>
                      <p className="text-lg font-bold text-white">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
                <h3 className="font-semibold text-white mb-1">Retention Cohorts</h3>
                <p className="text-xs text-[#94a3b8] mb-4">From customer data</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={retention.cohortRetention}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="cohort" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
                    <Bar dataKey="month3" name="3mo" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="month6" name="6mo" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="month12" name="12mo" fill="#10b981" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="text-center py-4">
              <Link
                href={`/environment/${env.id}/analytics`}
                className="text-sm text-[#3b82f6] hover:underline"
              >
                Open Full Analytics Dashboard &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* LOGS TAB */}
        {tab === "logs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#94a3b8]">Live output from dev server, data syncs, and theme checks</p>
              <div className="flex gap-2">
                <select className="bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none">
                  <option>All Sources</option>
                  <option>dev-server</option>
                  <option>data-sync</option>
                  <option>shopify-cli</option>
                  <option>theme-check</option>
                  <option>scheduler</option>
                </select>
                <select className="bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none">
                  <option>All Levels</option>
                  <option>Error</option>
                  <option>Warn</option>
                  <option>Info</option>
                  <option>Debug</option>
                </select>
                <button className="px-3 py-1.5 bg-[#0f172a] rounded-lg text-xs text-[#94a3b8] hover:text-white border border-[#334155] transition-colors">
                  Clear
                </button>
              </div>
            </div>

            <div className="bg-[#0f172a] rounded-xl border border-[#334155] p-4 space-y-0.5 font-mono max-h-[600px] overflow-y-auto">
              {mockLogs.map((log, i) => (
                <LogLine key={i} log={log} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
