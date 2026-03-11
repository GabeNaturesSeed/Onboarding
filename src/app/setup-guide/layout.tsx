import Link from "next/link";

export default function SetupGuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <header className="border-b border-[#334155] bg-[#1e293b]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="text-[#94a3b8] hover:text-white text-sm transition-colors">&larr; All Sites</Link>
          <div className="h-5 w-px bg-[#334155]" />
          <h1 className="text-lg font-bold text-white">Setup Guide</h1>
        </div>
      </header>
      <main className="py-8">{children}</main>
    </div>
  );
}
