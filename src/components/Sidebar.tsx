"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/sales", label: "Sales & Revenue", icon: "💰" },
  { href: "/dashboard/traffic", label: "Traffic & Conversion", icon: "📈" },
  { href: "/dashboard/retention", label: "Retention & Email", icon: "🔄" },
  { href: "/dashboard/pnl", label: "P&L / Margins", icon: "📋" },
  { href: "/dashboard/clients", label: "Clients", icon: "👥" },
  { href: "/onboarding", label: "Onboard New Client", icon: "➕" },
  { href: "/setup-guide", label: "Vibe Coding Setup", icon: "⚡" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#1e293b] border-r border-[#334155] flex flex-col">
      <div className="p-6 border-b border-[#334155]">
        <h1 className="text-xl font-bold text-white">Ecomm Onboard</h1>
        <p className="text-sm text-[#94a3b8] mt-1">Client Intelligence Hub</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-[#3b82f6] text-white"
                  : "text-[#94a3b8] hover:bg-[#334155] hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[#334155]">
        <div className="bg-[#0f172a] rounded-lg p-3">
          <p className="text-xs text-[#94a3b8]">Connected Clients</p>
          <p className="text-2xl font-bold text-white">3</p>
        </div>
      </div>
    </aside>
  );
}
