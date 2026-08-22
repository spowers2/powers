# Publishing & installing `@powers/*`

## Install (after first npm publish)

```bash
pnpm add @powers/core @powers/dom @powers/ui
# optional
pnpm add @powers/router @powers/animate @powers/ssr
```

```tsx
import "@powers/ui/theme.css";
import { signal } from "@powers/core";
import { mount } from "@powers/dom";
import { Button, createTheme } from "@powers/ui";
```

Vite / TSX:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@powers/dom"
  }
}
```

## Until packages appear on npm

Clone and use the monorepo workspace (`pnpm create-app` / examples), or wait for the first `0.1.0` publish.

## Maintainers — publish

```bash
# dry run (no upload)
pnpm publish:dry-run

# real publish (needs npm login to an account that owns @powers)
pnpm publish:packages
```

pnpm rewrites `workspace:*` dependencies to real versions on publish.

**License on npm:** BUSL-1.1 (source-available). Say that in the release notes — not “open source.”

## Package map (0.1.0)

| Package | Role |
|---|---|
| `@powers/core` | signals, store, resource |
| `@powers/dom` | mount, JSX |
| `@powers/ui` | design system |
| `@powers/router` | routing |
| `@powers/animate` | motion (`@powers/animate/gsap` optional) |
| `@powers/ssr` | string SSR + islands |
