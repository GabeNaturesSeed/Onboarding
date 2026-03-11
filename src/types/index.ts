export interface Client {
  id: string;
  name: string;
  businessName: string;
  email: string;
  industry: string;
  monthlyRevenue: string;
  connectedPlatforms: PlatformConnection[];
  onboardingStatus: "pending" | "in-progress" | "complete";
  createdAt: string;
}

export interface PlatformConnection {
  platform: PlatformType;
  status: "connected" | "disconnected" | "error";
  apiKey?: string;
  storeUrl?: string;
  lastSync?: string;
}

export type PlatformType =
  | "shopify"
  | "woocommerce"
  | "klaviyo"
  | "google-analytics"
  | "google-ads"
  | "google-search-console";

export interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueByMonth: { month: string; revenue: number; orders: number }[];
  topProducts: { name: string; revenue: number; unitsSold: number }[];
  revenueByChannel: { channel: string; revenue: number; percentage: number }[];
}

export interface TrafficMetrics {
  totalSessions: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  trafficBySource: { source: string; sessions: number; percentage: number }[];
  trafficByMonth: { month: string; organic: number; paid: number; direct: number; referral: number }[];
  conversionRate: number;
  pageviews: number;
}

export interface RetentionMetrics {
  repeatCustomerRate: number;
  customerLifetimeValue: number;
  churnRate: number;
  cohortRetention: { cohort: string; month1: number; month3: number; month6: number; month12: number }[];
  emailMetrics: {
    subscribers: number;
    openRate: number;
    clickRate: number;
    revenueFromEmail: number;
    flowRevenue: number;
    campaignRevenue: number;
  };
}

export interface PnLMetrics {
  revenue: number;
  cogs: number;
  grossProfit: number;
  grossMargin: number;
  adSpend: number;
  roas: number;
  operatingExpenses: number;
  netProfit: number;
  netMargin: number;
  monthlyPnL: {
    month: string;
    revenue: number;
    cogs: number;
    adSpend: number;
    opex: number;
    netProfit: number;
  }[];
}

export interface DashboardData {
  sales: SalesMetrics;
  traffic: TrafficMetrics;
  retention: RetentionMetrics;
  pnl: PnLMetrics;
}
