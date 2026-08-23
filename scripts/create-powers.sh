#!/usr/bin/env bash
# Scaffold a minimal Powers + Vite app from templates/powers-vite.
#
# Usage (from monorepo root):
#   bash scripts/create-powers.sh my-app
#   bash scripts/create-powers.sh ../outside/dashboard
#   pnpm create-app my-app
#
# Outsiders (no monorepo): prefer `pnpm create powers my-app` (npm package create-powers).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/templates/powers-vite"
NAME="${1:-}"

if [[ -z "$NAME" ]]; then
  echo "Usage: $0 <name-or-path>"
  echo "  $0 hello-ui                 # → examples/hello-ui (workspace:*)"
  echo "  $0 ../experiments/dashboard # external folder (^0.1.2 from npm)"
  exit 1
fi

if [[ "$NAME" == */* || "$NAME" == .*/* ]]; then
  DEST="$NAME"
else
  DEST="$ROOT/examples/$NAME"
fi

# Resolve to absolute when possible for prefix checks
if command -v realpath >/dev/null 2>&1; then
  DEST_ABS="$(mkdir -p "$(dirname "$DEST")" && realpath -m "$DEST" 2>/dev/null || echo "$DEST")"
else
  DEST_ABS="$DEST"
fi

IN_EXAMPLES=0
case "$DEST_ABS" in
  "$ROOT/examples"/*) IN_EXAMPLES=1 ;;
esac
# Also treat relative examples/ paths as in-repo before realpath
case "$DEST" in
  "$ROOT/examples"/*|examples/*) IN_EXAMPLES=1 ;;
esac

if [[ -e "$DEST" ]]; then
  echo "Refusing to overwrite: $DEST"
  exit 1
fi

if [[ ! -d "$SRC" ]]; then
  echo "Missing template: $SRC"
  exit 1
fi

mkdir -p "$(dirname "$DEST")"
cp -R "$SRC" "$DEST"
# Drop nested junk if any
rm -rf "$DEST/node_modules" "$DEST/dist" 2>/dev/null || true

BASE="$(basename "$DEST")"
if [[ -f "$DEST/package.json" ]] && command -v node >/dev/null 2>&1; then
  node -e "
    const fs = require('fs');
    const pkgPath = process.argv[1];
    const base = process.argv[2];
    const inExamples = process.argv[3] === '1';
    const j = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    j.name = inExamples ? '@lab206/' + base : base;
    const ver = '^0.1.2';
    const ws = 'workspace:*';
    const dep = inExamples ? ws : ver;
    j.dependencies = j.dependencies || {};
    for (const name of ['@lab206/core', '@lab206/dom', '@lab206/ui']) {
      j.dependencies[name] = dep;
    }
    fs.writeFileSync(pkgPath, JSON.stringify(j, null, 2) + '\n');
  " "$DEST/package.json" "$BASE" "$IN_EXAMPLES"
fi

echo "Created $DEST"
echo ""
echo "Next:"
if [[ "$IN_EXAMPLES" -eq 1 ]]; then
  echo "  cd $ROOT && pnpm install"
  echo "  pnpm --filter @lab206/$BASE dev"
  echo "  # or: cd $DEST && pnpm dev"
else
  echo "  cd $DEST"
  echo "  pnpm install   # or: npm install"
  echo "  pnpm dev       # → http://localhost:5190"
fi
echo ""
echo "Learn: https://lab206.com/lab?recipe=hello"
echo "Docs:  https://lab206.com/docs"
