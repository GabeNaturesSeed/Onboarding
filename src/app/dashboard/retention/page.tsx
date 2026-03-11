"use client";

import KPICard from "@/components/KPICard";
import ChartWrapper from "@/components/ChartWrapper";
import { mockDashboardData } from "@/lib/mock-data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export default function RetentionPage() {
  const { retention } = mockDashboardData;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Retention & Email Marketing</h2>
        <p className="text-[#94a3b8]">Customer lifecycle, retention cohorts, and email/SMS performance</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Repeat Customer Rate" value={`${retention.repeatCustomerRate}%`} change="+4.2%" changeType="positive" />
        <KPICard title="Customer LTV" value={`$${retention.customerLifetimeValue}`} change="+12.1%" changeType="positive" />
        <KPICard title="Churn Rate" value={`${retention.churnRate}%`} change="-0.8%" changeType="positive" />
        <KPICard title="Email Subscribers" value={`${(retention.emailMetrics.subscribers / 1000).toFixed(1)}K`} change="+2.1K" changeType="positive" />
      </div>

      {/* Cohort Retention Table */}
      <ChartWrapper title="Cohort Retention Analysis" subtitle="Percentage of customers retained over time">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#94a3b8]">
                <th className="text-left py-2 px-3">Cohort</th>
                <th className="text-center py-2 px-3">Month 1</th>
                <th className="text-center py-2 px-3">Month 3</th>
                <th className="text-center py-2 px-3">Month 6</th>
                <th className="text-center py-2 px-3">Month 12</th>
              </tr>
            </thead>
            <tbody>
              {retention.cohortRetention.map((cohort) => (
                <tr key={cohort.cohort} className="border-t border-[#334155]">
                  <td className="py-3 px-3 text-white font-medium">{cohort.cohort}</td>
                  {[cohort.month1, cohort.month3, cohort.month6, cohort.month12].map((val, i) => (
                    <td key={i} className="text-center py-3 px-3">
                      {val > 0 ? (
                        <span
                          className="inline-block px-3 py-1 rounded text-white text-sm font-medium"
                          style={{
                            backgroundColor: `rgba(59, 130, 246, ${Math.max(0.15, val / 100)})`,
                          }}
                        >
                          {val}%
                        </span>
                      ) : (
                        <span className="text-[#334155]">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartWrapper>

      {/* Cohort Chart */}
      <ChartWrapper title="Retention by Cohort" subtitle="Visual comparison of cohort retention">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={retention.cohortRetention}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="cohort" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} formatter={(value: any) => [`${value}%`]} />
            <Legend />
            <Bar dataKey="month3" name="3 Months" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="month6" name="6 Months" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="month12" name="12 Months" fill="#10b981" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Email Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper title="Email/SMS Performance" subtitle="Klaviyo engagement metrics">
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-[#0f172a] rounded-lg p-4">
              <p className="text-sm text-[#94a3b8]">Open Rate</p>
              <p className="text-2xl font-bold text-white">{retention.emailMetrics.openRate}%</p>
              <div className="w-full bg-[#334155] rounded-full h-2 mt-2">
                <div className="h-2 rounded-full bg-[#3b82f6]" style={{ width: `${retention.emailMetrics.openRate}%` }} />
              </div>
            </div>
            <div className="bg-[#0f172a] rounded-lg p-4">
              <p className="text-sm text-[#94a3b8]">Click Rate</p>
              <p className="text-2xl font-bold text-white">{retention.emailMetrics.clickRate}%</p>
              <div className="w-full bg-[#334155] rounded-full h-2 mt-2">
                <div className="h-2 rounded-full bg-[#10b981]" style={{ width: `${retention.emailMetrics.clickRate * 10}%` }} />
              </div>
            </div>
            <div className="bg-[#0f172a] rounded-lg p-4">
              <p className="text-sm text-[#94a3b8]">Subscribers</p>
              <p className="text-2xl font-bold text-white">{(retention.emailMetrics.subscribers / 1000).toFixed(1)}K</p>
            </div>
            <div className="bg-[#0f172a] rounded-lg p-4">
              <p className="text-sm text-[#94a3b8]">Total Email Revenue</p>
              <p className="text-2xl font-bold text-white">${(retention.emailMetrics.revenueFromEmail / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </ChartWrapper>

        <ChartWrapper title="Email Revenue Split" subtitle="Flow automation vs campaign revenue">
          <div className="space-y-6 pt-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#94a3b8]">Flow Revenue (Automations)</span>
                <span className="text-white font-medium">${(retention.emailMetrics.flowRevenue / 1000).toFixed(0)}K</span>
              </div>
              <div className="w-full bg-[#0f172a] rounded-full h-4">
                <div
                  className="h-4 rounded-full bg-[#8b5cf6] flex items-center justify-center text-xs text-white"
                  style={{ width: `${(retention.emailMetrics.flowRevenue / retention.emailMetrics.revenueFromEmail * 100).toFixed(0)}%` }}
                >
                  {(retention.emailMetrics.flowRevenue / retention.emailMetrics.revenueFromEmail * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#94a3b8]">Campaign Revenue</span>
                <span className="text-white font-medium">${(retention.emailMetrics.campaignRevenue / 1000).toFixed(0)}K</span>
              </div>
              <div className="w-full bg-[#0f172a] rounded-full h-4">
                <div
                  className="h-4 rounded-full bg-[#3b82f6] flex items-center justify-center text-xs text-white"
                  style={{ width: `${(retention.emailMetrics.campaignRevenue / retention.emailMetrics.revenueFromEmail * 100).toFixed(0)}%` }}
                >
                  {(retention.emailMetrics.campaignRevenue / retention.emailMetrics.revenueFromEmail * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            <div className="bg-[#0f172a] rounded-lg p-4 mt-4">
              <p className="text-sm text-[#94a3b8] mb-1">Email as % of Total Revenue</p>
              <p className="text-xl font-bold text-white">15%</p>
              <p className="text-xs text-[#94a3b8]">Industry benchmark: 20-30% — room to grow</p>
            </div>
          </div>
        </ChartWrapper>
      </div>
    </div>
  );
}
