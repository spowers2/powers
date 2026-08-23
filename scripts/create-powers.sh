#!/usr/bin/env bash
# Scaffold a minimal Powers + Vite app from templates/powers-vite.
#
# Usage (from monorepo root):
#   bash scripts/create-powers.sh my-app
#   bash scripts/create-powers.sh ../outside/dashboard
#   pnpm create-app my-app
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/templates/powers-vite"
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
    j.name = '@lab206/' + process.argv[2];
    fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
  " "$DEST/package.json" "$BASE"
fi

echo "Created $DEST"
echo ""
echo "Next:"
if [[ "$DEST" == "$ROOT/examples/"* ]]; then
  echo "  cd $ROOT && pnpm install"
  echo "  pnpm --filter @lab206/$BASE dev"
  echo "  # or: cd $DEST && pnpm dev"
else
  echo "  # Wire package.json deps to this monorepo (workspace/file:) or npm,"
  echo "  # then: cd $DEST && pnpm install && pnpm dev"
fi
echo ""
echo "Learn: Lab Start here → http://localhost:5173/lab?recipe=hello"
echo "       then Form → /lab?recipe=form · Theme → /lab?recipe=tokens"
