# Power UI — ordered plan

**Last updated:** 2026-08-10  
**Source of truth for sequence.** Keep this file current when priorities change.

---

## Principles (always)

1. Tiny learning curve, deep power  
2. Fine-grained reactivity first (no VDOM default)  
3. Explicit ownership & dispose  
4. Easy to theme / adapt (design tokens)  
5. GSAP is optional power-user path — not the default motion engine  

---

## Completed (recent)

| # | Milestone |
|---|---|
| … | Core → animate → dom → props → router → SSR string → UI → landing → forms → density |
| **5a–b** | Islands foundation + CLI example |
| **nav** | Unified site navigation |
| **4e–f** | `/system` design explorer (expanded sections) |
| **5c** | Islands hardening: `defineIslands`, `listIslandsInHtml`, hydrate options |
| **lab** | **Power Lab** — in-app learning playground (`/lab`) |

---

## Now / next (in order)

| # | Milestone | Notes |
|---|---|---|
| lab+ | Lab polish | syntax highlight, more recipes, tests |
| 5d | Streaming SSR (optional) | Progressive HTML if needed |
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
@power-ui/ssr      renderToString + defineIslands / hydrate
@power-ui/ui       tokens, theme, density, forms, layout primitives
```

See `docs/DESIGN_SYSTEM.md` · `docs/SSR.md`
