# Next steps (maintainer checklist)

Last updated: 2026-08-09

## Parked: Phase 2 — thin DOM (resume AFTER animation)

**Do not skip this.** After the animation foundation lands, immediately return here:

1. `@power-ui/dom` — explicit bindings first (`text`, `attr`, `on`, `show`, `list` / `For`)
2. Vite browser example (counter + list)
3. Only then: JSX or template compiler that **emits** those bindings

Rationale: same five reactivity ideas + “bind them to the DOM.” Compiler last.

See also: root `README.md` roadmap Phase 2.

---

## Upcoming: Animation foundation (before or alongside early DOM)

Status: **decided in principle, not implemented yet.**

See full recommendation: [`docs/ANIMATION.md`](./ANIMATION.md)

Order of work when we pick this up:

1. `@power-ui/animate` (or `motion` in core) — tween **signals**, not DOM nodes
2. Spring / easing presets, `animate(signal, to, opts)`, cancel + interrupt
3. Optional **GSAP adapter** later for complex timelines / SVG / pro motion design
4. Then wire animations into `@power-ui/dom` (Phase 2) via the same signal graph

---

## Completed

- [x] Phase 0 — manifesto + monorepo
- [x] Phase 1 — `@power-ui/core` signals / effects
- [x] Phase 1.1 — store, resource, onError, stress tests, size budget
