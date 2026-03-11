"use client";

import { mockClients } from "@/lib/mock-data";
import { platforms } from "@/lib/platforms";
import Link from "next/link";

export default function ClientsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Clients</h2>
          <p className="text-[#94a3b8]">Manage your onboarded e-commerce clients</p>
        </div>
        <Link
          href="/onboarding"
          className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-[#2563eb] transition-colors"
        >
          + Onboard New Client
        </Link>
      </div>

      <div className="space-y-4">
        {mockClients.map((client) => (
          <div key={client.id} className="bg-[#1e293b] rounded-xl border border-[#334155] p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{client.businessName}</h3>
                <p className="text-sm text-[#94a3b8]">{client.name} — {client.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-[#0f172a] text-[#94a3b8] px-2 py-1 rounded">{client.industry}</span>
                  <span className="text-xs bg-[#0f172a] text-[#94a3b8] px-2 py-1 rounded">{client.monthlyRevenue}/mo</span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  client.onboardingStatus === "complete"
                    ? "bg-[#10b981]/20 text-[#10b981]"
                    : client.onboardingStatus === "in-progress"
                    ? "bg-[#f59e0b]/20 text-[#f59e0b]"
                    : "bg-[#334155] text-[#94a3b8]"
                }`}
              >
                {client.onboardingStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {client.connectedPlatforms.map((conn) => {
                const platformInfo = platforms.find((p) => p.id === conn.platform);
                return (
                  <div
                    key={conn.platform}
                    className={`rounded-lg p-3 text-center ${
                      conn.status === "connected"
                        ? "bg-[#10b981]/10 border border-[#10b981]/30"
                        : conn.status === "error"
                        ? "bg-[#ef4444]/10 border border-[#ef4444]/30"
                        : "bg-[#0f172a] border border-[#334155]"
                    }`}
                  >
                    <p className="text-xs font-medium text-white">{platformInfo?.name}</p>
                    <p
                      className={`text-xs mt-1 ${
                        conn.status === "connected"
                          ? "text-[#10b981]"
                          : conn.status === "error"
                          ? "text-[#ef4444]"
                          : "text-[#94a3b8]"
                      }`}
                    >
                      {conn.status}
                    </p>
                    {conn.lastSync && (
                      <p className="text-[10px] text-[#94a3b8] mt-1">
                        {new Date(conn.lastSync).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
