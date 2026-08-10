# Next steps (maintainer checklist)

Last updated: 2026-08-09

## Completed: Animation foundation (Phase 1.2)

- [x] `@power-ui/animate` — tween + spring on number signals
- [x] Interrupt / cancel / complete
- [x] `prefers-reduced-motion` + test clock driver
- [x] Tests, size budget, `examples/animate-demo`

See [`docs/ANIMATION.md`](./ANIMATION.md).

---

## NEXT UP: Phase 2 — thin DOM (resume now)

**This is the immediate next engineering milestone.**

1. `@power-ui/dom` — explicit bindings first (`text`, `attr`, `on`, `show`, `list` / `For`)
2. Vite browser example (counter + list + optional `animate` on style/transform signals)
3. Only then: JSX or template compiler that **emits** those bindings

Rationale: same five reactivity ideas + animate + “bind them to the DOM.” Compiler last.

Wire motion into DOM after bindings exist (enter/exit, FLIP-ish later).

---

## Later

- Optional GSAP adapter (`@power-ui/animate/gsap` or similar)
- Color / multi-value interpolation
- SSR + selective hydration (Phase 3)

---

## Completed history

- [x] Phase 0 — manifesto + monorepo
- [x] Phase 1 — `@power-ui/core` signals / effects
- [x] Phase 1.1 — store, resource, onError, stress tests, size budget
- [x] Phase 1.2 — `@power-ui/animate`
