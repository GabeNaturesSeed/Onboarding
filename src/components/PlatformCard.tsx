"use client";

import { useState } from "react";
import { PlatformInfo } from "@/lib/platforms";

interface PlatformCardProps {
  platform: PlatformInfo;
  isConnected: boolean;
  onConnect: (platformId: string, credentials: Record<string, string>) => void;
}

export default function PlatformCard({ platform, isConnected, onConnect }: PlatformCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    // Simulate API connection
    await new Promise((r) => setTimeout(r, 1500));
    onConnect(platform.id, credentials);
    setConnecting(false);
    setExpanded(false);
  };

  return (
    <div className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-[#334155]/30 transition-colors"
        onClick={() => !isConnected && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: platform.color + "20", color: platform.color }}
          >
            {platform.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-white">{platform.name}</h3>
            <p className="text-sm text-[#94a3b8]">{platform.description}</p>
          </div>
        </div>
        <div>
          {isConnected ? (
            <span className="px-3 py-1 bg-[#10b981]/20 text-[#10b981] rounded-full text-sm font-medium">
              Connected
            </span>
          ) : (
            <span className="px-3 py-1 bg-[#334155] text-[#94a3b8] rounded-full text-sm">
              {expanded ? "Configure" : "Connect"}
            </span>
          )}
        </div>
      </div>

      {expanded && !isConnected && (
        <div className="px-5 pb-5 border-t border-[#334155]">
          <div className="pt-4 space-y-3">
            {platform.fields.map((field) => (
              <div key={field.key}>
                <label className="text-sm text-[#94a3b8] block mb-1">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6]"
                    placeholder={field.placeholder}
                    rows={3}
                    onChange={(e) => setCredentials({ ...credentials, [field.key]: e.target.value })}
                  />
                ) : (
                  <input
                    type={field.type}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6]"
                    placeholder={field.placeholder}
                    onChange={(e) => setCredentials({ ...credentials, [field.key]: e.target.value })}
                  />
                )}
              </div>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-[#2563eb] transition-colors disabled:opacity-50"
              >
                {connecting ? "Connecting..." : "Connect & Sync"}
              </button>
              <div className="flex flex-wrap gap-1">
                {platform.dataPoints.map((dp) => (
                  <span key={dp} className="text-xs bg-[#0f172a] text-[#94a3b8] px-2 py-1 rounded">
                    {dp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
