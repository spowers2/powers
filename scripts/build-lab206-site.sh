#!/usr/bin/env bash
# Build a static site for lab206.com (LiveCode / any static host).
#
# Layout:
#   /            → Lab (browser: landing, /lab, /system, /docs)
#   /workspace/  → designlab206 (hash routes when not at domain root)
#   /hearth/     → Hearth restaurant (hash routes)
#
# Usage (monorepo root):
#   pnpm build:lab206
#   # → sites/lab206.com/  and  sites/lab206.com.zip
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/sites/lab206.com"
ZIP="$ROOT/sites/lab206.com.zip"

echo "→ Building Lab (base /)"
pnpm --filter @lab206/example-browser exec vite build --base=/

echo "→ Building designlab206 (base /workspace/)"
pnpm --filter @lab206/app-starter exec vite build --base=/workspace/

echo "→ Building Hearth (base /hearth/)"
pnpm --filter @lab206/restaurant-demo exec vite build --base=/hearth/

echo "→ Assembling $OUT"
rm -rf "$OUT"
mkdir -p "$OUT/workspace" "$OUT/hearth"
cp -R "$ROOT/examples/browser/dist/." "$OUT/"
cp -R "$ROOT/examples/app-starter/dist/." "$OUT/workspace/"
cp -R "$ROOT/examples/restaurant-demo/dist/." "$OUT/hearth/"

# Root .htaccess: SPA fallback ONLY when the file/dir does not exist.
# (A bare RewriteRule without !-f/!-d was serving index.html for /assets/*.js
#  → browser MIME error "text/html" instead of JavaScript.)
cat > "$OUT/.htaccess" <<'HTA'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
HTA

cat > "$OUT/workspace/.htaccess" <<'HTA'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /workspace/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /workspace/index.html [L]
</IfModule>
HTA

cat > "$OUT/hearth/.htaccess" <<'HTA'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /hearth/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /hearth/index.html [L]
</IfModule>
HTA

cat > "$OUT/README-UPLOAD.txt" <<'TXT'
lab206.com static site (Powers demos)

Upload EVERYTHING in this folder into the LiveCode directory
that lab206.com DNS points at (document root).

URLs after DNS propagates:
  https://lab206.com/            Lab home
  https://lab206.com/lab         Power Lab
  https://lab206.com/system      Design system
  https://lab206.com/docs        Docs
  https://lab206.com/workspace/  designlab206  (routes: /workspace/#/…)
  https://lab206.com/hearth/     Hearth        (routes: /hearth/#/…)

Do not upload node_modules or the Powers monorepo — only this folder.

If the browser tab still shows a WordPress (or old host) icon after upload:
  delete any leftover favicon.ico / favicon.png in the document root
  that is NOT from this zip, then hard-refresh (or clear site data).
TXT

echo "→ Zipping $ZIP"
rm -f "$ZIP"
mkdir -p "$ROOT/sites"
(cd "$OUT" && zip -r "$ZIP" . -x "*.DS_Store")

echo ""
echo "✓ Site ready:"
echo "    folder: $OUT"
echo "    zip:    $ZIP"
du -sh "$OUT" "$ZIP" 2>/dev/null || true
echo ""
echo "Next:"
echo "  1. Point lab206.com DNS A/CNAME at your LiveCode host"
echo "  2. Upload this folder (or zip) into that site's document root"
echo "  3. Open https://lab206.com/"
echo ""
echo "Guide: docs/LAB206_LIVECODE.md"
