"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { mockEnvironments } from "@/lib/mock-environments";
import { mockDashboardData } from "@/lib/mock-data";
import KPICard from "@/components/KPICard";
import ChartWrapper from "@/components/ChartWrapper";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ComposedChart, Line, Legend, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];

export default function FullAnalytics() {
  const params = useParams();
  const env = mockEnvironments.find((e) => e.id === params.id);
  const { sales, traffic, retention, pnl } = mockDashboardData;

  if (!env) return null;

  const pnlWithMargin = pnl.monthlyPnL.map((m) => ({
    ...m,
    grossMargin: ((m.revenue - m.cogs) / m.revenue * 100).toFixed(1),
    netMargin: (m.netProfit / m.revenue * 100).toFixed(1),
  }));

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <header className="border-b border-[#334155] bg-[#1e293b]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href={`/environment/${env.id}`} className="text-[#94a3b8] hover:text-white text-sm transition-colors">&larr; {env.businessName}</Link>
          <div className="h-5 w-px bg-[#334155]" />
          <h1 className="text-lg font-bold text-white">Full Analytics — {env.businessName}</h1>
          <p className="text-xs text-[#94a3b8] ml-auto">Data from local syncs</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <KPICard title="Total Revenue" value={`$${(sales.totalRevenue / 1000).toFixed(0)}K`} change="+18.3%" changeType="positive" />
          <KPICard title="Total Orders" value={sales.totalOrders.toLocaleString()} change="+14.7%" changeType="positive" />
          <KPICard title="Conversion Rate" value={`${traffic.conversionRate}%`} change="+0.4%" changeType="positive" />
          <KPICard title="Customer LTV" value={`$${retention.customerLifetimeValue}`} change="+12.1%" changeType="positive" />
          <KPICard title="Net Margin" value={`${pnl.netMargin}%`} change="+2.3%" changeType="positive" />
        </div>

        {/* Revenue Trend */}
        <ChartWrapper title="Revenue & Orders Trend" subtitle="Monthly revenue with order volume overlay">
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={sales.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} interval={2} />
              <YAxis yAxisId="rev" tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <YAxis yAxisId="ord" orientation="right" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
              <Legend />
              <Area yAxisId="rev" type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
              <Line yAxisId="ord" type="monotone" dataKey="orders" name="Orders" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Sources */}
          <ChartWrapper title="Traffic Over Time" subtitle="From GA4 sync">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={traffic.trafficByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 10 }} interval={3} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
                <Legend />
                <Area type="monotone" dataKey="organic" name="Organic" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Area type="monotone" dataKey="paid" name="Paid" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="direct" name="Direct" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                <Area type="monotone" dataKey="referral" name="Referral" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartWrapper>

          {/* Traffic pie */}
          <ChartWrapper title="Traffic Distribution" subtitle="Session breakdown">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={traffic.trafficBySource} cx="50%" cy="50%" outerRadius={100} dataKey="sessions" nameKey="source">
                  {traffic.trafficBySource.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        {/* P&L */}
        <ChartWrapper title="P&L — Revenue vs Costs" subtitle="Monthly cost stack with revenue line">
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={pnl.monthlyPnL}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} interval={2} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="cogs" name="COGS" stackId="c" fill="#ef4444" fillOpacity={0.7} />
              <Bar dataKey="adSpend" name="Ad Spend" stackId="c" fill="#f59e0b" fillOpacity={0.7} />
              <Bar dataKey="opex" name="OpEx" stackId="c" fill="#8b5cf6" fillOpacity={0.7} />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Margin trends */}
          <ChartWrapper title="Margin Trends" subtitle="Gross and net margin">
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={pnlWithMargin}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 10 }} interval={3} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(v) => `${v}%`} domain={[0, 80]} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
                <Legend />
                <Area type="monotone" dataKey="grossMargin" name="Gross Margin" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
                <Line type="monotone" dataKey="netMargin" name="Net Margin" stroke="#10b981" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartWrapper>

          {/* Retention */}
          <ChartWrapper title="Cohort Retention" subtitle="From customer sync">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={retention.cohortRetention}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="cohort" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="month3" name="3mo" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="month6" name="6mo" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="month12" name="12mo" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        {/* Email / top products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartWrapper title="Email Performance (Klaviyo)" subtitle="From Klaviyo sync">
            <div className="grid grid-cols-2 gap-3 pt-2">
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
          </ChartWrapper>

          <ChartWrapper title="Top Products" subtitle="By revenue">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={sales.topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} width={130} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        {/* P&L Summary */}
        <ChartWrapper title="P&L Summary" subtitle="Full period">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2">
            <div className="bg-[#0f172a] rounded-lg p-4 border-l-4 border-[#3b82f6]">
              <p className="text-xs text-[#94a3b8]">Revenue</p>
              <p className="text-xl font-bold text-white">${(pnl.revenue / 1000).toFixed(0)}K</p>
            </div>
            <div className="bg-[#0f172a] rounded-lg p-4 border-l-4 border-[#ef4444]">
              <p className="text-xs text-[#94a3b8]">COGS</p>
              <p className="text-xl font-bold text-white">-${(pnl.cogs / 1000).toFixed(0)}K</p>
            </div>
            <div className="bg-[#0f172a] rounded-lg p-4 border-l-4 border-[#f59e0b]">
              <p className="text-xs text-[#94a3b8]">Ad Spend</p>
              <p className="text-xl font-bold text-white">-${(pnl.adSpend / 1000).toFixed(0)}K</p>
            </div>
            <div className="bg-[#0f172a] rounded-lg p-4 border-l-4 border-[#8b5cf6]">
              <p className="text-xs text-[#94a3b8]">ROAS</p>
              <p className="text-xl font-bold text-white">{pnl.roas}x</p>
            </div>
            <div className="bg-[#0f172a] rounded-lg p-4 border-l-4 border-[#10b981]">
              <p className="text-xs text-[#94a3b8]">Net Profit</p>
              <p className="text-xl font-bold text-[#10b981]">${(pnl.netProfit / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </ChartWrapper>
      </main>
    </div>
  );
}
