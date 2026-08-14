# Bundle size budgets

Power UI stays light by **failing CI** when packages grow past fixed gzip ceilings.

```bash
pnpm size   # all package size scripts
pnpm ci     # typecheck + test + size
```

## Budgets

| Package | How measured | gzip ceiling | ~current |
|---|---|---|---|
| `@power-ui/core` | full minify bundle | **8 KB** | ~2.1 KB |
| `@power-ui/dom` | minify, `core` external | **6 KB** | ~3.3 KB |
| `@power-ui/animate` | minify, `core` external | **5 KB** | ~1.6 KB |
| `@power-ui/router` | minify, `core`+`dom` external | **4 KB** | ~1.9 KB |
| `@power-ui/ui` full | minify public index, core+dom external | **32 KB** | ~25 KB |
| `@power-ui/ui` form-kit | Button/Input/Field/Stack/theme/helpers | **12 KB** | measured on `pnpm size` |

Artifacts land in each package’s `dist-size/` (`*.min.js`, `size.json`).

## Policy

1. **Headroom is intentional** — budgets are not “use all of this.”  
2. Raising a budget requires a **comment in the size script** + note in this file.  
3. Prefer tree-shakeable modules over a smaller monolithic “core UI.”  
4. CSS (`theme.css`) is **not** in these JS budgets; keep tokens shared, avoid per-app CSS soup.

## Scripts

| Path | Role |
|---|---|
| `packages/core/scripts/size.ts` | core gate |
| `packages/dom/scripts/size.ts` | dom gate |
| `packages/animate/scripts/size.ts` | animate gate |
| `packages/router/scripts/size.ts` | router gate |
| `packages/ui/scripts/size.ts` | ui full + form-kit |
| `.github/workflows/ci.yml` | CI runs `pnpm size` |
