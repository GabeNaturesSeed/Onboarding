"use client";

import KPICard from "@/components/KPICard";
import ChartWrapper from "@/components/ChartWrapper";
import { mockDashboardData, mockClients } from "@/lib/mock-data";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];

export default function DashboardOverview() {
  const { sales, traffic, retention, pnl } = mockDashboardData;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <p className="text-[#94a3b8]">Bloom & Grow Botanicals — Last 26 months</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={`$${(sales.totalRevenue / 1000).toFixed(0)}K`}
          change="+18.3%"
          changeType="positive"
          subtitle="vs prior period"
        />
        <KPICard
          title="Conversion Rate"
          value={`${traffic.conversionRate}%`}
          change="+0.4%"
          changeType="positive"
          subtitle="vs prior period"
        />
        <KPICard
          title="Customer LTV"
          value={`$${retention.customerLifetimeValue}`}
          change="+12.1%"
          changeType="positive"
          subtitle="vs prior period"
        />
        <KPICard
          title="Net Margin"
          value={`${pnl.netMargin}%`}
          change="+2.3%"
          changeType="positive"
          subtitle="vs prior period"
        />
      </div>

      {/* Revenue Trend */}
      <ChartWrapper title="Revenue Trend" subtitle="Monthly revenue over time">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={sales.revenueByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} interval={2} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
              labelStyle={{ color: "#f8fafc" }}
              formatter={(value: any) => [`$${value.toLocaleString()}`, "Revenue"]}
            />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Two column charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper title="Traffic Sources" subtitle="Session distribution by source">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={traffic.trafficBySource}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="sessions"
                nameKey="source"
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {traffic.trafficBySource.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                formatter={(value: any) => [value.toLocaleString(), "Sessions"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper title="Revenue by Channel" subtitle="Where the money comes from">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sales.revenueByChannel} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="channel" tick={{ fill: "#94a3b8", fontSize: 11 }} width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* Quick P&L */}
      <ChartWrapper title="Monthly P&L" subtitle="Revenue vs costs breakdown">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pnl.monthlyPnL}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} interval={2} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
              formatter={(value: any) => [`$${value.toLocaleString()}`]}
            />
            <Legend />
            <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="cogs" name="COGS" fill="#ef4444" radius={[2, 2, 0, 0]} />
            <Bar dataKey="adSpend" name="Ad Spend" fill="#f59e0b" radius={[2, 2, 0, 0]} />
            <Bar dataKey="netProfit" name="Net Profit" fill="#10b981" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Client Quick View */}
      <ChartWrapper title="Clients" subtitle="Current onboarding status">
        <div className="space-y-3">
          {mockClients.map((client) => (
            <div key={client.id} className="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg">
              <div>
                <p className="font-medium text-white">{client.businessName}</p>
                <p className="text-sm text-[#94a3b8]">{client.name} — {client.industry}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#94a3b8]">{client.monthlyRevenue}/mo</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    client.onboardingStatus === "complete"
                      ? "bg-[#10b981]/20 text-[#10b981]"
                      : client.onboardingStatus === "in-progress"
                      ? "bg-[#f59e0b]/20 text-[#f59e0b]"
                      : "bg-[#334155] text-[#94a3b8]"
                  }`}
                >
                  {client.onboardingStatus}
                </span>
                <div className="flex gap-1">
                  {client.connectedPlatforms
                    .filter((p) => p.status === "connected")
                    .map((p) => (
                      <span key={p.platform} className="w-2 h-2 rounded-full bg-[#10b981]" title={p.platform} />
                    ))}
                  {client.connectedPlatforms
                    .filter((p) => p.status !== "connected")
                    .map((p) => (
                      <span key={p.platform} className="w-2 h-2 rounded-full bg-[#334155]" title={p.platform} />
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ChartWrapper>
    </div>
  );
}
