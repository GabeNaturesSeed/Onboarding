// Generates the setup.sh script that gets included in the user's theme repo

export function generateSetupScript(platform: "shopify" | "woocommerce", storeName: string): string {
  return `#!/bin/bash
# ─── GabeGS Vibe Coder Setup ───
# Auto-generated for ${storeName}
# Run this after cloning your repo to get everything ready.

set -e

echo ""
echo "  ╔══════════════════════════════════════════╗"
echo "  ║   GabeGS Vibe Coder — ${platform === "shopify" ? "Shopify" : "WooCommerce"} Setup   ║"
echo "  ╚══════════════════════════════════════════╝"
echo ""

# ─── Check prerequisites ───

check_command() {
  if ! command -v "$1" &> /dev/null; then
    echo "  ✗ $1 is not installed."
    echo "    Install: $2"
    MISSING=1
  else
    echo "  ✓ $1 found: $(command -v "$1")"
  fi
}

MISSING=0

echo "Checking prerequisites..."
echo ""

check_command "node" "https://nodejs.org (v18+)"
check_command "git" "https://git-scm.com"
check_command "claude" "npm install -g @anthropic-ai/claude-code"
${platform === "shopify"
  ? 'check_command "shopify" "npm install -g @shopify/cli"'
  : 'check_command "wp" "https://wp-cli.org (WordPress CLI)"'
}

echo ""

if [ "$MISSING" -eq 1 ]; then
  echo "Some prerequisites are missing. Install them and re-run this script."
  echo ""
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# ─── Install Claude Code if not present ───

if ! command -v claude &> /dev/null; then
  echo "Installing Claude Code CLI..."
  npm install -g @anthropic-ai/claude-code
  echo "  ✓ Claude Code installed"
  echo ""
fi

# ─── Install project dependencies ───

if [ -f "package.json" ]; then
  echo "Installing npm dependencies..."
  npm install
  echo "  ✓ Dependencies installed"
  echo ""
fi

${platform === "woocommerce" ? `if [ -f "composer.json" ]; then
  echo "Installing composer dependencies..."
  composer install
  echo "  ✓ Composer dependencies installed"
  echo ""
fi
` : ""}

# ─── Create docs directory for performance tracking ───

mkdir -p docs
if [ ! -f "docs/performance-log.md" ]; then
  cat > docs/performance-log.md << 'PERF_EOF'
# Performance Log

Track Lighthouse scores over time. Run \`/performance-audit\` in Claude Code to update.

| Date | Page | Performance | LCP | CLS | FID | Notes |
|------|------|------------|-----|-----|-----|-------|
| $(date +%Y-%m-%d) | (baseline) | — | — | — | — | Initial setup |
PERF_EOF
  echo "  ✓ Performance log created at docs/performance-log.md"
fi

# ─── Verify Claude Code config ───

echo ""
echo "Verifying Claude Code configuration..."

if [ -f "CLAUDE.md" ]; then
  echo "  ✓ CLAUDE.md found"
else
  echo "  ✗ CLAUDE.md missing — re-download from GabeGS dashboard"
fi

if [ -f ".mcp.json" ]; then
  echo "  ✓ .mcp.json found (MCP servers configured)"
else
  echo "  ✗ .mcp.json missing"
fi

if [ -d ".claude" ]; then
  RULES=$(ls .claude/rules/*.md 2>/dev/null | wc -l)
  SKILLS=$(ls .claude/skills/*.md 2>/dev/null | wc -l)
  echo "  ✓ .claude/ found — $RULES rules, $SKILLS skills"
else
  echo "  ✗ .claude/ directory missing"
fi

if [ -f "KICKSTART.md" ]; then
  echo "  ✓ KICKSTART.md found"
else
  echo "  ✗ KICKSTART.md missing"
fi

if [ -f "HANDOFF.md" ]; then
  echo "  ✓ HANDOFF.md found"
fi

# ─── Done ───

echo ""
echo "  ╔══════════════════════════════════════════╗"
echo "  ║            Setup Complete!               ║"
echo "  ╚══════════════════════════════════════════╝"
echo ""
echo "  Next steps:"
echo ""
echo "    1. Run:  claude"
echo "    2. Paste the contents of KICKSTART.md"
echo "    3. Claude will audit your theme and create a plan"
echo ""
${platform === "shopify"
  ? `echo "    To start dev server:  shopify theme dev --store=${storeName}"
echo "    Or in Claude Code:    /dev"`
  : `echo "    To start dev server:  npm run dev"
echo "    Or in Claude Code:    /dev"`
}
echo ""
echo "  Read HANDOFF.md for full documentation."
echo ""
`;
}
