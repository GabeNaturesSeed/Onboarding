"use client";

import { useState } from "react";
import PlatformCard from "@/components/PlatformCard";
import { platforms } from "@/lib/platforms";

type Step = "info" | "platforms" | "review";

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("info");
  const [clientInfo, setClientInfo] = useState({
    name: "",
    businessName: "",
    email: "",
    industry: "",
    monthlyRevenue: "",
    website: "",
  });
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);

  const handleConnect = (platformId: string) => {
    setConnectedPlatforms((prev) => [...prev, platformId]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Onboard New Client</h2>
        <p className="text-[#94a3b8]">Connect their platforms and start pulling data</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4">
        {(["info", "platforms", "review"] as Step[]).map((s, i) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              step === s
                ? "bg-[#3b82f6] text-white"
                : "bg-[#1e293b] text-[#94a3b8] border border-[#334155]"
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-[#0f172a] flex items-center justify-center text-xs">
              {i + 1}
            </span>
            {s === "info" ? "Client Info" : s === "platforms" ? "Connect Platforms" : "Review & Launch"}
          </button>
        ))}
      </div>

      {/* Step 1: Client Info */}
      {step === "info" && (
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Client Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#94a3b8] block mb-1">Contact Name</label>
              <input
                type="text"
                value={clientInfo.name}
                onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6]"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="text-sm text-[#94a3b8] block mb-1">Business Name</label>
              <input
                type="text"
                value={clientInfo.businessName}
                onChange={(e) => setClientInfo({ ...clientInfo, businessName: e.target.value })}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6]"
                placeholder="Awesome Store LLC"
              />
            </div>
            <div>
              <label className="text-sm text-[#94a3b8] block mb-1">Email</label>
              <input
                type="email"
                value={clientInfo.email}
                onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6]"
                placeholder="jane@awesomestore.com"
              />
            </div>
            <div>
              <label className="text-sm text-[#94a3b8] block mb-1">Industry</label>
              <select
                value={clientInfo.industry}
                onChange={(e) => setClientInfo({ ...clientInfo, industry: e.target.value })}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6]"
              >
                <option value="">Select industry...</option>
                <option value="Health & Beauty">Health & Beauty</option>
                <option value="Fashion & Apparel">Fashion & Apparel</option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Electronics">Electronics</option>
                <option value="Pets">Pets</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-[#94a3b8] block mb-1">Monthly Revenue (approx)</label>
              <select
                value={clientInfo.monthlyRevenue}
                onChange={(e) => setClientInfo({ ...clientInfo, monthlyRevenue: e.target.value })}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6]"
              >
                <option value="">Select range...</option>
                <option value="<$10K">&lt;$10K</option>
                <option value="$10K-$50K">$10K-$50K</option>
                <option value="$50K-$100K">$50K-$100K</option>
                <option value="$100K-$500K">$100K-$500K</option>
                <option value="$500K-$1M">$500K-$1M</option>
                <option value="$1M+">$1M+</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-[#94a3b8] block mb-1">Website URL</label>
              <input
                type="text"
                value={clientInfo.website}
                onChange={(e) => setClientInfo({ ...clientInfo, website: e.target.value })}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6]"
                placeholder="https://awesomestore.com"
              />
            </div>
          </div>
          <div className="pt-4">
            <button
              onClick={() => setStep("platforms")}
              className="px-6 py-2.5 bg-[#3b82f6] text-white rounded-lg font-medium hover:bg-[#2563eb] transition-colors"
            >
              Next: Connect Platforms
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Platform Connections */}
      {step === "platforms" && (
        <div className="space-y-4">
          <p className="text-sm text-[#94a3b8]">
            Connect the client&apos;s platforms to start pulling historical data. You can always add more later.
          </p>
          {platforms.map((platform) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              isConnected={connectedPlatforms.includes(platform.id)}
              onConnect={handleConnect}
            />
          ))}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setStep("info")}
              className="px-6 py-2.5 bg-[#1e293b] text-white rounded-lg font-medium border border-[#334155] hover:bg-[#334155] transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep("review")}
              className="px-6 py-2.5 bg-[#3b82f6] text-white rounded-lg font-medium hover:bg-[#2563eb] transition-colors"
            >
              Next: Review
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === "review" && (
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white">Review & Launch</h3>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[#94a3b8] uppercase tracking-wider">Client Info</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(clientInfo).map(([key, value]) => (
                <div key={key} className="bg-[#0f172a] rounded-lg p-3">
                  <p className="text-xs text-[#94a3b8] capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                  <p className="text-sm text-white">{value || "—"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[#94a3b8] uppercase tracking-wider">Connected Platforms</h4>
            <div className="flex flex-wrap gap-2">
              {connectedPlatforms.length > 0 ? (
                connectedPlatforms.map((id) => {
                  const p = platforms.find((pl) => pl.id === id);
                  return (
                    <span key={id} className="px-3 py-1 bg-[#10b981]/20 text-[#10b981] rounded-full text-sm">
                      {p?.name}
                    </span>
                  );
                })
              ) : (
                <p className="text-sm text-[#94a3b8]">No platforms connected yet</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setStep("platforms")}
              className="px-6 py-2.5 bg-[#1e293b] text-white rounded-lg font-medium border border-[#334155] hover:bg-[#334155] transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => alert("Client onboarded! In production, this would save to the database and begin the data sync.")}
              className="px-6 py-2.5 bg-[#10b981] text-white rounded-lg font-medium hover:bg-[#059669] transition-colors"
            >
              Launch Onboarding & Start Data Sync
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
