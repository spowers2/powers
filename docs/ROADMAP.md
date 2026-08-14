# Power UX — ordered plan

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
| **ui++++++** | Combobox + Command |
| **patterns** | Lab async/form recipes + Docs patterns |
| **author** | `createStyleSheet` · `styleVars` · `trapFocus` · `docs/COMPONENTS.md` |
| **motion** | Transition · Collapse · overlay enter CSS |
| **kit+++** | Accordion, Drawer, Breadcrumb, Pagination, Radio, Slider, NumberInput, ToggleGroup, List, Table, Empty, Stat, Steps, Timeline, Chip, ScrollArea, AspectRatio, Link |

---

## Now / next (in order) — win on **developer experience**

The moat is not “more components than X”. It is: **fastest path from zero → beautiful interactive UI** with fine-grained power underneath.

| # | Milestone | Why it wins |
|---|---|---|
| A | **Trust the demo** ✅ | TOC pin, roving focus Menu/Tabs/List, smoke tests, focus rings |
| B | **Authoring loop** ✅ | Copy JSX (Lab-runnable) · Open Lab with snippet · error overlay |
| C | **Forms + motion** ✅ | form helpers · MOTION_PRESETS · recipes + docs |
| D | **Private scaffold** ✅ | `examples/app-starter` · `pnpm example:starter` · `pnpm new-app` |
| E | **Product depth** ✅ | designlab206 (time/invoices) · Hearth (tables) · demo links |
| F | **Foundation hardening** ✅ | Week 1 contracts · Week 2 overlays · Week 3 size/CI/STABLE/golden path |
| G | **Public later** | RELEASE.md + versioned packages when *you* decide |

Parked: streaming SSR — only when needed.

---

## Done (was parked)

### GSAP adapter + pro motion ✅

- `@power-ux/animate/gsap` — optional peer `gsap`  
- `gsapAnimate` / `gsapFromTo` / `createGsapBridge` → number signals  
- Default `@power-ux/animate` unchanged (no GSAP required)  
- See [`ANIMATION.md`](./ANIMATION.md)

---

## Package map

```
@power-ux/core      signals, store, resource, ownership
@power-ux/animate  tween / spring on signals
@power-ux/dom      mount, h, JSX, props, Show, For
@power-ux/router   createRouter, Link, navigate
@power-ux/ssr      renderToString + defineIslands / hydrate
@power-ux/ui       tokens + base + utilities + primitives
```

See `docs/STYLING.md` · `docs/DESIGN_SYSTEM.md` · `docs/POWER_LAB.md`
