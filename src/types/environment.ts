export type SitePlatform = "woocommerce" | "shopify";
export type EnvironmentStatus = "running" | "stopped" | "error" | "provisioning";
export type SyncStatus = "synced" | "syncing" | "stale" | "never";

export interface LocalEnvironment {
  id: string;
  clientName: string;
  businessName: string;
  platform: SitePlatform;
  status: EnvironmentStatus;
  localUrl: string;
  adminUrl: string;
  sitePath: string;
  phpVersion?: string;
  wpVersion?: string;
  wcVersion?: string;
  shopifyCli?: string;
  nodeVersion?: string;
  dbName?: string;
  domain: string;
  ssl: boolean;
  createdAt: string;
  lastStarted?: string;
  ports: {
    web: number;
    db?: number;
    mailhog?: number;
  };
  dataSyncs: DataSync[];
  theme: ThemeInfo;
}

export interface DataSync {
  source: DataSource;
  status: SyncStatus;
  lastSync?: string;
  recordCount?: number;
  syncSchedule?: "manual" | "hourly" | "daily" | "weekly";
}

export type DataSource =
  | "shopify-orders"
  | "shopify-products"
  | "shopify-customers"
  | "woo-orders"
  | "woo-products"
  | "woo-customers"
  | "klaviyo"
  | "google-analytics"
  | "google-ads"
  | "google-search-console";

export interface ThemeInfo {
  name: string;
  version: string;
  lastModified: string;
  files: number;
}

export interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  source: string;
}
