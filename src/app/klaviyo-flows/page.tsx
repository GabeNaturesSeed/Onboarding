"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { allCustomers, computeRFMSegments, defaultRFMConfig } from "@/lib/mock-admin";
import { generateFlowPlan, generateFlowMarkdown, type KlaviyoFlow } from "@/lib/klaviyo-flow-planner";

export default function KlaviyoFlowsPage() {
  const segments = useMemo(() => computeRFMSegments(allCustomers, defaultRFMConfig), []);
  const initialFlows = useMemo(() => generateFlowPlan(segments, "My Store", "E-Commerce"), [segments]);

  const [flows, setFlows] = useState<KlaviyoFlow[]>(initialFlows);
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [approvedFlows, setApprovedFlows] = useState<Set<string>>(new Set());

  const toggleFlow = (id: string) => {
    setFlows((prev) => prev.map((f) => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  const approveFlow = (id: string) => {
    setApprovedFlows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const activeFlow = flows.find((f) => f.id === selectedFlow);
  const enabledCount = flows.filter((f) => f.enabled).length;
  const approvedCount = approvedFlows.size;
  const markdown = generateFlowMarkdown(flows, "My Store", segments);

  const priorityColor = (p: string) =>
    p === "critical" ? "text-[#ef4444]" : p === "high" ? "text-[#f59e0b]" : "text-[#3b82f6]";
  const priorityBg = (p: string) =>
    p === "critical" ? "bg-[#ef4444]/10 border-[#ef4444]/20" : p === "high" ? "bg-[#f59e0b]/10 border-[#f59e0b]/20" : "bg-[#3b82f6]/10 border-[#3b82f6]/20";

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <header className="border-b border-[#334155] bg-[#1e293b]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/connections" className="text-[#94a3b8] hover:text-white text-sm transition-colors">&larr; Connections</Link>
            <div className="h-5 w-px bg-[#334155]" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#ec4899] flex items-center justify-center">
                <span className="text-white text-xs font-bold">K</span>
              </div>
              <h1 className="text-lg font-bold text-white">Klaviyo Flow Plan</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMarkdown(!showMarkdown)}
              className="px-3 py-1.5 text-sm text-[#94a3b8] hover:text-white border border-[#334155] rounded-lg transition-colors"
            >
              {showMarkdown ? "Flow View" : "Export .md"}
            </button>
            <Link href="/report" className="px-3 py-1.5 text-sm text-[#94a3b8] hover:text-white border border-[#334155] rounded-lg transition-colors">
              Overall Report
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Status bar */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Flows", value: flows.length.toString(), sub: `${enabledCount} enabled` },
            { label: "Customer Segments", value: segments.length.toString(), sub: `${allCustomers.length} customers` },
            { label: "Approved", value: `${approvedCount}/${enabledCount}`, sub: approvedCount === enabledCount ? "Ready to deploy" : "Review remaining" },
            { label: "Est. Revenue Impact", value: "$" + Math.round(segments.reduce((a, s) => a + s.revenue, 0) * 0.08 / 100) * 100, sub: "~8% uplift from flows" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
              <p className="text-xs text-[#94a3b8]">{stat.label}</p>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-[#64748b]">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* RFM Segment Summary */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Customer Segments (RFM Analysis)</h3>
          <div className="flex gap-2 flex-wrap">
            {segments.map((seg) => (
              <div key={seg.name} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f172a] border border-[#334155]">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                <span className="text-xs text-white font-medium">{seg.name}</span>
                <span className="text-xs text-[#64748b]">{seg.count} ({seg.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {showMarkdown ? (
          /* Markdown Export View */
          <div className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#334155]">
              <span className="text-sm font-medium text-white">klaviyo-flow-plan.md</span>
              <button
                onClick={() => navigator.clipboard?.writeText(markdown)}
                className="text-xs px-3 py-1 rounded bg-[#3b82f6] text-white hover:bg-[#2563eb] transition-colors"
              >
                Copy to Clipboard
              </button>
            </div>
            <pre className="p-4 text-xs text-[#e2e8f0] font-mono overflow-auto max-h-[600px] whitespace-pre-wrap leading-relaxed">
              {markdown}
            </pre>
          </div>
        ) : (
          /* Flow Cards View */
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Flow list */}
            <div className="lg:col-span-2 space-y-2">
              <h3 className="text-sm font-semibold text-white mb-2">Flows ({enabledCount} active)</h3>
              {flows.map((flow) => (
                <button
                  key={flow.id}
                  onClick={() => setSelectedFlow(selectedFlow === flow.id ? null : flow.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedFlow === flow.id
                      ? "bg-[#3b82f6]/10 border-[#3b82f6]/30"
                      : flow.enabled
                        ? "bg-[#1e293b] border-[#334155] hover:border-[#475569]"
                        : "bg-[#0f172a] border-[#334155] opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{flow.name}</span>
                    <div className="flex items-center gap-2">
                      {approvedFlows.has(flow.id) && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[#10b981]/10 text-[#10b981]">Approved</span>
                      )}
                      <span className={`text-xs font-semibold uppercase ${priorityColor(flow.priority)}`}>{flow.priority}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#94a3b8]">{flow.emails.length} emails &middot; {flow.trigger.split("(")[0]}</p>
                </button>
              ))}
            </div>

            {/* Flow detail */}
            <div className="lg:col-span-3">
              {activeFlow ? (
                <div className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#334155] flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{activeFlow.name}</h3>
                      <p className={`text-xs font-semibold uppercase ${priorityColor(activeFlow.priority)}`}>{activeFlow.priority} priority</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFlow(activeFlow.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          activeFlow.enabled
                            ? "bg-[#10b981]/10 border-[#10b981]/20 text-[#10b981]"
                            : "bg-[#0f172a] border-[#334155] text-[#64748b]"
                        }`}
                      >
                        {activeFlow.enabled ? "Enabled" : "Disabled"}
                      </button>
                      <button
                        onClick={() => approveFlow(activeFlow.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          approvedFlows.has(activeFlow.id)
                            ? "bg-[#10b981] border-[#10b981] text-white"
                            : "bg-[#0f172a] border-[#334155] text-[#94a3b8] hover:border-[#10b981] hover:text-[#10b981]"
                        }`}
                      >
                        {approvedFlows.has(activeFlow.id) ? "Approved" : "Approve"}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className={`rounded-lg p-3 border ${priorityBg(activeFlow.priority)}`}>
                      <p className="text-xs text-[#94a3b8] mb-1">Trigger</p>
                      <p className="text-sm text-white">{activeFlow.trigger}</p>
                    </div>

                    <div className="bg-[#0f172a] rounded-lg p-3 border border-[#334155]">
                      <p className="text-xs text-[#94a3b8] mb-1">Target Segment</p>
                      <p className="text-sm text-white">{activeFlow.segment}</p>
                    </div>

                    <div>
                      <p className="text-xs text-[#94a3b8] mb-2">Email Sequence ({activeFlow.emails.length} emails)</p>
                      <div className="space-y-2">
                        {activeFlow.emails.map((email, i) => (
                          <div key={i} className="bg-[#0f172a] rounded-lg p-3 border border-[#334155]">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="w-5 h-5 rounded-full bg-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center text-xs font-bold">{i + 1}</span>
                              <span className="text-xs text-[#64748b]">{email.delay}</span>
                            </div>
                            <p className="text-sm text-white font-medium mb-1">{email.subject}</p>
                            <p className="text-xs text-[#94a3b8]">{email.purpose}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#10b981]/5 border border-[#10b981]/20 rounded-lg p-3">
                      <p className="text-xs text-[#94a3b8] mb-1">Expected Impact</p>
                      <p className="text-sm text-white">{activeFlow.expectedRevenue}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-8 flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#ec4899]/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-[#8b5cf6]">K</span>
                    </div>
                    <p className="text-sm text-[#94a3b8]">Select a flow to view its email sequence</p>
                    <p className="text-xs text-[#64748b] mt-1">Approve all flows before deploying to Klaviyo</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Implementation Timeline */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Implementation Timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                phase: "Phase 1 — Revenue Recovery",
                timing: "Week 1",
                color: "#ef4444",
                flows: flows.filter((f) => f.priority === "critical" && f.enabled),
              },
              {
                phase: "Phase 2 — Growth & Retention",
                timing: "Week 2-3",
                color: "#f59e0b",
                flows: flows.filter((f) => f.priority === "high" && f.enabled),
              },
              {
                phase: "Phase 3 — Optimization",
                timing: "Week 3-4",
                color: "#3b82f6",
                flows: flows.filter((f) => f.priority === "medium" && f.enabled),
              },
            ].map((phase) => (
              <div key={phase.phase} className="bg-[#0f172a] rounded-lg border border-[#334155] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: phase.color }} />
                  <span className="text-xs font-semibold text-white">{phase.phase}</span>
                </div>
                <p className="text-xs text-[#64748b] mb-2">{phase.timing}</p>
                <div className="space-y-1">
                  {phase.flows.map((f) => (
                    <div key={f.id} className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-sm flex items-center justify-center text-[8px] ${approvedFlows.has(f.id) ? "bg-[#10b981] text-white" : "border border-[#334155]"}`}>
                        {approvedFlows.has(f.id) && "\u2713"}
                      </span>
                      <span className="text-xs text-[#e2e8f0]">{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deploy Status */}
        <div className="bg-[#0f172a] rounded-xl border border-[#334155] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white mb-1">Ready to Deploy?</h3>
              <p className="text-xs text-[#94a3b8]">
                {approvedCount === 0
                  ? "Review and approve flows above before deploying to Klaviyo."
                  : approvedCount < enabledCount
                    ? `${approvedCount} of ${enabledCount} flows approved. Review remaining flows.`
                    : "All flows approved! Ready to build in Klaviyo."}
              </p>
            </div>
            <button
              disabled={approvedCount === 0}
              className="px-6 py-2.5 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-30"
            >
              Deploy to Klaviyo ({approvedCount} flows)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
