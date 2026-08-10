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
| 0 | Manifesto + monorepo | repo root |
| 1 | Core reactivity | `@power-ui/core` |
| 1.1 | store, resource, onError, stress, size | `@power-ui/core` |
| 1.2 | Signal-native animation | `@power-ui/animate` |
| 2.0 | Thin DOM bindings | `@power-ui/dom` |
| 2.x | JSX + component / Show / For | `@power-ui/dom` |
| 2.y | Reactive props | `@power-ui/dom` |
| 3a | **Router** | `@power-ui/router` |
| 3b | **SSR foundation** (`renderToString`) | `@power-ui/ssr` |
| 4a | **Design system foundation** | `@power-ui/ui` (tokens + primitives) |
| 4b | **Design system expansion + marketing landing** | Badge, Container, Grid, Code · modern landing `/` |
| 4c | App demos under design system | Playground + Todos routes |

---

## Now / next (in order)

| # | Milestone | Notes |
|---|---|---|
| 4d | Design system expansion continued | Forms, density, more primitives, docs site |
| 5 | SSR islands / resumability | Beyond string HTML — selective hydrate |
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

### Not goals yet

- React API clone  
- Competing with full design-system orgs on day one  
- Magic globals  

---

## Package map

```
@power-ui/core      signals, store, resource, ownership
@power-ui/animate  tween / spring on signals
@power-ui/dom      mount, h, JSX, props, Show, For
@power-ui/router   createRouter, Link, navigate
@power-ui/ssr      renderToString (happy-dom)
@power-ui/ui       tokens + theme + Button, Input, Stack, Text, Card,
                   Badge, Container, Grid, Code
```

---

## Design system edit guide

1. Open `packages/ui/src/styles/tokens.css`  
2. Change brand / semantic CSS variables  
3. Light/dark via `data-pu-theme` (`createTheme().bind()`)  
4. Primitives only use semantic tokens (`--pu-color-*`, `--pu-space-*`)  

See `docs/DESIGN_SYSTEM.md`.
