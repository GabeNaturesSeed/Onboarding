// Aggregated mock data across all clients for the overall report

export interface ClientSummary {
  id: string;
  businessName: string;
  platform: string;
  monthlyRevenue: number;
  monthlyOrders: number;
  aov: number;
  conversionRate: number;
  trafficSessions: number;
  organicPct: number;
  paidPct: number;
  repeatCustomerRate: number;
  ltv: number;
  emailRevenuePct: number;
  grossMargin: number;
  netMargin: number;
  adSpend: number;
  roas: number;
  yoyGrowth: number;
  status: "healthy" | "needs-attention" | "at-risk";
  topIssue: string;
  topOpportunity: string;
}

export const clientSummaries: ClientSummary[] = [
  {
    id: "bloom-grow",
    businessName: "Bloom & Grow Botanicals",
    platform: "woocommerce",
    monthlyRevenue: 85000,
    monthlyOrders: 1120,
    aov: 75.89,
    conversionRate: 3.2,
    trafficSessions: 22400,
    organicPct: 35,
    paidPct: 25,
    repeatCustomerRate: 34.7,
    ltv: 218,
    emailRevenuePct: 15,
    grossMargin: 70,
    netMargin: 27.1,
    adSpend: 14200,
    roas: 5.92,
    yoyGrowth: 18.3,
    status: "healthy",
    topIssue: "Email revenue below benchmark (15% vs 25% target)",
    topOpportunity: "Lifecycle flows — welcome, abandoned cart, post-purchase could add $12K/mo",
  },
  {
    id: "apex-gear",
    businessName: "Apex Performance Gear",
    platform: "shopify",
    monthlyRevenue: 142000,
    monthlyOrders: 1680,
    aov: 84.52,
    conversionRate: 2.8,
    trafficSessions: 38500,
    organicPct: 28,
    paidPct: 35,
    repeatCustomerRate: 22.1,
    ltv: 156,
    emailRevenuePct: 8,
    grossMargin: 62,
    netMargin: 18.4,
    adSpend: 28500,
    roas: 4.21,
    yoyGrowth: 24.7,
    status: "needs-attention",
    topIssue: "Low repeat rate (22%) and Klaviyo connection error — email only 8% of revenue",
    topOpportunity: "Fix Klaviyo sync + build retention flows — potential $25K/mo lift",
  },
  {
    id: "cozy-home",
    businessName: "Cozy Home Collective",
    platform: "woocommerce",
    monthlyRevenue: 52000,
    monthlyOrders: 620,
    aov: 83.87,
    conversionRate: 1.9,
    trafficSessions: 14200,
    organicPct: 18,
    paidPct: 42,
    repeatCustomerRate: 16.3,
    ltv: 112,
    emailRevenuePct: 4,
    grossMargin: 58,
    netMargin: 11.2,
    adSpend: 12800,
    roas: 3.12,
    yoyGrowth: 6.1,
    status: "at-risk",
    topIssue: "Low CVR (1.9%), high paid dependency (42%), no email/retention strategy",
    topOpportunity: "CRO + organic SEO + email setup could double margin to 22%",
  },
];

export const aggregated = {
  totalMonthlyRevenue: clientSummaries.reduce((a, c) => a + c.monthlyRevenue, 0),
  totalMonthlyOrders: clientSummaries.reduce((a, c) => a + c.monthlyOrders, 0),
  avgAov: clientSummaries.reduce((a, c) => a + c.aov, 0) / clientSummaries.length,
  avgConversionRate: clientSummaries.reduce((a, c) => a + c.conversionRate, 0) / clientSummaries.length,
  totalAdSpend: clientSummaries.reduce((a, c) => a + c.adSpend, 0),
  avgRoas: clientSummaries.reduce((a, c) => a + c.roas, 0) / clientSummaries.length,
  avgNetMargin: clientSummaries.reduce((a, c) => a + c.netMargin, 0) / clientSummaries.length,
  avgRepeatRate: clientSummaries.reduce((a, c) => a + c.repeatCustomerRate, 0) / clientSummaries.length,
  avgLtv: clientSummaries.reduce((a, c) => a + c.ltv, 0) / clientSummaries.length,
  totalSessions: clientSummaries.reduce((a, c) => a + c.trafficSessions, 0),
  avgYoyGrowth: clientSummaries.reduce((a, c) => a + c.yoyGrowth, 0) / clientSummaries.length,
  revenueByClient: clientSummaries.map((c) => ({ name: c.businessName, revenue: c.monthlyRevenue })),
  marginComparison: clientSummaries.map((c) => ({ name: c.businessName, gross: c.grossMargin, net: c.netMargin })),
  channelMix: clientSummaries.map((c) => ({
    name: c.businessName,
    organic: c.organicPct,
    paid: c.paidPct,
    email: c.emailRevenuePct,
    other: 100 - c.organicPct - c.paidPct - c.emailRevenuePct,
  })),
};
