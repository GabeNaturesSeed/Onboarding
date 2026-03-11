// Klaviyo flow planner: generates RFM-based flow plans as .md content
// Flows stay as plans until approved — then deploy via Klaviyo API

import { type RFMSegment } from "./mock-admin";

export interface KlaviyoFlow {
  id: string;
  name: string;
  trigger: string;
  segment: string;
  emails: { subject: string; delay: string; purpose: string }[];
  expectedRevenue: string;
  priority: "critical" | "high" | "medium";
  enabled: boolean;
}

export function generateFlowPlan(segments: RFMSegment[], storeName: string, industry: string): KlaviyoFlow[] {
  // Find segment sizes to tailor flows
  const championsCount = segments.find((s) => s.name === "Champions")?.count || 0;
  const atRiskCount = segments.find((s) => s.name === "At Risk")?.count || 0;
  const atRiskRevenue = segments.find((s) => s.name === "At Risk")?.revenue || 0;
  const oneTimerCount = segments.find((s) => s.name === "One-Timers")?.count || 0;
  const hibernatingCount = segments.find((s) => s.name === "Hibernating")?.count || 0;
  const recentCount = segments.find((s) => s.name === "Recent Customers")?.count || 0;
  const potentialCount = segments.find((s) => s.name === "Potential Loyalists")?.count || 0;
  const totalCustomers = segments.reduce((a, s) => a + s.count, 0);
  const totalRevenue = segments.reduce((a, s) => a + s.revenue, 0);

  return [
    {
      id: "welcome-series",
      name: "Welcome Series",
      trigger: "List subscription (newsletter signup or account creation)",
      segment: "New subscribers — all new emails entering your list",
      emails: [
        { subject: `Welcome to ${storeName} — here's 10% off your first order`, delay: "Immediate", purpose: "Deliver welcome discount, set brand tone, introduce core values" },
        { subject: "Our founder's story (and why we started this)", delay: "+1 day", purpose: "Build brand connection, share origin story, establish trust" },
        { subject: `Top picks for ${industry.toLowerCase()} lovers like you`, delay: "+3 days", purpose: "Curated product showcase based on industry, drive first browse" },
        { subject: "Your 10% off expires tomorrow", delay: "+6 days", purpose: "Urgency on welcome offer, final push to convert" },
      ],
      expectedRevenue: `Drives first purchase for new subscribers. Target: 8-15% conversion within 7 days.`,
      priority: "critical",
      enabled: true,
    },
    {
      id: "abandoned-cart",
      name: "Abandoned Cart Recovery",
      trigger: "Added to cart but didn't complete checkout within 1 hour",
      segment: "All customers and visitors with items in cart",
      emails: [
        { subject: "You left something behind", delay: "+1 hour", purpose: "Gentle reminder with cart contents, product images, and easy checkout link" },
        { subject: "Still thinking it over? Here's why customers love it", delay: "+24 hours", purpose: "Social proof — add reviews, ratings, UGC for abandoned products" },
        { subject: "Last chance — your cart is about to expire", delay: "+48 hours", purpose: "Create urgency. Optional: add small incentive (free shipping or 5% off)" },
      ],
      expectedRevenue: `Recovers 5-15% of abandoned carts. Based on your AOV, this could be $${Math.round(totalRevenue * 0.03 / 100) * 100}+/mo.`,
      priority: "critical",
      enabled: true,
    },
    {
      id: "browse-abandonment",
      name: "Browse Abandonment",
      trigger: "Viewed product page 2+ times but didn't add to cart",
      segment: "Known contacts who browse but don't act",
      emails: [
        { subject: "Still interested in [Product Name]?", delay: "+2 hours", purpose: "Remind them of the product they viewed, show related items" },
        { subject: "Selling fast — [Product Name] is popular right now", delay: "+1 day", purpose: "Social proof + scarcity, drive add-to-cart" },
      ],
      expectedRevenue: "Converts window shoppers. Lower conversion than cart abandonment (1-3%) but larger audience.",
      priority: "high",
      enabled: true,
    },
    {
      id: "post-purchase",
      name: "Post-Purchase Nurture",
      trigger: "Order placed (fulfilled)",
      segment: `Recent Customers (${recentCount} customers) and One-Timers (${oneTimerCount} customers)`,
      emails: [
        { subject: "Your order is on its way! Here's what to expect", delay: "On fulfillment", purpose: "Order confirmation delight, set delivery expectations, reduce support tickets" },
        { subject: "How to get the most out of your [Product]", delay: "+3 days after delivery", purpose: "Product education, usage tips, increase perceived value" },
        { subject: "How did we do? Leave a review", delay: "+7 days after delivery", purpose: "Collect reviews for social proof, identify issues early" },
        { subject: "Based on your purchase — you might love these", delay: "+14 days", purpose: "Cross-sell recommendation engine, drive second purchase" },
      ],
      expectedRevenue: `Increases repeat rate from ${Math.round((1 - oneTimerCount / totalCustomers) * 100)}% to target 35%+. Review collection drives future conversion.`,
      priority: "critical",
      enabled: true,
    },
    {
      id: "second-purchase",
      name: "Second Purchase Push",
      trigger: "First purchase + 14 days (hasn't ordered again)",
      segment: `One-Timers — ${oneTimerCount} customers (${Math.round(oneTimerCount / totalCustomers * 100)}% of base) who have only purchased once`,
      emails: [
        { subject: "Thanks for your first order — here's something special", delay: "+14 days post-purchase", purpose: "Exclusive second-purchase discount, make them feel valued" },
        { subject: "Customers who bought [Product] also love these", delay: "+21 days", purpose: "Personalized recommendations based on first purchase" },
        { subject: "Your special offer expires this weekend", delay: "+28 days", purpose: "Final urgency push for second purchase conversion" },
      ],
      expectedRevenue: `Converting just 10% of One-Timers to repeat buyers adds $${Math.round(oneTimerCount * 0.1 * (totalRevenue / totalCustomers) / 100) * 100}/mo.`,
      priority: "high",
      enabled: true,
    },
    {
      id: "win-back",
      name: "Win-Back Campaign",
      trigger: "No purchase in 90+ days (was previously active)",
      segment: `At Risk (${atRiskCount} customers, $${atRiskRevenue.toLocaleString()} historical revenue) — customers slipping away`,
      emails: [
        { subject: "We miss you — here's 15% off to come back", delay: "+90 days since last order", purpose: "Re-engage with meaningful discount, remind them of brand value" },
        { subject: "A lot has changed since your last visit", delay: "+7 days", purpose: "Showcase new products, improvements, what they've missed" },
        { subject: "Final offer: 20% off before we say goodbye", delay: "+14 days", purpose: "Last chance deep discount, be transparent about the sunset" },
      ],
      expectedRevenue: `Recovers 5-10% of At Risk segment. That's $${Math.round(atRiskRevenue * 0.07 / 100) * 100} in recovered revenue.`,
      priority: "high",
      enabled: true,
    },
    {
      id: "vip-loyalty",
      name: "VIP / Champions Loyalty",
      trigger: "Customer enters Champions segment (high R, F, M scores)",
      segment: `Champions — ${championsCount} customers, your most valuable ${Math.round(championsCount / totalCustomers * 100)}%`,
      emails: [
        { subject: "You're officially a VIP — here's your exclusive access", delay: "On segment entry", purpose: "Recognize their loyalty, grant early access to new products" },
        { subject: "VIP exclusive: new arrivals just for you", delay: "Monthly", purpose: "Early access to new products, limited editions, exclusive bundles" },
        { subject: "Share the love — give $20, get $20", delay: "+7 days after VIP entry", purpose: "Referral program activation, leverage their advocacy" },
      ],
      expectedRevenue: "Champions drive 3-5x more revenue than average. Referrals from VIPs convert 30% higher.",
      priority: "medium",
      enabled: true,
    },
    {
      id: "potential-loyalist-nurture",
      name: "Potential Loyalist Nurture",
      trigger: "Customer enters Potential Loyalist segment (recent buyer, 2-3 orders)",
      segment: `Potential Loyalists — ${potentialCount} customers on the verge of becoming loyal`,
      emails: [
        { subject: "You're on your way to VIP status — here's what's next", delay: "On segment entry", purpose: "Show them the loyalty ladder, incentivize next purchase" },
        { subject: "Curated just for you based on your taste", delay: "+5 days", purpose: "Personalized recommendations to deepen engagement" },
        { subject: "One more purchase unlocks VIP perks", delay: "+14 days", purpose: "Gamify the loyalty journey, clear call to action" },
      ],
      expectedRevenue: `Converting Potential Loyalists to Loyal adds $${Math.round(potentialCount * 50 / 100) * 100}+ in incremental LTV.`,
      priority: "medium",
      enabled: true,
    },
    {
      id: "sunset",
      name: "Sunset / List Hygiene",
      trigger: "No email engagement (opens/clicks) in 180+ days",
      segment: `Hibernating — ${hibernatingCount} customers with no recent activity`,
      emails: [
        { subject: "Should we keep sending you emails?", delay: "+180 days no engagement", purpose: "Ask permission to continue, re-confirm interest" },
        { subject: "Last email from us (unless you want to stay)", delay: "+7 days", purpose: "Final opt-in request, clear unsubscribe, clean the list" },
      ],
      expectedRevenue: "Doesn't directly drive revenue but improves deliverability, open rates, and sender reputation for all other flows.",
      priority: "medium",
      enabled: true,
    },
  ];
}

export function generateFlowMarkdown(flows: KlaviyoFlow[], storeName: string, segments: RFMSegment[]): string {
  const totalCustomers = segments.reduce((a, s) => a + s.count, 0);
  const totalRevenue = segments.reduce((a, s) => a + s.revenue, 0);

  let md = `# Klaviyo Flow Plan — ${storeName}
Generated: ${new Date().toISOString().split("T")[0]}

## Customer Base Summary
- **Total Customers:** ${totalCustomers.toLocaleString()}
- **Total Revenue:** $${totalRevenue.toLocaleString()}
- **Segments:** ${segments.length}

### Segment Breakdown
| Segment | Customers | Revenue | Action |
|---------|-----------|---------|--------|
${segments.map((s) => `| ${s.name} | ${s.count} (${s.percentage}%) | $${s.revenue.toLocaleString()} | ${s.action} |`).join("\n")}

---

## Flow Plan (${flows.filter((f) => f.enabled).length} flows)

`;

  for (const flow of flows.filter((f) => f.enabled)) {
    md += `### ${flow.priority === "critical" ? "[CRITICAL]" : flow.priority === "high" ? "[HIGH]" : "[MEDIUM]"} ${flow.name}

**Trigger:** ${flow.trigger}
**Target Segment:** ${flow.segment}
**Expected Impact:** ${flow.expectedRevenue}

| # | Subject Line | Timing | Purpose |
|---|-------------|--------|---------|
${flow.emails.map((e, i) => `| ${i + 1} | ${e.subject} | ${e.delay} | ${e.purpose} |`).join("\n")}

---

`;
  }

  md += `## Implementation Order

### Phase 1 — Revenue Recovery (Week 1)
${flows.filter((f) => f.priority === "critical").map((f) => `1. **${f.name}** — ${f.trigger}`).join("\n")}

### Phase 2 — Growth & Retention (Week 2-3)
${flows.filter((f) => f.priority === "high").map((f) => `1. **${f.name}** — ${f.trigger}`).join("\n")}

### Phase 3 — Optimization (Week 3-4)
${flows.filter((f) => f.priority === "medium").map((f) => `1. **${f.name}** — ${f.trigger}`).join("\n")}

## Status
- [ ] Flows reviewed and approved
- [ ] Klaviyo lists/segments configured
- [ ] Email templates designed
- [ ] Flows built in Klaviyo
- [ ] Test emails sent
- [ ] Flows set to live
`;

  return md;
}
