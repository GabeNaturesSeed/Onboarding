"use client";

import KPICard from "@/components/KPICard";
import ChartWrapper from "@/components/ChartWrapper";
import { mockDashboardData } from "@/lib/mock-data";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];

export default function TrafficPage() {
  const { traffic } = mockDashboardData;

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Traffic & Conversion</h2>
        <p className="text-[#94a3b8]">Website performance, traffic sources, and conversion analysis</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Sessions" value={`${(traffic.totalSessions / 1000).toFixed(0)}K`} change="+22.4%" changeType="positive" />
        <KPICard title="Unique Visitors" value={`${(traffic.uniqueVisitors / 1000).toFixed(0)}K`} change="+19.8%" changeType="positive" />
        <KPICard title="Conversion Rate" value={`${traffic.conversionRate}%`} change="+0.4%" changeType="positive" />
        <KPICard title="Bounce Rate" value={`${traffic.bounceRate}%`} change="-2.1%" changeType="positive" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <KPICard title="Avg Session Duration" value={formatDuration(traffic.avgSessionDuration)} />
        <KPICard title="Pageviews" value={`${(traffic.pageviews / 1000000).toFixed(2)}M`} />
        <KPICard title="Pages/Session" value={(traffic.pageviews / traffic.totalSessions).toFixed(1)} />
      </div>

      <ChartWrapper title="Traffic Over Time by Source" subtitle="Organic, paid, direct, and referral traffic trends">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={traffic.trafficByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} interval={2} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
            <Legend />
            <Area type="monotone" dataKey="organic" name="Organic" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            <Area type="monotone" dataKey="paid" name="Paid" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            <Area type="monotone" dataKey="direct" name="Direct" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
            <Area type="monotone" dataKey="referral" name="Referral" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper title="Traffic Distribution" subtitle="Sessions by source">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={traffic.trafficBySource} cx="50%" cy="50%" outerRadius={110} dataKey="sessions" nameKey="source">
                {traffic.trafficBySource.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} formatter={(value: any) => [value.toLocaleString(), "Sessions"]} />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper title="Traffic Source Breakdown" subtitle="Detailed session counts">
          <div className="space-y-4 pt-2">
            {traffic.trafficBySource.map((source, i) => (
              <div key={source.source}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#94a3b8]">{source.source}</span>
                  <span className="text-white font-medium">{source.sessions.toLocaleString()} ({source.percentage}%)</span>
                </div>
                <div className="w-full bg-[#0f172a] rounded-full h-3">
                  <div className="h-3 rounded-full transition-all" style={{ width: `${source.percentage}%`, backgroundColor: COLORS[i] }} />
                </div>
              </div>
            ))}
          </div>
        </ChartWrapper>
      </div>
    </div>
  );
}
