# Power UI — ordered plan

**Last updated:** 2026-08-10  
**Source of truth for sequence.** Keep this file current when priorities change.

Public docs hub: [`docs/README.md`](./README.md)

---

## Principles (always)

1. Tiny learning curve, deep power  
2. Fine-grained reactivity first (no VDOM default)  
3. Explicit ownership & dispose  
4. **Integrated styling** — tokens + primitives + thin utilities (not “React + Tailwind” as default)  
5. Easy to retheme via one token file  
6. Docs written for **public readers** from day one  
7. GSAP is optional power-user path — not the default motion engine  

---

## Completed (recent)

| # | Milestone |
|---|---|
| … | Core → animate → dom → router → SSR/islands → UI → Lab → styling architecture |
| **docs** | Public docs hub (`docs/README.md`), launch-ready CONTRIBUTING |
| **ui+** | Alert, Divider, Spinner + utility expansion |
| **modern** | Glass/elevation tokens, multi-shadow, Card variants, bento utilities |
| **ui++** | Dialog, Tabs, Progress, Skeleton, Avatar |
| **lab-ux** | Lab recipe switch fix + visual polish |
| **ui+++** | Tooltip, Toaster |
| **ui++++** | Popover, Menu |
| **lab+** | Syntax highlight + Menu recipe + teaching panel |
| **ui+++++** | Kbd |
| **pub-doc** | `docs/RELEASE.md` checklist |

---

## Now / next (in order)

| # | Milestone | Notes |
|---|---|---|
| ui++++++ | More primitives as demos demand | Command, Combobox, … |
| 5d | Streaming SSR (optional) | Progressive HTML if needed |
| 6 | **GSAP adapter** (parked) | Optional peer; cinematic timelines |
| 7 | Color / enter-exit motion | Motion polish |
| 8 | Hardening | For/`ul` semantics, a11y recipes |
| pub | Execute release checklist | npm publish, website, LICENSE already MIT |

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
@power-ui/ui       tokens + base + utilities + primitives
```

See `docs/STYLING.md` · `docs/DESIGN_SYSTEM.md` · `docs/POWER_LAB.md`
