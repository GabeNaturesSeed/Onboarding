"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend,
} from "recharts";
import type { MerchantProduct, FeedSummary, Severity } from "@/lib/mock-merchant-center";

type Tab = "overview" | "products" | "performance" | "titles" | "images" | "pricing" | "compliance";
type FilterMode = "all" | "errors" | "warnings" | "approved" | "disapproved" | "pending" | "out_of_stock";

function SevBadge({ s }: { s: Severity }) {
  const c: Record<Severity, string> = { error: "bg-[#ef4444]/20 text-[#ef4444]", warning: "bg-[#f59e0b]/20 text-[#f59e0b]", info: "bg-[#3b82f6]/20 text-[#3b82f6]", pass: "bg-[#10b981]/20 text-[#10b981]" };
  return <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${c[s]}`}>{s}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const c: Record<string, string> = { approved: "bg-[#10b981]/20 text-[#10b981]", disapproved: "bg-[#ef4444]/20 text-[#ef4444]", pending: "bg-[#f59e0b]/20 text-[#f59e0b]" };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c[status] || ""}`}>{status}</span>;
}

function ScoreRing({ score, size = 64, label }: { score: number; size?: number; label?: string }) {
  const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#334155" strokeWidth="4" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={`${(score / 100) * c} ${c}`} strokeLinecap="round" />
      </svg>
      <span className="text-lg font-bold -mt-10" style={{ color }}>{score}</span>
      {label && <span className="text-[10px] text-[#64748b] mt-5">{label}</span>}
    </div>
  );
}

function Bar2({ label, filled, total, color }: { label: string; filled: number; total: number; color?: string }) {
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
  const c = color || (pct === 100 ? "#10b981" : pct >= 80 ? "#f59e0b" : "#ef4444");
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[#94a3b8]">{label}</span>
        <span className="font-mono" style={{ color: c }}>{filled}/{total}</span>
      </div>
      <div className="w-full bg-[#0f172a] rounded-full h-1.5"><div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: c }} /></div>
    </div>
  );
}

function TrendArrow({ value }: { value: number }) {
  if (value > 2) return <span className="text-[#10b981] text-xs font-medium">+{value}%</span>;
  if (value < -2) return <span className="text-[#ef4444] text-xs font-medium">{value}%</span>;
  return <span className="text-[#64748b] text-xs">{value}%</span>;
}

export default function MerchantCenterPage() {
  const [products, setProducts] = useState<MerchantProduct[]>([]);
  const [summary, setSummary] = useState<FeedSummary | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "revenue" | "issues" | "title">("score");
  const [clientFilter, setClientFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/merchant-center").then((r) => r.json()).then((d) => { setProducts(d.products); setSummary(d.summary); });
  }, []);

  const filtered = useMemo(() => {
    let list = products;
    if (clientFilter !== "all") list = list.filter((p) => p.client === clientFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.offerId.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    switch (filter) {
      case "errors": list = list.filter((p) => p.issues.some((i) => i.severity === "error")); break;
      case "warnings": list = list.filter((p) => p.issues.some((i) => i.severity === "warning") && !p.issues.some((i) => i.severity === "error")); break;
      case "approved": list = list.filter((p) => p.status === "approved"); break;
      case "disapproved": list = list.filter((p) => p.status === "disapproved"); break;
      case "pending": list = list.filter((p) => p.status === "pending"); break;
      case "out_of_stock": list = list.filter((p) => p.availability === "out_of_stock"); break;
    }
    switch (sortBy) {
      case "score": list = [...list].sort((a, b) => a.productScore - b.productScore); break;
      case "revenue": list = [...list].sort((a, b) => b.performance.revenue - a.performance.revenue); break;
      case "issues": list = [...list].sort((a, b) => b.issues.length - a.issues.length); break;
      case "title": list = [...list].sort((a, b) => a.title.localeCompare(b.title)); break;
    }
    return list;
  }, [products, filter, search, sortBy, clientFilter]);

  if (!summary) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><p className="text-[#94a3b8]">Loading feed data...</p></div>;

  const scoreColor = (s: number) => s >= 75 ? "#10b981" : s >= 50 ? "#f59e0b" : "#ef4444";
  const clients = [...new Set(products.map((p) => p.client))];

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <header className="border-b border-[#334155] bg-[#1e293b]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#94a3b8] hover:text-white text-sm">&larr; Home</Link>
            <div className="h-5 w-px bg-[#334155]" />
            <h1 className="text-lg font-bold text-white">Merchant Center</h1>
            <span className="text-xs text-[#64748b]">{summary.totalProducts} products across {clients.length} clients</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="px-3 py-1.5 text-sm text-[#94a3b8] hover:text-white border border-[#334155] rounded-lg">Admin</Link>
            <Link href="/report" className="px-3 py-1.5 text-sm text-[#94a3b8] hover:text-white border border-[#334155] rounded-lg">Report</Link>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-[#334155] bg-[#1e293b]">
        <div className="max-w-7xl mx-auto px-6 flex gap-0 overflow-x-auto">
          {([["overview", "Overview"], ["products", "Product Audit"], ["performance", "Performance"], ["titles", "Title Optimizer"], ["images", "Image Audit"], ["pricing", "Pricing"], ["compliance", "Compliance"]] as [Tab, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab === key ? "border-[#3b82f6] text-white" : "border-transparent text-[#94a3b8] hover:text-white"}`}>{label}</button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* === OVERVIEW TAB === */}
        {tab === "overview" && (<>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5 flex items-center gap-4">
              <ScoreRing score={summary.avgProductScore} label="Feed Score" />
            </div>
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">Status</p>
              <div className="flex items-end gap-2 mt-2">
                <div><p className="text-lg font-bold text-[#10b981]">{summary.approved}</p><p className="text-[10px] text-[#64748b]">OK</p></div>
                <div><p className="text-lg font-bold text-[#ef4444]">{summary.disapproved}</p><p className="text-[10px] text-[#64748b]">Denied</p></div>
                <div><p className="text-lg font-bold text-[#f59e0b]">{summary.pending}</p><p className="text-[10px] text-[#64748b]">Pending</p></div>
              </div>
            </div>
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">Shopping Revenue</p>
              <p className="text-xl font-bold text-white mt-1">${summary.totalRevenue.toLocaleString()}</p>
              <p className="text-[10px] text-[#64748b]">{summary.totalClicks.toLocaleString()} clicks / {summary.totalImpressions.toLocaleString()} impr</p>
            </div>
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">Avg Performance</p>
              <div className="flex items-end gap-2 mt-2">
                <div><p className="text-lg font-bold text-white">{summary.avgCTR}%</p><p className="text-[10px] text-[#64748b]">CTR</p></div>
                <div><p className="text-lg font-bold text-white">{summary.avgConvRate}%</p><p className="text-[10px] text-[#64748b]">Conv</p></div>
                <div><p className="text-lg font-bold text-white">{summary.avgROAS}x</p><p className="text-[10px] text-[#64748b]">ROAS</p></div>
              </div>
            </div>
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">Health</p>
              <div className="flex items-end gap-2 mt-2">
                <div><p className="text-lg font-bold text-[#ef4444]">{summary.withErrors}</p><p className="text-[10px] text-[#64748b]">Errors</p></div>
                <div><p className="text-lg font-bold text-[#f59e0b]">{summary.withWarnings}</p><p className="text-[10px] text-[#64748b]">Warns</p></div>
                <div><p className="text-lg font-bold text-[#10b981]">{summary.complianceRate}%</p><p className="text-[10px] text-[#64748b]">Comply</p></div>
              </div>
            </div>
          </div>

          {/* Client breakdown */}
          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">By Client</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {summary.clientBreakdown.map((c) => (
                <div key={c.client} className="bg-[#0f172a] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-white">{c.client}</span>
                    <span className="text-xs font-mono" style={{ color: scoreColor(c.avgScore) }}>{c.avgScore}/100</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div><p className="text-[#64748b]">Products</p><p className="text-white font-medium">{c.products}</p></div>
                    <div><p className="text-[#64748b]">Approved</p><p className="text-white font-medium">{c.approved}/{c.products}</p></div>
                    <div><p className="text-[#64748b]">Revenue</p><p className="text-white font-medium">${c.revenue.toLocaleString()}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Field completeness + top issues side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Field Completeness</h3>
              <div className="space-y-2.5">
                <Bar2 label="Title" filled={summary.totalProducts - products.filter((p) => !p.title).length} total={summary.totalProducts} />
                <Bar2 label="Description" filled={summary.totalProducts - summary.missingDescription} total={summary.totalProducts} />
                <Bar2 label="Image" filled={summary.totalProducts - summary.missingImages} total={summary.totalProducts} />
                <Bar2 label="Brand" filled={summary.totalProducts - summary.missingBrand} total={summary.totalProducts} />
                <Bar2 label="GTIN/MPN" filled={summary.totalProducts - summary.missingGtin} total={summary.totalProducts} />
                <Bar2 label="Google Category" filled={summary.totalProducts - summary.missingGoogleCategory} total={summary.totalProducts} />
                <Bar2 label="Color" filled={summary.totalProducts - summary.missingColor} total={summary.totalProducts} />
                <Bar2 label="Size" filled={summary.totalProducts - summary.missingSize} total={summary.totalProducts} />
              </div>
            </div>
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Top Issues (by impact)</h3>
              <div className="space-y-2">
                {summary.issueBreakdown.slice(0, 8).map((iss, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#0f172a] rounded-lg px-3 py-2">
                    <SevBadge s={iss.severity} />
                    <span className="text-xs text-[#e2e8f0] flex-1 truncate">{iss.issue}</span>
                    <span className="text-[10px] font-mono text-[#64748b]">{iss.count}x</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Score distribution chart */}
          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Product Score Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { range: "0-25", count: products.filter((p) => p.productScore < 25).length },
                { range: "25-50", count: products.filter((p) => p.productScore >= 25 && p.productScore < 50).length },
                { range: "50-75", count: products.filter((p) => p.productScore >= 50 && p.productScore < 75).length },
                { range: "75-100", count: products.filter((p) => p.productScore >= 75).length },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="range" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>)}

        {/* === PRODUCT AUDIT TAB === */}
        {tab === "products" && (<>
          {/* Filters */}
          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, SKU, brand..." className="flex-1 min-w-[200px] bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#3b82f6]" />
              <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)} className="bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs">
                <option value="all">All Clients</option>
                {clients.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs">
                <option value="score">Sort: Score (worst first)</option>
                <option value="revenue">Sort: Revenue</option>
                <option value="issues">Sort: Most issues</option>
                <option value="title">Sort: Title A-Z</option>
              </select>
              <div className="flex gap-1">
                {([["all", "All"], ["errors", "Errors"], ["warnings", "Warns"], ["disapproved", "Denied"], ["out_of_stock", "OOS"]] as [FilterMode, string][]).map(([k, l]) => (
                  <button key={k} onClick={() => setFilter(k)} className={`px-2.5 py-1.5 rounded text-xs font-medium ${filter === k ? "bg-[#3b82f6] text-white" : "text-[#94a3b8] hover:bg-[#0f172a]"}`}>{l}</button>
                ))}
              </div>
              <span className="text-xs text-[#64748b]">{filtered.length} products</span>
            </div>
          </div>

          {/* Product list */}
          <div className="space-y-3">
            {filtered.map((p) => {
              const errCnt = p.issues.filter((i) => i.severity === "error").length;
              const warnCnt = p.issues.filter((i) => i.severity === "warning").length;
              const isExp = expanded === p.id;
              return (
                <div key={p.id} className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
                  <div className="px-5 py-4 cursor-pointer hover:bg-[#0f172a]/50" onClick={() => setExpanded(isExp ? null : p.id)}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${scoreColor(p.productScore)}15`, border: `1px solid ${scoreColor(p.productScore)}30` }}>
                        <span className="text-sm font-bold" style={{ color: scoreColor(p.productScore) }}>{p.productScore}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm text-white font-medium truncate">{p.title || "Untitled"}</span>
                          <StatusBadge status={p.status} />
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-[#64748b]">
                          <span className="font-mono">{p.offerId}</span>
                          <span>{p.client}</span>
                          <span>{p.price}</span>
                          <span className={p.availability === "out_of_stock" ? "text-[#ef4444]" : p.availability === "in_stock" ? "text-[#10b981]" : "text-[#f59e0b]"}>{p.availability.replace(/_/g, " ")}</span>
                          <span>Title: {p.titleAnalysis.structureScore}</span>
                          <span>Img: {p.imageAudit.imageScore}</span>
                          <span>CTR: {p.performance.ctr}%</span>
                          <span>Rev: ${p.performance.revenue}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {errCnt > 0 && <span className="px-2 py-0.5 bg-[#ef4444]/20 text-[#ef4444] rounded text-xs">{errCnt} err</span>}
                        {warnCnt > 0 && <span className="px-2 py-0.5 bg-[#f59e0b]/20 text-[#f59e0b] rounded text-xs">{warnCnt} warn</span>}
                        {p.issues.length === 0 && <span className="px-2 py-0.5 bg-[#10b981]/20 text-[#10b981] rounded text-xs">Perfect</span>}
                        <span className={`text-[#64748b] transition-transform ${isExp ? "rotate-180" : ""}`}>&#9662;</span>
                      </div>
                    </div>
                  </div>

                  {isExp && (
                    <div className="px-5 pb-5 space-y-4 border-t border-[#334155] pt-4">
                      {/* Scores row */}
                      <div className="grid grid-cols-5 gap-3">
                        <div className="bg-[#0f172a] rounded-lg p-3 text-center">
                          <p className="text-[10px] text-[#64748b]">Overall</p>
                          <p className="text-lg font-bold" style={{ color: scoreColor(p.productScore) }}>{p.productScore}</p>
                        </div>
                        <div className="bg-[#0f172a] rounded-lg p-3 text-center">
                          <p className="text-[10px] text-[#64748b]">Title</p>
                          <p className="text-lg font-bold" style={{ color: scoreColor(p.titleAnalysis.structureScore) }}>{p.titleAnalysis.structureScore}</p>
                        </div>
                        <div className="bg-[#0f172a] rounded-lg p-3 text-center">
                          <p className="text-[10px] text-[#64748b]">Images</p>
                          <p className="text-lg font-bold" style={{ color: scoreColor(p.imageAudit.imageScore) }}>{p.imageAudit.imageScore}</p>
                        </div>
                        <div className="bg-[#0f172a] rounded-lg p-3 text-center">
                          <p className="text-[10px] text-[#64748b]">Quality</p>
                          <p className="text-lg font-bold" style={{ color: scoreColor(p.performance.qualityScore * 10) }}>{p.performance.qualityScore}/10</p>
                        </div>
                        <div className="bg-[#0f172a] rounded-lg p-3 text-center">
                          <p className="text-[10px] text-[#64748b]">Compliance</p>
                          <p className="text-lg font-bold" style={{ color: p.compliance.overallCompliant ? "#10b981" : "#ef4444" }}>{p.compliance.overallCompliant ? "Pass" : "Fail"}</p>
                        </div>
                      </div>

                      {/* Title analysis */}
                      <div className="bg-[#0f172a] rounded-lg p-4">
                        <h4 className="text-xs font-semibold text-[#64748b] uppercase mb-2">Title Analysis</h4>
                        <p className="text-sm text-white mb-2">&quot;{p.title}&quot; <span className="text-[#64748b]">({p.titleAnalysis.length} chars)</span></p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {p.titleAnalysis.keywordsFound.map((k) => <span key={k} className="px-2 py-0.5 bg-[#10b981]/10 text-[#10b981] rounded text-[10px]">{k}</span>)}
                          {p.titleAnalysis.keywordsMissing.map((k) => <span key={k} className="px-2 py-0.5 bg-[#ef4444]/10 text-[#ef4444] rounded text-[10px]">missing: {k}</span>)}
                        </div>
                        <p className="text-xs text-[#94a3b8]">Suggestion: <span className="text-[#3b82f6]">{p.titleAnalysis.suggestion}</span></p>
                      </div>

                      {/* Performance + Price side by side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#0f172a] rounded-lg p-4">
                          <h4 className="text-xs font-semibold text-[#64748b] uppercase mb-2">Shopping Performance</h4>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div><p className="text-[#64748b]">Impressions</p><p className="text-white font-medium">{p.performance.impressions.toLocaleString()}</p></div>
                            <div><p className="text-[#64748b]">Clicks</p><p className="text-white font-medium">{p.performance.clicks.toLocaleString()}</p></div>
                            <div><p className="text-[#64748b]">CTR</p><p className="text-white font-medium">{p.performance.ctr}%</p></div>
                            <div><p className="text-[#64748b]">Conversions</p><p className="text-white font-medium">{p.performance.conversions}</p></div>
                            <div><p className="text-[#64748b]">Conv Rate</p><p className="text-white font-medium">{p.performance.conversionRate}%</p></div>
                            <div><p className="text-[#64748b]">Revenue</p><p className="text-white font-medium">${p.performance.revenue}</p></div>
                            <div><p className="text-[#64748b]">ROAS</p><p className="text-white font-medium">{p.performance.roas}x</p></div>
                            <div><p className="text-[#64748b]">Impr Share</p><p className="text-white font-medium">{p.performance.impressionShare}%</p></div>
                            <div><p className="text-[#64748b]">7d Trend</p><TrendArrow value={p.performance.trend7d} /></div>
                          </div>
                        </div>
                        <div className="bg-[#0f172a] rounded-lg p-4">
                          <h4 className="text-xs font-semibold text-[#64748b] uppercase mb-2">Pricing</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div><p className="text-[#64748b]">Price</p><p className="text-white font-medium">${p.priceAnalysis.currentPrice}</p></div>
                            <div><p className="text-[#64748b]">Sale Price</p><p className="text-white font-medium">{p.priceAnalysis.salePrice ? `$${p.priceAnalysis.salePrice} (${p.priceAnalysis.salePctOff}% off)` : "None"}</p></div>
                            <div><p className="text-[#64748b]">Competitor Avg</p><p className="text-white font-medium">{p.priceAnalysis.competitorAvg ? `$${p.priceAnalysis.competitorAvg}` : "N/A"}</p></div>
                            <div><p className="text-[#64748b]">Position</p><p className={`font-medium ${p.priceAnalysis.pricePosition === "below" ? "text-[#10b981]" : p.priceAnalysis.pricePosition === "above" ? "text-[#ef4444]" : "text-white"}`}>{p.priceAnalysis.pricePosition}</p></div>
                            <div><p className="text-[#64748b]">Est. Margin</p><p className="text-white font-medium">{p.priceAnalysis.marginEstimate ? `${p.priceAnalysis.marginEstimate}%` : "N/A"}</p></div>
                            <div><p className="text-[#64748b]">MAP Violation</p><p className={p.priceAnalysis.hasMAPViolation ? "text-[#ef4444] font-medium" : "text-[#10b981]"}>{p.priceAnalysis.hasMAPViolation ? "Yes" : "No"}</p></div>
                          </div>
                        </div>
                      </div>

                      {/* Image audit + All fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#0f172a] rounded-lg p-4">
                          <h4 className="text-xs font-semibold text-[#64748b] uppercase mb-2">Image Audit</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div><p className="text-[#64748b]">Primary</p><p className={p.imageAudit.primaryImage ? "text-[#10b981]" : "text-[#ef4444]"}>{p.imageAudit.primaryImage ? "Yes" : "Missing"}</p></div>
                            <div><p className="text-[#64748b]">Additional</p><p className="text-white">{p.imageAudit.additionalCount}</p></div>
                            <div><p className="text-[#64748b]">Resolution</p><p className="text-white">{p.imageAudit.estimatedResolution}</p></div>
                            <div><p className="text-[#64748b]">White BG</p><p className={p.imageAudit.hasWhiteBackground ? "text-[#10b981]" : "text-[#f59e0b]"}>{p.imageAudit.hasWhiteBackground ? "Yes" : "No"}</p></div>
                            <div><p className="text-[#64748b]">Lifestyle</p><p className={p.imageAudit.hasLifestyleShot ? "text-[#10b981]" : "text-[#64748b]"}>{p.imageAudit.hasLifestyleShot ? "Yes" : "No"}</p></div>
                            <div><p className="text-[#64748b]">Scale Ref</p><p className={p.imageAudit.hasScaleReference ? "text-[#10b981]" : "text-[#64748b]"}>{p.imageAudit.hasScaleReference ? "Yes" : "No"}</p></div>
                          </div>
                        </div>
                        <div className="bg-[#0f172a] rounded-lg p-4">
                          <h4 className="text-xs font-semibold text-[#64748b] uppercase mb-2">Stock History</h4>
                          <div className="space-y-1">
                            {p.stockHistory.map((h, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <span className="text-[#64748b] w-20">{h.date}</span>
                                <span className={`w-2 h-2 rounded-full ${h.availability === "in_stock" ? "bg-[#10b981]" : "bg-[#ef4444]"}`} />
                                <span className="text-[#e2e8f0]">{h.availability.replace(/_/g, " ")} ({h.daysInState}d)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* All fields */}
                      <div className="bg-[#0f172a] rounded-lg p-4">
                        <h4 className="text-xs font-semibold text-[#64748b] uppercase mb-2">All Feed Fields</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5 text-xs">
                          {([
                            ["Offer ID", p.offerId], ["Brand", p.brand], ["GTIN", p.gtin], ["MPN", p.mpn], ["Condition", p.condition],
                            ["Price", p.price], ["Sale Price", p.salePrice], ["Availability", p.availability],
                            ["Google Category", p.googleProductCategory], ["Product Type", p.productType],
                            ["Color", p.color], ["Size", p.size], ["Material", p.material], ["Gender", p.gender], ["Age Group", p.ageGroup],
                            ["Shipping Weight", p.shippingWeight], ["Item Group ID", p.itemGroupId],
                            ["Custom Label 0", p.customLabel0], ["Custom Label 1", p.customLabel1],
                            ["Last Updated", p.lastUpdated], ["Images", `1 + ${p.additionalImages.length} additional`],
                          ] as [string, string | null][]).map(([l, v]) => (
                            <div key={l} className="flex gap-1.5">
                              <span className="text-[#64748b] w-28 shrink-0">{l}:</span>
                              <span className={v ? "text-[#e2e8f0]" : "text-[#ef4444] italic"}>{v || "Missing"}</span>
                            </div>
                          ))}
                        </div>
                        {p.description && (
                          <div className="mt-3 pt-2 border-t border-[#334155]">
                            <span className="text-[#64748b] text-xs">Description ({p.description.length} chars):</span>
                            <p className="text-xs text-[#e2e8f0] mt-1 leading-relaxed line-clamp-3">{p.description}</p>
                          </div>
                        )}
                      </div>

                      {/* Issues */}
                      {p.issues.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-[#64748b] uppercase">Issues & Fixes ({p.issues.length})</h4>
                          {p.issues.map((iss, i) => (
                            <div key={i} className={`rounded-lg p-3 border ${iss.severity === "error" ? "bg-[#ef4444]/5 border-[#ef4444]/20" : iss.severity === "warning" ? "bg-[#f59e0b]/5 border-[#f59e0b]/20" : "bg-[#3b82f6]/5 border-[#3b82f6]/20"}`}>
                              <div className="flex items-start gap-2">
                                <SevBadge s={iss.severity} />
                                <div className="flex-1">
                                  <p className="text-xs text-[#e2e8f0]"><span className="font-mono text-[#94a3b8]">{iss.field}</span> — {iss.message}</p>
                                  {iss.fix && <p className="text-xs text-[#10b981] mt-0.5">Fix: {iss.fix}</p>}
                                  {iss.impact && <p className="text-xs text-[#f59e0b] mt-0.5">Impact: {iss.impact}</p>}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>)}

        {/* === PERFORMANCE TAB === */}
        {tab === "performance" && (<>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { l: "Total Impressions", v: summary.totalImpressions.toLocaleString() },
              { l: "Total Clicks", v: summary.totalClicks.toLocaleString() },
              { l: "Avg CTR", v: `${summary.avgCTR}%` },
              { l: "Total Revenue", v: `$${summary.totalRevenue.toLocaleString()}` },
              { l: "Avg Conv Rate", v: `${summary.avgConvRate}%` },
              { l: "Avg ROAS", v: `${summary.avgROAS}x` },
            ].map((m) => (
              <div key={m.l} className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
                <p className="text-xs text-[#94a3b8]">{m.l}</p>
                <p className="text-xl font-bold text-white mt-1">{m.v}</p>
              </div>
            ))}
          </div>

          {/* Top / bottom performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Top Performers (by Revenue)</h3>
              {[...products].sort((a, b) => b.performance.revenue - a.performance.revenue).slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-[#334155]/50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">{p.title}</p>
                    <p className="text-[10px] text-[#64748b]">{p.client} / {p.offerId}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs shrink-0">
                    <span className="text-[#10b981] font-medium">${p.performance.revenue}</span>
                    <span className="text-[#94a3b8]">{p.performance.roas}x ROAS</span>
                    <TrendArrow value={p.performance.trend7d} />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Underperformers (low CTR, high impr)</h3>
              {[...products].filter((p) => p.performance.impressions > 300).sort((a, b) => a.performance.ctr - b.performance.ctr).slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-[#334155]/50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">{p.title}</p>
                    <p className="text-[10px] text-[#64748b]">{p.client} / {p.performance.impressions.toLocaleString()} impressions</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs shrink-0">
                    <span className="text-[#ef4444] font-medium">{p.performance.ctr}% CTR</span>
                    <span className="text-[#94a3b8]">QS: {p.performance.qualityScore}/10</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by category chart */}
          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Revenue by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={summary.categoryBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="category" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>)}

        {/* === TITLE OPTIMIZER TAB === */}
        {tab === "titles" && (<>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">Avg Title Score</p>
              <p className="text-xl font-bold mt-1" style={{ color: scoreColor(summary.avgTitleScore) }}>{summary.avgTitleScore}/100</p>
            </div>
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">Avg Length</p>
              <p className="text-xl font-bold text-white mt-1">{summary.avgTitleLength} chars</p>
              <p className="text-[10px] text-[#64748b]">Ideal: 70-150</p>
            </div>
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">Too Short (&lt;30)</p>
              <p className="text-xl font-bold text-[#ef4444] mt-1">{summary.shortTitles}</p>
            </div>
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">Too Long (&gt;150)</p>
              <p className="text-xl font-bold text-[#f59e0b] mt-1">{summary.longTitles}</p>
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Title Optimization by Product</h3>
            <div className="space-y-3">
              {[...products].sort((a, b) => a.titleAnalysis.structureScore - b.titleAnalysis.structureScore).map((p) => (
                <div key={p.id} className="bg-[#0f172a] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold w-8 text-center" style={{ color: scoreColor(p.titleAnalysis.structureScore) }}>{p.titleAnalysis.structureScore}</span>
                      <span className="text-xs text-[#64748b]">{p.client} / {p.offerId}</span>
                    </div>
                    <span className="text-xs text-[#64748b]">{p.titleAnalysis.length} chars</span>
                  </div>
                  <p className="text-sm text-white mb-2">{p.title || <span className="text-[#ef4444] italic">No title</span>}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {p.titleAnalysis.keywordsFound.map((k) => <span key={k} className="px-1.5 py-0.5 bg-[#10b981]/10 text-[#10b981] rounded text-[10px]">{k}</span>)}
                    {p.titleAnalysis.keywordsMissing.map((k) => <span key={k} className="px-1.5 py-0.5 bg-[#ef4444]/10 text-[#ef4444] rounded text-[10px]">+ {k}</span>)}
                  </div>
                  <p className="text-xs text-[#3b82f6]">{p.titleAnalysis.suggestion}</p>
                  <div className="flex items-center gap-4 mt-2 text-[10px] text-[#64748b]">
                    <span>Brand: {p.titleAnalysis.hasBrand ? "Yes" : "No"}</span>
                    <span>Color: {p.titleAnalysis.hasColor ? "Yes" : "No"}</span>
                    <span>Size: {p.titleAnalysis.hasSize ? "Yes" : "No"}</span>
                    <span>Material: {p.titleAnalysis.hasMaterial ? "Yes" : "No"}</span>
                    <span>Type: {p.titleAnalysis.hasProductType ? "Yes" : "No"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>)}

        {/* === IMAGE AUDIT TAB === */}
        {tab === "images" && (<>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">Avg Image Score</p>
              <p className="text-xl font-bold mt-1" style={{ color: scoreColor(summary.avgImageScore) }}>{summary.avgImageScore}/100</p>
            </div>
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">Missing Primary</p>
              <p className="text-xl font-bold text-[#ef4444] mt-1">{summary.missingImages}</p>
            </div>
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">No Additional</p>
              <p className="text-xl font-bold text-[#f59e0b] mt-1">{products.filter((p) => p.additionalImages.length === 0).length}</p>
            </div>
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">3+ Images</p>
              <p className="text-xl font-bold text-[#10b981] mt-1">{products.filter((p) => p.additionalImages.length >= 3).length}</p>
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Image Quality Review</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#334155]">
                    {["Score", "Product", "Client", "Primary", "Additional", "Resolution", "White BG", "Lifestyle", "Scale Ref"].map((h) => (
                      <th key={h} className="text-left text-[#64748b] font-medium px-3 py-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...products].sort((a, b) => a.imageAudit.imageScore - b.imageAudit.imageScore).map((p) => (
                    <tr key={p.id} className="border-b border-[#334155]/50 hover:bg-[#0f172a]/50">
                      <td className="px-3 py-2 font-bold" style={{ color: scoreColor(p.imageAudit.imageScore) }}>{p.imageAudit.imageScore}</td>
                      <td className="px-3 py-2 text-white truncate max-w-[200px]">{p.title}</td>
                      <td className="px-3 py-2 text-[#94a3b8]">{p.client}</td>
                      <td className="px-3 py-2"><span className={p.imageAudit.primaryImage ? "text-[#10b981]" : "text-[#ef4444]"}>{p.imageAudit.primaryImage ? "Yes" : "MISSING"}</span></td>
                      <td className="px-3 py-2 text-white">{p.imageAudit.additionalCount}</td>
                      <td className="px-3 py-2 text-[#94a3b8]">{p.imageAudit.estimatedResolution}</td>
                      <td className="px-3 py-2"><span className={p.imageAudit.hasWhiteBackground ? "text-[#10b981]" : "text-[#64748b]"}>{p.imageAudit.hasWhiteBackground ? "Yes" : "No"}</span></td>
                      <td className="px-3 py-2"><span className={p.imageAudit.hasLifestyleShot ? "text-[#10b981]" : "text-[#64748b]"}>{p.imageAudit.hasLifestyleShot ? "Yes" : "No"}</span></td>
                      <td className="px-3 py-2"><span className={p.imageAudit.hasScaleReference ? "text-[#10b981]" : "text-[#64748b]"}>{p.imageAudit.hasScaleReference ? "Yes" : "No"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>)}

        {/* === PRICING TAB === */}
        {tab === "pricing" && (<>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">Products on Sale</p>
              <p className="text-xl font-bold text-white mt-1">{products.filter((p) => p.salePrice).length}</p>
            </div>
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">Above Competitor Avg</p>
              <p className="text-xl font-bold text-[#f59e0b] mt-1">{products.filter((p) => p.priceAnalysis.pricePosition === "above").length}</p>
            </div>
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">Below Competitor Avg</p>
              <p className="text-xl font-bold text-[#10b981] mt-1">{products.filter((p) => p.priceAnalysis.pricePosition === "below").length}</p>
            </div>
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">MAP Violations</p>
              <p className="text-xl font-bold text-[#ef4444] mt-1">{products.filter((p) => p.priceAnalysis.hasMAPViolation).length}</p>
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Price Competitiveness</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#334155]">
                    {["Product", "Client", "Price", "Sale", "Competitor Avg", "Position", "Est Margin", "MAP", "30d Drop"].map((h) => (
                      <th key={h} className="text-left text-[#64748b] font-medium px-3 py-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-[#334155]/50 hover:bg-[#0f172a]/50">
                      <td className="px-3 py-2 text-white truncate max-w-[180px]">{p.title}</td>
                      <td className="px-3 py-2 text-[#94a3b8]">{p.client}</td>
                      <td className="px-3 py-2 text-white font-medium">${p.priceAnalysis.currentPrice}</td>
                      <td className="px-3 py-2">{p.priceAnalysis.salePrice ? <span className="text-[#10b981]">${p.priceAnalysis.salePrice} ({p.priceAnalysis.salePctOff}%)</span> : <span className="text-[#64748b]">-</span>}</td>
                      <td className="px-3 py-2 text-[#94a3b8]">{p.priceAnalysis.competitorAvg ? `$${p.priceAnalysis.competitorAvg}` : "-"}</td>
                      <td className="px-3 py-2"><span className={p.priceAnalysis.pricePosition === "below" ? "text-[#10b981]" : p.priceAnalysis.pricePosition === "above" ? "text-[#ef4444]" : "text-white"}>{p.priceAnalysis.pricePosition}</span></td>
                      <td className="px-3 py-2 text-white">{p.priceAnalysis.marginEstimate}%</td>
                      <td className="px-3 py-2"><span className={p.priceAnalysis.hasMAPViolation ? "text-[#ef4444] font-medium" : "text-[#10b981]"}>{p.priceAnalysis.hasMAPViolation ? "YES" : "OK"}</span></td>
                      <td className="px-3 py-2"><span className={p.priceAnalysis.hasPriceDrop30d ? "text-[#f59e0b]" : "text-[#64748b]"}>{p.priceAnalysis.hasPriceDrop30d ? "Yes" : "No"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Price history chart for first product with history */}
          {products.filter((p) => p.priceAnalysis.priceHistory.length > 0).length > 0 && (
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Sample Price History (top products)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={products[0].priceAnalysis.priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} name={products[0].title.substring(0, 30)} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>)}

        {/* === COMPLIANCE TAB === */}
        {tab === "compliance" && (<>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">Compliance Rate</p>
              <p className="text-xl font-bold mt-1" style={{ color: summary.complianceRate >= 80 ? "#10b981" : "#ef4444" }}>{summary.complianceRate}%</p>
            </div>
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">Fully Compliant</p>
              <p className="text-xl font-bold text-[#10b981] mt-1">{products.filter((p) => p.compliance.overallCompliant).length}</p>
            </div>
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">With Violations</p>
              <p className="text-xl font-bold text-[#ef4444] mt-1">{products.filter((p) => !p.compliance.overallCompliant).length}</p>
            </div>
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">Stockout Rate</p>
              <p className="text-xl font-bold text-[#f59e0b] mt-1">{summary.stockoutRate}%</p>
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Compliance Checklist by Product</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#334155]">
                    {["Product", "Client", "Overall", "Landing Page", "Price Match", "Image Policy", "Identifiers", "Shipping", "Return Policy", "Violations"].map((h) => (
                      <th key={h} className="text-left text-[#64748b] font-medium px-3 py-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...products].sort((a, b) => a.compliance.violations.length - b.compliance.violations.length).reverse().map((p) => {
                    const C = ({ v }: { v: boolean }) => <span className={v ? "text-[#10b981]" : "text-[#ef4444]"}>{v ? "Pass" : "Fail"}</span>;
                    return (
                      <tr key={p.id} className="border-b border-[#334155]/50 hover:bg-[#0f172a]/50">
                        <td className="px-3 py-2 text-white truncate max-w-[160px]">{p.title}</td>
                        <td className="px-3 py-2 text-[#94a3b8]">{p.client}</td>
                        <td className="px-3 py-2"><span className={`font-medium ${p.compliance.overallCompliant ? "text-[#10b981]" : "text-[#ef4444]"}`}>{p.compliance.overallCompliant ? "PASS" : "FAIL"}</span></td>
                        <td className="px-3 py-2"><C v={p.compliance.landingPageMatch} /></td>
                        <td className="px-3 py-2"><C v={p.compliance.priceMatchesPage} /></td>
                        <td className="px-3 py-2"><C v={p.compliance.meetsImagePolicy} /></td>
                        <td className="px-3 py-2"><C v={p.compliance.meetsIdentifierReq} /></td>
                        <td className="px-3 py-2"><C v={p.compliance.shippingConfigured} /></td>
                        <td className="px-3 py-2"><C v={p.compliance.returnPolicySet} /></td>
                        <td className="px-3 py-2 text-[#94a3b8]">{p.compliance.violations.length || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Violation details */}
          {products.filter((p) => p.compliance.violations.length > 0).length > 0 && (
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Violation Details</h3>
              <div className="space-y-3">
                {products.filter((p) => p.compliance.violations.length > 0).map((p) => (
                  <div key={p.id} className="bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">{p.title}</span>
                      <span className="text-xs text-[#64748b]">{p.client} / {p.offerId}</span>
                    </div>
                    <div className="space-y-1">
                      {p.compliance.violations.map((v, i) => (
                        <p key={i} className="text-xs text-[#ef4444] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] shrink-0" />
                          {v}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>)}
      </main>
    </div>
  );
}
