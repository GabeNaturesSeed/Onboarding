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
      path: ".claude/rules/lean-theme.md",
      description: "Lean theme philosophy — strip to essentials for speed and conversion",
      content: getLeanThemeRules(platform),
    },
    {
      path: ".claude/rules/seo-accessibility.md",
      description: "SEO and accessibility requirements",
      content: getSEOAccessibilityRules(platform),
    },
    {
      path: "HANDOFF.md",
      description: "Client handoff documentation — what was set up, how to use it, what to do next",
      content: getHandoffDoc(platform, storeName),
    },
    {
      path: "KICKSTART.md",
      description: "First prompt — paste this into Claude Code to begin your journey",
      content: getKickstartPrompt(platform, storeName),
    },
    ...getSkillFiles(platform, storeName),
  ];
}

// ─── CLAUDE.md Templates ───

function getShopifyClaudeMd(storeName: string): string {
  return `# ${storeName} — Shopify Theme

## Philosophy: Lean, Fast, Conversion-First
This theme follows a **lean code philosophy**. Every line of code must earn its place. The goal is NOT to add features — it's to strip the theme down to only what's needed for the site to function beautifully, load fast, and convert visitors into customers.

**Before writing ANY code, ask:**
1. Does this directly help the customer buy?
2. Can this be done with less code?
3. Will this slow down page load?
4. Is this code already handled by the platform natively?

If the answer to #1 is no, don't write it. If #3 is yes, find a lighter way.

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

## Theme Stripping Checklist
When working on this theme, actively look for and remove:
- [ ] Unused CSS classes and stylesheets
- [ ] JavaScript that powers features not used on this store
- [ ] Sections that are registered but never placed on any page
- [ ] Snippets that are never rendered
- [ ] Third-party scripts with no measurable ROI
- [ ] Fonts not used in the design (check font-family declarations vs. actual usage)
- [ ] Liquid code that computes values never displayed
- [ ] Comments and dead code from the original theme
- [ ] Duplicate logic (same thing computed in multiple places)

## Conversion Rate Optimization (CRO) Principles
- **Above the fold:** Product image, price, add-to-cart — nothing else competes
- **Social proof:** Reviews/ratings visible without scrolling on product pages
- **Trust signals:** Shipping info, return policy, payment badges near buy button
- **Urgency (honest):** Stock levels if genuinely low, not fake countdown timers
- **Mobile-first:** 70%+ of e-commerce traffic is mobile — design for thumb zones
- **Checkout friction:** Minimize steps, auto-fill where possible, guest checkout default
- **Page speed IS conversion:** Every 100ms of load time costs ~1% conversion

## Self-Evolving System
This Claude Code environment learns and improves:
- After each session, use \`/memory\` to save what worked and what didn't
- Run \`/performance-audit\` regularly — the scores should only go up
- When you discover a pattern that works, add it to this CLAUDE.md
- When you find dead code, remove it immediately — don't comment it out
- Track your Lighthouse scores in \`docs/performance-log.md\`

## Git Workflow
- Branch naming: \`feature/section-name\` or \`fix/bug-description\`
- Commit format: \`type(scope): description\` (e.g., \`feat(product): add size chart section\`)
- Always pull latest theme before pushing: \`shopify theme pull\`
`;
}

function getWooCommerceClaudeMd(storeName: string): string {
  return `# ${storeName} — WooCommerce Theme

## Philosophy: Lean, Fast, Conversion-First
This theme follows a **lean code philosophy**. Every line of code must earn its place. The goal is NOT to add features — it's to strip the theme down to only what's needed for the site to function beautifully, load fast, and convert visitors into customers.

**Before writing ANY code, ask:**
1. Does this directly help the customer buy?
2. Can this be done with less code?
3. Will this slow down page load?
4. Is this code already handled by the platform or a plugin natively?

If the answer to #1 is no, don't write it. If #3 is yes, find a lighter way.

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

## Theme Stripping Checklist
When working on this theme, actively look for and remove:
- [ ] Unused CSS classes and stylesheets (check with coverage tools)
- [ ] JavaScript from plugins/features not active on this store
- [ ] Template overrides that don't actually change anything from WooCommerce defaults
- [ ] Plugin CSS/JS that can be dequeued on pages where it's not needed
- [ ] Fonts not used in the design
- [ ] Dead code from the parent/starter theme
- [ ] Unused template parts and includes
- [ ] Third-party scripts with no measurable ROI
- [ ] Duplicate enqueued libraries (e.g., multiple jQuery versions)

## Conversion Rate Optimization (CRO) Principles
- **Above the fold:** Product image, price, add-to-cart — nothing else competes
- **Social proof:** Reviews/ratings visible without scrolling on product pages
- **Trust signals:** Shipping info, return policy, payment badges near buy button
- **Urgency (honest):** Stock levels if genuinely low, not fake countdown timers
- **Mobile-first:** 70%+ of e-commerce traffic is mobile — design for thumb zones
- **Checkout friction:** Minimize steps, auto-fill where possible, guest checkout default
- **Page speed IS conversion:** Every 100ms of load time costs ~1% conversion

## Self-Evolving System
This Claude Code environment learns and improves:
- After each session, use \`/memory\` to save what worked and what didn't
- Run \`/performance-audit\` regularly — the scores should only go up
- When you discover a pattern that works, add it to this CLAUDE.md
- When you find dead code, remove it immediately — don't comment it out
- Track your Lighthouse scores in \`docs/performance-log.md\`

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

// ─── Lean Theme Rules ───

function getLeanThemeRules(platform: "shopify" | "woocommerce"): string {
  const platformStripping = platform === "shopify"
    ? `
## Shopify-Specific Stripping

### What to Remove
- **App embed scripts** from apps you've uninstalled (check \`layout/theme.liquid\` for orphaned scripts)
- **Unused section types** — if you only use 8 sections, remove the other 20+
- **Snippet bloat** — starter themes ship with 40+ snippets, most stores use <15
- **Icon libraries** — replace full icon fonts/SVG sprites with only the icons actually used
- **Liquid computed but never shown** — search for \`{% assign %}\` variables that are never output
- **Dawn/default theme CSS** for features you don't use (predictive search, quick add, etc.)

### Audit Commands
\`\`\`bash
# Find unused snippets (referenced nowhere)
grep -rL --include="*.liquid" "render\\|include" snippets/ | while read f; do
  basename=$(basename "$f" .liquid)
  if ! grep -rq "$basename" sections/ templates/ layout/ snippets/ 2>/dev/null; then
    echo "UNUSED: $f"
  fi
done

# Find sections not in any JSON template
for f in sections/*.liquid; do
  basename=$(basename "$f" .liquid)
  if ! grep -rq "$basename" templates/ 2>/dev/null; then
    echo "POTENTIALLY UNUSED: $f"
  fi
done

# Check total asset sizes
ls -lhS assets/ | head -20
\`\`\`

### Performance Budgets
| Asset Type | Budget | Typical Theme | Target |
|-----------|--------|---------------|--------|
| Total CSS | < 50KB gzipped | 150-300KB | 30-45KB |
| Total JS | < 80KB gzipped | 200-500KB | 50-75KB |
| Fonts | < 100KB | 200-400KB | 60-80KB |
| Hero image | < 200KB | 500KB+ | 100-150KB |
| LCP | < 2.0s | 3-5s | 1.5-2.0s |`
    : `
## WordPress-Specific Stripping

### What to Remove
- **Plugin CSS/JS on pages that don't need them** — dequeue with conditional logic:
  \`\`\`php
  function mytheme_dequeue_unnecessary() {
      if ( ! is_product() ) {
          wp_dequeue_style( 'wc-gallery-style' );
          wp_dequeue_script( 'zoom' );
          wp_dequeue_script( 'flexslider' );
      }
      if ( ! is_checkout() ) {
          wp_dequeue_script( 'wc-checkout' );
      }
  }
  add_action( 'wp_enqueue_scripts', 'mytheme_dequeue_unnecessary', 100 );
  \`\`\`
- **Block editor styles** if not using Gutenberg on the frontend
- **Emoji script** (loaded by default, rarely needed):
  \`\`\`php
  remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
  remove_action( 'wp_print_styles', 'print_emoji_styles' );
  \`\`\`
- **jQuery Migrate** if no legacy plugins depend on it
- **Unused WooCommerce templates** — only override what you change
- **oEmbed discovery** if not embedding external content
- **REST API link tags** in header if not used by frontend

### Audit Queries
\`\`\`sql
-- Find posts with no featured image (may affect layout)
SELECT ID, post_title FROM wp_posts
WHERE post_type = 'product' AND ID NOT IN
(SELECT post_id FROM wp_postmeta WHERE meta_key = '_thumbnail_id');

-- Count active plugins (target < 15 for performance)
SELECT COUNT(*) FROM wp_options WHERE option_name = 'active_plugins';
\`\`\`

### Performance Budgets
| Asset Type | Budget | Typical Theme | Target |
|-----------|--------|---------------|--------|
| Total CSS | < 60KB gzipped | 200-400KB | 40-55KB |
| Total JS | < 100KB gzipped | 300-600KB | 60-90KB |
| Fonts | < 100KB | 200-400KB | 60-80KB |
| DB queries/page | < 40 | 80-200 | 25-35 |
| LCP | < 2.0s | 3-6s | 1.5-2.0s |`;

  return `---
paths:
  - "**/*"
---

# Lean Theme Philosophy

## Core Principle
**Every line of code is a liability.** Code costs performance, costs maintenance, and costs cognitive load. The best code is no code. The second best is the minimum code that solves the problem elegantly.

## The Stripping Process

### Phase 1: Audit (Before touching anything)
1. Run Lighthouse on every major page type (home, collection, product, cart, checkout)
2. Record baseline scores in \`docs/performance-log.md\`
3. Inventory ALL CSS files, JS files, and fonts — record sizes
4. List every third-party script and its purpose
5. Map every section/template to whether it's actually used on live pages

### Phase 2: Remove (The scary part — but most impactful)
1. Delete unused sections, templates, snippets, and template parts
2. Remove CSS for features not used on this store
3. Remove JS for features not used on this store
4. Replace icon fonts/SVG sprites with individual SVGs for icons actually used
5. Remove unused fonts and font weights
6. Remove third-party scripts that don't have measurable ROI

### Phase 3: Optimize (Make what's left faster)
1. Inline critical CSS for above-the-fold content
2. Defer all non-critical JS
3. Convert images to WebP with proper srcset
4. Implement proper lazy loading
5. Preload LCP image and critical fonts
6. Minimize Liquid/PHP computation in templates

### Phase 4: Measure (Prove it worked)
1. Re-run Lighthouse on all page types
2. Compare against baseline — scores should be significantly higher
3. Record new scores in \`docs/performance-log.md\`
4. Set up ongoing monitoring

## Rules for New Code
- **No new dependencies** without explicit justification and size analysis
- **No CSS frameworks** — write only the CSS you need
- **No JS libraries** for things achievable with vanilla JS
- **No "just in case" code** — if it's not needed today, don't write it
- **No copy-paste from StackOverflow** without understanding every line
- Every new feature must include a performance impact assessment
${platformStripping}

## The Conversion Lens
Before every change, evaluate through these lenses:
1. **Speed:** Does this make the page faster or slower?
2. **Clarity:** Does this make the buying decision easier?
3. **Trust:** Does this increase confidence in the purchase?
4. **Friction:** Does this remove or add steps to checkout?

If a change doesn't improve at least one of these, reconsider whether it's needed.
`;
}

// ─── Handoff Documentation ───

function getHandoffDoc(platform: "shopify" | "woocommerce", storeName: string): string {
  return `# Handoff Documentation — ${storeName}

## What Was Set Up For You

### 1. Claude Code Environment
Your project has a complete AI-powered development environment. When you open this folder with Claude Code, it automatically knows:
- Your store platform (${platform === "shopify" ? "Shopify" : "WooCommerce"})
- Your coding standards and conventions
- Your performance targets
- Your available tools and APIs

### 2. Files Installed
| File | What It Does |
|------|-------------|
| \`CLAUDE.md\` | Tells Claude Code everything about your project — conventions, commands, philosophy |
| \`.mcp.json\` | Connects Claude to your tools — file system, browser testing, APIs, memory |
| \`.claude/settings.json\` | Permissions — what Claude can and can't do automatically |
| \`.claude/rules/\` | Coding standards that Claude follows for every edit |
| \`.claude/skills/\` | Slash commands you can type to trigger common workflows |
| \`KICKSTART.md\` | Your first prompt — paste it into Claude Code to begin |

### 3. Available Slash Commands
| Command | What It Does |
|---------|-------------|
| \`/dev\` | Start your development server |
| \`/lint\` | Check code quality |
| \`/deploy\` | Push theme to your live store |
| \`/new-section\` | Create a new theme section with proper structure |
| \`/performance-audit\` | Full performance analysis with fix recommendations |
| \`/seo-audit\` | SEO and structured data check |
| \`/strip\` | Analyze theme for bloat and remove unused code |
| \`/cro-review\` | Review a page for conversion optimization opportunities |

### 4. Connected MCP Tools
| Tool | What You Can Do |
|------|----------------|
| **Filesystem** | Read, write, search any file in your project |
| **Puppeteer** | Take screenshots, test in browser, visual QA |
| **Fetch** | Hit your store's API, check URLs, fetch documentation |
| ${platform === "shopify" ? "**Shopify API** | Query products, collections, metafields, orders" : "**MySQL** | Query your WordPress database directly"} |
| **Memory** | Claude remembers context between sessions |
| **Sequential Thinking** | Complex multi-step reasoning for architecture decisions |

---

## How to Use This (Practical Guide)

### Getting Started (Day 1)
1. Open terminal in this project folder
2. Run \`claude\` to start Claude Code
3. Copy and paste the contents of \`KICKSTART.md\` as your first message
4. Claude will walk you through an initial audit of your theme

### Daily Workflow
1. Open Claude Code in your project
2. Tell it what you want to change in plain English
3. Review the changes it proposes
4. Test locally with \`/dev\`
5. When happy, deploy with \`/deploy\`

### Example Conversations
**"Make my product page load faster"**
→ Claude audits the page, identifies bloat, removes unused CSS/JS, optimizes images, and measures the improvement.

**"Add a size chart to product pages"**
→ Claude creates a lean section with minimal CSS, proper schema, and accessible markup.

**"Why is my bounce rate high on mobile?"**
→ Claude uses Puppeteer to screenshot your pages on mobile, identifies layout issues, and fixes them.

**"What are my top products by revenue?"**
→ Claude queries your ${platform === "shopify" ? "Shopify Admin API" : "WooCommerce database"} and gives you the data.

**"Strip everything unnecessary from this theme"**
→ Claude runs the full stripping process: audit → remove → optimize → measure.

### Weekly Habits
- Run \`/performance-audit\` every Monday — track your scores going up
- Run \`/seo-audit\` after any template changes
- Check \`docs/performance-log.md\` for trends
- Ask Claude "what should I improve next?" — it knows your codebase

---

## How This System Evolves

This isn't a static setup. It's designed to get smarter over time:

1. **Memory persists** — Claude remembers your preferences, patterns, and past decisions
2. **Rules are editable** — found a better convention? Edit \`.claude/rules/\` to enforce it
3. **Skills are extensible** — create new \`.claude/skills/your-workflow.md\` for custom commands
4. **CLAUDE.md grows** — as you learn what works for your store, add it to the project instructions

The goal is that within a month, your Claude Code environment knows your store better than any agency would after 6 months of working with you.

---

## Support & Resources
- Questions about Claude Code: https://docs.anthropic.com/en/docs/claude-code
- Questions about this setup: Review CLAUDE.md and the rules/ folder
- Need to add a new MCP server: Edit \`.mcp.json\`
- Need to change permissions: Edit \`.claude/settings.json\`
`;
}

// ─── Kickstart Prompt ───

function getKickstartPrompt(platform: "shopify" | "woocommerce", storeName: string): string {
  return `# Kickstart Prompt for ${storeName}

Copy everything below this line and paste it as your first message in Claude Code:

---

Hi Claude! This is our first session working on the ${storeName} ${platform === "shopify" ? "Shopify" : "WooCommerce"} theme together.

I'd like you to do a full initial audit. Here's what I need:

## Phase 1: Understand the Theme
1. Read through all the template files and understand the structure
2. Tell me what sections/templates exist and which ones are actually being used
3. Identify the CSS and JS files — how many, how large, what they do

## Phase 2: Performance Baseline
1. Count up all assets (CSS, JS, fonts, images) and their sizes
2. Identify any obvious performance issues:
   - Render-blocking scripts
   - Unused CSS/JS
   - Unoptimized images
   - Unnecessary third-party scripts
   - Heavy fonts or icon libraries
3. Create \`docs/performance-log.md\` with today's baseline

## Phase 3: Identify the Bloat
Tell me specifically:
- Which files can be safely removed (unused sections, snippets, templates)
- Which CSS rules have no corresponding HTML on any live page
- Which JS features aren't used on this store
- Which third-party scripts are loaded and whether they're justified
- How many font files/weights are loaded vs. actually used

## Phase 4: Recommend a Plan
Based on your audit, give me a prioritized list of changes:
1. **Quick wins** — things you can fix right now that will have immediate impact
2. **Medium effort** — optimizations that take a session or two
3. **Bigger projects** — structural improvements for when we have time

Don't make any changes yet — just analyze and report. I want to understand my theme before we start stripping it down.

After the audit, save your findings to memory so we have context for our next session.

---

## What Happens Next

After the initial audit, here are good follow-up prompts:

### Session 2: Strip the Bloat
"Let's implement the quick wins from the audit. Remove all unused CSS, JS, and template files. Measure before and after."

### Session 3: CRO Review
"Screenshot my product page on mobile and desktop. Review it for conversion optimization. What's above the fold? What's missing? What's in the way?"

### Session 4: Performance Deep Dive
"Run /performance-audit. Let's get Lighthouse to 90+. Focus on LCP and CLS."

### Session 5: SEO
"Run /seo-audit. Check structured data on product pages. Make sure every page has proper meta tags."

### Ongoing
- "What should I work on next?" — Claude knows your codebase and priorities
- "Add [feature] to [page]" — Claude builds it lean and conversion-focused
- "Something broke on mobile" — Claude screenshots, diagnoses, fixes
- "Show me my ${platform === "shopify" ? "top products by revenue" : "best selling products this month"}" — Claude queries your data
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
    {
      path: ".claude/skills/strip.md",
      description: "Analyze theme for bloat and strip unused code",
      content: platform === "shopify"
        ? `---
name: strip
description: Strip theme bloat — find and remove unused code
---

Run the full lean theme stripping process:

## Step 1: Inventory
- List ALL files in sections/, snippets/, assets/, templates/
- For each file, check if it's referenced anywhere
- Measure the size of every CSS and JS file
- List all fonts loaded and their weights

## Step 2: Identify Dead Code
- Find snippets never rendered by any section or template
- Find sections not placed in any JSON template
- Find CSS classes with no matching HTML elements
- Find JS that initializes features not present in the DOM
- Find fonts loaded but not used in any CSS font-family declaration

## Step 3: Report
Present findings as a table:
| File | Type | Size | Status | Reason |
|------|------|------|--------|--------|

Status should be: REMOVE, OPTIMIZE, or KEEP

## Step 4: Execute (with user confirmation)
After user approves the removal list:
1. Delete unused files
2. Remove unused CSS rules
3. Remove unused JS
4. Update any references
5. Run \`shopify theme check\` to verify nothing broke
6. Record before/after sizes in \`docs/performance-log.md\`
`
        : `---
name: strip
description: Strip theme bloat — find and remove unused code
---

Run the full lean theme stripping process:

## Step 1: Inventory
- List ALL template files, includes, and assets
- For each PHP file, check if it's included/required anywhere
- Check which WooCommerce template overrides exist and if they differ from defaults
- Measure enqueued CSS and JS files
- List all registered fonts

## Step 2: Identify Dead Code
- Find template-parts never called by get_template_part()
- Find WooCommerce overrides identical to plugin defaults (should be removed)
- Find enqueued scripts/styles loaded on pages where they're not needed
- Find functions defined but never hooked or called
- Check for removed/disabled plugins that left orphaned assets

## Step 3: Report
Present findings as a table:
| File | Type | Size | Status | Reason |
|------|------|------|--------|--------|

## Step 4: Execute (with user confirmation)
After user approves:
1. Delete unused files
2. Add conditional dequeuing for page-specific assets
3. Remove dead functions and hooks
4. Delete identical WooCommerce template overrides
5. Run \`composer run phpcs\` to verify
6. Record before/after in \`docs/performance-log.md\`
`,
    },
    {
      path: ".claude/skills/cro-review.md",
      description: "Review a page for conversion rate optimization",
      content: `---
name: cro-review
description: CRO audit — review a page for conversion optimization
---

Run a conversion rate optimization review on a specific page. Ask the user which page to review (product, collection, home, cart, checkout).

## Step 1: Visual Analysis
Use Puppeteer to screenshot the page at:
- Mobile (375px width)
- Tablet (768px width)
- Desktop (1440px width)

## Step 2: Above-the-Fold Audit
For each viewport, answer:
- What is visible without scrolling?
- Is the primary CTA (add to cart / shop now) visible?
- Is the product image/hero dominant?
- Is the price clearly visible?
- Are there any distractions (popups, banners, unnecessary elements)?

## Step 3: Trust & Social Proof
- Are reviews/ratings visible on product pages?
- Are trust badges (shipping, returns, payment) near the buy button?
- Is the brand story/value proposition communicated?

## Step 4: Friction Analysis
- How many clicks from landing to checkout?
- Are form fields minimized?
- Is guest checkout available?
- Are error messages helpful?
- Is mobile tap target size adequate (44x44px minimum)?

## Step 5: Speed Impact
- Is anything above-the-fold render-blocked?
- Are images properly sized for the viewport?
- Is the LCP element optimized?

## Step 6: Recommendations
Provide a prioritized list:
| Priority | Issue | Impact | Fix |
|----------|-------|--------|-----|

Focus on changes that are high-impact and low-effort first.
`,
    },
  ];

  return skills;
}

// ─── Summary for display ───

export function getClaudeFileSummary(platform: "shopify" | "woocommerce"): { path: string; description: string }[] {
  return [
    { path: "CLAUDE.md", description: "Project context, lean philosophy, CRO principles, self-evolving system" },
    { path: "HANDOFF.md", description: "Client handoff — what's set up, how to use it, daily/weekly workflows" },
    { path: "KICKSTART.md", description: "First prompt — paste into Claude Code to begin the initial theme audit" },
    { path: ".claude/settings.json", description: "Permissions, environment variables, and tool access control" },
    { path: ".mcp.json", description: `MCP servers: filesystem, puppeteer, fetch, ${platform === "shopify" ? "Shopify API" : "MySQL, WooCommerce API"}, memory` },
    { path: ".claude/rules/theme-standards.md", description: `${platform === "shopify" ? "Liquid" : "PHP/WordPress"} coding standards and naming conventions` },
    { path: ".claude/rules/lean-theme.md", description: "Lean theme philosophy — stripping process, performance budgets, audit commands" },
    { path: ".claude/rules/performance.md", description: "Core Web Vitals targets, image/CSS/JS optimization guidelines" },
    { path: ".claude/rules/seo-accessibility.md", description: "SEO requirements, structured data, WCAG 2.1 AA compliance" },
    { path: ".claude/skills/dev.md", description: `/dev — Start ${platform === "shopify" ? "Shopify theme" : "WooCommerce"} dev server` },
    { path: ".claude/skills/lint.md", description: `/lint — Run ${platform === "shopify" ? "theme check" : "PHPCS + ESLint"}` },
    { path: ".claude/skills/deploy.md", description: `/deploy — Build and push theme to ${platform === "shopify" ? "store" : "server"}` },
    { path: ".claude/skills/new-section.md", description: `/new-section — Scaffold a new ${platform === "shopify" ? "section" : "template part"}` },
    { path: ".claude/skills/performance-audit.md", description: "/performance-audit — Full performance analysis" },
    { path: ".claude/skills/seo-audit.md", description: "/seo-audit — SEO and structured data audit" },
    { path: ".claude/skills/strip.md", description: "/strip — Find and remove unused code, CSS, JS, fonts" },
    { path: ".claude/skills/cro-review.md", description: "/cro-review — Conversion optimization audit with screenshots" },
  ];
}
