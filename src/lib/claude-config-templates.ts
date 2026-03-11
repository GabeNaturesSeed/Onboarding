// Claude Code configuration templates for scaffolded e-commerce themes

export interface ClaudeFileTemplate {
  path: string;
  content: string;
  description: string;
}

export function getClaudeFiles(platform: "shopify" | "woocommerce", storeName: string): ClaudeFileTemplate[] {
  return [
    {
      path: "CLAUDE.md",
      description: "Main project instructions for Claude Code",
      content: platform === "shopify" ? getShopifyClaudeMd(storeName) : getWooCommerceClaudeMd(storeName),
    },
    {
      path: ".claude/settings.json",
      description: "Project-wide Claude Code settings with permissions",
      content: JSON.stringify(platform === "shopify" ? getShopifySettings() : getWooCommerceSettings(), null, 2),
    },
    {
      path: ".mcp.json",
      description: "MCP server configurations for AI-powered development",
      content: JSON.stringify(platform === "shopify" ? getShopifyMCP(storeName) : getWooCommerceMCP(storeName), null, 2),
    },
    {
      path: ".claude/rules/theme-standards.md",
      description: "Code standards and conventions",
      content: platform === "shopify" ? getShopifyRules() : getWooCommerceRules(),
    },
    {
      path: ".claude/rules/performance.md",
      description: "Performance optimization guidelines",
      content: getPerformanceRules(platform),
    },
    {
      path: ".claude/rules/seo-accessibility.md",
      description: "SEO and accessibility requirements",
      content: getSEOAccessibilityRules(platform),
    },
    ...getSkillFiles(platform, storeName),
  ];
}

// ─── CLAUDE.md Templates ───

function getShopifyClaudeMd(storeName: string): string {
  return `# ${storeName} — Shopify Theme

## Overview
This is a Shopify Liquid theme for **${storeName}**. It uses Shopify's Online Store 2.0 architecture with JSON templates, sections, and blocks.

## Project Structure
\`\`\`
├── assets/           # CSS, JS, images, fonts
├── config/           # settings_schema.json, settings_data.json
├── layout/           # theme.liquid, password.liquid
├── locales/          # Translation files (en.default.json)
├── sections/         # Reusable page sections with schema
├── snippets/         # Reusable Liquid partials
├── templates/        # JSON templates (index, product, collection, etc.)
├── CLAUDE.md         # This file — project instructions for Claude
├── .mcp.json         # MCP server configs
└── .claude/          # Claude Code settings, rules, and skills
\`\`\`

## Development Commands
- **Start dev server:** \`shopify theme dev --store=${storeName}\`
- **Push theme:** \`shopify theme push --store=${storeName}\`
- **Pull latest:** \`shopify theme pull --store=${storeName}\`
- **Check theme:** \`shopify theme check\`
- **Preview:** Dev server runs at \`http://127.0.0.1:9292\`

## Code Conventions
- **Liquid:** 2-space indentation, lowercase variable names with underscores
- **CSS:** BEM naming, mobile-first, use CSS custom properties for theme settings
- **JavaScript:** ES modules, no jQuery unless required by Shopify, vanilla JS preferred
- **Sections:** Every section MUST have a valid \`{% schema %}\` block with \`name\`, \`settings\`, and \`presets\`
- **Assets:** Prefix custom files with \`custom-\` to distinguish from theme defaults

## Section Schema Rules
- All sections must include a \`name\` field (max 25 chars)
- Use \`blocks\` for repeatable content within sections
- Provide sensible \`default\` values for all settings
- Include \`limit\` on blocks when appropriate
- Add \`info\` text to complex settings for merchant guidance

## Liquid Best Practices
- Use \`{{ 'filename.css' | asset_url | stylesheet_tag }}\` for stylesheets
- Use \`{% render 'snippet-name' %}\` instead of \`{% include %}\`
- Access metafields via \`{{ product.metafields.namespace.key }}\`
- Use \`| json\` filter when passing data to JavaScript
- Wrap performance-critical blocks in \`{% cache %}\` where supported
- Always use \`| escape\` on user-generated content to prevent XSS

## Image Handling
- Use \`{{ image | image_url: width: 800 }}\` (not \`img_url\`)
- Always include \`loading="lazy"\` on below-fold images
- Provide \`width\` and \`height\` attributes for CLS prevention
- Use \`srcset\` for responsive images: 200, 400, 600, 800, 1200 widths

## SEO Requirements
- Every page template must have unique \`<title>\` and \`<meta name="description">\`
- Product pages: structured data (JSON-LD) for Product schema
- Collection pages: breadcrumb structured data
- Use semantic HTML5 (\`<main>\`, \`<article>\`, \`<nav>\`, \`<section>\`)
- All images must have descriptive \`alt\` text

## Accessibility (WCAG 2.1 AA)
- Color contrast ratio minimum 4.5:1 for text
- All interactive elements keyboard-accessible
- Form inputs must have associated \`<label>\` elements
- Skip-to-content link in layout
- ARIA labels on icon-only buttons

## Testing Before Push
1. Run \`shopify theme check\` — fix all errors, review warnings
2. Test on mobile viewport (375px)
3. Verify all sections render in Theme Customizer
4. Check Lighthouse score (target: 90+ performance)
5. Validate structured data at Google Rich Results Test

## Shopify API Reference
- Liquid objects: product, collection, cart, customer, shop, page
- Global objects: settings, request, routes, content_for_header
- Theme settings defined in \`config/settings_schema.json\`
- Section settings defined in each section's \`{% schema %}\` block
- Admin API version: 2024-10

## Git Workflow
- Branch naming: \`feature/section-name\` or \`fix/bug-description\`
- Commit format: \`type(scope): description\` (e.g., \`feat(product): add size chart section\`)
- Always pull latest theme before pushing: \`shopify theme pull\`
`;
}

function getWooCommerceClaudeMd(storeName: string): string {
  return `# ${storeName} — WooCommerce Theme

## Overview
This is a WordPress/WooCommerce theme for **${storeName}**. It follows WordPress theme standards with WooCommerce template overrides for shop functionality.

## Project Structure
\`\`\`
├── assets/
│   ├── css/          # Compiled CSS
│   ├── js/           # JavaScript files
│   ├── images/       # Theme images
│   └── fonts/        # Custom fonts
├── inc/              # PHP includes (customizer, hooks, helpers)
├── template-parts/   # Reusable template partials
├── woocommerce/      # WooCommerce template overrides
│   ├── archive-product.php
│   ├── single-product/
│   ├── cart/
│   ├── checkout/
│   └── myaccount/
├── style.css         # Theme header + base styles
├── functions.php     # Theme setup, enqueues, hooks
├── header.php        # Site header
├── footer.php        # Site footer
├── index.php         # Default template
├── page.php          # Page template
├── single.php        # Single post template
├── CLAUDE.md         # This file
├── .mcp.json         # MCP server configs
└── .claude/          # Claude Code settings, rules, and skills
\`\`\`

## Development Commands
- **Start dev server:** \`npm run dev\` (watches SCSS/JS, BrowserSync)
- **Build production:** \`npm run build\`
- **Lint PHP:** \`composer run phpcs\`
- **Lint JS:** \`npm run lint\`
- **Start WordPress:** \`wp server\` or use Local/DDEV/Docker
- **WP CLI:** \`wp theme activate ${storeName.split(".")[0]}\`

## Code Conventions
- **PHP:** WordPress Coding Standards (WPCS), 1 tab indentation
- **CSS/SCSS:** BEM naming, mobile-first, custom properties for theme settings
- **JavaScript:** ES modules, vanilla JS preferred, jQuery only via \`wp_enqueue_script\`
- **Naming:** Prefix all functions, hooks, and classes with theme slug: \`${storeName.split(".")[0].replace(/[^a-z0-9]/g, "_")}_\`

## WordPress & WooCommerce Standards
- Escape all output: \`esc_html()\`, \`esc_attr()\`, \`esc_url()\`, \`wp_kses_post()\`
- Sanitize all input: \`sanitize_text_field()\`, \`absint()\`, \`wp_kses()\`
- Use \`wp_enqueue_script/style()\` — never hardcode \`<script>\` or \`<link>\`
- Translation-ready: wrap all strings in \`__()\`, \`_e()\`, \`esc_html__()\`
- Use hooks (\`add_action\`, \`add_filter\`) — never modify core/plugin files

## WooCommerce Template Overrides
- Copy templates from \`wp-content/plugins/woocommerce/templates/\`
- Place in \`woocommerce/\` directory maintaining folder structure
- Check \`@version\` docblock — keep overrides updated with WC releases
- Test with WooCommerce update compatibility tool
- Override only what you need — don't copy entire template if changing one line

## Theme Customizer
- Register settings in \`inc/customizer.php\`
- Use \`sanitize_callback\` on every setting
- Group related controls in panels and sections
- Provide \`transport => 'postMessage'\` with selective refresh for live preview

## Image Handling
- Use \`wp_get_attachment_image()\` with responsive srcset (auto-generated)
- Add custom image sizes via \`add_image_size()\` in functions.php
- Always include \`loading="lazy"\` on below-fold images
- Use WebP with fallback via \`<picture>\` element

## SEO Requirements
- Semantic HTML5 structure
- Product pages: JSON-LD Product schema (WooCommerce provides base, extend in theme)
- Breadcrumbs via \`woocommerce_breadcrumb()\`
- Proper heading hierarchy (single H1 per page)
- \`<title>\` managed by WordPress — don't hardcode

## Accessibility (WCAG 2.1 AA)
- Color contrast 4.5:1 minimum for text
- Keyboard navigation for all interactive elements
- \`<label>\` elements for all form inputs
- Skip-to-content link
- ARIA attributes on dynamic content

## Testing Before Push
1. Run \`composer run phpcs\` — fix all errors
2. Run \`npm run lint\` — fix JS issues
3. Test with WordPress Theme Check plugin
4. Test WooCommerce flows: browse → cart → checkout → order confirmation
5. Test on mobile viewport (375px)
6. Verify Customizer controls work
7. Check Lighthouse score (target: 90+ performance)

## Database & WP CLI
- Export: \`wp db export backup.sql\`
- Search-replace for staging: \`wp search-replace 'oldurl.com' 'newurl.com'\`
- Flush rewrite rules: \`wp rewrite flush\`
- Clear transients: \`wp transient delete --all\`

## Git Workflow
- Branch naming: \`feature/component-name\` or \`fix/bug-description\`
- Commit format: \`type(scope): description\`
- Never commit \`node_modules/\`, \`.env\`, or database dumps
`;
}

// ─── Settings Templates ───

function getShopifySettings() {
  return {
    permissions: {
      allow: [
        "Bash(shopify theme *)",
        "Bash(npm run *)",
        "Bash(npx shopify *)",
        "Bash(git add *)",
        "Bash(git commit *)",
        "Bash(git push *)",
        "Bash(git pull *)",
        "Bash(git checkout *)",
        "Bash(git branch *)",
        "Bash(git log *)",
        "Bash(git diff *)",
        "Bash(git status)",
        "Bash(node *)",
        "Bash(curl *shopify*)",
        "Bash(ls *)",
        "Bash(cat *)",
        "Bash(mkdir *)",
        "Read(**)",
        "Edit(sections/**)",
        "Edit(snippets/**)",
        "Edit(templates/**)",
        "Edit(layout/**)",
        "Edit(assets/**)",
        "Edit(config/**)",
        "Edit(locales/**)",
        "mcp__shopify__*",
        "mcp__filesystem__*",
        "mcp__puppeteer__*",
      ],
      deny: [
        "Bash(rm -rf *)",
        "Bash(sudo *)",
        "Edit(.git/**)",
        "Edit(.env*)",
      ],
    },
    env: {
      SHOPIFY_CLI_THEME_TOKEN: "${SHOPIFY_CLI_THEME_TOKEN}",
      SHOPIFY_FLAG_STORE: "${SHOPIFY_FLAG_STORE}",
    },
  };
}

function getWooCommerceSettings() {
  return {
    permissions: {
      allow: [
        "Bash(npm run *)",
        "Bash(npx *)",
        "Bash(composer *)",
        "Bash(wp *)",
        "Bash(php *)",
        "Bash(git add *)",
        "Bash(git commit *)",
        "Bash(git push *)",
        "Bash(git pull *)",
        "Bash(git checkout *)",
        "Bash(git branch *)",
        "Bash(git log *)",
        "Bash(git diff *)",
        "Bash(git status)",
        "Bash(node *)",
        "Bash(ls *)",
        "Bash(cat *)",
        "Bash(mkdir *)",
        "Read(**)",
        "Edit(*.php)",
        "Edit(woocommerce/**)",
        "Edit(template-parts/**)",
        "Edit(inc/**)",
        "Edit(assets/**)",
        "Edit(style.css)",
        "Edit(functions.php)",
        "mcp__filesystem__*",
        "mcp__mysql__*",
        "mcp__puppeteer__*",
      ],
      deny: [
        "Bash(rm -rf *)",
        "Bash(sudo *)",
        "Edit(.git/**)",
        "Edit(.env*)",
        "Edit(wp-config.php)",
      ],
    },
    env: {
      WP_ENV: "development",
      WP_HOME: "${WP_HOME:-http://localhost:8080}",
    },
  };
}

// ─── MCP Server Configs ───

function getShopifyMCP(storeName: string) {
  return {
    mcpServers: {
      filesystem: {
        type: "stdio",
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-filesystem", "."],
        description: "File system access for theme files",
      },
      puppeteer: {
        type: "stdio",
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-puppeteer"],
        description: "Browser automation for visual testing and screenshots",
      },
      fetch: {
        type: "stdio",
        command: "npx",
        args: ["-y", "@anthropic/mcp-server-fetch"],
        description: "HTTP requests for Shopify API calls and documentation",
      },
      shopify: {
        type: "stdio",
        command: "npx",
        args: ["-y", "@anthropic/mcp-server-fetch"],
        env: {
          SHOPIFY_STORE: storeName,
          SHOPIFY_ACCESS_TOKEN: "${SHOPIFY_ACCESS_TOKEN}",
        },
        description: "Shopify Admin API access for product data, metafields, and store configuration",
      },
      sequential_thinking: {
        type: "stdio",
        command: "npx",
        args: ["-y", "@anthropic/mcp-server-sequential-thinking"],
        description: "Step-by-step reasoning for complex theme architecture decisions",
      },
      memory: {
        type: "stdio",
        command: "npx",
        args: ["-y", "@anthropic/mcp-server-memory"],
        description: "Persistent memory for theme context, decisions, and learnings across sessions",
      },
    },
  };
}

function getWooCommerceMCP(storeName: string) {
  return {
    mcpServers: {
      filesystem: {
        type: "stdio",
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-filesystem", "."],
        description: "File system access for theme files",
      },
      puppeteer: {
        type: "stdio",
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-puppeteer"],
        description: "Browser automation for visual testing and screenshots",
      },
      fetch: {
        type: "stdio",
        command: "npx",
        args: ["-y", "@anthropic/mcp-server-fetch"],
        description: "HTTP requests for WooCommerce REST API and documentation",
      },
      mysql: {
        type: "stdio",
        command: "npx",
        args: ["-y", "@anthropic/mcp-server-mysql"],
        env: {
          MYSQL_HOST: "${MYSQL_HOST:-localhost}",
          MYSQL_USER: "${MYSQL_USER:-root}",
          MYSQL_PASSWORD: "${MYSQL_PASSWORD}",
          MYSQL_DATABASE: "${MYSQL_DATABASE:-wordpress}",
        },
        description: "WordPress database access for queries, debugging, and data inspection",
      },
      woocommerce_api: {
        type: "stdio",
        command: "npx",
        args: ["-y", "@anthropic/mcp-server-fetch"],
        env: {
          WC_STORE_URL: storeName,
          WC_CONSUMER_KEY: "${WC_CONSUMER_KEY}",
          WC_CONSUMER_SECRET: "${WC_CONSUMER_SECRET}",
        },
        description: "WooCommerce REST API for product, order, and customer data",
      },
      sequential_thinking: {
        type: "stdio",
        command: "npx",
        args: ["-y", "@anthropic/mcp-server-sequential-thinking"],
        description: "Step-by-step reasoning for complex theme architecture decisions",
      },
      memory: {
        type: "stdio",
        command: "npx",
        args: ["-y", "@anthropic/mcp-server-memory"],
        description: "Persistent memory for theme context, decisions, and learnings across sessions",
      },
    },
  };
}

// ─── Rules Templates ───

function getShopifyRules(): string {
  return `---
paths:
  - "**/*.liquid"
  - "sections/**"
  - "snippets/**"
---

# Shopify Liquid Theme Standards

## Template Language
- Use Liquid tags with proper spacing: \`{% if condition %}\` not \`{%if condition%}\`
- Use 2-space indentation inside Liquid blocks
- Prefer \`{% render %}\` over \`{% include %}\` (deprecated)
- Use \`{% comment %}\` blocks for documentation, not HTML comments (prevents leaking to source)

## Section Architecture
- One section per file in \`sections/\`
- Every section MUST have a \`{% schema %}\` block
- Schema must include: \`name\`, \`settings\` array, \`presets\` (for sections available in customizer)
- Use \`blocks\` for repeatable nested content
- Limit block types to 8 or fewer per section

## Settings Types Reference
- \`text\` — single line input
- \`textarea\` — multi-line input
- \`richtext\` — rich text editor
- \`image_picker\` — media library image
- \`url\` — URL with link picker
- \`select\` / \`radio\` — option selectors
- \`checkbox\` — boolean toggle
- \`range\` — numeric slider
- \`color\` / \`color_background\` — color pickers
- \`font_picker\` — typography selector
- \`collection\` / \`product\` / \`blog\` / \`page\` — resource pickers

## Naming Conventions
- Section files: \`kebab-case.liquid\` (e.g., \`featured-collection.liquid\`)
- Snippet files: \`kebab-case.liquid\` (e.g., \`product-card.liquid\`)
- CSS classes: BEM (\`block__element--modifier\`)
- JS files: \`kebab-case.js\`
- Setting IDs: \`snake_case\` (e.g., \`heading_text\`, \`show_vendor\`)

## Asset Pipeline
- CSS: Use \`{{ 'file.css' | asset_url | stylesheet_tag }}\`
- JS: Use \`{{ 'file.js' | asset_url | script_tag }}\` with \`defer\`
- Images: Use \`{{ 'file.png' | asset_url }}\` for static, \`{{ image | image_url }}\` for dynamic
- Never inline large CSS/JS — use asset files

## Security
- Always escape output: \`{{ variable | escape }}\`
- Use \`| json\` when embedding data in \`<script>\` tags
- Never output raw customer data without escaping
- Validate all form inputs server-side (Shopify handles this)
`;
}

function getWooCommerceRules(): string {
  return `---
paths:
  - "**/*.php"
  - "woocommerce/**"
  - "inc/**"
---

# WooCommerce/WordPress PHP Theme Standards

## PHP Coding Standards
- Follow WordPress Coding Standards (WPCS)
- Use tabs for indentation (1 tab = 4 spaces visual)
- Opening braces on same line: \`function name() {\`
- Space inside parentheses: \`if ( $condition ) {\`
- Yoda conditions: \`if ( true === $value ) {\`

## Security (CRITICAL)
- **Escape ALL output:**
  - \`esc_html( $text )\` — plain text
  - \`esc_attr( $attribute )\` — HTML attributes
  - \`esc_url( $url )\` — URLs
  - \`wp_kses_post( $html )\` — trusted HTML with allowed tags
  - \`esc_html__( 'text', 'textdomain' )\` — translated + escaped
- **Sanitize ALL input:**
  - \`sanitize_text_field( $_POST['field'] )\`
  - \`absint( $number )\`
  - \`wp_verify_nonce()\` for form submissions
- **NEVER use \`echo $variable\` without escaping**
- Use prepared statements for direct DB queries: \`$wpdb->prepare()\`

## Naming Conventions
- Theme prefix for all functions: \`mytheme_function_name()\`
- Hook names: \`mytheme_after_header\`, \`mytheme_product_card\`
- Class names: \`class MyTheme_Feature_Name {}\`
- Template files: \`kebab-case.php\`
- Partial files: \`content-type.php\` in \`template-parts/\`

## WooCommerce Overrides
- ONLY copy templates you need to modify
- Check \`@version\` tag — update when WC updates
- Use hooks before overriding templates:
  - \`woocommerce_before_shop_loop\`
  - \`woocommerce_after_shop_loop_item\`
  - \`woocommerce_single_product_summary\`
- Test with \`WC_TEMPLATE_DEBUG_MODE\` to catch stale overrides

## Enqueueing Assets
\`\`\`php
function mytheme_enqueue_assets() {
    wp_enqueue_style( 'mytheme-style', get_stylesheet_uri(), array(), '1.0.0' );
    wp_enqueue_script( 'mytheme-main', get_template_directory_uri() . '/assets/js/main.js', array(), '1.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'mytheme_enqueue_assets' );
\`\`\`

## Template Hierarchy
- \`front-page.php\` → static front page
- \`archive-product.php\` → shop/collection page
- \`single-product.php\` → product detail page
- \`taxonomy-product_cat.php\` → product category
- \`woocommerce.php\` → catches all WC pages (avoid, use specific templates)
`;
}

function getPerformanceRules(platform: "shopify" | "woocommerce"): string {
  const platformSpecific = platform === "shopify"
    ? `
## Shopify-Specific Performance
- Use \`{% cache %}\` on expensive Liquid blocks when available
- Defer non-critical JavaScript with \`| script_tag\` + defer attribute
- Use Shopify's native lazy loading: \`loading="lazy"\`
- Minimize Liquid loops — max 50 iterations per loop
- Avoid nested \`for\` loops in templates (O(n²) rendering)
- Use \`{% render %}\` with params instead of relying on global variables
- Limit use of \`| json\` on large objects — filter attributes first`
    : `
## WordPress-Specific Performance
- Use transients for expensive queries: \`set_transient()\` / \`get_transient()\`
- Implement object caching with Redis or Memcached
- Use \`wp_enqueue_script()\` with \`in_footer: true\`
- Minimize database queries per page (target < 50)
- Use \`WP_Query\` with specific \`fields\` parameter
- Avoid \`query_posts()\` — use \`WP_Query\` or \`get_posts()\`
- Implement lazy loading for below-fold WooCommerce product images`;

  return `---
paths:
  - "**/*"
---

# Performance Guidelines

## Core Web Vitals Targets
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **Lighthouse Performance**: 90+

## Image Optimization
- Always specify \`width\` and \`height\` attributes (prevents CLS)
- Use responsive images with \`srcset\` and \`sizes\`
- Serve WebP format with fallback
- Lazy load below-fold images: \`loading="lazy"\`
- Eager load hero/LCP image: \`loading="eager"\` + \`fetchpriority="high"\`
- Maximum image dimensions: 2048px wide for full-width, 800px for product cards

## CSS Performance
- Critical CSS inlined in \`<head>\` for above-fold content
- Non-critical CSS loaded asynchronously
- Minimize CSS specificity — avoid \`!important\`
- Remove unused CSS — target < 50KB total CSS
- Use \`will-change\` sparingly and only right before animations

## JavaScript Performance
- Defer all non-critical JS
- Avoid render-blocking scripts in \`<head>\`
- Bundle and minify for production
- Target < 100KB total JS (gzipped)
- Use \`IntersectionObserver\` for scroll-triggered animations
- Avoid \`document.write()\` — breaks streaming parser

## Font Loading
- Use \`font-display: swap\` to prevent invisible text
- Preload critical fonts: \`<link rel="preload" as="font">\`
- Limit to 2-3 font families maximum
- Use variable fonts when available (single file, multiple weights)
- Subset fonts to needed characters only
${platformSpecific}

## Third-Party Scripts
- Audit all third-party scripts quarterly
- Load analytics/tracking asynchronously
- Use \`requestIdleCallback\` for non-essential third-party init
- Set up Content Security Policy headers
- Consider facade pattern for heavy embeds (YouTube, maps)
`;
}

function getSEOAccessibilityRules(platform: "shopify" | "woocommerce"): string {
  return `---
paths:
  - "**/*"
---

# SEO & Accessibility Standards

## SEO Essentials
- Single \`<h1>\` per page — matches page intent
- Logical heading hierarchy: h1 → h2 → h3 (no skipping)
- Unique \`<title>\` and \`<meta name="description">\` per page
- Canonical URLs to prevent duplicate content
- XML sitemap (${platform === "shopify" ? "auto-generated by Shopify" : "use Yoast or similar plugin"})
- Robots.txt properly configured

## Structured Data (JSON-LD)
- **Product pages:** Product schema with name, image, price, availability, reviews
- **Collection pages:** ItemList or CollectionPage schema
- **Organization:** Organization schema in layout/header
- **Breadcrumbs:** BreadcrumbList schema on all pages
- **FAQ pages:** FAQPage schema when applicable
- Validate with Google Rich Results Test

## Accessibility (WCAG 2.1 AA)

### Perceivable
- All images have descriptive \`alt\` text (not "image" or filename)
- Decorative images use \`alt=""\` with \`role="presentation"\`
- Color is not the only way to convey information
- Text contrast ratio: 4.5:1 for normal text, 3:1 for large text
- Video content has captions/transcripts

### Operable
- All functionality available via keyboard
- Visible focus indicators on interactive elements
- Skip-to-content link as first focusable element
- No keyboard traps — users can tab away from any element
- Modals trap focus within and restore on close
- Touch targets minimum 44x44px on mobile

### Understandable
- Page language declared: \`<html lang="en">\`
- Form inputs have visible \`<label>\` elements
- Error messages are specific and helpful
- Consistent navigation across pages
- No unexpected context changes on input

### Robust
- Valid HTML — run through W3C validator
- ARIA attributes used correctly (\`aria-label\`, \`aria-expanded\`, \`aria-hidden\`)
- Dynamic content updates announced via \`aria-live\` regions
- Custom components follow WAI-ARIA design patterns
`;
}

// ─── Skill Files ───

function getSkillFiles(platform: "shopify" | "woocommerce", storeName: string): ClaudeFileTemplate[] {
  const skills: ClaudeFileTemplate[] = [
    {
      path: ".claude/skills/dev.md",
      description: "Start development server",
      content: platform === "shopify"
        ? `---
name: dev
description: Start Shopify theme dev server
---

Start the Shopify theme development server:

\`\`\`bash
shopify theme dev --store=${storeName}
\`\`\`

After starting, open http://127.0.0.1:9292 to preview the theme. The server watches for file changes and hot-reloads.
`
        : `---
name: dev
description: Start WooCommerce dev server
---

Start the development environment:

\`\`\`bash
npm run dev
\`\`\`

This starts the SCSS/JS watcher and BrowserSync for live reload. Make sure WordPress/WooCommerce is running locally first.
`,
    },
    {
      path: ".claude/skills/lint.md",
      description: "Run theme linting and checks",
      content: platform === "shopify"
        ? `---
name: lint
description: Run Shopify theme check
---

Run the full theme linting suite:

\`\`\`bash
shopify theme check
\`\`\`

Review all errors and warnings. Fix all errors before committing. Warnings should be reviewed and fixed if reasonable.
`
        : `---
name: lint
description: Run PHP and JS linting
---

Run the full linting suite:

\`\`\`bash
composer run phpcs
npm run lint
\`\`\`

Fix all errors before committing. Run \`composer run phpcbf\` to auto-fix PHP style issues.
`,
    },
    {
      path: ".claude/skills/deploy.md",
      description: "Deploy theme to store",
      content: platform === "shopify"
        ? `---
name: deploy
description: Push theme to Shopify store
---

Deploy the theme to the store. First, run checks:

\`\`\`bash
shopify theme check
\`\`\`

If checks pass, push the theme:

\`\`\`bash
shopify theme push --store=${storeName}
\`\`\`

For pushing to a specific theme (not the live theme):
\`\`\`bash
shopify theme push --store=${storeName} --unpublished
\`\`\`
`
        : `---
name: deploy
description: Build and deploy WooCommerce theme
---

Build production assets:

\`\`\`bash
npm run build
\`\`\`

Then deploy via your preferred method (FTP, Git-based deployment, or wp-cli):

\`\`\`bash
# If using rsync:
rsync -avz --exclude='.git' --exclude='node_modules' ./ user@server:/path/to/wp-content/themes/your-theme/
\`\`\`
`,
    },
    {
      path: ".claude/skills/new-section.md",
      description: "Create a new theme section/component",
      content: platform === "shopify"
        ? `---
name: new-section
description: Scaffold a new Shopify section
---

Create a new Shopify theme section. Ask the user what the section should do, then:

1. Create the section file in \`sections/[name].liquid\`
2. Include a valid \`{% schema %}\` with:
   - \`name\` (max 25 chars)
   - Relevant \`settings\` array
   - \`blocks\` if repeatable content is needed
   - \`presets\` with default values
3. Add supporting CSS in \`assets/section-[name].css\`
4. Add supporting JS in \`assets/section-[name].js\` if interactive
5. Create any needed snippets in \`snippets/\`

Follow the coding standards in CLAUDE.md. Ensure the section is responsive and accessible.
`
        : `---
name: new-section
description: Create a new WooCommerce template part
---

Create a new theme component/template part. Ask the user what it should do, then:

1. Create the template part in \`template-parts/[name].php\`
2. Create a supporting function in \`inc/[name].php\`
3. Register the include in \`functions.php\`
4. Add CSS in \`assets/css/components/[name].css\`
5. Add JS in \`assets/js/components/[name].js\` if interactive
6. Hook it into the appropriate action (e.g., \`woocommerce_after_shop_loop_item\`)

Follow WordPress coding standards. Escape all output. Make it translation-ready.
`,
    },
    {
      path: ".claude/skills/performance-audit.md",
      description: "Run a performance audit on the theme",
      content: `---
name: performance-audit
description: Audit theme performance
---

Run a comprehensive performance audit:

1. **Analyze assets:**
   - Count and measure all CSS/JS files
   - Identify unused CSS
   - Check image sizes and formats
   - Review font loading strategy

2. **Check for common issues:**
   - Render-blocking resources
   - Large DOM size
   - Excessive HTTP requests
   - Missing lazy loading
   - Unoptimized images

3. **Run Lighthouse via Puppeteer** (if available):
   Use the puppeteer MCP to load the dev preview and capture performance metrics.

4. **Report findings** with:
   - Current scores/metrics
   - Specific issues found
   - Prioritized fix recommendations
   - Expected impact of each fix
`,
    },
    {
      path: ".claude/skills/seo-audit.md",
      description: "Audit SEO and structured data",
      content: `---
name: seo-audit
description: Audit theme SEO and structured data
---

Run a comprehensive SEO audit of the theme:

1. **Check every template for:**
   - Proper \`<title>\` tag
   - Meta description
   - Canonical URL
   - Open Graph tags (og:title, og:description, og:image)
   - Single H1 per page
   - Logical heading hierarchy

2. **Structured Data:**
   - Product schema on product pages
   - BreadcrumbList schema
   - Organization schema
   - Review/Rating schema

3. **Technical SEO:**
   - Check robots.txt
   - Verify sitemap
   - Check for noindex tags
   - Internal linking structure
   - Image alt text coverage

4. **Report** with specific file locations and fix recommendations.
`,
    },
  ];

  return skills;
}

// ─── Summary for display ───

export function getClaudeFileSummary(platform: "shopify" | "woocommerce"): { path: string; description: string }[] {
  return [
    { path: "CLAUDE.md", description: "Project context, commands, conventions, and guidelines" },
    { path: ".claude/settings.json", description: "Permissions, environment variables, and tool access control" },
    { path: ".mcp.json", description: `MCP servers: filesystem, puppeteer, fetch, ${platform === "shopify" ? "Shopify API" : "MySQL, WooCommerce API"}, memory` },
    { path: ".claude/rules/theme-standards.md", description: `${platform === "shopify" ? "Liquid" : "PHP/WordPress"} coding standards and naming conventions` },
    { path: ".claude/rules/performance.md", description: "Core Web Vitals targets, image/CSS/JS optimization guidelines" },
    { path: ".claude/rules/seo-accessibility.md", description: "SEO requirements, structured data, WCAG 2.1 AA compliance" },
    { path: ".claude/skills/dev.md", description: `/dev — Start ${platform === "shopify" ? "Shopify theme" : "WooCommerce"} dev server` },
    { path: ".claude/skills/lint.md", description: `/lint — Run ${platform === "shopify" ? "theme check" : "PHPCS + ESLint"}` },
    { path: ".claude/skills/deploy.md", description: `/deploy — Build and push theme to ${platform === "shopify" ? "store" : "server"}` },
    { path: ".claude/skills/new-section.md", description: `/new-section — Scaffold a new ${platform === "shopify" ? "section" : "template part"}` },
    { path: ".claude/skills/performance-audit.md", description: "/performance-audit — Full performance analysis" },
    { path: ".claude/skills/seo-audit.md", description: "/seo-audit — SEO and structured data audit" },
  ];
}
