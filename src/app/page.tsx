import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-5xl font-bold text-white mb-4">Ecomm Onboard</h1>
        <p className="text-xl text-[#94a3b8] mb-8">
          Client intelligence hub for e-commerce businesses. Connect platforms,
          analyze data, and know exactly how to help your clients grow.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-[#3b82f6] text-white rounded-lg font-medium hover:bg-[#2563eb] transition-colors"
          >
            View Dashboard
          </Link>
          <Link
            href="/onboarding"
            className="px-6 py-3 bg-[#1e293b] text-white rounded-lg font-medium border border-[#334155] hover:bg-[#334155] transition-colors"
          >
            Onboard New Client
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-6 text-left">
          <div className="bg-[#1e293b] rounded-xl p-5 border border-[#334155]">
            <p className="text-2xl mb-2">🔌</p>
            <h3 className="font-semibold text-white mb-1">Connect APIs</h3>
            <p className="text-sm text-[#94a3b8]">
              Shopify, WooCommerce, Klaviyo, Google Analytics, Ads & Search Console
            </p>
          </div>
          <div className="bg-[#1e293b] rounded-xl p-5 border border-[#334155]">
            <p className="text-2xl mb-2">📊</p>
            <h3 className="font-semibold text-white mb-1">Analyze Everything</h3>
            <p className="text-sm text-[#94a3b8]">
              Sales, traffic, retention, margins, P&L — all in one view
            </p>
          </div>
          <div className="bg-[#1e293b] rounded-xl p-5 border border-[#334155]">
            <p className="text-2xl mb-2">⚡</p>
            <h3 className="font-semibold text-white mb-1">Vibe Code Setup</h3>
            <p className="text-sm text-[#94a3b8]">
              Set up a fast, Claude-powered theme and local reporting project
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
