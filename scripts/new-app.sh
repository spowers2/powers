#!/usr/bin/env bash
# Copy the private app-starter into a new examples/* app (or external path).
# Usage (from monorepo root):
#   ./scripts/new-app.sh my-product
#   ./scripts/new-app.sh ../outside-apps/dashboard
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/examples/app-starter"
NAME="${1:-}"

if [[ -z "$NAME" ]]; then
  echo "Usage: $0 <name-or-path>"
  echo "  ./scripts/new-app.sh billing-ui"
  echo "  ./scripts/new-app.sh ../my-app"
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

mkdir -p "$(dirname "$DEST")"
cp -R "$SRC" "$DEST"

# Rename package if inside examples/
BASE="$(basename "$DEST")"
if [[ -f "$DEST/package.json" ]]; then
  # portable-ish rename of package name
  if command -v node >/dev/null 2>&1; then
    node -e "
      const fs = require('fs');
      const p = process.argv[1];
      const j = JSON.parse(fs.readFileSync(p, 'utf8'));
      j.name = '@power-ui/' + process.argv[2];
      fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
    " "$DEST/package.json" "$BASE"
  fi
fi

echo "Created $DEST"
echo "Next:"
echo "  cd $ROOT && pnpm install"
if [[ "$DEST" == "$ROOT/examples/"* ]]; then
  echo "  pnpm --filter @power-ui/$BASE dev"
else
  echo "  # Point package.json deps at file: or workspace, then pnpm install && pnpm dev"
fi
