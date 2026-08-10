# Next steps (maintainer checklist)

Last updated: 2026-08-09

## Completed recently

- [x] Phase 2.0 — `@power-ui/dom` thin bindings + browser demo  
- [x] Phase 2.x — JSX runtime (`jsx-runtime`), `component`, `Show`, `For`  

---

## Parked — return when it makes sense

### GSAP adapter + richer motion

**Do not drop this.** After components/JSX feel solid in real apps, or when cinematic timelines are needed:

1. Optional `@power-ui/animate/gsap` (or `@power-ui/gsap`) peer adapter  
2. Sync GSAP tweens → signals (or target DOM for marketing pages only)  
3. Color / multi-value interpolation in `@power-ui/animate`  
4. Enter/exit + FLIP-style helpers on top of `Show` / `For`  

See [`docs/ANIMATION.md`](./ANIMATION.md).

---

## Sensible next milestones

1. Reactive props helpers (`mergeProps` / props as store) for reusable components  
2. Small router package  
3. SSR / islands (Phase 3)  
4. **GSAP adapter** when pro motion demand is real  
5. Hardening: better `For` without wrapper-in-`ul` edge cases, a11y recipes  

---

## Completed history

- [x] Phase 0 — manifesto + monorepo  
- [x] Phase 1 — `@power-ui/core`  
- [x] Phase 1.1 — store, resource, onError, stress tests, size  
- [x] Phase 1.2 — `@power-ui/animate`  
- [x] Phase 2.0 — `@power-ui/dom`  
- [x] Phase 2.x — JSX + `component` / `Show` / `For`  
