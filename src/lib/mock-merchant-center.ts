// Google Merchant Center — deep product feed audit

export type Severity = "error" | "warning" | "info" | "pass";

export interface ProductIssue {
  field: string;
  severity: Severity;
  message: string;
  fix?: string;
  impact?: string;
}

export interface TitleAnalysis {
  length: number;
  hasBrand: boolean;
  hasColor: boolean;
  hasSize: boolean;
  hasMaterial: boolean;
  hasProductType: boolean;
  hasGender: boolean;
  structureScore: number; // 0-100
  keywordsFound: string[];
  keywordsMissing: string[];
  suggestion: string;
}

export interface ImageAudit {
  primaryImage: boolean;
  additionalCount: number;
  estimatedResolution: string;
  hasWhiteBackground: boolean;
  hasLifestyleShot: boolean;
  hasScaleReference: boolean;
  hasPackagingShot: boolean;
  imageScore: number; // 0-100
}

export interface PriceAnalysis {
  currentPrice: number;
  salePrice: number | null;
  salePctOff: number | null;
  competitorAvg: number | null;
  pricePosition: "below" | "at" | "above" | "unknown";
  marginEstimate: number | null;
  hasMAPViolation: boolean;
  hasPriceDrop30d: boolean;
  priceHistory: { date: string; price: number }[];
}

export interface ShoppingPerformance {
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  costPerClick: number;
  roas: number;
  impressionShare: number;
  topImpressionShare: number;
  avgPosition: number;
  qualityScore: number;
  trend: "up" | "down" | "flat";
  trend7d: number; // % change
}

export interface ComplianceCheck {
  landingPageMatch: boolean;
  priceMatchesPage: boolean;
  availabilityMatchesPage: boolean;
  noRestrictedContent: boolean;
  meetsImagePolicy: boolean;
  meetsIdentifierReq: boolean;
  shippingConfigured: boolean;
  taxConfigured: boolean;
  returnPolicySet: boolean;
  overallCompliant: boolean;
  violations: string[];
}

export interface StockHistory {
  date: string;
  availability: "in_stock" | "out_of_stock";
  daysInState: number;
}

export interface MerchantProduct {
  id: string;
  offerId: string;
  title: string;
  description: string;
  link: string;
  imageLink: string;
  additionalImages: string[];
  price: string;
  salePrice: string | null;
  availability: "in_stock" | "out_of_stock" | "preorder" | "backorder";
  brand: string;
  gtin: string;
  mpn: string;
  condition: "new" | "refurbished" | "used" | "";
  category: string;
  googleProductCategory: string;
  productType: string;
  color: string;
  size: string;
  material: string;
  gender: string;
  ageGroup: string;
  shippingWeight: string;
  shippingLabel: string;
  customLabel0: string;
  customLabel1: string;
  itemGroupId: string;
  status: "approved" | "disapproved" | "pending";
  issues: ProductIssue[];
  lastUpdated: string;
  // Deep audit fields
  titleAnalysis: TitleAnalysis;
  imageAudit: ImageAudit;
  priceAnalysis: PriceAnalysis;
  performance: ShoppingPerformance;
  compliance: ComplianceCheck;
  stockHistory: StockHistory[];
  productScore: number; // 0-100 overall
  client: string;
}

export interface FeedSummary {
  totalProducts: number;
  approved: number;
  disapproved: number;
  pending: number;
  inStock: number;
  outOfStock: number;
  preorder: number;
  withErrors: number;
  withWarnings: number;
  perfect: number;
  avgTitleLength: number;
  avgDescriptionLength: number;
  avgTitleScore: number;
  avgImageScore: number;
  avgProductScore: number;
  missingGtin: number;
  missingBrand: number;
  missingColor: number;
  missingSize: number;
  missingGoogleCategory: number;
  missingImages: number;
  missingDescription: number;
  shortTitles: number;
  longTitles: number;
  shortDescriptions: number;
  duplicateTitles: number;
  priceMissingSale: number;
  totalImpressions: number;
  totalClicks: number;
  totalRevenue: number;
  avgCTR: number;
  avgConvRate: number;
  avgROAS: number;
  complianceRate: number;
  stockoutRate: number;
  categoryBreakdown: { category: string; count: number; issues: number; revenue: number; avgScore: number }[];
  issueBreakdown: { issue: string; severity: Severity; count: number; impactRevenue: number }[];
  clientBreakdown: { client: string; products: number; approved: number; avgScore: number; revenue: number }[];
}

// --- Title Analysis ---
function analyzeTitle(p: { title: string; brand: string; color: string; size: string; material: string; productType: string; gender: string; googleProductCategory: string }): TitleAnalysis {
  if (!p.title) return { length: 0, hasBrand: false, hasColor: false, hasSize: false, hasMaterial: false, hasProductType: false, hasGender: false, structureScore: 0, keywordsFound: [], keywordsMissing: ["brand", "product type", "color", "size"], suggestion: "Add a descriptive title" };

  const t = p.title.toLowerCase();
  const hasBrand = !!p.brand && t.includes(p.brand.toLowerCase());
  const hasColor = !!p.color && t.includes(p.color.toLowerCase().split("/")[0]);
  const hasSize = !!p.size && (t.includes(p.size.toLowerCase()) || /\d+["'']\s|inch|oz|lb|ml/i.test(p.title));
  const hasMaterial = !!p.material && t.includes(p.material.toLowerCase().split("/")[0]);
  const hasGender = !!p.gender && (t.includes(p.gender) || t.includes("men") || t.includes("women"));

  const ptWords = p.productType?.toLowerCase().split(/[>\s/]+/).filter((w) => w.length > 3) || [];
  const hasProductType = ptWords.some((w) => t.includes(w));

  const found: string[] = [];
  const missing: string[] = [];
  if (hasBrand) found.push("brand"); else if (p.brand) missing.push("brand");
  if (hasColor) found.push("color"); else if (p.color) missing.push("color");
  if (hasSize) found.push("size"); else missing.push("size");
  if (hasMaterial) found.push("material"); else if (p.material) missing.push("material");
  if (hasProductType) found.push("product type"); else missing.push("product type");
  if (hasGender) found.push("gender"); else if (p.gender) missing.push("gender");

  let score = 0;
  // Length scoring (ideal 70-150)
  if (p.title.length >= 70 && p.title.length <= 150) score += 25;
  else if (p.title.length >= 40 && p.title.length <= 170) score += 15;
  else if (p.title.length >= 20) score += 5;
  // Attribute presence
  if (hasBrand) score += 15;
  if (hasColor) score += 12;
  if (hasSize) score += 12;
  if (hasMaterial) score += 8;
  if (hasProductType) score += 13;
  if (hasGender) score += 5;
  // Penalties
  if (p.title === p.title.toUpperCase() && p.title.length > 5) score -= 15;
  if (/!{2,}|FREE|BEST PRICE|BUY NOW|SALE/i.test(p.title)) score -= 25;
  if (p.title.length > 150) score -= 10;
  // Bonus for good structure
  if (p.title.length >= 50 && found.length >= 3) score += 10;

  score = Math.max(0, Math.min(100, score));

  const suggestions: string[] = [];
  if (!hasBrand && p.brand) suggestions.push(`Start with "${p.brand}"`);
  if (missing.includes("color") && p.color) suggestions.push(`Add color "${p.color}"`);
  if (missing.includes("size")) suggestions.push("Include size/dimensions");
  if (p.title.length < 50) suggestions.push("Expand to 70-150 characters");
  const suggestion = suggestions.length > 0 ? suggestions.join(". ") + "." : "Title looks good!";

  return { length: p.title.length, hasBrand, hasColor, hasSize, hasMaterial, hasProductType, hasGender, structureScore: score, keywordsFound: found, keywordsMissing: missing, suggestion };
}

// --- Image Audit ---
function auditImages(p: { imageLink: string; additionalImages: string[]; googleProductCategory: string; id: string }): ImageAudit {
  const seed = parseInt(p.id) || 1;
  const hasImage = !!p.imageLink;
  const isApparel = p.googleProductCategory?.includes("Apparel") || false;
  return {
    primaryImage: hasImage,
    additionalCount: p.additionalImages.length,
    estimatedResolution: hasImage ? (seed % 3 === 0 ? "800x800" : seed % 2 === 0 ? "1200x1200" : "1600x1600") : "N/A",
    hasWhiteBackground: hasImage && (isApparel ? seed % 2 === 0 : seed % 3 !== 0),
    hasLifestyleShot: p.additionalImages.length >= 2 && seed % 3 !== 0,
    hasScaleReference: p.additionalImages.length >= 3,
    hasPackagingShot: p.additionalImages.length >= 4 && seed % 2 === 0,
    imageScore: !hasImage ? 0 : Math.min(100, 30 + (p.additionalImages.length * 12) + (isApparel && seed % 2 === 0 ? 10 : 0) + (p.additionalImages.length >= 3 ? 10 : 0)),
  };
}

// --- Price Analysis ---
function analyzePrice(p: { price: string; salePrice: string | null; id: string; category: string }): PriceAnalysis {
  const current = parseFloat(p.price) || 0;
  const sale = p.salePrice ? parseFloat(p.salePrice) : null;
  const salePct = sale && current > 0 ? Math.round(((current - sale) / current) * 100) : null;
  const seed = parseInt(p.id) || 1;

  // Simulated competitor pricing
  const competitorAvg = current > 0 ? Math.round(current * (0.85 + (seed % 5) * 0.08) * 100) / 100 : null;
  const position: PriceAnalysis["pricePosition"] = !competitorAvg ? "unknown" : current < competitorAvg * 0.95 ? "below" : current > competitorAvg * 1.05 ? "above" : "at";

  const history: { date: string; price: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(2026, 2 - Math.floor(i / 4), 11 - (i * 5));
    const variance = 1 + (seed % 3 === 0 ? -0.1 : seed % 2 === 0 ? 0.05 : 0) * (i > 2 ? 1 : 0);
    history.push({ date: d.toISOString().split("T")[0], price: Math.round(current * variance * 100) / 100 });
  }

  return {
    currentPrice: current,
    salePrice: sale,
    salePctOff: salePct,
    competitorAvg,
    pricePosition: position,
    marginEstimate: current > 0 ? Math.round((40 + (seed % 4) * 8)) : null,
    hasMAPViolation: seed === 3,
    hasPriceDrop30d: seed % 4 === 0,
    priceHistory: history,
  };
}

// --- Shopping Performance ---
function generatePerformance(p: { id: string; status: string; price: string; availability: string; customLabel0: string }): ShoppingPerformance {
  const seed = parseInt(p.id) || 1;
  const isActive = p.status === "approved" && p.availability !== "out_of_stock";
  const isBestseller = p.customLabel0 === "bestseller";
  const price = parseFloat(p.price) || 20;

  const baseImpressions = isActive ? (isBestseller ? 8000 : 2000) + seed * 300 : seed * 50;
  const baseCTR = isActive ? (isBestseller ? 3.2 : 1.5) + (seed % 4) * 0.3 : 0.5;
  const impressions = Math.round(baseImpressions * (0.7 + Math.random() * 0.6));
  const clicks = Math.round(impressions * baseCTR / 100);
  const convRate = isActive ? 2.5 + (seed % 3) * 0.8 : 0.5;
  const conversions = Math.round(clicks * convRate / 100);
  const revenue = Math.round(conversions * price * 100) / 100;
  const cpc = isActive ? 0.3 + (seed % 5) * 0.15 : 0.5;

  return {
    impressions,
    clicks,
    ctr: Math.round(baseCTR * 100) / 100,
    conversions,
    conversionRate: Math.round(convRate * 100) / 100,
    revenue,
    costPerClick: Math.round(cpc * 100) / 100,
    roas: clicks > 0 ? Math.round((revenue / (clicks * cpc)) * 100) / 100 : 0,
    impressionShare: isActive ? Math.round(40 + seed * 3 + Math.random() * 20) : Math.round(5 + Math.random() * 10),
    topImpressionShare: isActive ? Math.round(15 + seed * 2 + Math.random() * 15) : Math.round(Math.random() * 5),
    avgPosition: isActive ? Math.round((1.2 + (16 - seed) * 0.15) * 10) / 10 : 8 + Math.random() * 4,
    qualityScore: isActive ? Math.min(10, Math.round(5 + seed * 0.3 + (isBestseller ? 2 : 0))) : Math.round(2 + Math.random() * 3),
    trend: seed % 3 === 0 ? "down" : seed % 2 === 0 ? "up" : "flat",
    trend7d: seed % 3 === 0 ? -(5 + Math.round(Math.random() * 15)) : seed % 2 === 0 ? (3 + Math.round(Math.random() * 12)) : Math.round(Math.random() * 4 - 2),
  };
}

// --- Compliance ---
function checkCompliance(p: { imageLink: string; gtin: string; mpn: string; brand: string; googleProductCategory: string; shippingWeight: string; price: string; title: string; condition: string }): ComplianceCheck {
  const violations: string[] = [];
  const landingPageMatch = !(/!{2,}|FREE|BEST PRICE|BUY NOW/i.test(p.title));
  const priceMatch = !!p.price;
  const hasIdentifiers = !!(p.gtin || p.mpn);
  const meetsImage = !!p.imageLink;
  const hasShipping = !!p.shippingWeight;
  const noRestricted = !(/weapon|drug|tobacco|gambling/i.test(p.title));

  if (!landingPageMatch) violations.push("Promotional text in title may not match landing page");
  if (!priceMatch) violations.push("Price missing from feed");
  if (!hasIdentifiers) violations.push("Missing unique product identifiers (GTIN/MPN)");
  if (!meetsImage) violations.push("Primary product image is missing");
  if (!p.brand) violations.push("Brand attribute is required");
  if (!p.googleProductCategory) violations.push("Google product category not mapped");
  if (!p.condition) violations.push("Product condition not specified");
  if (!hasShipping) violations.push("Shipping weight not configured");

  return {
    landingPageMatch,
    priceMatchesPage: priceMatch,
    availabilityMatchesPage: true,
    noRestrictedContent: noRestricted,
    meetsImagePolicy: meetsImage,
    meetsIdentifierReq: hasIdentifiers,
    shippingConfigured: hasShipping,
    taxConfigured: true,
    returnPolicySet: !!p.brand, // simplified
    overallCompliant: violations.length === 0,
    violations,
  };
}

// --- Stock History ---
function generateStockHistory(p: { availability: string; id: string }): StockHistory[] {
  const seed = parseInt(p.id) || 1;
  const history: StockHistory[] = [];
  const isOOS = p.availability === "out_of_stock";

  if (isOOS) {
    history.push({ date: "2026-02-20", availability: "in_stock", daysInState: 45 });
    history.push({ date: "2026-03-05", availability: "out_of_stock", daysInState: 6 });
  } else if (seed % 4 === 0) {
    history.push({ date: "2026-01-15", availability: "in_stock", daysInState: 30 });
    history.push({ date: "2026-02-14", availability: "out_of_stock", daysInState: 8 });
    history.push({ date: "2026-02-22", availability: "in_stock", daysInState: 17 });
  } else {
    history.push({ date: "2026-01-01", availability: "in_stock", daysInState: 70 });
  }
  return history;
}

// --- Core Audit ---
function auditProduct(p: MerchantProduct): ProductIssue[] {
  const issues: ProductIssue[] = [];

  // Title
  if (!p.title) {
    issues.push({ field: "title", severity: "error", message: "Title is missing", fix: "Add a descriptive product title with brand, key attributes, and product type", impact: "Products without titles are always disapproved" });
  } else {
    if (p.title.length < 30) issues.push({ field: "title", severity: "warning", message: `Title too short (${p.title.length} chars, recommend 70-150)`, fix: "Add brand name, color, size, material, and key features to title", impact: "Short titles get 40% fewer impressions on average" });
    if (p.title.length > 150) issues.push({ field: "title", severity: "warning", message: `Title too long (${p.title.length} chars, max 150)`, fix: "Shorten to under 150 characters, prioritize key attributes", impact: "Truncated titles reduce CTR by ~15%" });
    if (p.title === p.title.toUpperCase() && p.title.length > 5) issues.push({ field: "title", severity: "warning", message: "Title is ALL CAPS", fix: "Use proper title case", impact: "ALL CAPS can trigger automatic disapproval" });
    if (/!{2,}|FREE|BEST PRICE|BUY NOW|SALE/i.test(p.title)) issues.push({ field: "title", severity: "error", message: "Title contains promotional text", fix: "Remove FREE, SALE, BUY NOW — use sale_price attribute instead", impact: "Immediate disapproval per Google Merchant Center policy" });
    if (p.titleAnalysis.structureScore < 50 && p.title.length >= 10) issues.push({ field: "title", severity: "warning", message: `Title optimization score is low (${p.titleAnalysis.structureScore}/100)`, fix: p.titleAnalysis.suggestion, impact: "Optimized titles can increase CTR by 20-35%" });
    if (!p.titleAnalysis.hasBrand && p.brand) issues.push({ field: "title", severity: "info", message: "Brand name not in title", fix: `Add "${p.brand}" to the beginning of the title`, impact: "Brand in title improves ad relevance and quality score" });
  }

  // Description
  if (!p.description) {
    issues.push({ field: "description", severity: "error", message: "Description is missing", fix: "Add a detailed product description (500-5000 chars)", impact: "Missing descriptions reduce quality score and can cause disapprovals" });
  } else {
    if (p.description.length < 100) issues.push({ field: "description", severity: "warning", message: `Description too short (${p.description.length} chars)`, fix: "Expand to 500+ chars with features, materials, dimensions, use cases", impact: "Thin descriptions reduce organic Shopping visibility" });
    if (p.description.length < 500 && p.description.length >= 100) issues.push({ field: "description", severity: "info", message: `Description could be richer (${p.description.length}/500+ chars recommended)`, fix: "Add materials, dimensions, care instructions, compatibility info" });
    if (/<[^>]+>/.test(p.description)) issues.push({ field: "description", severity: "warning", message: "Description contains HTML tags", fix: "Strip all HTML — use plain text only in the feed", impact: "HTML tags display as raw text in some surfaces" });
    if (p.description === p.title) issues.push({ field: "description", severity: "warning", message: "Description is identical to title", fix: "Write a unique, detailed description", impact: "Duplicate content reduces quality score" });
  }

  // Images
  if (!p.imageLink) issues.push({ field: "imageLink", severity: "error", message: "Primary image is missing", fix: "Add a high-quality product image (min 800x800px)", impact: "Automatic disapproval — images are required" });
  if (p.additionalImages.length === 0) issues.push({ field: "additionalImages", severity: "warning", message: "No additional images", fix: "Add 3-5 images: angles, lifestyle, scale, detail shots", impact: "Products with 3+ images see 32% higher conversion rate" });
  if (p.imageAudit.imageScore < 40 && p.imageLink) issues.push({ field: "images", severity: "warning", message: `Image quality score low (${p.imageAudit.imageScore}/100)`, fix: "Add more images, ensure white background, include lifestyle shots", impact: "Low image quality correlates with lower CTR and conversions" });
  if (p.imageAudit.estimatedResolution === "800x800" && p.imageLink) issues.push({ field: "imageLink", severity: "info", message: "Image resolution at minimum (800x800)", fix: "Upgrade to 1200x1200 or higher for better zoom experience", impact: "Higher resolution images perform better on mobile Shopping" });

  // Price
  if (!p.price) issues.push({ field: "price", severity: "error", message: "Price is missing", fix: "Add product price with currency code", impact: "Automatic disapproval" });
  if (p.priceAnalysis.pricePosition === "above") issues.push({ field: "price", severity: "info", message: `Price above competitor average ($${p.priceAnalysis.competitorAvg})`, fix: "Consider competitive pricing or highlight unique value in title/description", impact: "Higher prices reduce impression share in Shopping auctions" });
  if (p.priceAnalysis.hasMAPViolation) issues.push({ field: "price", severity: "error", message: "Potential MAP (Minimum Advertised Price) violation", fix: "Verify pricing complies with manufacturer's MAP policy", impact: "MAP violations can result in account suspension" });

  // Identifiers
  if (!p.gtin && !p.mpn) issues.push({ field: "gtin", severity: "error", message: "Missing GTIN and MPN — at least one required", fix: "Add UPC/EAN/ISBN (GTIN) or manufacturer part number (MPN)", impact: "Missing identifiers result in limited impression share" });
  if (!p.brand) issues.push({ field: "brand", severity: "error", message: "Brand is missing", fix: "Add the product brand name", impact: "Required attribute — will cause disapproval" });

  // Category
  if (!p.googleProductCategory) issues.push({ field: "googleProductCategory", severity: "error", message: "Google product category is missing", fix: "Map to the most specific Google taxonomy category", impact: "Unmapped products may show for wrong queries" });

  // Availability
  if (p.availability === "out_of_stock") {
    const oosDays = p.stockHistory.find((h) => h.availability === "out_of_stock")?.daysInState || 0;
    issues.push({ field: "availability", severity: "warning", message: `Out of stock for ${oosDays} days`, fix: oosDays > 5 ? "Restock urgently or remove from feed" : "Monitor restock timeline", impact: `Lost ~$${Math.round(p.performance.revenue / 30 * oosDays)} in estimated revenue` });
  }

  // Condition
  if (!p.condition) issues.push({ field: "condition", severity: "warning", message: "Condition not specified", fix: "Set to new, refurbished, or used", impact: "Missing condition may affect ad eligibility" });

  // Apparel
  if (p.googleProductCategory?.includes("Apparel") || p.productType?.toLowerCase().includes("clothing")) {
    if (!p.color) issues.push({ field: "color", severity: "error", message: "Color missing (required for apparel)", fix: "Add the product color", impact: "Required for apparel — will cause disapproval" });
    if (!p.size) issues.push({ field: "size", severity: "error", message: "Size missing (required for apparel)", fix: "Add the product size", impact: "Required for apparel — will cause disapproval" });
    if (!p.gender) issues.push({ field: "gender", severity: "warning", message: "Gender not specified", fix: "Set to male, female, or unisex", impact: "Reduces targeting accuracy for shopping campaigns" });
    if (!p.ageGroup) issues.push({ field: "ageGroup", severity: "warning", message: "Age group not specified", fix: "Set to adult, kids, toddler, infant, or newborn" });
    if (!p.itemGroupId) issues.push({ field: "itemGroupId", severity: "warning", message: "No item group ID for variant", fix: "Group size/color variants under one item_group_id", impact: "Variants without grouping show as separate products" });
  }

  // Shipping
  if (!p.shippingWeight) issues.push({ field: "shippingWeight", severity: "info", message: "Shipping weight not set", fix: "Add for more accurate shipping cost estimates" });

  // Performance-based
  if (p.performance.ctr < 1.0 && p.performance.impressions > 500) issues.push({ field: "performance", severity: "warning", message: `Low CTR (${p.performance.ctr}%) with ${p.performance.impressions} impressions`, fix: "Improve title, add sale price, upgrade main image", impact: "Low CTR wastes impression share allocation" });
  if (p.performance.conversionRate < 1.0 && p.performance.clicks > 20) issues.push({ field: "performance", severity: "warning", message: `Low conversion rate (${p.performance.conversionRate}%)`, fix: "Check landing page experience, pricing, and product page content", impact: "Low conversions increase effective CPA" });
  if (p.performance.qualityScore <= 4) issues.push({ field: "qualityScore", severity: "info", message: `Low quality score (${p.performance.qualityScore}/10)`, fix: "Improve feed data completeness, landing page relevance, bid strategy", impact: "Low quality score reduces impression share and increases CPC" });

  // Compliance
  if (!p.compliance.overallCompliant) {
    for (const v of p.compliance.violations.slice(0, 2)) {
      issues.push({ field: "compliance", severity: "error", message: v, fix: "Fix to avoid disapproval or account suspension" });
    }
  }

  return issues;
}

// --- Raw Product Data ---
const clientMap: Record<string, string> = {
  "BG": "Bloom & Grow",
  "AP": "Apex Gear",
  "CH": "Cozy Home",
};

const rawBase: Omit<MerchantProduct, "issues" | "titleAnalysis" | "imageAudit" | "priceAnalysis" | "performance" | "compliance" | "stockHistory" | "productScore" | "client">[] = [
  {
    id: "1", offerId: "SKU-BG-001", title: "Monstera Deliciosa - Large Indoor Plant 10\" Pot",
    description: "Beautiful Monstera Deliciosa (Swiss Cheese Plant) in a 10-inch nursery pot. This tropical beauty features the iconic split leaves that make it a statement piece in any room. Easy to care for, thrives in indirect light. Height approximately 24-30 inches from soil level.",
    link: "https://bloomgrow.com/products/monstera-deliciosa-large", imageLink: "https://cdn.bloomgrow.com/monstera-large.jpg",
    additionalImages: ["https://cdn.bloomgrow.com/monstera-2.jpg", "https://cdn.bloomgrow.com/monstera-3.jpg"],
    price: "45.99 USD", salePrice: "39.99 USD", availability: "in_stock",
    brand: "Bloom & Grow", gtin: "0123456789012", mpn: "BG-MON-10",
    condition: "new", category: "Plants", googleProductCategory: "Home & Garden > Plants > Houseplants",
    productType: "Indoor Plants > Tropical", color: "Green", size: "10 inch pot",
    material: "", gender: "", ageGroup: "", shippingWeight: "8 lb",
    shippingLabel: "oversize", customLabel0: "bestseller", customLabel1: "tropical",
    itemGroupId: "MON-GROUP", status: "approved", lastUpdated: "2026-03-10",
  },
  {
    id: "2", offerId: "SKU-BG-002", title: "Fiddle Leaf Fig",
    description: "Fiddle leaf fig tree.",
    link: "https://bloomgrow.com/products/fiddle-leaf-fig", imageLink: "https://cdn.bloomgrow.com/fiddle.jpg",
    additionalImages: [],
    price: "65.00 USD", salePrice: null, availability: "in_stock",
    brand: "Bloom & Grow", gtin: "", mpn: "",
    condition: "new", category: "Plants", googleProductCategory: "",
    productType: "Indoor Plants", color: "Green", size: "",
    material: "", gender: "", ageGroup: "", shippingWeight: "",
    shippingLabel: "", customLabel0: "", customLabel1: "",
    itemGroupId: "", status: "disapproved", lastUpdated: "2026-03-08",
  },
  {
    id: "3", offerId: "SKU-BG-003", title: "SNAKE PLANT BUNDLE - BUY NOW!! BEST PRICE GUARANTEED!!!",
    description: "Bundle of 3 snake plants. Various sizes included. Low maintenance and perfect for beginners. Sansevieria trifasciata, also known as mother-in-law's tongue, is one of the hardiest indoor plants available. Tolerates low light and infrequent watering.",
    link: "https://bloomgrow.com/products/snake-plant-bundle", imageLink: "https://cdn.bloomgrow.com/snake-bundle.jpg",
    additionalImages: ["https://cdn.bloomgrow.com/snake-2.jpg"],
    price: "34.99 USD", salePrice: "29.99 USD", availability: "in_stock",
    brand: "Bloom & Grow", gtin: "0123456789034", mpn: "BG-SNK-BDL",
    condition: "new", category: "Plants", googleProductCategory: "Home & Garden > Plants > Houseplants",
    productType: "Indoor Plants > Succulents", color: "Green/Yellow", size: "Assorted",
    material: "", gender: "", ageGroup: "", shippingWeight: "5 lb",
    shippingLabel: "standard", customLabel0: "bundle", customLabel1: "beginner",
    itemGroupId: "SNK-GROUP", status: "disapproved", lastUpdated: "2026-03-09",
  },
  {
    id: "4", offerId: "SKU-BG-004", title: "Ceramic Self-Watering Planter - Matte White - 6 Inch",
    description: "Elegant matte white ceramic self-watering planter. Features a built-in water reservoir that keeps your plants hydrated for up to 2 weeks. The modern minimalist design complements any decor. Inner pot is removable for easy planting. Drainage hole with plug included. Dimensions: 6\" diameter x 5.5\" height.",
    link: "https://bloomgrow.com/products/ceramic-self-watering-planter", imageLink: "https://cdn.bloomgrow.com/planter-white.jpg",
    additionalImages: ["https://cdn.bloomgrow.com/planter-2.jpg", "https://cdn.bloomgrow.com/planter-3.jpg", "https://cdn.bloomgrow.com/planter-4.jpg"],
    price: "28.50 USD", salePrice: null, availability: "in_stock",
    brand: "Bloom & Grow", gtin: "0123456789045", mpn: "BG-PLT-WH6",
    condition: "new", category: "Planters", googleProductCategory: "Home & Garden > Lawn & Garden > Gardening > Pot & Planter Liners",
    productType: "Planters > Ceramic", color: "White", size: "6 inch",
    material: "Ceramic", gender: "", ageGroup: "", shippingWeight: "2.5 lb",
    shippingLabel: "standard", customLabel0: "accessory", customLabel1: "",
    itemGroupId: "PLT-WH-GROUP", status: "approved", lastUpdated: "2026-03-10",
  },
  {
    id: "5", offerId: "SKU-BG-005", title: "Pothos Golden",
    description: "",
    link: "https://bloomgrow.com/products/pothos-golden", imageLink: "",
    additionalImages: [],
    price: "12.99 USD", salePrice: null, availability: "out_of_stock",
    brand: "", gtin: "", mpn: "",
    condition: "", category: "Plants", googleProductCategory: "",
    productType: "Indoor Plants", color: "", size: "",
    material: "", gender: "", ageGroup: "", shippingWeight: "",
    shippingLabel: "", customLabel0: "", customLabel1: "",
    itemGroupId: "", status: "disapproved", lastUpdated: "2026-02-15",
  },
  {
    id: "6", offerId: "SKU-BG-006", title: "Organic Indoor Plant Fertilizer - All-Purpose Liquid Feed 16oz",
    description: "Premium organic liquid fertilizer specially formulated for indoor plants. NPK ratio 3-1-2 promotes healthy foliage growth. Made from sustainably sourced seaweed extract and worm castings. Safe for all houseplants including edibles. Apply every 2 weeks during growing season. One bottle treats up to 50 plants.",
    link: "https://bloomgrow.com/products/organic-fertilizer", imageLink: "https://cdn.bloomgrow.com/fertilizer.jpg",
    additionalImages: ["https://cdn.bloomgrow.com/fert-2.jpg"],
    price: "14.99 USD", salePrice: null, availability: "in_stock",
    brand: "Bloom & Grow", gtin: "0123456789067", mpn: "BG-FERT-16",
    condition: "new", category: "Plant Care", googleProductCategory: "Home & Garden > Lawn & Garden > Gardening > Plant Food",
    productType: "Plant Care > Fertilizer", color: "", size: "16 oz",
    material: "", gender: "", ageGroup: "", shippingWeight: "1.2 lb",
    shippingLabel: "standard", customLabel0: "consumable", customLabel1: "organic",
    itemGroupId: "", status: "approved", lastUpdated: "2026-03-10",
  },
  {
    id: "7", offerId: "SKU-BG-007", title: "Rare Pink Princess Philodendron - Variegated - 4\" Nursery Pot",
    description: "Highly sought-after Pink Princess Philodendron (Philodendron erubescens) with beautiful pink variegation on dark green leaves. Each plant is unique with varying levels of pink. Shipped in a 4-inch nursery pot. Requires bright indirect light to maintain variegation. Allow soil to partially dry between waterings. <b>Note:</b> <i>Variegation varies by plant.</i>",
    link: "https://bloomgrow.com/products/pink-princess-philodendron", imageLink: "https://cdn.bloomgrow.com/pink-princess.jpg",
    additionalImages: ["https://cdn.bloomgrow.com/pp-2.jpg", "https://cdn.bloomgrow.com/pp-3.jpg"],
    price: "89.99 USD", salePrice: "79.99 USD", availability: "in_stock",
    brand: "Bloom & Grow", gtin: "0123456789078", mpn: "BG-PPP-4",
    condition: "new", category: "Plants", googleProductCategory: "Home & Garden > Plants > Houseplants",
    productType: "Indoor Plants > Rare & Exotic", color: "Pink/Green", size: "4 inch pot",
    material: "", gender: "", ageGroup: "", shippingWeight: "1.5 lb",
    shippingLabel: "fragile", customLabel0: "rare", customLabel1: "high-value",
    itemGroupId: "PPP-GROUP", status: "approved", lastUpdated: "2026-03-10",
  },
  {
    id: "8", offerId: "SKU-BG-008", title: "Macrame Plant Hanger - Cotton Rope - 36 Inch - Boho Home Decor Wall Hanging Planter Holder",
    description: "Handcrafted macrame plant hanger made from 100% natural cotton rope. Features intricate knotwork in a bohemian design. Holds pots up to 8 inches in diameter. Total length 36 inches from hook to bottom. Includes wooden ring for easy hanging. Perfect for trailing plants like pothos, string of pearls, or spider plants.",
    link: "https://bloomgrow.com/products/macrame-hanger", imageLink: "https://cdn.bloomgrow.com/macrame.jpg",
    additionalImages: [],
    price: "22.99 USD", salePrice: null, availability: "in_stock",
    brand: "Bloom & Grow", gtin: "0123456789089", mpn: "BG-MAC-36",
    condition: "new", category: "Plant Accessories", googleProductCategory: "Home & Garden > Decor > Plant Stands & Hangers",
    productType: "Accessories > Hangers", color: "Natural/Cream", size: "36 inch",
    material: "Cotton", gender: "", ageGroup: "", shippingWeight: "0.5 lb",
    shippingLabel: "standard", customLabel0: "accessory", customLabel1: "handmade",
    itemGroupId: "", status: "pending", lastUpdated: "2026-03-11",
  },
  {
    id: "9", offerId: "SKU-BG-009", title: "Succulent Trio Gift Box",
    description: "Curated gift box with three hand-selected succulents in decorative 3-inch pots. Includes a care card with watering and light instructions. Each box contains a mix of rosette, trailing, and upright varieties. Perfect gift for plant lovers, housewarmings, or office desks. Plants may vary from photos based on seasonal availability.",
    link: "https://bloomgrow.com/products/succulent-trio", imageLink: "https://cdn.bloomgrow.com/succulent-trio.jpg",
    additionalImages: ["https://cdn.bloomgrow.com/succ-2.jpg", "https://cdn.bloomgrow.com/succ-3.jpg"],
    price: "32.99 USD", salePrice: "27.99 USD", availability: "preorder",
    brand: "Bloom & Grow", gtin: "0123456789090", mpn: "BG-SUC-TRIO",
    condition: "new", category: "Plants", googleProductCategory: "Home & Garden > Plants > Houseplants",
    productType: "Indoor Plants > Succulents > Gift Sets", color: "Assorted", size: "3 inch pots (x3)",
    material: "", gender: "", ageGroup: "", shippingWeight: "3 lb",
    shippingLabel: "fragile", customLabel0: "gift", customLabel1: "seasonal",
    itemGroupId: "SUC-TRIO-GROUP", status: "approved", lastUpdated: "2026-03-10",
  },
  {
    id: "10", offerId: "SKU-BG-010", title: "ZZ Plant",
    description: "Zamioculcas zamiifolia in a 6-inch pot. Very low maintenance. Drought tolerant. Great for offices and low-light spaces.",
    link: "https://bloomgrow.com/products/zz-plant", imageLink: "https://cdn.bloomgrow.com/zz-plant.jpg",
    additionalImages: [],
    price: "24.99 USD", salePrice: null, availability: "in_stock",
    brand: "Bloom & Grow", gtin: "", mpn: "BG-ZZ-6",
    condition: "new", category: "Plants", googleProductCategory: "Home & Garden > Plants > Houseplants",
    productType: "Indoor Plants > Low Light", color: "Green", size: "6 inch pot",
    material: "", gender: "", ageGroup: "", shippingWeight: "4 lb",
    shippingLabel: "standard", customLabel0: "easy-care", customLabel1: "",
    itemGroupId: "", status: "approved", lastUpdated: "2026-03-09",
  },
  {
    id: "11", offerId: "SKU-AP-001", title: "Men's Performance Running Shorts - Lightweight 5\" Inseam",
    description: "Engineered for speed and comfort. These lightweight running shorts feature moisture-wicking fabric, built-in brief liner, zippered back pocket for keys, and reflective details for low-light visibility. 4-way stretch polyester blend moves with you through any workout. Available in multiple colors and sizes.",
    link: "https://apexgear.com/products/mens-running-shorts", imageLink: "https://cdn.apexgear.com/running-shorts.jpg",
    additionalImages: ["https://cdn.apexgear.com/shorts-2.jpg", "https://cdn.apexgear.com/shorts-3.jpg", "https://cdn.apexgear.com/shorts-4.jpg"],
    price: "45.00 USD", salePrice: "38.00 USD", availability: "in_stock",
    brand: "Apex Performance", gtin: "0234567890012", mpn: "AP-RS-001",
    condition: "new", category: "Athletic Shorts", googleProductCategory: "Apparel & Accessories > Clothing > Shorts",
    productType: "Men's Clothing > Athletic Shorts", color: "Black", size: "M",
    material: "Polyester/Spandex", gender: "male", ageGroup: "adult", shippingWeight: "0.3 lb",
    shippingLabel: "standard", customLabel0: "bestseller", customLabel1: "running",
    itemGroupId: "AP-RS-GROUP", status: "approved", lastUpdated: "2026-03-10",
  },
  {
    id: "12", offerId: "SKU-AP-002", title: "Women's Compression Leggings",
    description: "High-waisted compression leggings with squat-proof fabric. Features a hidden waistband pocket, flatlock seams to prevent chafing, and four-way stretch for full range of motion. Perfect for running, yoga, CrossFit, and everyday wear.",
    link: "https://apexgear.com/products/womens-compression-leggings", imageLink: "https://cdn.apexgear.com/leggings.jpg",
    additionalImages: ["https://cdn.apexgear.com/legg-2.jpg"],
    price: "58.00 USD", salePrice: null, availability: "in_stock",
    brand: "Apex Performance", gtin: "0234567890023", mpn: "AP-CL-001",
    condition: "new", category: "Athletic Leggings", googleProductCategory: "Apparel & Accessories > Clothing > Pants",
    productType: "Women's Clothing > Leggings", color: "", size: "",
    material: "Nylon/Spandex", gender: "", ageGroup: "", shippingWeight: "0.4 lb",
    shippingLabel: "standard", customLabel0: "core", customLabel1: "yoga",
    itemGroupId: "AP-CL-GROUP", status: "pending", lastUpdated: "2026-03-11",
  },
  {
    id: "13", offerId: "SKU-AP-003", title: "Insulated Water Bottle 32oz - Stainless Steel",
    description: "Double-wall vacuum insulated water bottle keeps drinks cold for 24 hours or hot for 12. Made from food-grade 18/8 stainless steel. BPA-free. Wide mouth for easy filling and cleaning. Leak-proof lid with carry loop. Fits standard cup holders.",
    link: "https://apexgear.com/products/insulated-bottle", imageLink: "https://cdn.apexgear.com/bottle.jpg",
    additionalImages: ["https://cdn.apexgear.com/bottle-2.jpg", "https://cdn.apexgear.com/bottle-3.jpg"],
    price: "29.99 USD", salePrice: null, availability: "out_of_stock",
    brand: "Apex Performance", gtin: "0234567890034", mpn: "AP-WB-32",
    condition: "new", category: "Hydration", googleProductCategory: "Home & Garden > Kitchen & Dining > Drinkware > Water Bottles",
    productType: "Accessories > Water Bottles", color: "Midnight Blue", size: "32 oz",
    material: "Stainless Steel", gender: "", ageGroup: "", shippingWeight: "0.9 lb",
    shippingLabel: "standard", customLabel0: "accessory", customLabel1: "",
    itemGroupId: "AP-WB-GROUP", status: "approved", lastUpdated: "2026-03-07",
  },
  {
    id: "14", offerId: "SKU-CH-001", title: "Handwoven Throw Blanket - 100% Cotton - 50x60\"",
    description: "Artisan-crafted throw blanket handwoven from 100% organic cotton. Features a classic herringbone pattern with fringed edges. Pre-washed for ultimate softness. Machine washable and dryer safe. OEKO-TEX certified free from harmful substances. Size: 50 x 60 inches.",
    link: "https://cozyhome.com/products/handwoven-throw", imageLink: "https://cdn.cozyhome.com/throw.jpg",
    additionalImages: ["https://cdn.cozyhome.com/throw-2.jpg", "https://cdn.cozyhome.com/throw-3.jpg", "https://cdn.cozyhome.com/throw-4.jpg"],
    price: "79.99 USD", salePrice: "64.99 USD", availability: "in_stock",
    brand: "Cozy Home Collective", gtin: "0345678901012", mpn: "CH-THR-HB50",
    condition: "new", category: "Blankets", googleProductCategory: "Home & Garden > Linens & Bedding > Blankets & Throws",
    productType: "Living Room > Throw Blankets", color: "Oatmeal", size: "50x60 inches",
    material: "Organic Cotton", gender: "", ageGroup: "", shippingWeight: "2.2 lb",
    shippingLabel: "standard", customLabel0: "bestseller", customLabel1: "organic",
    itemGroupId: "CH-THR-GROUP", status: "approved", lastUpdated: "2026-03-10",
  },
  {
    id: "15", offerId: "SKU-CH-002", title: "Soy Candle",
    description: "Hand-poured soy candle. Smells nice. Burns a long time.",
    link: "https://cozyhome.com/products/soy-candle", imageLink: "https://cdn.cozyhome.com/candle.jpg",
    additionalImages: [],
    price: "24.99 USD", salePrice: null, availability: "in_stock",
    brand: "", gtin: "", mpn: "",
    condition: "", category: "Candles", googleProductCategory: "",
    productType: "Home Decor > Candles", color: "", size: "",
    material: "", gender: "", ageGroup: "", shippingWeight: "",
    shippingLabel: "", customLabel0: "", customLabel1: "",
    itemGroupId: "", status: "disapproved", lastUpdated: "2026-03-01",
  },
  {
    id: "16", offerId: "SKU-CH-003", title: "Linen Duvet Cover Set - King - Stonewashed Belgian Linen",
    description: "Luxurious stonewashed Belgian linen duvet cover set. Includes one duvet cover and two pillow shams. Gets softer with every wash. Natural temperature regulation keeps you cool in summer and warm in winter. Hidden button closure. Linen is naturally hypoallergenic, moisture-wicking, and eco-friendly. OEKO-TEX Standard 100 certified.",
    link: "https://cozyhome.com/products/linen-duvet-king", imageLink: "https://cdn.cozyhome.com/duvet.jpg",
    additionalImages: ["https://cdn.cozyhome.com/duvet-2.jpg", "https://cdn.cozyhome.com/duvet-3.jpg"],
    price: "189.00 USD", salePrice: null, availability: "in_stock",
    brand: "Cozy Home Collective", gtin: "0345678901034", mpn: "CH-DUV-K",
    condition: "new", category: "Bedding", googleProductCategory: "Home & Garden > Linens & Bedding > Bedding > Duvet Covers",
    productType: "Bedroom > Duvet Covers", color: "Sand", size: "King",
    material: "Belgian Linen", gender: "", ageGroup: "", shippingWeight: "4.5 lb",
    shippingLabel: "standard", customLabel0: "premium", customLabel1: "linen",
    itemGroupId: "CH-DUV-GROUP", status: "approved", lastUpdated: "2026-03-10",
  },
];

// Build enriched products
function buildProduct(raw: typeof rawBase[0]): MerchantProduct {
  const clientKey = raw.offerId.split("-")[1] || "BG";
  const client = clientMap[clientKey] || "Unknown";

  // Generate deep audit data first (needed by issue checker)
  const titleAnalysis = analyzeTitle(raw);
  const imageAudit = auditImages(raw);
  const priceAnalysis = analyzePrice(raw);
  const performance = generatePerformance(raw);
  const compliance = checkCompliance(raw);
  const stockHistory = generateStockHistory(raw);

  const partial: MerchantProduct = {
    ...raw,
    titleAnalysis,
    imageAudit,
    priceAnalysis,
    performance,
    compliance,
    stockHistory,
    client,
    issues: [],
    productScore: 0,
  };

  // Run full audit
  partial.issues = auditProduct(partial);

  // Compute overall product score
  const errorCount = partial.issues.filter((i) => i.severity === "error").length;
  const warnCount = partial.issues.filter((i) => i.severity === "warning").length;
  let score = 100;
  score -= errorCount * 15;
  score -= warnCount * 5;
  score = Math.max(0, Math.min(100, score));
  // Blend with other scores
  score = Math.round(score * 0.4 + titleAnalysis.structureScore * 0.2 + imageAudit.imageScore * 0.2 + (performance.qualityScore * 10) * 0.2);
  partial.productScore = Math.max(0, Math.min(100, score));

  return partial;
}

export const merchantProducts: MerchantProduct[] = rawBase.map(buildProduct);

// --- Feed Summary ---
function computeSummary(products: MerchantProduct[]): FeedSummary {
  const titles = products.map((p) => p.title).filter(Boolean);
  const titleSet = new Set(titles);

  const categories = new Map<string, { count: number; issues: number; revenue: number; totalScore: number }>();
  for (const p of products) {
    const cat = p.category || "Uncategorized";
    const existing = categories.get(cat) || { count: 0, issues: 0, revenue: 0, totalScore: 0 };
    existing.count++;
    if (p.issues.some((i) => i.severity === "error" || i.severity === "warning")) existing.issues++;
    existing.revenue += p.performance.revenue;
    existing.totalScore += p.productScore;
    categories.set(cat, existing);
  }

  const issueCounts = new Map<string, { severity: Severity; count: number; impactRevenue: number }>();
  for (const p of products) {
    for (const issue of p.issues) {
      const key = issue.message.split("(")[0].split(" — ")[0].trim();
      const existing = issueCounts.get(key) || { severity: issue.severity, count: 0, impactRevenue: 0 };
      existing.count++;
      existing.impactRevenue += p.performance.revenue;
      issueCounts.set(key, existing);
    }
  }

  const clients = new Map<string, { products: number; approved: number; totalScore: number; revenue: number }>();
  for (const p of products) {
    const existing = clients.get(p.client) || { products: 0, approved: 0, totalScore: 0, revenue: 0 };
    existing.products++;
    if (p.status === "approved") existing.approved++;
    existing.totalScore += p.productScore;
    existing.revenue += p.performance.revenue;
    clients.set(p.client, existing);
  }

  const compliantCount = products.filter((p) => p.compliance.overallCompliant).length;

  return {
    totalProducts: products.length,
    approved: products.filter((p) => p.status === "approved").length,
    disapproved: products.filter((p) => p.status === "disapproved").length,
    pending: products.filter((p) => p.status === "pending").length,
    inStock: products.filter((p) => p.availability === "in_stock").length,
    outOfStock: products.filter((p) => p.availability === "out_of_stock").length,
    preorder: products.filter((p) => p.availability === "preorder" || p.availability === "backorder").length,
    withErrors: products.filter((p) => p.issues.some((i) => i.severity === "error")).length,
    withWarnings: products.filter((p) => p.issues.some((i) => i.severity === "warning") && !p.issues.some((i) => i.severity === "error")).length,
    perfect: products.filter((p) => p.issues.length === 0).length,
    avgTitleLength: Math.round(titles.reduce((a, t) => a + t.length, 0) / (titles.length || 1)),
    avgDescriptionLength: Math.round(products.filter((p) => p.description).reduce((a, p) => a + p.description.length, 0) / (products.filter((p) => p.description).length || 1)),
    avgTitleScore: Math.round(products.reduce((a, p) => a + p.titleAnalysis.structureScore, 0) / products.length),
    avgImageScore: Math.round(products.reduce((a, p) => a + p.imageAudit.imageScore, 0) / products.length),
    avgProductScore: Math.round(products.reduce((a, p) => a + p.productScore, 0) / products.length),
    missingGtin: products.filter((p) => !p.gtin && !p.mpn).length,
    missingBrand: products.filter((p) => !p.brand).length,
    missingColor: products.filter((p) => !p.color).length,
    missingSize: products.filter((p) => !p.size).length,
    missingGoogleCategory: products.filter((p) => !p.googleProductCategory).length,
    missingImages: products.filter((p) => !p.imageLink).length,
    missingDescription: products.filter((p) => !p.description).length,
    shortTitles: products.filter((p) => p.title && p.title.length < 30).length,
    longTitles: products.filter((p) => p.title && p.title.length > 150).length,
    shortDescriptions: products.filter((p) => p.description && p.description.length < 100).length,
    duplicateTitles: titles.length - titleSet.size,
    priceMissingSale: products.filter((p) => p.salePrice && parseFloat(p.salePrice) >= parseFloat(p.price)).length,
    totalImpressions: products.reduce((a, p) => a + p.performance.impressions, 0),
    totalClicks: products.reduce((a, p) => a + p.performance.clicks, 0),
    totalRevenue: Math.round(products.reduce((a, p) => a + p.performance.revenue, 0)),
    avgCTR: Math.round((products.reduce((a, p) => a + p.performance.ctr, 0) / products.length) * 100) / 100,
    avgConvRate: Math.round((products.reduce((a, p) => a + p.performance.conversionRate, 0) / products.length) * 100) / 100,
    avgROAS: Math.round((products.filter((p) => p.performance.roas > 0).reduce((a, p) => a + p.performance.roas, 0) / (products.filter((p) => p.performance.roas > 0).length || 1)) * 100) / 100,
    complianceRate: Math.round((compliantCount / products.length) * 100),
    stockoutRate: Math.round((products.filter((p) => p.availability === "out_of_stock").length / products.length) * 100),
    categoryBreakdown: Array.from(categories.entries()).map(([category, data]) => ({ category, count: data.count, issues: data.issues, revenue: Math.round(data.revenue), avgScore: Math.round(data.totalScore / data.count) })).sort((a, b) => b.revenue - a.revenue),
    issueBreakdown: Array.from(issueCounts.entries()).map(([issue, data]) => ({ issue, severity: data.severity, count: data.count, impactRevenue: Math.round(data.impactRevenue) })).sort((a, b) => {
      const sevOrder: Record<Severity, number> = { error: 0, warning: 1, info: 2, pass: 3 };
      return sevOrder[a.severity] - sevOrder[b.severity] || b.count - a.count;
    }),
    clientBreakdown: Array.from(clients.entries()).map(([client, data]) => ({ client, products: data.products, approved: data.approved, avgScore: Math.round(data.totalScore / data.products), revenue: Math.round(data.revenue) })).sort((a, b) => b.revenue - a.revenue),
  };
}

export const feedSummary = computeSummary(merchantProducts);
