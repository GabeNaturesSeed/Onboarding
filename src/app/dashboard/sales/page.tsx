"use client";

import KPICard from "@/components/KPICard";
import ChartWrapper from "@/components/ChartWrapper";
import { mockDashboardData } from "@/lib/mock-data";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ComposedChart, Line, Legend,
} from "recharts";

export default function SalesPage() {
  const { sales } = mockDashboardData;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Sales & Revenue</h2>
        <p className="text-[#94a3b8]">Deep dive into sales performance across all channels</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Revenue" value={`$${(sales.totalRevenue / 1000).toFixed(0)}K`} change="+18.3%" changeType="positive" />
        <KPICard title="Total Orders" value={sales.totalOrders.toLocaleString()} change="+14.7%" changeType="positive" />
        <KPICard title="Avg Order Value" value={`$${sales.averageOrderValue.toFixed(2)}`} change="+3.1%" changeType="positive" />
        <KPICard title="Revenue/Order Growth" value="+$2.28" change="MoM" changeType="neutral" />
      </div>

      <ChartWrapper title="Revenue & Orders Trend" subtitle="Monthly revenue with order volume overlay">
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={sales.revenueByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} interval={2} />
            <YAxis yAxisId="revenue" tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
            <YAxis yAxisId="orders" orientation="right" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
            <Legend />
            <Area yAxisId="revenue" type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
            <Line yAxisId="orders" type="monotone" dataKey="orders" name="Orders" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper title="Top Products by Revenue" subtitle="Best performing SKUs">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sales.topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} width={140} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} formatter={(value: any) => [`$${value.toLocaleString()}`]} />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper title="Revenue by Channel" subtitle="Sales attribution">
          <div className="space-y-4 pt-2">
            {sales.revenueByChannel.map((channel) => (
              <div key={channel.channel}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#94a3b8]">{channel.channel}</span>
                  <span className="text-white font-medium">${(channel.revenue / 1000).toFixed(0)}K ({channel.percentage}%)</span>
                </div>
                <div className="w-full bg-[#0f172a] rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-[#3b82f6] transition-all"
                    style={{ width: `${channel.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartWrapper>
      </div>

      <ChartWrapper title="Units Sold — Top Products" subtitle="Volume comparison">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={sales.topProducts}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
            <Bar dataKey="unitsSold" name="Units Sold" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}
