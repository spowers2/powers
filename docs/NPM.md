# Publishing & installing `@lab206/*`

**Supported release: `0.1.8+`.** Do not use `0.1.0`–`0.1.2` (broken Vite / `workspace:*` publishes). Prefer **0.1.8+** for SVG JSX (`createElementNS`), `createApiClient`, and Dialog/form input stability (`isolateTracking`).

## Scaffold (recommended)

```bash
pnpm create powers my-app
# or: npm create powers@latest my-app
cd my-app && pnpm install && pnpm dev
```

This embeds a Vite app with `jsxImportSource: "@lab206/dom"` already set. Prefer this over hand-wiring.

## Install into an existing Vite app

```bash
pnpm add @lab206/core @lab206/dom @lab206/ui
# optional
pnpm add @lab206/router @lab206/animate @lab206/ssr
```

### Required: Vite + TypeScript JSX

`react-jsx` is only the **transform mode name** — you do **not** install React.

**`tsconfig.json`:**

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@lab206/dom"
  }
}
```

**`vite.config.ts`:** (Vite does **not** read jsxImportSource from tsconfig)

```ts
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@lab206/dom",
  },
  optimizeDeps: {
    include: ["@lab206/core", "@lab206/dom", "@lab206/ui"],
  },
});
```

```tsx
import "@lab206/ui/theme.css";
import { signal } from "@lab206/core";
import { mount } from "@lab206/dom";
import { Button, createTheme } from "@lab206/ui";

createTheme("light").bind();
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `React is not defined` / `react/jsx-runtime` | You’re on **&lt;0.1.3** or Vite JSX isn’t set to `@lab206/dom`. Upgrade to **0.1.6+**, set `esbuild.jsxImportSource`, delete `node_modules/.vite`, restart. |
| `Unsupported URL Type "workspace:"` | You installed a broken **0.1.1** publish. Use **0.1.6+**. |
| Input/textarea caret resets in Dialog on each keystroke | Upgrade to **0.1.5+** (`isolateTracking` + `bindDynamic` ownership). |
| `createApiClient` missing from `@lab206/core` | Upgrade to **0.1.6+**. |
| Types / JSX weirdness | Ensure both **tsconfig** and **vite** jsxImportSource are `@lab206/dom`. |

## Current release

**0.1.8** on npm (`lab206` org) + `create-powers@0.1.8`.  
Publish with **`pnpm publish`** so `workspace:*` rewrites to real versions — never bare `npm publish` from a workspace package.

**2FA tip:** use a **granular** access token with package write + **Bypass two-factor authentication for write/publish**. Classic tokens / sessions without bypass will keep asking for OTP.

## Maintainers — publish

```bash
pnpm publish:dry-run
pnpm publish:packages   # needs npm auth / granular token with bypass 2FA
```

Do **not** add `"development": "./src/..."` to package `exports` — that made Vite compile package TSX as React. Monorepo HMR uses `examples/powers-vite-alias.mjs` instead.

**License on npm:** BUSL-1.1 (source-available).

## Package map (0.1.8)

| Package | Role |
|---|---|
| `@lab206/core` | signals, store, resource |
| `@lab206/dom` | mount, JSX (`jsxImportSource`) |
| `@lab206/ui` | design system |
| `@lab206/router` | routing |
| `@lab206/animate` | motion (`@lab206/animate/gsap` optional) |
| `@lab206/ssr` | string SSR + islands |
| `create-powers` | `pnpm create powers` scaffold |
