"use client";

import KPICard from "@/components/KPICard";
import ChartWrapper from "@/components/ChartWrapper";
import { mockDashboardData } from "@/lib/mock-data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Line, Area, Legend,
} from "recharts";

export default function PnLPage() {
  const { pnl } = mockDashboardData;

  // Add cumulative margin data
  const pnlWithMargin = pnl.monthlyPnL.map((m) => ({
    ...m,
    grossProfit: m.revenue - m.cogs,
    grossMargin: ((m.revenue - m.cogs) / m.revenue * 100).toFixed(1),
    netMargin: (m.netProfit / m.revenue * 100).toFixed(1),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">P&L / Margins</h2>
        <p className="text-[#94a3b8]">Profitability analysis, cost breakdown, and ROAS tracking</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Net Profit" value={`$${(pnl.netProfit / 1000).toFixed(0)}K`} change="+23.4%" changeType="positive" />
        <KPICard title="Gross Margin" value={`${pnl.grossMargin}%`} change="+1.2%" changeType="positive" />
        <KPICard title="Net Margin" value={`${pnl.netMargin}%`} change="+2.3%" changeType="positive" />
        <KPICard title="ROAS" value={`${pnl.roas}x`} change="+0.8x" changeType="positive" />
      </div>

      {/* P&L Summary Card */}
      <ChartWrapper title="P&L Summary" subtitle="Full period breakdown">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="bg-[#0f172a] rounded-lg p-4 border-l-4 border-[#3b82f6]">
            <p className="text-sm text-[#94a3b8]">Revenue</p>
            <p className="text-xl font-bold text-white">${(pnl.revenue / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-[#0f172a] rounded-lg p-4 border-l-4 border-[#ef4444]">
            <p className="text-sm text-[#94a3b8]">COGS</p>
            <p className="text-xl font-bold text-white">-${(pnl.cogs / 1000).toFixed(0)}K</p>
            <p className="text-xs text-[#94a3b8]">{((pnl.cogs / pnl.revenue) * 100).toFixed(0)}% of revenue</p>
          </div>
          <div className="bg-[#0f172a] rounded-lg p-4 border-l-4 border-[#f59e0b]">
            <p className="text-sm text-[#94a3b8]">Ad Spend</p>
            <p className="text-xl font-bold text-white">-${(pnl.adSpend / 1000).toFixed(0)}K</p>
            <p className="text-xs text-[#94a3b8]">{((pnl.adSpend / pnl.revenue) * 100).toFixed(0)}% of revenue</p>
          </div>
          <div className="bg-[#0f172a] rounded-lg p-4 border-l-4 border-[#10b981]">
            <p className="text-sm text-[#94a3b8]">Net Profit</p>
            <p className="text-xl font-bold text-[#10b981]">${(pnl.netProfit / 1000).toFixed(0)}K</p>
            <p className="text-xs text-[#94a3b8]">{pnl.netMargin}% margin</p>
          </div>
        </div>
      </ChartWrapper>

      {/* Revenue vs Costs */}
      <ChartWrapper title="Monthly Revenue vs Costs" subtitle="Stacked cost breakdown against revenue">
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={pnlWithMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} interval={2} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} formatter={(value: any) => [typeof value === "number" ? `$${value.toLocaleString()}` : value]} />
            <Legend />
            <Bar dataKey="cogs" name="COGS" stackId="costs" fill="#ef4444" fillOpacity={0.7} />
            <Bar dataKey="adSpend" name="Ad Spend" stackId="costs" fill="#f59e0b" fillOpacity={0.7} />
            <Bar dataKey="opex" name="Operating Expenses" stackId="costs" fill="#8b5cf6" fillOpacity={0.7} />
            <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Margin Trends */}
      <ChartWrapper title="Margin Trends" subtitle="Gross and net margin over time">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={pnlWithMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} interval={2} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[0, 80]} />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} formatter={(value: any) => [`${value}%`]} />
            <Legend />
            <Area type="monotone" dataKey="grossMargin" name="Gross Margin" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
            <Line type="monotone" dataKey="netMargin" name="Net Margin" stroke="#10b981" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Net Profit Trend */}
      <ChartWrapper title="Net Profit Trend" subtitle="Monthly bottom line">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={pnlWithMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} interval={2} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} formatter={(value: any) => [`$${value.toLocaleString()}`]} />
            <Bar dataKey="netProfit" name="Net Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Ad Performance */}
      <ChartWrapper title="Advertising Efficiency" subtitle="ROAS and ad spend analysis">
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="bg-[#0f172a] rounded-lg p-4 text-center">
            <p className="text-sm text-[#94a3b8]">Total Ad Spend</p>
            <p className="text-2xl font-bold text-white">${(pnl.adSpend / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-[#0f172a] rounded-lg p-4 text-center">
            <p className="text-sm text-[#94a3b8]">Revenue from Ads</p>
            <p className="text-2xl font-bold text-white">${((pnl.adSpend * pnl.roas) / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-[#0f172a] rounded-lg p-4 text-center">
            <p className="text-sm text-[#94a3b8]">Blended ROAS</p>
            <p className="text-2xl font-bold text-[#10b981]">{pnl.roas}x</p>
            <p className="text-xs text-[#94a3b8]">Target: 4x+</p>
          </div>
        </div>
      </ChartWrapper>
    </div>
  );
}
