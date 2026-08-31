# @lab206/dom

DOM + JSX runtime for [Powers](https://lab206.com) — `mount`, control flow, reactive props.

```bash
pnpm create powers my-app
# or
pnpm add @lab206/core @lab206/dom @lab206/ui
```

Required (both):

```json
// tsconfig
{ "compilerOptions": { "jsx": "react-jsx", "jsxImportSource": "@lab206/dom" } }
```

```ts
// vite.config.ts — Vite does not read tsconfig for this
export default defineConfig({
  esbuild: { jsx: "automatic", jsxImportSource: "@lab206/dom" },
});
```

Use `@lab206/*@0.1.6+`. Do not install React.

- Docs: https://lab206.com/docs  
- License: BUSL-1.1 (source-available)
