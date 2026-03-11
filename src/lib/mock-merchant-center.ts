// Google Merchant Center product feed audit data

export type Severity = "error" | "warning" | "info" | "pass";

export interface ProductIssue {
  field: string;
  severity: Severity;
  message: string;
  fix?: string;
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
  categoryBreakdown: { category: string; count: number; issues: number }[];
  issueBreakdown: { issue: string; severity: Severity; count: number }[];
}

function auditProduct(p: MerchantProduct): ProductIssue[] {
  const issues: ProductIssue[] = [];

  // Title checks
  if (!p.title) {
    issues.push({ field: "title", severity: "error", message: "Title is missing", fix: "Add a descriptive product title with brand, key attributes, and product type" });
  } else {
    if (p.title.length < 30) {
      issues.push({ field: "title", severity: "warning", message: `Title too short (${p.title.length} chars, recommend 70-150)`, fix: "Add brand name, color, size, material, and key features to title" });
    }
    if (p.title.length > 150) {
      issues.push({ field: "title", severity: "warning", message: `Title too long (${p.title.length} chars, max 150)`, fix: "Shorten title to under 150 characters, keep most important attributes first" });
    }
    if (p.title === p.title.toUpperCase() && p.title.length > 5) {
      issues.push({ field: "title", severity: "warning", message: "Title is ALL CAPS", fix: "Use proper title case — all caps can trigger disapprovals" });
    }
    if (/!{2,}|FREE|BEST PRICE|BUY NOW|SALE/i.test(p.title)) {
      issues.push({ field: "title", severity: "error", message: "Title contains promotional text", fix: "Remove promotional language like FREE, SALE, BUY NOW from title" });
    }
  }

  // Description checks
  if (!p.description) {
    issues.push({ field: "description", severity: "error", message: "Description is missing", fix: "Add a detailed product description (500-5000 chars recommended)" });
  } else {
    if (p.description.length < 100) {
      issues.push({ field: "description", severity: "warning", message: `Description too short (${p.description.length} chars)`, fix: "Expand description to at least 500 characters with features, materials, use cases" });
    }
    if (/<[^>]+>/.test(p.description)) {
      issues.push({ field: "description", severity: "warning", message: "Description contains HTML tags", fix: "Strip HTML tags from description — use plain text only" });
    }
  }

  // Image checks
  if (!p.imageLink) {
    issues.push({ field: "imageLink", severity: "error", message: "Primary image is missing", fix: "Add a high-quality product image (min 800x800px, white background for apparel)" });
  }
  if (p.additionalImages.length === 0) {
    issues.push({ field: "additionalImages", severity: "warning", message: "No additional images", fix: "Add 3-5 additional images showing different angles, lifestyle shots, size context" });
  }

  // Price checks
  if (!p.price) {
    issues.push({ field: "price", severity: "error", message: "Price is missing", fix: "Add the product price including currency code" });
  }

  // Identifiers
  if (!p.gtin && !p.mpn) {
    issues.push({ field: "gtin", severity: "error", message: "Missing GTIN and MPN — at least one required", fix: "Add UPC/EAN/ISBN (GTIN) or manufacturer part number (MPN)" });
  }
  if (!p.brand) {
    issues.push({ field: "brand", severity: "error", message: "Brand is missing", fix: "Add the product brand name" });
  }

  // Category
  if (!p.googleProductCategory) {
    issues.push({ field: "googleProductCategory", severity: "error", message: "Google product category is missing", fix: "Map to the most specific Google product taxonomy category" });
  }

  // Availability
  if (p.availability === "out_of_stock") {
    issues.push({ field: "availability", severity: "warning", message: "Product is out of stock", fix: "Restock or remove from feed to avoid wasted impressions" });
  }

  // Condition
  if (!p.condition) {
    issues.push({ field: "condition", severity: "warning", message: "Condition not specified", fix: "Set condition to new, refurbished, or used" });
  }

  // Apparel-specific
  if (p.googleProductCategory?.includes("Apparel") || p.productType?.toLowerCase().includes("clothing")) {
    if (!p.color) {
      issues.push({ field: "color", severity: "error", message: "Color missing (required for apparel)", fix: "Add the product color" });
    }
    if (!p.size) {
      issues.push({ field: "size", severity: "error", message: "Size missing (required for apparel)", fix: "Add the product size" });
    }
    if (!p.gender) {
      issues.push({ field: "gender", severity: "warning", message: "Gender not specified (recommended for apparel)", fix: "Set gender to male, female, or unisex" });
    }
    if (!p.ageGroup) {
      issues.push({ field: "ageGroup", severity: "warning", message: "Age group not specified (recommended for apparel)", fix: "Set age group to adult, kids, toddler, infant, or newborn" });
    }
  }

  // Shipping
  if (!p.shippingWeight) {
    issues.push({ field: "shippingWeight", severity: "info", message: "Shipping weight not set", fix: "Add shipping weight for more accurate shipping cost estimates" });
  }

  return issues;
}

// Generate realistic mock products
const rawProducts: Omit<MerchantProduct, "issues">[] = [
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

// Run audit on all products
export const merchantProducts: MerchantProduct[] = rawProducts.map((p) => ({
  ...p,
  issues: auditProduct(p as MerchantProduct),
}));

// Compute feed summary
function computeSummary(products: MerchantProduct[]): FeedSummary {
  const titles = products.map((p) => p.title).filter(Boolean);
  const titleSet = new Set(titles);
  const duplicateTitles = titles.length - titleSet.size;

  const categories = new Map<string, { count: number; issues: number }>();
  for (const p of products) {
    const cat = p.category || "Uncategorized";
    const existing = categories.get(cat) || { count: 0, issues: 0 };
    existing.count++;
    if (p.issues.some((i) => i.severity === "error" || i.severity === "warning")) existing.issues++;
    categories.set(cat, existing);
  }

  const issueCounts = new Map<string, { severity: Severity; count: number }>();
  for (const p of products) {
    for (const issue of p.issues) {
      const key = issue.message.split("(")[0].trim();
      const existing = issueCounts.get(key) || { severity: issue.severity, count: 0 };
      existing.count++;
      issueCounts.set(key, existing);
    }
  }

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
    avgTitleLength: Math.round(titles.reduce((a, t) => a + t.length, 0) / titles.length),
    avgDescriptionLength: Math.round(products.filter((p) => p.description).reduce((a, p) => a + p.description.length, 0) / products.filter((p) => p.description).length),
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
    duplicateTitles,
    priceMissingSale: products.filter((p) => p.salePrice && parseFloat(p.salePrice) >= parseFloat(p.price)).length,
    categoryBreakdown: Array.from(categories.entries()).map(([category, data]) => ({ category, ...data })).sort((a, b) => b.count - a.count),
    issueBreakdown: Array.from(issueCounts.entries()).map(([issue, data]) => ({ issue, ...data })).sort((a, b) => {
      const sevOrder: Record<Severity, number> = { error: 0, warning: 1, info: 2, pass: 3 };
      return sevOrder[a.severity] - sevOrder[b.severity] || b.count - a.count;
    }),
  };
}

export const feedSummary = computeSummary(merchantProducts);
