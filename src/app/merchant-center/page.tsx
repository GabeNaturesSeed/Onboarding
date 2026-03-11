"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { MerchantProduct, FeedSummary, Severity } from "@/lib/mock-merchant-center";

type FilterMode = "all" | "errors" | "warnings" | "approved" | "disapproved" | "pending" | "out_of_stock";

function SeverityBadge({ severity }: { severity: Severity }) {
  const styles: Record<Severity, string> = {
    error: "bg-[#ef4444]/20 text-[#ef4444]",
    warning: "bg-[#f59e0b]/20 text-[#f59e0b]",
    info: "bg-[#3b82f6]/20 text-[#3b82f6]",
    pass: "bg-[#10b981]/20 text-[#10b981]",
  };
  return <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${styles[severity]}`}>{severity}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    approved: "bg-[#10b981]/20 text-[#10b981]",
    disapproved: "bg-[#ef4444]/20 text-[#ef4444]",
    pending: "bg-[#f59e0b]/20 text-[#f59e0b]",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || ""}`}>{status}</span>;
}

function AvailabilityBadge({ availability }: { availability: string }) {
  const styles: Record<string, string> = {
    in_stock: "text-[#10b981]",
    out_of_stock: "text-[#ef4444]",
    preorder: "text-[#f59e0b]",
    backorder: "text-[#f59e0b]",
  };
  return <span className={`text-xs font-medium ${styles[availability] || "text-[#94a3b8]"}`}>{availability.replace(/_/g, " ")}</span>;
}

function FieldCompleteness({ label, filled, total }: { label: string; filled: number; total: number }) {
  const pct = Math.round((filled / total) * 100);
  const color = pct === 100 ? "#10b981" : pct >= 80 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#94a3b8] w-32 shrink-0">{label}</span>
      <div className="flex-1 bg-[#0f172a] rounded-full h-2">
        <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-mono w-16 text-right" style={{ color }}>{filled}/{total} ({pct}%)</span>
    </div>
  );
}

export default function MerchantCenterPage() {
  const [products, setProducts] = useState<MerchantProduct[]>([]);
  const [summary, setSummary] = useState<FeedSummary | null>(null);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/merchant-center")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products);
        setSummary(data.summary);
      });
  }, []);

  const filtered = products.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.offerId.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false;
    }
    switch (filter) {
      case "errors": return p.issues.some((i) => i.severity === "error");
      case "warnings": return p.issues.some((i) => i.severity === "warning") && !p.issues.some((i) => i.severity === "error");
      case "approved": return p.status === "approved";
      case "disapproved": return p.status === "disapproved";
      case "pending": return p.status === "pending";
      case "out_of_stock": return p.availability === "out_of_stock";
      default: return true;
    }
  });

  const feedScore = summary
    ? Math.round(((summary.approved / summary.totalProducts) * 40) + ((summary.perfect / summary.totalProducts) * 30) + (((summary.totalProducts - summary.missingGtin) / summary.totalProducts) * 15) + (((summary.totalProducts - summary.missingGoogleCategory) / summary.totalProducts) * 15))
    : 0;

  const scoreColor = feedScore >= 80 ? "#10b981" : feedScore >= 50 ? "#f59e0b" : "#ef4444";

  if (!summary) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><p className="text-[#94a3b8]">Loading feed data...</p></div>;

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <header className="border-b border-[#334155] bg-[#1e293b]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#94a3b8] hover:text-white text-sm transition-colors">&larr; Dashboard</Link>
            <div className="h-5 w-px bg-[#334155]" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#4285f4]/20 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                  <path d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c1.86.5 4 .83 6 1v13h2v-6h2v6h2V9c2-.17 4.14-.5 6-1l-.5-2z" fill="#4285F4"/>
                  <circle cx="12" cy="3.5" r="1.5" fill="#4285F4"/>
                </svg>
              </div>
              <h1 className="text-lg font-bold text-white">Merchant Center</h1>
            </div>
            <span className="text-xs text-[#64748b]">{summary.totalProducts} products</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="px-3 py-1.5 text-sm text-[#94a3b8] hover:text-white border border-[#334155] rounded-lg transition-colors">
              Admin Dashboard
            </Link>
            <Link href="/report" className="px-3 py-1.5 text-sm text-[#94a3b8] hover:text-white border border-[#334155] rounded-lg transition-colors">
              Overall Report
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Feed Health Score */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5 flex items-center gap-5">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#334155" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={scoreColor} strokeWidth="3" strokeDasharray={`${feedScore}, 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold" style={{ color: scoreColor }}>{feedScore}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Feed Health Score</p>
              <p className="text-xs text-[#94a3b8] mt-1">{feedScore >= 80 ? "Feed is healthy" : feedScore >= 50 ? "Needs improvement" : "Critical issues"}</p>
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <p className="text-xs text-[#94a3b8]">Status Breakdown</p>
            <div className="flex items-end gap-3 mt-2">
              <div><p className="text-xl font-bold text-[#10b981]">{summary.approved}</p><p className="text-[10px] text-[#64748b]">Approved</p></div>
              <div><p className="text-xl font-bold text-[#ef4444]">{summary.disapproved}</p><p className="text-[10px] text-[#64748b]">Disapproved</p></div>
              <div><p className="text-xl font-bold text-[#f59e0b]">{summary.pending}</p><p className="text-[10px] text-[#64748b]">Pending</p></div>
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <p className="text-xs text-[#94a3b8]">Availability</p>
            <div className="flex items-end gap-3 mt-2">
              <div><p className="text-xl font-bold text-[#10b981]">{summary.inStock}</p><p className="text-[10px] text-[#64748b]">In Stock</p></div>
              <div><p className="text-xl font-bold text-[#ef4444]">{summary.outOfStock}</p><p className="text-[10px] text-[#64748b]">Stockout</p></div>
              <div><p className="text-xl font-bold text-[#f59e0b]">{summary.preorder}</p><p className="text-[10px] text-[#64748b]">Preorder</p></div>
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <p className="text-xs text-[#94a3b8]">Issues</p>
            <div className="flex items-end gap-3 mt-2">
              <div><p className="text-xl font-bold text-[#ef4444]">{summary.withErrors}</p><p className="text-[10px] text-[#64748b]">w/ Errors</p></div>
              <div><p className="text-xl font-bold text-[#f59e0b]">{summary.withWarnings}</p><p className="text-[10px] text-[#64748b]">w/ Warnings</p></div>
              <div><p className="text-xl font-bold text-[#10b981]">{summary.perfect}</p><p className="text-[10px] text-[#64748b]">Perfect</p></div>
            </div>
          </div>
        </div>

        {/* Field Completeness */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Required Field Completeness</h3>
            <div className="space-y-3">
              <FieldCompleteness label="Title" filled={summary.totalProducts - (products.filter((p) => !p.title).length)} total={summary.totalProducts} />
              <FieldCompleteness label="Description" filled={summary.totalProducts - summary.missingDescription} total={summary.totalProducts} />
              <FieldCompleteness label="Image" filled={summary.totalProducts - summary.missingImages} total={summary.totalProducts} />
              <FieldCompleteness label="Brand" filled={summary.totalProducts - summary.missingBrand} total={summary.totalProducts} />
              <FieldCompleteness label="GTIN/MPN" filled={summary.totalProducts - summary.missingGtin} total={summary.totalProducts} />
              <FieldCompleteness label="Google Category" filled={summary.totalProducts - summary.missingGoogleCategory} total={summary.totalProducts} />
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Content Quality</h3>
            <div className="space-y-3">
              <FieldCompleteness label="Color" filled={summary.totalProducts - summary.missingColor} total={summary.totalProducts} />
              <FieldCompleteness label="Size" filled={summary.totalProducts - summary.missingSize} total={summary.totalProducts} />
              <FieldCompleteness label="Title 30-150 chars" filled={summary.totalProducts - summary.shortTitles - summary.longTitles} total={summary.totalProducts} />
              <FieldCompleteness label="Desc 100+ chars" filled={summary.totalProducts - summary.shortDescriptions - summary.missingDescription} total={summary.totalProducts} />
              <FieldCompleteness label="Additional Images" filled={products.filter((p) => p.additionalImages.length > 0).length} total={summary.totalProducts} />
              <FieldCompleteness label="Unique Titles" filled={summary.totalProducts - summary.duplicateTitles} total={summary.totalProducts} />
            </div>
          </div>
        </div>

        {/* Top Issues */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Top Issues Across Feed</h3>
          <div className="space-y-2">
            {summary.issueBreakdown.slice(0, 10).map((issue, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#0f172a] rounded-lg px-4 py-2.5">
                <SeverityBadge severity={issue.severity} />
                <span className="text-sm text-[#e2e8f0] flex-1">{issue.issue}</span>
                <span className="text-xs font-mono text-[#94a3b8]">{issue.count} product{issue.count !== 1 ? "s" : ""}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product List */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
          <div className="p-5 border-b border-[#334155]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Product Feed Review</h3>
              <span className="text-xs text-[#64748b]">{filtered.length} of {products.length}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, SKU, or brand..."
                className="flex-1 bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#3b82f6]"
              />
              <div className="flex gap-1">
                {([
                  ["all", "All"],
                  ["errors", "Errors"],
                  ["warnings", "Warnings"],
                  ["disapproved", "Disapproved"],
                  ["pending", "Pending"],
                  ["out_of_stock", "Stockouts"],
                ] as [FilterMode, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      filter === key ? "bg-[#3b82f6] text-white" : "text-[#94a3b8] hover:bg-[#0f172a]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="divide-y divide-[#334155]">
            {filtered.map((product) => {
              const errorCount = product.issues.filter((i) => i.severity === "error").length;
              const warnCount = product.issues.filter((i) => i.severity === "warning").length;
              const isExpanded = expandedProduct === product.id;

              return (
                <div key={product.id} className="group">
                  <div
                    className="px-5 py-4 cursor-pointer hover:bg-[#0f172a]/50 transition-colors"
                    onClick={() => setExpandedProduct(isExpanded ? null : product.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#0f172a] border border-[#334155] flex items-center justify-center text-[10px] text-[#64748b] shrink-0 overflow-hidden">
                        {product.imageLink ? "IMG" : "---"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm text-white font-medium truncate">{product.title || "Untitled"}</span>
                          <StatusBadge status={product.status} />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#64748b]">
                          <span className="font-mono">{product.offerId}</span>
                          <span>{product.price}</span>
                          <AvailabilityBadge availability={product.availability} />
                          {product.brand && <span>{product.brand}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {errorCount > 0 && <span className="px-2 py-0.5 bg-[#ef4444]/20 text-[#ef4444] rounded text-xs font-medium">{errorCount} error{errorCount !== 1 ? "s" : ""}</span>}
                        {warnCount > 0 && <span className="px-2 py-0.5 bg-[#f59e0b]/20 text-[#f59e0b] rounded text-xs font-medium">{warnCount} warn</span>}
                        {product.issues.length === 0 && <span className="px-2 py-0.5 bg-[#10b981]/20 text-[#10b981] rounded text-xs font-medium">Perfect</span>}
                        <span className={`text-[#64748b] transition-transform ${isExpanded ? "rotate-180" : ""}`}>&#9662;</span>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-4">
                      {/* All Fields */}
                      <div className="bg-[#0f172a] rounded-lg p-4">
                        <h4 className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-3">All Fields</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-xs">
                          {([
                            ["Offer ID", product.offerId],
                            ["Title", product.title],
                            ["Brand", product.brand],
                            ["GTIN", product.gtin],
                            ["MPN", product.mpn],
                            ["Condition", product.condition],
                            ["Price", product.price],
                            ["Sale Price", product.salePrice],
                            ["Availability", product.availability],
                            ["Google Category", product.googleProductCategory],
                            ["Product Type", product.productType],
                            ["Color", product.color],
                            ["Size", product.size],
                            ["Material", product.material],
                            ["Gender", product.gender],
                            ["Age Group", product.ageGroup],
                            ["Shipping Weight", product.shippingWeight],
                            ["Item Group ID", product.itemGroupId],
                            ["Custom Label 0", product.customLabel0],
                            ["Custom Label 1", product.customLabel1],
                            ["Last Updated", product.lastUpdated],
                            ["Images", `1 primary + ${product.additionalImages.length} additional`],
                          ] as [string, string | null][]).map(([label, value]) => (
                            <div key={label} className="flex gap-2">
                              <span className="text-[#64748b] shrink-0 w-28">{label}:</span>
                              <span className={value ? "text-[#e2e8f0]" : "text-[#ef4444] italic"}>{value || "Missing"}</span>
                            </div>
                          ))}
                        </div>
                        {product.description && (
                          <div className="mt-3 pt-3 border-t border-[#334155]">
                            <span className="text-[#64748b] text-xs">Description ({product.description.length} chars):</span>
                            <p className="text-xs text-[#e2e8f0] mt-1 leading-relaxed">{product.description}</p>
                          </div>
                        )}
                      </div>

                      {/* Issues & Fixes */}
                      {product.issues.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">Issues & Recommended Fixes</h4>
                          {product.issues.map((issue, i) => (
                            <div key={i} className={`rounded-lg p-3 border ${
                              issue.severity === "error" ? "bg-[#ef4444]/5 border-[#ef4444]/20" :
                              issue.severity === "warning" ? "bg-[#f59e0b]/5 border-[#f59e0b]/20" :
                              "bg-[#3b82f6]/5 border-[#3b82f6]/20"
                            }`}>
                              <div className="flex items-start gap-2">
                                <SeverityBadge severity={issue.severity} />
                                <div className="flex-1">
                                  <p className="text-xs text-[#e2e8f0]">
                                    <span className="font-mono text-[#94a3b8]">{issue.field}</span> — {issue.message}
                                  </p>
                                  {issue.fix && (
                                    <p className="text-xs text-[#10b981] mt-1">Fix: {issue.fix}</p>
                                  )}
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
        </div>

        {/* Category Breakdown */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Category Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {summary.categoryBreakdown.map((cat) => (
              <div key={cat.category} className="bg-[#0f172a] rounded-lg p-3">
                <p className="text-sm font-medium text-white">{cat.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-[#94a3b8]">{cat.count} products</span>
                  {cat.issues > 0 ? (
                    <span className="text-xs text-[#f59e0b]">{cat.issues} with issues</span>
                  ) : (
                    <span className="text-xs text-[#10b981]">All clean</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
