export default function SetupGuidePage() {
  const steps = [
    {
      title: "1. Install VS Code + Claude Code Extension",
      content: `Download VS Code if you haven't already. Then install the Claude Code CLI:

npm install -g @anthropic-ai/claude-code

Open your terminal in VS Code and run: claude

This gives you an AI-powered coding assistant right in your terminal that understands your entire project.`,
    },
    {
      title: "2. Set Up Your Shopify Theme Project Locally",
      content: `Clone your Shopify theme to a local project:

shopify theme pull --store your-store.myshopify.com

This pulls your entire theme (Liquid templates, CSS, JS, assets) into a local folder.
Now Claude Code can see and edit every file — sections, templates, snippets, config — all at once.

Run the dev server: shopify theme dev
This gives you a live preview URL that hot-reloads as you make changes.`,
    },
    {
      title: "3. Why This Is Faster Than the Shopify Editor",
      content: `The Shopify online theme editor only lets you edit one file at a time, with no search across files, no AI help, and slow saves.

With Claude Code locally:
• Edit multiple files simultaneously (layout + section + snippet in one go)
• AI understands the full context of your theme
• Instant search across all Liquid, CSS, and JS files
• Version control with Git — never lose work
• Batch changes: "Update the color scheme across all sections" in one command
• Claude Code can read your schema, metafields, and settings_data.json to make smart changes`,
    },
    {
      title: "4. Connect Your Reporting Data Locally",
      content: `Create a project folder structure like this:

my-ecomm-project/
├── theme/              # Your Shopify theme
├── data/
│   ├── shopify/        # Exported sales/order CSVs or API pulls
│   ├── analytics/      # GA4 exports
│   ├── klaviyo/        # Email performance data
│   └── ads/            # Google Ads exports
├── reports/            # Generated reports
└── scripts/            # Automation scripts

Use Claude Code to write scripts that pull data from APIs and generate reports.
Everything lives in one place — theme code + business data + reporting.`,
    },
    {
      title: "5. Vibe Coding Workflow with Claude Code",
      content: `The \"vibe coding\" approach means describing what you want in natural language and letting Claude Code handle the implementation:

Example prompts:
• "Add a sticky add-to-cart bar that shows on scroll with the product image, title, price, and variant selector"
• "Create a new section for customer testimonials with a carousel, star ratings, and schema markup"
• "Pull our last 12 months of Shopify sales data and create a monthly revenue chart"
• "Optimize all images in the assets folder and update references"
• "Add structured data markup to all product pages for better SEO"

Claude Code reads your entire project context, makes the changes across all necessary files, and you just review and approve.`,
    },
    {
      title: "6. Automation Scripts for Ongoing Reporting",
      content: `Use Claude Code to build automation scripts:

• Daily/weekly data pulls from Shopify, GA4, Klaviyo APIs
• Auto-generated P&L reports in CSV or HTML
• Inventory alerts and reorder notifications
• Customer cohort analysis scripts
• Ad performance tracking with ROAS calculations

Example: "Write a Node.js script that pulls yesterday's Shopify orders, calculates AOV and revenue by traffic source, and saves it to a CSV in the data folder"

Claude Code will write the script, you run it, and the data flows into your local project.`,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Vibe Coding Setup Guide</h2>
        <p className="text-[#94a3b8]">
          Set up a fast, Claude Code-powered local development and reporting environment
        </p>
      </div>

      <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-6">
        <h3 className="text-lg font-semibold text-white mb-2">What You&apos;ll Set Up</h3>
        <p className="text-sm text-[#94a3b8] mb-4">
          A single local project that combines your Shopify theme, business data from all platforms,
          and Claude Code as your AI development partner. This gives you speed, control, and full
          context that the Shopify admin editor can&apos;t match.
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#0f172a] rounded-lg p-3 text-center">
            <p className="text-2xl mb-1">🎨</p>
            <p className="text-sm text-white font-medium">Theme Dev</p>
            <p className="text-xs text-[#94a3b8]">Local Liquid editing</p>
          </div>
          <div className="bg-[#0f172a] rounded-lg p-3 text-center">
            <p className="text-2xl mb-1">📊</p>
            <p className="text-sm text-white font-medium">Data Hub</p>
            <p className="text-xs text-[#94a3b8]">All platforms in one place</p>
          </div>
          <div className="bg-[#0f172a] rounded-lg p-3 text-center">
            <p className="text-2xl mb-1">⚡</p>
            <p className="text-sm text-white font-medium">AI Workflow</p>
            <p className="text-xs text-[#94a3b8]">Claude Code powered</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.title} className="bg-[#1e293b] rounded-xl border border-[#334155] p-6">
            <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
            <div className="text-sm text-[#94a3b8] whitespace-pre-line leading-relaxed">
              {step.content}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#10b981] mb-2">Ready to Start?</h3>
        <p className="text-sm text-[#94a3b8]">
          Once your client&apos;s platforms are connected in the onboarding flow above, you can
          immediately start pulling data and building their local project. Claude Code will help
          you scaffold the entire thing in minutes.
        </p>
      </div>
    </div>
  );
}
