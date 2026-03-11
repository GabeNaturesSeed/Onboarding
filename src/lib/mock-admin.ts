// Admin dashboard data: RFM segmentation, MER, full client metrics

export interface CustomerRecord {
  id: string;
  email: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  lastOrderDate: string;
  daysSinceLastOrder: number;
  firstOrderDate: string;
  lifetimeMonths: number;
}

export interface RFMSegment {
  name: string;
  description: string;
  color: string;
  count: number;
  revenue: number;
  avgRecency: number;
  avgFrequency: number;
  avgMonetary: number;
  percentage: number;
  action: string;
}

export interface RFMConfig {
  recencyThresholds: [number, number, number, number]; // 5-point scale boundaries (days)
  frequencyThresholds: [number, number, number, number]; // order count boundaries
  monetaryThresholds: [number, number, number, number]; // dollar boundaries
}

export const defaultRFMConfig: RFMConfig = {
  recencyThresholds: [30, 60, 120, 240],    // 5=0-30d, 4=31-60d, 3=61-120d, 2=121-240d, 1=240+d
  frequencyThresholds: [1, 2, 4, 8],         // 5=8+, 4=4-7, 3=2-3, 2=1, 1=0
  monetaryThresholds: [50, 100, 250, 500],    // 5=$500+, 4=$250-499, 3=$100-249, 2=$50-99, 1=<$50
};

// Generate mock customer data across all clients
function generateCustomers(): CustomerRecord[] {
  const customers: CustomerRecord[] = [];
  const names = [
    "Sarah Johnson", "Mike Chen", "Emily Rodriguez", "James Wilson", "Amanda Liu",
    "David Kim", "Jessica Taylor", "Ryan Patel", "Lauren Brown", "Chris Murphy",
    "Nicole Garcia", "Andrew Lopez", "Megan Hall", "Brandon Lee", "Katie Adams",
    "Tyler Martinez", "Samantha Clark", "Josh White", "Rachel Davis", "Kevin Moore",
    "Hannah Thompson", "Alex Rivera", "Olivia Anderson", "Daniel Scott", "Ashley Cooper",
    "Matthew Turner", "Brianna Evans", "Lucas Reed", "Sophie Bell", "Nathan Ross",
    "Emma Wright", "Ethan Foster", "Grace Hughes", "Dylan Phillips", "Chloe Campbell",
    "Jake Morgan", "Lily Parker", "Owen Stewart", "Zoe Collins", "Mason Reed",
    "Ava Mitchell", "Logan Price", "Isabella Ross", "Carter Sanders", "Mia Barnes",
    "Hunter Powell", "Ella Simmons", "Noah Jenkins", "Charlotte Long", "Aiden Hayes",
  ];

  for (let i = 0; i < 200; i++) {
    const name = names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : "");
    const email = name.toLowerCase().replace(/ /g, ".").replace(/ \d+/g, (m) => m.trim()) + "@email.com";

    // Create realistic distribution: most customers are low-value
    const segment = Math.random();
    let orders: number, spent: number, recencyDays: number;

    if (segment < 0.05) {
      // Champions (5%)
      orders = 8 + Math.floor(Math.random() * 15);
      spent = 500 + Math.random() * 2000;
      recencyDays = Math.floor(Math.random() * 30);
    } else if (segment < 0.15) {
      // Loyal (10%)
      orders = 4 + Math.floor(Math.random() * 8);
      spent = 250 + Math.random() * 500;
      recencyDays = Math.floor(Math.random() * 60);
    } else if (segment < 0.30) {
      // Potential Loyalists (15%)
      orders = 2 + Math.floor(Math.random() * 4);
      spent = 100 + Math.random() * 250;
      recencyDays = Math.floor(Math.random() * 45);
    } else if (segment < 0.50) {
      // At Risk (20%)
      orders = 2 + Math.floor(Math.random() * 5);
      spent = 100 + Math.random() * 400;
      recencyDays = 120 + Math.floor(Math.random() * 180);
    } else if (segment < 0.70) {
      // Need Attention (20%)
      orders = 1 + Math.floor(Math.random() * 2);
      spent = 50 + Math.random() * 150;
      recencyDays = 60 + Math.floor(Math.random() * 120);
    } else {
      // One-timers / Hibernating (30%)
      orders = 1;
      spent = 20 + Math.random() * 100;
      recencyDays = 90 + Math.floor(Math.random() * 300);
    }

    const lifetimeMonths = Math.max(1, Math.floor(recencyDays / 30) + Math.floor(Math.random() * 12));

    customers.push({
      id: `cust-${i + 1}`,
      email,
      name,
      totalOrders: orders,
      totalSpent: Math.round(spent * 100) / 100,
      avgOrderValue: Math.round((spent / orders) * 100) / 100,
      lastOrderDate: new Date(Date.now() - recencyDays * 86400000).toISOString().split("T")[0],
      daysSinceLastOrder: recencyDays,
      firstOrderDate: new Date(Date.now() - lifetimeMonths * 30 * 86400000).toISOString().split("T")[0],
      lifetimeMonths,
    });
  }
  return customers;
}

export const allCustomers = generateCustomers();

function scoreValue(value: number, thresholds: [number, number, number, number], ascending: boolean): number {
  if (ascending) {
    // Higher value = higher score (frequency, monetary)
    if (value >= thresholds[3]) return 5;
    if (value >= thresholds[2]) return 4;
    if (value >= thresholds[1]) return 3;
    if (value >= thresholds[0]) return 2;
    return 1;
  } else {
    // Lower value = higher score (recency — fewer days ago is better)
    if (value <= thresholds[0]) return 5;
    if (value <= thresholds[1]) return 4;
    if (value <= thresholds[2]) return 3;
    if (value <= thresholds[3]) return 2;
    return 1;
  }
}

export function computeRFMSegments(customers: CustomerRecord[], config: RFMConfig): RFMSegment[] {
  const scored = customers.map((c) => ({
    ...c,
    rScore: scoreValue(c.daysSinceLastOrder, config.recencyThresholds, false),
    fScore: scoreValue(c.totalOrders, config.frequencyThresholds, true),
    mScore: scoreValue(c.totalSpent, config.monetaryThresholds, true),
  }));

  const segmentDefs = [
    { name: "Champions", test: (r: number, f: number, m: number) => r >= 4 && f >= 4 && m >= 4, color: "#10b981", action: "Reward with loyalty perks, early access, referral program" },
    { name: "Loyal Customers", test: (r: number, f: number) => r >= 3 && f >= 3, color: "#3b82f6", action: "Upsell premium products, request reviews, VIP offers" },
    { name: "Potential Loyalists", test: (r: number, f: number) => r >= 4 && f >= 2 && f < 4, color: "#8b5cf6", action: "Send welcome series, product recommendations, loyalty signup" },
    { name: "Recent Customers", test: (r: number, f: number) => r >= 4 && f < 2, color: "#06b6d4", action: "Post-purchase flow, cross-sell, build relationship" },
    { name: "At Risk", test: (r: number, f: number) => r <= 2 && f >= 3, color: "#f59e0b", action: "Win-back campaign, special discount, personal outreach" },
    { name: "Need Attention", test: (r: number, f: number) => r <= 3 && r >= 2 && f >= 2 && f <= 3, color: "#f97316", action: "Re-engagement email, limited-time offer, survey" },
    { name: "About to Sleep", test: (r: number, f: number) => r <= 2 && f >= 2 && f < 3, color: "#ef4444", action: "Urgent win-back, deep discount, new product announcement" },
    { name: "Hibernating", test: (r: number) => r <= 1, color: "#6b7280", action: "Reactivation campaign or sunset from list" },
    { name: "One-Timers", test: (_r: number, f: number) => f <= 1, color: "#94a3b8", action: "Second purchase incentive, education content, review request" },
  ];

  const segments: RFMSegment[] = [];
  const assigned = new Set<string>();

  for (const def of segmentDefs) {
    const members = scored.filter((c) => !assigned.has(c.id) && def.test(c.rScore, c.fScore, c.mScore));
    members.forEach((m) => assigned.add(m.id));

    if (members.length === 0) continue;

    segments.push({
      name: def.name,
      description: `R:${Math.round(members.reduce((a, m) => a + m.rScore, 0) / members.length)}/F:${Math.round(members.reduce((a, m) => a + m.fScore, 0) / members.length)}/M:${Math.round(members.reduce((a, m) => a + m.mScore, 0) / members.length)}`,
      color: def.color,
      count: members.length,
      revenue: Math.round(members.reduce((a, m) => a + m.totalSpent, 0)),
      avgRecency: Math.round(members.reduce((a, m) => a + m.daysSinceLastOrder, 0) / members.length),
      avgFrequency: Math.round((members.reduce((a, m) => a + m.totalOrders, 0) / members.length) * 10) / 10,
      avgMonetary: Math.round(members.reduce((a, m) => a + m.totalSpent, 0) / members.length),
      percentage: Math.round((members.length / customers.length) * 100 * 10) / 10,
      action: def.action,
    });
  }

  // Catch any unassigned
  const unassigned = scored.filter((c) => !assigned.has(c.id));
  if (unassigned.length > 0) {
    segments.push({
      name: "Other",
      description: "Unclassified",
      color: "#475569",
      count: unassigned.length,
      revenue: Math.round(unassigned.reduce((a, m) => a + m.totalSpent, 0)),
      avgRecency: Math.round(unassigned.reduce((a, m) => a + m.daysSinceLastOrder, 0) / unassigned.length),
      avgFrequency: Math.round((unassigned.reduce((a, m) => a + m.totalOrders, 0) / unassigned.length) * 10) / 10,
      avgMonetary: Math.round(unassigned.reduce((a, m) => a + m.totalSpent, 0) / unassigned.length),
      percentage: Math.round((unassigned.length / customers.length) * 100 * 10) / 10,
      action: "Analyze further to determine best engagement strategy",
    });
  }

  return segments.sort((a, b) => b.revenue - a.revenue);
}

// MER (Marketing Efficiency Ratio) = Total Revenue / Total Marketing Spend
export interface MERData {
  period: string;
  revenue: number;
  adSpend: number;
  emailCost: number;
  affiliateCost: number;
  otherMarketingCost: number;
  totalMarketingSpend: number;
  mer: number;
  blendedRoas: number;
}

export const merData: MERData[] = [
  { period: "Oct 2025", revenue: 245000, adSpend: 42000, emailCost: 1200, affiliateCost: 4800, otherMarketingCost: 2500, totalMarketingSpend: 50500, mer: 4.85, blendedRoas: 4.85 },
  { period: "Nov 2025", revenue: 312000, adSpend: 58000, emailCost: 1200, affiliateCost: 7200, otherMarketingCost: 3000, totalMarketingSpend: 69400, mer: 4.50, blendedRoas: 4.50 },
  { period: "Dec 2025", revenue: 389000, adSpend: 72000, emailCost: 1400, affiliateCost: 9500, otherMarketingCost: 4000, totalMarketingSpend: 86900, mer: 4.48, blendedRoas: 4.48 },
  { period: "Jan 2026", revenue: 198000, adSpend: 35000, emailCost: 1200, affiliateCost: 3800, otherMarketingCost: 2200, totalMarketingSpend: 42200, mer: 4.69, blendedRoas: 4.69 },
  { period: "Feb 2026", revenue: 267000, adSpend: 48000, emailCost: 1200, affiliateCost: 5500, otherMarketingCost: 2800, totalMarketingSpend: 57500, mer: 4.64, blendedRoas: 4.64 },
  { period: "Mar 2026", revenue: 279000, adSpend: 55500, emailCost: 1400, affiliateCost: 5900, otherMarketingCost: 3200, totalMarketingSpend: 66000, mer: 4.23, blendedRoas: 4.23 },
];

export interface ClientOverview {
  name: string;
  revenue: number;
  orders: number;
  customers: number;
  adSpend: number;
  roas: number;
  mer: number;
  emailRevPct: number;
  repeatRate: number;
  aov: number;
  ltv: number;
  cac: number;
  ltvCacRatio: number;
  margin: number;
}

export const clientOverviews: ClientOverview[] = [
  { name: "Bloom & Grow", revenue: 85000, orders: 1120, customers: 820, adSpend: 14200, roas: 5.92, mer: 5.18, emailRevPct: 15, repeatRate: 34.7, aov: 75.89, ltv: 218, cac: 32, ltvCacRatio: 6.8, margin: 27.1 },
  { name: "Apex Gear", revenue: 142000, orders: 1680, customers: 1350, adSpend: 28500, roas: 4.21, mer: 3.87, emailRevPct: 8, repeatRate: 22.1, aov: 84.52, ltv: 156, cac: 45, ltvCacRatio: 3.5, margin: 18.4 },
  { name: "Cozy Home", revenue: 52000, orders: 620, customers: 540, adSpend: 12800, roas: 3.12, mer: 2.78, emailRevPct: 4, repeatRate: 16.3, aov: 83.87, ltv: 112, cac: 58, ltvCacRatio: 1.9, margin: 11.2 },
];
