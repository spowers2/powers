# Component specs (phase 2) — **ready**

Machine-readable specs for the **full Powers Figma UI kit**, aligned with `@lab206/ui`.

## Quick start

```bash
# from monorepo root
pnpm design-kit:build
```

| File | Use |
|---|---|
| [`export/catalog.json`](./export/catalog.json) | Full specs (plugin + tooling) |
| [`export/index.md`](./export/index.md) | Checklist of all components |
| [`export/pages.md`](./export/pages.md) | Per-component Figma build notes |
| [`FIGMA_BUILD.md`](./FIGMA_BUILD.md) | **How to construct the kit in Figma** |
| [`catalog.ts`](./catalog.ts) | Source of truth (edit this) |
| [`_schema.ts`](./_schema.ts) | TypeScript contract |

## Coverage

All major `@lab206/ui` primitives across:

foundations · actions · forms · data-display · feedback · overlays · navigation · layout

## Editing

1. Change or add a component in `catalog.ts`  
2. `pnpm design-kit:build`  
3. Rebuild / update the matching Figma component set  

Token paths must exist in `../tokens/source.ts` (phase 1).
