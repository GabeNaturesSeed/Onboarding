"use client";

import { useState } from "react";
import Link from "next/link";

type Step = "platform" | "config" | "data" | "provision";
type Platform = "woocommerce" | "shopify";

export default function NewEnvironment() {
  const [step, setStep] = useState<Step>("platform");
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [config, setConfig] = useState({
    clientName: "",
    businessName: "",
    domain: "",
    // WooCommerce
    phpVersion: "8.2",
    wpVersion: "6.7.1",
    wcVersion: "9.5.2",
    // Shopify
    storeUrl: "",
    // Shared
    sitePath: "",
    ssl: true,
  });
  const [dataSources, setDataSources] = useState<string[]>([]);
  const [provisioning, setProvisioning] = useState(false);
  const [provisionStep, setProvisionStep] = useState(0);

  const provisionSteps = platform === "woocommerce" ? [
    "Creating local directory...",
    "Downloading WordPress 6.7.1...",
    "Installing PHP 8.2 runtime...",
    "Setting up MySQL database...",
    "Installing WooCommerce 9.5.2...",
    "Configuring SSL certificate...",
    "Starting development server...",
    "Ready!",
  ] : [
    "Creating local directory...",
    "Installing Shopify CLI...",
    "Authenticating with Shopify Partner API...",
    "Pulling theme files...",
    "Installing Node.js dependencies...",
    "Starting development server...",
    "Ready!",
  ];

  const handleProvision = () => {
    setStep("provision");
    setProvisioning(true);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setProvisionStep(i);
      if (i >= provisionSteps.length - 1) {
        clearInterval(interval);
        setProvisioning(false);
      }
    }, 800);
  };

  const toggleDataSource = (source: string) => {
    setDataSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <header className="border-b border-[#334155] bg-[#1e293b]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="text-[#94a3b8] hover:text-white text-sm transition-colors">&larr; All Sites</Link>
          <div className="h-5 w-px bg-[#334155]" />
          <h1 className="text-lg font-bold text-white">Create New Local Site</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Progress */}
        <div className="flex items-center gap-2">
          {(["platform", "config", "data", "provision"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s ? "bg-[#3b82f6] text-white" :
                (["platform", "config", "data", "provision"].indexOf(step) > i) ? "bg-[#10b981] text-white" :
                "bg-[#334155] text-[#64748b]"
              }`}>
                {["platform", "config", "data", "provision"].indexOf(step) > i ? "✓" : i + 1}
              </div>
              {i < 3 && <div className={`w-16 h-0.5 ${
                ["platform", "config", "data", "provision"].indexOf(step) > i ? "bg-[#10b981]" : "bg-[#334155]"
              }`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Platform */}
        {step === "platform" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Choose Platform</h2>
            <p className="text-sm text-[#94a3b8]">Select the e-commerce platform for this client</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { setPlatform("woocommerce"); setConfig({ ...config, domain: "", sitePath: "" }); }}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  platform === "woocommerce"
                    ? "border-[#7f54b3] bg-[#7f54b3]/10"
                    : "border-[#334155] bg-[#1e293b] hover:border-[#7f54b3]/50"
                }`}
              >
                <div className="text-3xl mb-3">🟣</div>
                <h3 className="text-lg font-semibold text-white">WooCommerce</h3>
                <p className="text-sm text-[#94a3b8] mt-1">Full local WordPress + WooCommerce with MySQL, PHP, and SSL</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {["WordPress", "PHP 8.2+", "MySQL", "SSL", "MailHog"].map((t) => (
                    <span key={t} className="text-[10px] bg-[#0f172a] text-[#94a3b8] px-1.5 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              </button>

              <button
                onClick={() => { setPlatform("shopify"); setConfig({ ...config, domain: "", sitePath: "" }); }}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  platform === "shopify"
                    ? "border-[#96bf48] bg-[#96bf48]/10"
                    : "border-[#334155] bg-[#1e293b] hover:border-[#96bf48]/50"
                }`}
              >
                <div className="text-3xl mb-3">🟢</div>
                <h3 className="text-lg font-semibold text-white">Shopify</h3>
                <p className="text-sm text-[#94a3b8] mt-1">Local theme dev via Shopify CLI with hot reload and theme pull</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {["Shopify CLI", "Node.js", "Liquid", "Hot Reload"].map((t) => (
                    <span key={t} className="text-[10px] bg-[#0f172a] text-[#94a3b8] px-1.5 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              </button>
            </div>
            <button
              onClick={() => platform && setStep("config")}
              disabled={!platform}
              className="px-6 py-2.5 bg-[#3b82f6] text-white rounded-lg font-medium hover:bg-[#2563eb] transition-colors disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Config */}
        {step === "config" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Configure Environment</h2>
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#94a3b8] block mb-1">Client Name</label>
                  <input type="text" value={config.clientName} onChange={(e) => setConfig({ ...config, clientName: e.target.value })}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6]"
                    placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="text-sm text-[#94a3b8] block mb-1">Business Name</label>
                  <input type="text" value={config.businessName} onChange={(e) => setConfig({ ...config, businessName: e.target.value })}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6]"
                    placeholder="Awesome Store" />
                </div>
              </div>

              {platform === "woocommerce" ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-[#94a3b8] block mb-1">Local Domain</label>
                      <input type="text" value={config.domain} onChange={(e) => setConfig({ ...config, domain: e.target.value })}
                        className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6]"
                        placeholder="awesome-store.local" />
                    </div>
                    <div>
                      <label className="text-sm text-[#94a3b8] block mb-1">Site Path</label>
                      <input type="text" value={config.sitePath} onChange={(e) => setConfig({ ...config, sitePath: e.target.value })}
                        className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6]"
                        placeholder="~/Sites/awesome-store" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-[#94a3b8] block mb-1">PHP Version</label>
                      <select value={config.phpVersion} onChange={(e) => setConfig({ ...config, phpVersion: e.target.value })}
                        className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6]">
                        <option value="8.3">8.3</option>
                        <option value="8.2">8.2</option>
                        <option value="8.1">8.1</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-[#94a3b8] block mb-1">WordPress</label>
                      <select value={config.wpVersion} onChange={(e) => setConfig({ ...config, wpVersion: e.target.value })}
                        className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6]">
                        <option value="6.7.1">6.7.1</option>
                        <option value="6.6.2">6.6.2</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-[#94a3b8] block mb-1">WooCommerce</label>
                      <select value={config.wcVersion} onChange={(e) => setConfig({ ...config, wcVersion: e.target.value })}
                        className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6]">
                        <option value="9.5.2">9.5.2</option>
                        <option value="9.4.3">9.4.3</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-[#94a3b8]">Trusted SSL</label>
                    <button
                      onClick={() => setConfig({ ...config, ssl: !config.ssl })}
                      className={`w-10 h-5 rounded-full transition-colors ${config.ssl ? "bg-[#10b981]" : "bg-[#334155]"}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-0.5 ${config.ssl ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[#94a3b8] block mb-1">Shopify Store URL</label>
                    <input type="text" value={config.storeUrl} onChange={(e) => setConfig({ ...config, storeUrl: e.target.value })}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6]"
                      placeholder="your-store.myshopify.com" />
                  </div>
                  <div>
                    <label className="text-sm text-[#94a3b8] block mb-1">Local Site Path</label>
                    <input type="text" value={config.sitePath} onChange={(e) => setConfig({ ...config, sitePath: e.target.value })}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6]"
                      placeholder="~/Sites/your-store" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep("platform")} className="px-6 py-2.5 bg-[#1e293b] text-white rounded-lg border border-[#334155] hover:bg-[#334155] transition-colors">Back</button>
              <button onClick={() => setStep("data")} className="px-6 py-2.5 bg-[#3b82f6] text-white rounded-lg font-medium hover:bg-[#2563eb] transition-colors">Continue</button>
            </div>
          </div>
        )}

        {/* Step 3: Data Sources */}
        {step === "data" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Connect Data Sources</h2>
            <p className="text-sm text-[#94a3b8]">Select which data to pull into the local environment (can be configured later)</p>
            <div className="space-y-2">
              {[
                { id: "orders", icon: "📦", label: "Orders & Sales", desc: `Pull order history from ${platform === "woocommerce" ? "WooCommerce" : "Shopify"} API` },
                { id: "products", icon: "🏷️", label: "Products & Inventory", desc: "Product catalog, variants, and stock levels" },
                { id: "customers", icon: "👤", label: "Customer Data", desc: "Customer profiles, purchase history, segments" },
                { id: "klaviyo", icon: "📧", label: "Klaviyo (Email/SMS)", desc: "Subscribers, flows, campaigns, revenue attribution" },
                { id: "ga4", icon: "📊", label: "Google Analytics (GA4)", desc: "Sessions, traffic sources, conversions, behavior" },
                { id: "ads", icon: "📢", label: "Google Ads", desc: "Campaigns, ad spend, ROAS, keywords" },
                { id: "gsc", icon: "🔍", label: "Google Search Console", desc: "Organic rankings, impressions, CTR" },
              ].map((source) => (
                <button
                  key={source.id}
                  onClick={() => toggleDataSource(source.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    dataSources.includes(source.id)
                      ? "bg-[#3b82f6]/10 border-[#3b82f6]/40"
                      : "bg-[#1e293b] border-[#334155] hover:border-[#3b82f6]/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{source.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-white">{source.label}</p>
                      <p className="text-xs text-[#94a3b8]">{source.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      dataSources.includes(source.id) ? "bg-[#3b82f6] border-[#3b82f6]" : "border-[#334155]"
                    }`}>
                      {dataSources.includes(source.id) && <span className="text-white text-xs">✓</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep("config")} className="px-6 py-2.5 bg-[#1e293b] text-white rounded-lg border border-[#334155] hover:bg-[#334155] transition-colors">Back</button>
              <button onClick={handleProvision} className="px-6 py-2.5 bg-[#10b981] text-white rounded-lg font-medium hover:bg-[#059669] transition-colors">
                Create Site
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Provisioning */}
        {step === "provision" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">
              {provisioning ? "Setting Up Environment..." : "Environment Ready!"}
            </h2>
            <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-6">
              <div className="space-y-3">
                {provisionSteps.map((stepText, i) => (
                  <div key={i} className={`flex items-center gap-3 ${i > provisionStep ? "opacity-30" : ""}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      i < provisionStep ? "bg-[#10b981] text-white" :
                      i === provisionStep ? (provisioning ? "bg-[#3b82f6] text-white animate-pulse" : "bg-[#10b981] text-white") :
                      "bg-[#334155] text-[#64748b]"
                    }`}>
                      {i < provisionStep ? "✓" : i === provisionStep && !provisioning ? "✓" : ""}
                    </div>
                    <span className={`text-sm ${i <= provisionStep ? "text-white" : "text-[#64748b]"}`}>
                      {stepText}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {!provisioning && (
              <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-[#10b981]">Your local site is ready!</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[#94a3b8]">Local URL</p>
                    <p className="text-white font-mono">https://{config.domain || "site"}.local</p>
                  </div>
                  <div>
                    <p className="text-[#94a3b8]">Site Path</p>
                    <p className="text-white font-mono">{config.sitePath || "~/Sites/site"}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-[#2563eb] transition-colors">
                    Open Site
                  </button>
                  <button className="px-4 py-2 bg-[#1e293b] text-white rounded-lg text-sm border border-[#334155] hover:bg-[#334155] transition-colors">
                    Open in VS Code
                  </button>
                  <button className="px-4 py-2 bg-[#1e293b] text-white rounded-lg text-sm border border-[#334155] hover:bg-[#334155] transition-colors">
                    Open Terminal
                  </button>
                  <Link href="/" className="px-4 py-2 bg-[#1e293b] text-[#94a3b8] rounded-lg text-sm border border-[#334155] hover:text-white hover:bg-[#334155] transition-colors">
                    Back to Sites
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
