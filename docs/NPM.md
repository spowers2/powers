# Publishing & installing `@lab206/*`

## Install (after first npm publish)

```bash
pnpm add @lab206/core @lab206/dom @lab206/ui
# optional
pnpm add @lab206/router @lab206/animate @lab206/ssr
```

```tsx
import "@lab206/ui/theme.css";
import { signal } from "@lab206/core";
import { mount } from "@lab206/dom";
import { Button, createTheme } from "@lab206/ui";
```

Vite / TSX:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@lab206/dom"
  }
}
```

## Current release

**0.1.2** on npm under the `lab206` org. Use `pnpm publish` (not bare `npm publish`) so `workspace:*` deps rewrite to real versions.

## Maintainers — publish

```bash
# dry run (no upload)
pnpm publish:dry-run

# real publish (npm login / granular token with bypass 2FA; account must own @lab206)
pnpm publish:packages
```

pnpm rewrites `workspace:*` dependencies to real versions on publish. Prefer `pnpm publish` over `npm publish` for that rewrite.

**License on npm:** BUSL-1.1 (source-available). Say that in the release notes — not “open source.”

## Package map (0.1.2)

| Package | Role |
|---|---|
| `@lab206/core` | signals, store, resource |
| `@lab206/dom` | mount, JSX |
| `@lab206/ui` | design system |
| `@lab206/router` | routing |
| `@lab206/animate` | motion (`@lab206/animate/gsap` optional) |
| `@lab206/ssr` | string SSR + islands |
