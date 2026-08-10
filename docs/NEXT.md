# Next steps (maintainer checklist)

Last updated: 2026-08-09

## Completed recently

- [x] Phase 2.0 — `@power-ui/dom` thin bindings + browser demo  
- [x] Phase 2.x — JSX runtime, `component`, `Show`, `For`  
- [x] Phase 2.y — **reactive props** (`createProps`, `mergeProps`, `splitProps`)  

---

## Parked — return when it makes sense

### GSAP adapter + richer motion

**Do not drop this.** When apps need cinematic timelines / SVG / ScrollTrigger-class work:

1. Optional `@power-ui/animate/gsap` peer adapter  
2. Sync GSAP tweens → signals (or DOM-only marketing pages)  
3. Color / multi-value interpolation  
4. Enter/exit + FLIP-style helpers  

See [`docs/ANIMATION.md`](./ANIMATION.md).

---

## Sensible next milestones

1. Small **router** package  
2. **SSR / islands** (Phase 3)  
3. **GSAP adapter** when pro motion demand is real  
4. Hardening: `For` HTML list edge cases, a11y recipes, prop typing polish  

---

## Completed history

- [x] Phase 0 — manifesto + monorepo  
- [x] Phase 1 — `@power-ui/core`  
- [x] Phase 1.1 — store, resource, onError, stress tests, size  
- [x] Phase 1.2 — `@power-ui/animate`  
- [x] Phase 2.0 — `@power-ui/dom`  
- [x] Phase 2.x — JSX + `component` / `Show` / `For`  
- [x] Phase 2.y — reactive props  
