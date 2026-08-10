# Power UI — ordered plan

**Last updated:** 2026-08-10  
**Source of truth for sequence.** Keep this file current when priorities change.

---

## Principles (always)

1. Tiny learning curve, deep power  
2. Fine-grained reactivity first (no VDOM default)  
3. Explicit ownership & dispose  
4. **Integrated styling** — tokens + primitives + thin utilities (not “React + Tailwind” as default)  
5. Easy to retheme via one token file  
6. GSAP is optional power-user path — not the default motion engine  

---

## Completed (recent)

| # | Milestone |
|---|---|
| … | Core → animate → dom → props → router → SSR → UI → landing → forms → density → Lab |
| **style** | **Styling architecture** — `docs/STYLING.md` + `utilities.css` (BEM-ish, token-mapped) |
| **lab** | Power Lab (`/lab`) |
| **5c** | Islands: `defineIslands`, hydrate options |

---

## Now / next (in order)

| # | Milestone | Notes |
|---|---|---|
| style+ | Grow primitives + utilities carefully | No full Tailwind clone |
| lab+ | Lab polish | highlighting, more recipes |
| 5d | Streaming SSR (optional) | Progressive HTML if needed |
| 6 | **GSAP adapter** (parked until needed) | Optional peer; cinematic timelines |
| 7 | Color / multi-value animate, enter-exit / FLIP | Motion polish |
| 8 | Hardening | For/`ul` semantics, a11y recipes |

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
@power-ui/ui       tokens + base + utilities + primitives (default look)
```

See `docs/STYLING.md` · `docs/DESIGN_SYSTEM.md` · `docs/SSR.md` · `docs/POWER_LAB.md`
