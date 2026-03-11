"use client";

import Link from "next/link";
import { clientSummaries, aggregated } from "@/lib/mock-report";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend,
} from "recharts";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "healthy": "bg-[#10b981]/20 text-[#10b981]",
    "needs-attention": "bg-[#f59e0b]/20 text-[#f59e0b]",
    "at-risk": "bg-[#ef4444]/20 text-[#ef4444]",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || ""}`}>
      {status.replace("-", " ")}
    </span>
  );
}

function MetricBar({ label, value, max, format = "pct" }: { label: string; value: number; max: number; format?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = pct > 66 ? "#10b981" : pct > 33 ? "#f59e0b" : "#ef4444";
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[#94a3b8]">{label}</span>
        <span className="text-white font-medium">
          {format === "pct" ? `${value}%` : format === "dollar" ? `$${value.toLocaleString()}` : `${value}x`}
        </span>
      </div>
      <div className="w-full bg-[#0f172a] rounded-full h-2">
        <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function OverallReport() {
  // Radar chart data: normalize each metric to 0-100 for comparison
  const radarData = [
    { metric: "CVR", ...Object.fromEntries(clientSummaries.map((c) => [c.businessName, Math.min(c.conversionRate / 5 * 100, 100)])) },
    { metric: "Repeat %", ...Object.fromEntries(clientSummaries.map((c) => [c.businessName, Math.min(c.repeatCustomerRate / 50 * 100, 100)])) },
    { metric: "Net Margin", ...Object.fromEntries(clientSummaries.map((c) => [c.businessName, Math.min(c.netMargin / 35 * 100, 100)])) },
    { metric: "ROAS", ...Object.fromEntries(clientSummaries.map((c) => [c.businessName, Math.min(c.roas / 8 * 100, 100)])) },
    { metric: "Email %", ...Object.fromEntries(clientSummaries.map((c) => [c.businessName, Math.min(c.emailRevenuePct / 30 * 100, 100)])) },
    { metric: "Organic %", ...Object.fromEntries(clientSummaries.map((c) => [c.businessName, Math.min(c.organicPct / 50 * 100, 100)])) },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <header className="border-b border-[#334155] bg-[#1e293b]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#94a3b8] hover:text-white text-sm transition-colors">&larr; All Sites</Link>
            <div className="h-5 w-px bg-[#334155]" />
            <h1 className="text-lg font-bold text-white">Overall Client Report</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/connections" className="px-3 py-1.5 text-sm text-[#94a3b8] hover:text-white border border-[#334155] rounded-lg transition-colors">
              Manage Connections
            </Link>
            <span className="text-xs text-[#64748b]">{clientSummaries.length} clients</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Aggregated KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: "Total Monthly Rev", value: `$${(aggregated.totalMonthlyRevenue / 1000).toFixed(0)}K` },
            { label: "Total Orders/mo", value: aggregated.totalMonthlyOrders.toLocaleString() },
            { label: "Avg AOV", value: `$${aggregated.avgAov.toFixed(2)}` },
            { label: "Avg CVR", value: `${aggregated.avgConversionRate.toFixed(1)}%` },
            { label: "Avg Net Margin", value: `${aggregated.avgNetMargin.toFixed(1)}%` },
            { label: "Avg YoY Growth", value: `${aggregated.avgYoyGrowth.toFixed(1)}%` },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">{kpi.label}</p>
              <p className="text-xl font-bold text-white mt-1">{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Total Ad Spend", value: `$${(aggregated.totalAdSpend / 1000).toFixed(1)}K` },
            { label: "Avg ROAS", value: `${aggregated.avgRoas.toFixed(1)}x` },
            { label: "Avg Repeat Rate", value: `${aggregated.avgRepeatRate.toFixed(1)}%` },
            { label: "Avg LTV", value: `$${aggregated.avgLtv.toFixed(0)}` },
            { label: "Total Sessions/mo", value: `${(aggregated.totalSessions / 1000).toFixed(1)}K` },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">{kpi.label}</p>
              <p className="text-xl font-bold text-white mt-1">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Client Scorecards */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Client Scorecards</h2>
          <div className="space-y-4">
            {clientSummaries.map((client) => (
              <div key={client.id} className="bg-[#1e293b] rounded-xl border border-[#334155] p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                      client.platform === "woocommerce" ? "bg-[#7f54b3]/20" : "bg-[#96bf48]/20"
                    }`}>
                      {client.platform === "woocommerce" ? "🟣" : "🟢"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{client.businessName}</h3>
                        <StatusBadge status={client.status} />
                      </div>
                      <p className="text-xs text-[#64748b]">${client.monthlyRevenue.toLocaleString()}/mo &middot; {client.monthlyOrders} orders &middot; {client.yoyGrowth}% YoY</p>
                    </div>
                  </div>
                  <Link href={`/environment/${client.id}`} className="text-xs text-[#3b82f6] hover:underline">
                    View Details &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                  <MetricBar label="Conversion Rate" value={client.conversionRate} max={5} format="pct" />
                  <MetricBar label="Repeat Customer %" value={client.repeatCustomerRate} max={50} format="pct" />
                  <MetricBar label="Net Margin" value={client.netMargin} max={35} format="pct" />
                  <MetricBar label="ROAS" value={client.roas} max={8} format="x" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                  <MetricBar label="Email Revenue %" value={client.emailRevenuePct} max={30} format="pct" />
                  <MetricBar label="Organic Traffic %" value={client.organicPct} max={50} format="pct" />
                  <MetricBar label="Gross Margin" value={client.grossMargin} max={80} format="pct" />
                  <MetricBar label="LTV" value={client.ltv} max={300} format="dollar" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-lg p-3">
                    <p className="text-xs font-medium text-[#ef4444] mb-1">Top Issue</p>
                    <p className="text-sm text-[#e2e8f0]">{client.topIssue}</p>
                  </div>
                  <div className="bg-[#10b981]/5 border border-[#10b981]/20 rounded-lg p-3">
                    <p className="text-xs font-medium text-[#10b981] mb-1">Top Opportunity</p>
                    <p className="text-sm text-[#e2e8f0]">{client.topOpportunity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <h3 className="font-semibold text-white mb-1">Revenue Comparison</h3>
            <p className="text-xs text-[#94a3b8] mb-4">Monthly revenue per client</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={aggregated.revenueByClient}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <h3 className="font-semibold text-white mb-1">Margin Comparison</h3>
            <p className="text-xs text-[#94a3b8] mb-4">Gross vs net margin</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={aggregated.marginComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="gross" name="Gross Margin" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="net" name="Net Margin" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <h3 className="font-semibold text-white mb-1">Client Health Radar</h3>
            <p className="text-xs text-[#94a3b8] mb-4">Normalized comparison across key metrics</p>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <PolarRadiusAxis tick={false} domain={[0, 100]} />
                {clientSummaries.map((c, i) => (
                  <Radar
                    key={c.id}
                    name={c.businessName}
                    dataKey={c.businessName}
                    stroke={COLORS[i]}
                    fill={COLORS[i]}
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                ))}
                <Legend />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Channel Mix */}
          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <h3 className="font-semibold text-white mb-1">Channel Mix</h3>
            <p className="text-xs text-[#94a3b8] mb-4">Traffic & revenue source breakdown</p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={aggregated.channelMix} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} width={140} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="organic" name="Organic" stackId="a" fill="#10b981" />
                <Bar dataKey="paid" name="Paid" stackId="a" fill="#3b82f6" />
                <Bar dataKey="email" name="Email" stackId="a" fill="#8b5cf6" />
                <Bar dataKey="other" name="Other" stackId="a" fill="#334155" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Actions */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-6">
          <h3 className="font-semibold text-white mb-4">Priority Actions Across All Clients</h3>
          <div className="space-y-3">
            {[
              { priority: "HIGH", client: "Cozy Home Collective", action: "Conversion rate optimization — 1.9% CVR is critically low. Audit product pages, checkout flow, and site speed.", impact: "+$15K/mo revenue at 3% CVR" },
              { priority: "HIGH", client: "Apex Performance Gear", action: "Fix Klaviyo connection and build retention email flows. 22% repeat rate with only 8% email revenue.", impact: "+$25K/mo from email automation" },
              { priority: "MED", client: "Cozy Home Collective", action: "Reduce paid dependency from 42% — invest in SEO content and organic ranking strategy.", impact: "-$5K/mo ad spend, better margins" },
              { priority: "MED", client: "Bloom & Grow Botanicals", action: "Scale email from 15% to 25% of revenue — add post-purchase flows, win-back campaigns, VIP segmentation.", impact: "+$12K/mo email revenue" },
              { priority: "LOW", client: "Cozy Home Collective", action: "Connect Google Analytics, Search Console, and Klaviyo to enable full reporting.", impact: "Unlock data-driven decisions" },
              { priority: "LOW", client: "Apex Performance Gear", action: "Connect Google Ads to track ROAS at campaign level and optimize spend allocation.", impact: "Improve ROAS from 4.2x to 5.5x+" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-3 bg-[#0f172a] rounded-lg">
                <span className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 mt-0.5 ${
                  item.priority === "HIGH" ? "bg-[#ef4444]/20 text-[#ef4444]" :
                  item.priority === "MED" ? "bg-[#f59e0b]/20 text-[#f59e0b]" :
                  "bg-[#334155] text-[#94a3b8]"
                }`}>
                  {item.priority}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    <span className="text-[#3b82f6] font-medium">{item.client}</span> — {item.action}
                  </p>
                  <p className="text-xs text-[#10b981] mt-1">{item.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
