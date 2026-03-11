import { PlatformType } from "@/types";

export interface PlatformInfo {
  id: PlatformType;
  name: string;
  description: string;
  color: string;
  fields: { key: string; label: string; placeholder: string; type: string }[];
  dataPoints: string[];
}

export const platforms: PlatformInfo[] = [
  {
    id: "shopify",
    name: "Shopify",
    description: "Pull sales, orders, products, and customer data",
    color: "#96bf48",
    fields: [
      { key: "storeUrl", label: "Store URL", placeholder: "your-store.myshopify.com", type: "text" },
      { key: "apiKey", label: "Admin API Access Token", placeholder: "shpat_xxxxxxxxxxxxx", type: "password" },
    ],
    dataPoints: ["Sales & Revenue", "Orders & AOV", "Products", "Customers", "Inventory"],
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    description: "Pull sales, orders, products, and customer data",
    color: "#7f54b3",
    fields: [
      { key: "storeUrl", label: "Store URL", placeholder: "https://your-store.com", type: "text" },
      { key: "consumerKey", label: "Consumer Key", placeholder: "ck_xxxxxxxxxxxxx", type: "password" },
      { key: "consumerSecret", label: "Consumer Secret", placeholder: "cs_xxxxxxxxxxxxx", type: "password" },
    ],
    dataPoints: ["Sales & Revenue", "Orders & AOV", "Products", "Customers"],
  },
  {
    id: "klaviyo",
    name: "Klaviyo",
    description: "Email/SMS marketing, flows, campaigns, and subscriber data",
    color: "#24ce7b",
    fields: [
      { key: "apiKey", label: "Private API Key", placeholder: "pk_xxxxxxxxxxxxx", type: "password" },
    ],
    dataPoints: ["Subscribers", "Open/Click Rates", "Flow Revenue", "Campaign Revenue", "List Growth"],
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Website traffic, user behavior, conversions, and audience data",
    color: "#f9ab00",
    fields: [
      { key: "propertyId", label: "GA4 Property ID", placeholder: "123456789", type: "text" },
      { key: "serviceAccountJson", label: "Service Account JSON Key", placeholder: "Paste JSON key contents", type: "textarea" },
    ],
    dataPoints: ["Sessions & Users", "Bounce Rate", "Conversion Rate", "Traffic Sources", "Page Performance"],
  },
  {
    id: "google-ads",
    name: "Google Ads",
    description: "Ad spend, ROAS, campaign performance, and keyword data",
    color: "#4285f4",
    fields: [
      { key: "customerId", label: "Customer ID", placeholder: "123-456-7890", type: "text" },
      { key: "developerToken", label: "Developer Token", placeholder: "xxxxxxxxxxxxx", type: "password" },
      { key: "refreshToken", label: "OAuth Refresh Token", placeholder: "1//xxxxxxxxxxxxx", type: "password" },
    ],
    dataPoints: ["Ad Spend", "ROAS", "CPC/CPM", "Conversions", "Campaign Performance"],
  },
  {
    id: "google-search-console",
    name: "Google Search Console",
    description: "Organic search performance, keywords, and indexing data",
    color: "#ea4335",
    fields: [
      { key: "siteUrl", label: "Site URL", placeholder: "https://your-store.com", type: "text" },
      { key: "serviceAccountJson", label: "Service Account JSON Key", placeholder: "Paste JSON key contents", type: "textarea" },
    ],
    dataPoints: ["Search Impressions", "Click-Through Rate", "Avg Position", "Top Queries", "Index Coverage"],
  },
];
