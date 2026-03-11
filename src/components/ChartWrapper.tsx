"use client";

import { ReactNode } from "react";

interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function ChartWrapper({ title, subtitle, children }: ChartWrapperProps) {
  return (
    <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-sm text-[#94a3b8]">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
