#!/usr/bin/env bash
# Smoke first-time consumer path: Vite template + workspace file: deps.
# Catches React JSX / vite misconfig before npm publish.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="${TMPDIR:-/tmp}/powers-smoke-consumer-$$"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

mkdir -p "$TMP"
cp -R "$ROOT/templates/powers-vite/." "$TMP/app"
cd "$TMP/app"

python3 - <<PY
import json
root = "$ROOT"
j = json.load(open("package.json"))
j["dependencies"] = {
  "@lab206/core": f"file:{root}/packages/core",
  "@lab206/dom": f"file:{root}/packages/dom",
  "@lab206/ui": f"file:{root}/packages/ui",
}
open("package.json", "w").write(json.dumps(j, indent=2) + "\n")
PY

(cd "$ROOT" && pnpm --filter @lab206/core --filter @lab206/dom --filter @lab206/ui run build) >/dev/null
npm install --silent
npm run build
echo "✓ smoke-consumer: template builds against workspace packages"
