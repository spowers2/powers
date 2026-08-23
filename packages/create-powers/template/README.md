# Powers Vite template

Minimal app: theme, form with `createField` + `bind`, dark mode toggle.

## Fastest path

```bash
pnpm create powers my-app
# or: npm create powers@latest my-app
cd my-app
pnpm install
pnpm dev   # → http://localhost:5190
```

## Manual

```bash
pnpm add @lab206/core @lab206/dom @lab206/ui
```

Use this folder as the project (or copy it from the [Powers repo](https://github.com/spowers2/powers/tree/main/templates/powers-vite)).  
Vite is already wired with `jsxImportSource: "@lab206/dom"`.

## From the Powers monorepo (contributors)

```bash
# at repo root
pnpm create-app my-app
cd examples/my-app
pnpm install   # from repo root is fine too
pnpm --filter @lab206/my-app dev
```

In-repo scaffolds use `workspace:*` so HMR hits package sources.

## Put this online

```bash
pnpm build
pnpm deploy:zip   # → site-upload.zip
```

Upload/extract into your host web root (often `public_html`).  
Guide: [DEPLOY.md](https://github.com/spowers2/powers/blob/main/docs/DEPLOY.md)

## Learn more

- Live docs: https://lab206.com/docs  
- Lab: https://lab206.com/lab?recipe=hello  
- License: BSL-1.1 (source-available)
