# Power UI — ordered plan

**Last updated:** 2026-08-09  
**Source of truth for sequence.** Keep this file current when priorities change.

---

## Principles (always)

1. Tiny learning curve, deep power  
2. Fine-grained reactivity first (no VDOM default)  
3. Explicit ownership & dispose  
4. Easy to theme / adapt (design tokens)  
5. GSAP is optional power-user path — not the default motion engine  

---

## Completed (in order)

| # | Milestone | Package / artifact |
|---|---|---|
| 0–4c | Core → animate → dom → router → ssr string → UI foundation → landing | see history |
| **4d** | **Forms + density** | Field, Label, Textarea, Select, Switch, Checkbox · `createDensity` |
| **5a** | **SSR islands foundation** | `island`, `hydrateIslands`, `islandPlaceholder` |
| **5b** | **SSR islands example** | `examples/ssr-islands` |
| **4e** | **Design system explorer route** | `/system` in browser demo |
| **nav** | **Unified site navigation** | Same header on all routes |

---

## Now / next (in order)

| # | Milestone | Notes |
|---|---|---|
| 5c | SSR islands hardening | Streaming, registry codegen |
| 4f | Deeper DS docs / Story-like pages | Expand `/system` |
| 6 | **GSAP adapter** (parked until needed) | Optional peer; cinematic timelines |
| 7 | Color / multi-value animate, enter-exit / FLIP | Motion polish |
| 8 | Hardening | For/`ul` semantics, a11y recipes, prop typing |

---

## Parked (do not forget)

### GSAP adapter + pro motion

When apps need ScrollTrigger-class / SVG morph / timeline studio work:

1. `@power-ui/animate/gsap` (or `@power-ui/gsap`) as **optional** peer  
2. Bridge GSAP ticks → signals **or** DOM-only marketing pages  
3. Keep `@power-ui/animate` as the default learn path  

---

## Package map

```
@power-ui/core      signals, store, resource, ownership
@power-ui/animate  tween / spring on signals
@power-ui/dom      mount, h, JSX, props, Show, For
@power-ui/router   createRouter, Link, navigate
@power-ui/ssr      renderToString + islands hydrate API
@power-ui/ui       tokens, theme, density, full primitive set
```

## Design system edit guide

1. `packages/ui/src/styles/tokens.css`  
2. `data-pu-theme` / `data-pu-density` on `<html>`  
3. Primitives use only `--pu-*` semantic tokens  

See `docs/DESIGN_SYSTEM.md` · `docs/SSR.md`
