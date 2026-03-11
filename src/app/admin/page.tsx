"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell,
} from "recharts";
import {
  allCustomers, computeRFMSegments, defaultRFMConfig,
  merData, clientOverviews,
} from "@/lib/mock-admin";
import type { RFMConfig } from "@/lib/mock-admin";

function MetricCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
      <p className="text-xs text-[#94a3b8]">{label}</p>
      <p className="text-xl font-bold mt-1" style={{ color: color || "white" }}>{value}</p>
      {sub && <p className="text-[10px] text-[#64748b] mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "rfm" | "mer">("overview");

  // RFM config state — user can tweak thresholds
  const [rfmConfig, setRfmConfig] = useState<RFMConfig>(defaultRFMConfig);

  const rfmSegments = useMemo(() => computeRFMSegments(allCustomers, rfmConfig), [rfmConfig]);

  const totalRevenue = clientOverviews.reduce((a, c) => a + c.revenue, 0);
  const totalOrders = clientOverviews.reduce((a, c) => a + c.orders, 0);
  const totalCustomers = clientOverviews.reduce((a, c) => a + c.customers, 0);
  const totalAdSpend = clientOverviews.reduce((a, c) => a + c.adSpend, 0);
  const currentMER = merData[merData.length - 1];

  const updateThreshold = (type: keyof RFMConfig, index: number, value: number) => {
    setRfmConfig((prev) => {
      const newConfig = { ...prev };
      const arr = [...prev[type]] as [number, number, number, number];
      arr[index] = value;
      newConfig[type] = arr;
      return newConfig;
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <header className="border-b border-[#334155] bg-[#1e293b]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#94a3b8] hover:text-white text-sm transition-colors">&larr; Home</Link>
            <div className="h-5 w-px bg-[#334155]" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#ef4444] flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/merchant-center" className="px-3 py-1.5 text-sm text-[#94a3b8] hover:text-white border border-[#334155] rounded-lg transition-colors">
              Merchant Center
            </Link>
            <Link href="/report" className="px-3 py-1.5 text-sm text-[#94a3b8] hover:text-white border border-[#334155] rounded-lg transition-colors">
              Overall Report
            </Link>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-[#334155] bg-[#1e293b]">
        <div className="max-w-7xl mx-auto px-6 flex gap-0">
          {([["overview", "Full Overview"], ["rfm", "RFM Segmentation"], ["mer", "MER & Efficiency"]] as [string, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === key ? "border-[#3b82f6] text-white" : "border-transparent text-[#94a3b8] hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <>
            {/* Top KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <MetricCard label="Total Monthly Rev" value={`$${(totalRevenue / 1000).toFixed(0)}K`} />
              <MetricCard label="Total Orders" value={totalOrders.toLocaleString()} />
              <MetricCard label="Total Customers" value={totalCustomers.toLocaleString()} />
              <MetricCard label="Total Ad Spend" value={`$${(totalAdSpend / 1000).toFixed(1)}K`} />
              <MetricCard label="Overall MER" value={`${currentMER.mer}x`} color={currentMER.mer > 4 ? "#10b981" : "#f59e0b"} />
              <MetricCard label="RFM Segments" value={`${rfmSegments.length}`} sub={`${allCustomers.length} customers`} />
            </div>

            {/* Client Comparison Table */}
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
              <div className="p-5 border-b border-[#334155]">
                <h3 className="font-semibold text-white">Client Performance Matrix</h3>
                <p className="text-xs text-[#94a3b8] mt-0.5">All key metrics at a glance across clients</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#334155]">
                      {["Client", "Revenue", "Orders", "AOV", "Ad Spend", "ROAS", "MER", "Email %", "Repeat %", "LTV", "CAC", "LTV:CAC", "Margin"].map((h) => (
                        <th key={h} className="text-left text-[#64748b] font-medium px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {clientOverviews.map((c) => (
                      <tr key={c.name} className="border-b border-[#334155]/50 hover:bg-[#0f172a]/50">
                        <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                        <td className="px-4 py-3 text-[#e2e8f0]">${(c.revenue / 1000).toFixed(0)}K</td>
                        <td className="px-4 py-3 text-[#e2e8f0]">{c.orders.toLocaleString()}</td>
                        <td className="px-4 py-3 text-[#e2e8f0]">${c.aov.toFixed(0)}</td>
                        <td className="px-4 py-3 text-[#e2e8f0]">${(c.adSpend / 1000).toFixed(1)}K</td>
                        <td className={`px-4 py-3 font-medium ${c.roas >= 5 ? "text-[#10b981]" : c.roas >= 3 ? "text-[#f59e0b]" : "text-[#ef4444]"}`}>{c.roas}x</td>
                        <td className={`px-4 py-3 font-medium ${c.mer >= 4 ? "text-[#10b981]" : c.mer >= 3 ? "text-[#f59e0b]" : "text-[#ef4444]"}`}>{c.mer}x</td>
                        <td className={`px-4 py-3 ${c.emailRevPct >= 20 ? "text-[#10b981]" : c.emailRevPct >= 10 ? "text-[#f59e0b]" : "text-[#ef4444]"}`}>{c.emailRevPct}%</td>
                        <td className={`px-4 py-3 ${c.repeatRate >= 30 ? "text-[#10b981]" : c.repeatRate >= 20 ? "text-[#f59e0b]" : "text-[#ef4444]"}`}>{c.repeatRate}%</td>
                        <td className="px-4 py-3 text-[#e2e8f0]">${c.ltv}</td>
                        <td className="px-4 py-3 text-[#e2e8f0]">${c.cac}</td>
                        <td className={`px-4 py-3 font-medium ${c.ltvCacRatio >= 5 ? "text-[#10b981]" : c.ltvCacRatio >= 3 ? "text-[#f59e0b]" : "text-[#ef4444]"}`}>{c.ltvCacRatio}x</td>
                        <td className={`px-4 py-3 font-medium ${c.margin >= 25 ? "text-[#10b981]" : c.margin >= 15 ? "text-[#f59e0b]" : "text-[#ef4444]"}`}>{c.margin}%</td>
                      </tr>
                    ))}
                    {/* Totals row */}
                    <tr className="bg-[#0f172a] font-medium">
                      <td className="px-4 py-3 text-white">Total / Avg</td>
                      <td className="px-4 py-3 text-white">${(totalRevenue / 1000).toFixed(0)}K</td>
                      <td className="px-4 py-3 text-white">{totalOrders.toLocaleString()}</td>
                      <td className="px-4 py-3 text-white">${Math.round(totalRevenue / totalOrders)}</td>
                      <td className="px-4 py-3 text-white">${(totalAdSpend / 1000).toFixed(1)}K</td>
                      <td className="px-4 py-3 text-white">{(totalRevenue / totalAdSpend).toFixed(1)}x</td>
                      <td className="px-4 py-3 text-white">{currentMER.mer}x</td>
                      <td className="px-4 py-3 text-white">{Math.round(clientOverviews.reduce((a, c) => a + c.emailRevPct, 0) / clientOverviews.length)}%</td>
                      <td className="px-4 py-3 text-white">{(clientOverviews.reduce((a, c) => a + c.repeatRate, 0) / clientOverviews.length).toFixed(1)}%</td>
                      <td className="px-4 py-3 text-white">${Math.round(clientOverviews.reduce((a, c) => a + c.ltv, 0) / clientOverviews.length)}</td>
                      <td className="px-4 py-3 text-white">${Math.round(clientOverviews.reduce((a, c) => a + c.cac, 0) / clientOverviews.length)}</td>
                      <td className="px-4 py-3 text-white">{(clientOverviews.reduce((a, c) => a + c.ltvCacRatio, 0) / clientOverviews.length).toFixed(1)}x</td>
                      <td className="px-4 py-3 text-white">{(clientOverviews.reduce((a, c) => a + c.margin, 0) / clientOverviews.length).toFixed(1)}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Revenue chart */}
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
              <h3 className="font-semibold text-white mb-1">Revenue by Client</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={clientOverviews}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* RFM TAB */}
        {activeTab === "rfm" && (
          <>
            {/* Config Panel */}
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white">RFM Parameters</h3>
                  <p className="text-xs text-[#94a3b8] mt-0.5">Adjust thresholds for 5-point scoring. Changes update segments in real-time.</p>
                </div>
                <button
                  onClick={() => setRfmConfig(defaultRFMConfig)}
                  className="px-3 py-1.5 text-xs text-[#94a3b8] hover:text-white border border-[#334155] rounded-lg transition-colors"
                >
                  Reset to Defaults
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Recency */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Recency (days since last order)</h4>
                  <p className="text-[10px] text-[#64748b] mb-3">Lower = better. Score 5 = most recent.</p>
                  <div className="space-y-2">
                    {["Score 5: 0 to", "Score 4: to", "Score 3: to", "Score 2: to"].map((label, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs text-[#94a3b8] w-20">{label}</span>
                        <input
                          type="number"
                          value={rfmConfig.recencyThresholds[i]}
                          onChange={(e) => updateThreshold("recencyThresholds", i, parseInt(e.target.value) || 0)}
                          className="w-20 bg-[#0f172a] border border-[#334155] rounded px-2 py-1 text-white text-xs text-center"
                        />
                        <span className="text-xs text-[#64748b]">days</span>
                      </div>
                    ))}
                    <p className="text-[10px] text-[#64748b]">Score 1: {rfmConfig.recencyThresholds[3]}+ days</p>
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Frequency (total orders)</h4>
                  <p className="text-[10px] text-[#64748b] mb-3">Higher = better. Score 5 = most orders.</p>
                  <div className="space-y-2">
                    {["Score 2: min", "Score 3: min", "Score 4: min", "Score 5: min"].map((label, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs text-[#94a3b8] w-20">{label}</span>
                        <input
                          type="number"
                          value={rfmConfig.frequencyThresholds[i]}
                          onChange={(e) => updateThreshold("frequencyThresholds", i, parseInt(e.target.value) || 0)}
                          className="w-20 bg-[#0f172a] border border-[#334155] rounded px-2 py-1 text-white text-xs text-center"
                        />
                        <span className="text-xs text-[#64748b]">orders</span>
                      </div>
                    ))}
                    <p className="text-[10px] text-[#64748b]">Score 1: &lt;{rfmConfig.frequencyThresholds[0]} orders</p>
                  </div>
                </div>

                {/* Monetary */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Monetary (total spent)</h4>
                  <p className="text-[10px] text-[#64748b] mb-3">Higher = better. Score 5 = highest LTV.</p>
                  <div className="space-y-2">
                    {["Score 2: min $", "Score 3: min $", "Score 4: min $", "Score 5: min $"].map((label, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs text-[#94a3b8] w-20">{label}</span>
                        <input
                          type="number"
                          value={rfmConfig.monetaryThresholds[i]}
                          onChange={(e) => updateThreshold("monetaryThresholds", i, parseInt(e.target.value) || 0)}
                          className="w-20 bg-[#0f172a] border border-[#334155] rounded px-2 py-1 text-white text-xs text-center"
                        />
                        <span className="text-xs text-[#64748b]">USD</span>
                      </div>
                    ))}
                    <p className="text-[10px] text-[#64748b]">Score 1: &lt;${rfmConfig.monetaryThresholds[0]}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Segment Results */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Segment list */}
              <div className="lg:col-span-2 space-y-3">
                <h3 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider">Segments ({rfmSegments.length})</h3>
                {rfmSegments.map((seg) => (
                  <div key={seg.name} className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                        <div>
                          <h4 className="font-semibold text-white">{seg.name}</h4>
                          <p className="text-xs text-[#94a3b8]">{seg.description}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#64748b]">{seg.percentage}%</span>
                    </div>
                    <div className="grid grid-cols-5 gap-3 mb-3">
                      <div><p className="text-xs text-[#64748b]">Customers</p><p className="text-sm font-bold text-white">{seg.count}</p></div>
                      <div><p className="text-xs text-[#64748b]">Revenue</p><p className="text-sm font-bold text-white">${seg.revenue.toLocaleString()}</p></div>
                      <div><p className="text-xs text-[#64748b]">Avg Recency</p><p className="text-sm font-bold text-white">{seg.avgRecency}d</p></div>
                      <div><p className="text-xs text-[#64748b]">Avg Frequency</p><p className="text-sm font-bold text-white">{seg.avgFrequency}x</p></div>
                      <div><p className="text-xs text-[#64748b]">Avg Monetary</p><p className="text-sm font-bold text-white">${seg.avgMonetary}</p></div>
                    </div>
                    <div className="bg-[#0f172a] rounded-lg p-3">
                      <p className="text-xs text-[#94a3b8]"><span className="text-[#10b981] font-medium">Recommended Action:</span> {seg.action}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Segment chart */}
              <div className="space-y-4">
                <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
                  <h3 className="text-sm font-semibold text-white mb-3">Revenue by Segment</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={rfmSegments} dataKey="revenue" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={100} paddingAngle={2}>
                        {rfmSegments.map((seg, i) => <Cell key={i} fill={seg.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} formatter={(value) => `$${Number(value).toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
                  <h3 className="text-sm font-semibold text-white mb-3">Customer Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={rfmSegments} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={100} paddingAngle={2}>
                        {rfmSegments.map((seg, i) => <Cell key={i} fill={seg.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {/* MER TAB */}
        {activeTab === "mer" && (
          <>
            {/* Current MER */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <MetricCard label="Current MER" value={`${currentMER.mer}x`} sub="Revenue / Total Mktg Spend" color={currentMER.mer > 4 ? "#10b981" : "#f59e0b"} />
              <MetricCard label="Monthly Revenue" value={`$${(currentMER.revenue / 1000).toFixed(0)}K`} />
              <MetricCard label="Total Mktg Spend" value={`$${(currentMER.totalMarketingSpend / 1000).toFixed(1)}K`} />
              <MetricCard label="Ad Spend" value={`$${(currentMER.adSpend / 1000).toFixed(1)}K`} sub={`${Math.round(currentMER.adSpend / currentMER.totalMarketingSpend * 100)}% of total`} />
              <MetricCard label="Email Cost" value={`$${currentMER.emailCost.toLocaleString()}`} sub={`${Math.round(currentMER.emailCost / currentMER.totalMarketingSpend * 100)}% of total`} />
              <MetricCard label="Affiliate + Other" value={`$${((currentMER.affiliateCost + currentMER.otherMarketingCost) / 1000).toFixed(1)}K`} />
            </div>

            {/* MER explanation */}
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
              <h3 className="font-semibold text-white mb-2">What is MER?</h3>
              <p className="text-sm text-[#94a3b8]">
                <span className="text-white font-semibold">Marketing Efficiency Ratio (MER)</span> = Total Revenue / Total Marketing Spend.
                Unlike ROAS (which only measures paid ad return), MER captures the efficiency of <em>all</em> marketing:
                ads, email platform costs, affiliate commissions, influencer spend, content, etc.
                A higher MER means your overall marketing engine is more efficient.
              </p>
              <div className="mt-3 bg-[#0f172a] rounded-lg p-4 font-mono text-sm text-[#e2e8f0]">
                <p>MER = ${currentMER.revenue.toLocaleString()} / ${currentMER.totalMarketingSpend.toLocaleString()} = <span className="text-[#10b981] font-bold">{currentMER.mer}x</span></p>
                <p className="text-[#64748b] text-xs mt-1">For every $1 spent on marketing, you generate ${currentMER.mer.toFixed(2)} in revenue</p>
              </div>
            </div>

            {/* MER trend */}
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
              <h3 className="font-semibold text-white mb-1">MER Trend (6 months)</h3>
              <p className="text-xs text-[#94a3b8] mb-4">Marketing Efficiency Ratio over time</p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={merData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="period" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} domain={[3, 6]} tickFormatter={(v) => `${v}x`} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="mer" stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", r: 5 }} name="MER" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Spend breakdown */}
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
              <h3 className="font-semibold text-white mb-1">Marketing Spend Breakdown</h3>
              <p className="text-xs text-[#94a3b8] mb-4">Where the money goes each month</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={merData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="period" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="adSpend" name="Ad Spend" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="emailCost" name="Email Platform" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="affiliateCost" name="Affiliates" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="otherMarketingCost" name="Other" stackId="a" fill="#334155" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Per-client MER */}
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
              <h3 className="font-semibold text-white mb-4">MER by Client</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {clientOverviews.map((c) => (
                  <div key={c.name} className="bg-[#0f172a] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{c.name}</span>
                      <span className={`text-lg font-bold ${c.mer >= 4 ? "text-[#10b981]" : c.mer >= 3 ? "text-[#f59e0b]" : "text-[#ef4444]"}`}>{c.mer}x</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-[#94a3b8]">Revenue</span><span className="text-[#e2e8f0]">${(c.revenue / 1000).toFixed(0)}K</span></div>
                      <div className="flex justify-between"><span className="text-[#94a3b8]">Ad Spend</span><span className="text-[#e2e8f0]">${(c.adSpend / 1000).toFixed(1)}K</span></div>
                      <div className="flex justify-between"><span className="text-[#94a3b8]">ROAS (ads only)</span><span className="text-[#e2e8f0]">{c.roas}x</span></div>
                      <div className="flex justify-between"><span className="text-[#94a3b8]">LTV:CAC</span><span className="text-[#e2e8f0]">{c.ltvCacRatio}x</span></div>
                    </div>
                    <div className="mt-3 w-full bg-[#334155] rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: `${Math.min(c.mer / 6 * 100, 100)}%`, backgroundColor: c.mer >= 4 ? "#10b981" : c.mer >= 3 ? "#f59e0b" : "#ef4444" }} />
                    </div>
                    <p className="text-[10px] text-[#64748b] mt-1">{c.mer >= 4 ? "Healthy" : c.mer >= 3 ? "Needs optimization" : "Inefficient — reduce spend or increase retention"}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
