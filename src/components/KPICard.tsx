interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
}

export default function KPICard({ title, value, change, changeType = "neutral", subtitle }: KPICardProps) {
  const changeColor =
    changeType === "positive"
      ? "text-[#10b981]"
      : changeType === "negative"
      ? "text-[#ef4444]"
      : "text-[#94a3b8]";

  return (
    <div className="bg-[#1e293b] rounded-xl p-5 border border-[#334155]">
      <p className="text-sm text-[#94a3b8] mb-1">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      <div className="flex items-center gap-2 mt-2">
        {change && (
          <span className={`text-sm font-medium ${changeColor}`}>{change}</span>
        )}
        {subtitle && (
          <span className="text-xs text-[#94a3b8]">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
