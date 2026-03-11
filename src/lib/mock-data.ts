import { Client, DashboardData } from "@/types";

export const mockClients: Client[] = [
  {
    id: "1",
    name: "Sarah Chen",
    businessName: "Bloom & Grow Botanicals",
    email: "sarah@bloomandgrow.com",
    industry: "Health & Beauty",
    monthlyRevenue: "$85,000",
    connectedPlatforms: [
      { platform: "shopify", status: "connected", lastSync: "2026-03-10T14:30:00Z" },
      { platform: "klaviyo", status: "connected", lastSync: "2026-03-10T14:30:00Z" },
      { platform: "google-analytics", status: "connected", lastSync: "2026-03-10T12:00:00Z" },
      { platform: "google-ads", status: "connected", lastSync: "2026-03-10T12:00:00Z" },
      { platform: "google-search-console", status: "disconnected" },
      { platform: "woocommerce", status: "disconnected" },
    ],
    onboardingStatus: "complete",
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    name: "Marcus Rivera",
    businessName: "Apex Performance Gear",
    email: "marcus@apexgear.com",
    industry: "Sports & Outdoors",
    monthlyRevenue: "$142,000",
    connectedPlatforms: [
      { platform: "shopify", status: "connected", lastSync: "2026-03-09T10:00:00Z" },
      { platform: "klaviyo", status: "error" },
      { platform: "google-analytics", status: "connected", lastSync: "2026-03-09T10:00:00Z" },
      { platform: "google-ads", status: "disconnected" },
      { platform: "google-search-console", status: "connected", lastSync: "2026-03-09T10:00:00Z" },
      { platform: "woocommerce", status: "disconnected" },
    ],
    onboardingStatus: "in-progress",
    createdAt: "2026-02-20",
  },
  {
    id: "3",
    name: "Jamie Thompson",
    businessName: "Cozy Home Collective",
    email: "jamie@cozyhome.co",
    industry: "Home & Garden",
    monthlyRevenue: "$52,000",
    connectedPlatforms: [
      { platform: "woocommerce", status: "connected", lastSync: "2026-03-08T16:00:00Z" },
      { platform: "shopify", status: "disconnected" },
      { platform: "klaviyo", status: "disconnected" },
      { platform: "google-analytics", status: "disconnected" },
      { platform: "google-ads", status: "disconnected" },
      { platform: "google-search-console", status: "disconnected" },
    ],
    onboardingStatus: "pending",
    createdAt: "2026-03-05",
  },
];

const months = [
  "Jan 24", "Feb 24", "Mar 24", "Apr 24", "May 24", "Jun 24",
  "Jul 24", "Aug 24", "Sep 24", "Oct 24", "Nov 24", "Dec 24",
  "Jan 25", "Feb 25", "Mar 25", "Apr 25", "May 25", "Jun 25",
  "Jul 25", "Aug 25", "Sep 25", "Oct 25", "Nov 25", "Dec 25",
  "Jan 26", "Feb 26",
];

export const mockDashboardData: DashboardData = {
  sales: {
    totalRevenue: 1847200,
    totalOrders: 24350,
    averageOrderValue: 75.86,
    revenueByMonth: months.map((month, i) => ({
      month,
      revenue: 55000 + Math.sin(i * 0.5) * 15000 + i * 1200 + Math.random() * 5000,
      orders: 700 + Math.floor(Math.sin(i * 0.5) * 150 + i * 15 + Math.random() * 50),
    })),
    topProducts: [
      { name: "Organic Face Serum", revenue: 245000, unitsSold: 4900 },
      { name: "Vitamin C Moisturizer", revenue: 198000, unitsSold: 3300 },
      { name: "Rose Hip Body Oil", revenue: 167000, unitsSold: 2780 },
      { name: "Aloe Vera Gel Set", revenue: 134000, unitsSold: 3350 },
      { name: "Lavender Sleep Kit", revenue: 112000, unitsSold: 1867 },
    ],
    revenueByChannel: [
      { channel: "Online Store", revenue: 1108320, percentage: 60 },
      { channel: "Paid Ads", revenue: 369440, percentage: 20 },
      { channel: "Email/SMS", revenue: 277080, percentage: 15 },
      { channel: "Wholesale", revenue: 92360, percentage: 5 },
    ],
  },
  traffic: {
    totalSessions: 482000,
    uniqueVisitors: 341000,
    bounceRate: 42.3,
    avgSessionDuration: 185,
    conversionRate: 3.2,
    pageviews: 1250000,
    trafficBySource: [
      { source: "Organic Search", sessions: 168700, percentage: 35 },
      { source: "Paid Search", sessions: 120500, percentage: 25 },
      { source: "Social Media", sessions: 96400, percentage: 20 },
      { source: "Direct", sessions: 48200, percentage: 10 },
      { source: "Email", sessions: 33740, percentage: 7 },
      { source: "Referral", sessions: 14460, percentage: 3 },
    ],
    trafficByMonth: months.map((month, i) => ({
      month,
      organic: 5000 + i * 250 + Math.floor(Math.random() * 1500),
      paid: 3500 + i * 180 + Math.floor(Math.random() * 1000),
      direct: 1500 + i * 50 + Math.floor(Math.random() * 500),
      referral: 400 + i * 20 + Math.floor(Math.random() * 200),
    })),
  },
  retention: {
    repeatCustomerRate: 34.7,
    customerLifetimeValue: 218,
    churnRate: 5.2,
    cohortRetention: [
      { cohort: "Q1 2024", month1: 100, month3: 42, month6: 28, month12: 19 },
      { cohort: "Q2 2024", month1: 100, month3: 45, month6: 31, month12: 21 },
      { cohort: "Q3 2024", month1: 100, month3: 48, month6: 33, month12: 23 },
      { cohort: "Q4 2024", month1: 100, month3: 51, month6: 36, month12: 0 },
      { cohort: "Q1 2025", month1: 100, month3: 52, month6: 38, month12: 0 },
      { cohort: "Q2 2025", month1: 100, month3: 54, month6: 0, month12: 0 },
    ],
    emailMetrics: {
      subscribers: 48500,
      openRate: 28.4,
      clickRate: 3.8,
      revenueFromEmail: 277080,
      flowRevenue: 166248,
      campaignRevenue: 110832,
    },
  },
  pnl: {
    revenue: 1847200,
    cogs: 554160,
    grossProfit: 1293040,
    grossMargin: 70,
    adSpend: 312000,
    roas: 5.92,
    operatingExpenses: 480000,
    netProfit: 501040,
    netMargin: 27.1,
    monthlyPnL: months.map((month, i) => {
      const rev = 55000 + Math.sin(i * 0.5) * 15000 + i * 1200 + Math.random() * 5000;
      const cogs = rev * 0.3;
      const adSpend = 10000 + i * 200 + Math.random() * 2000;
      const opex = 16000 + i * 200;
      return {
        month,
        revenue: Math.round(rev),
        cogs: Math.round(cogs),
        adSpend: Math.round(adSpend),
        opex: Math.round(opex),
        netProfit: Math.round(rev - cogs - adSpend - opex),
      };
    }),
  },
};
