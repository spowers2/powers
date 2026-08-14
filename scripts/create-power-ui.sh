#!/usr/bin/env bash
# Scaffold a minimal Power UI + Vite app from templates/power-ui-vite.
#
# Usage (from monorepo root):
#   bash scripts/create-power-ui.sh my-app
#   bash scripts/create-power-ui.sh ../outside/dashboard
#   pnpm create-app my-app
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/templates/power-ui-vite"
NAME="${1:-}"

if [[ -z "$NAME" ]]; then
  echo "Usage: $0 <name-or-path>"
  echo "  $0 hello-ui                 # → examples/hello-ui"
  echo "  $0 ../experiments/dashboard # external folder"
  exit 1
fi

if [[ "$NAME" == */* || "$NAME" == .*/* ]]; then
  DEST="$NAME"
else
  DEST="$ROOT/examples/$NAME"
fi

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

BASE="$(basename "$DEST")"
if [[ -f "$DEST/package.json" ]] && command -v node >/dev/null 2>&1; then
  node -e "
    const fs = require('fs');
    const p = process.argv[1];
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    j.name = '@power-ui/' + process.argv[2];
    fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
  " "$DEST/package.json" "$BASE"
fi

echo "Created $DEST"
echo ""
echo "Next:"
if [[ "$DEST" == "$ROOT/examples/"* ]]; then
  echo "  cd $ROOT && pnpm install"
  echo "  pnpm --filter @power-ui/$BASE dev"
  echo "  # or: cd $DEST && pnpm dev"
else
  echo "  # Wire package.json deps to this monorepo (workspace/file:) or npm,"
  echo "  # then: cd $DEST && pnpm install && pnpm dev"
fi
echo ""
echo "Cookbook: open monorepo demo Lab → /lab?recipe=settings"
