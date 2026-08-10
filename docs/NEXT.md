# Next steps (maintainer checklist)

Last updated: 2026-08-09

## Completed: Phase 2 thin DOM (v0.1)

- [x] `@power-ui/dom` — `mount`, `h`, `text`, `bind*`, `on`, `show`, `list`
- [x] Tests (happy-dom)
- [x] Browser example (`examples/browser` + Vite)
- [x] Docs: `docs/DOM.md`

---

## Parked — return when it makes sense

### GSAP adapter + richer motion

**Do not drop this.** After DOM/compiler feel solid (or when a user needs cinematic timelines):

1. Optional `@power-ui/animate/gsap` (or `@power-ui/gsap`) peer adapter  
2. Sync GSAP tweens → signals (or target DOM for marketing pages only)  
3. Color / multi-value interpolation in `@power-ui/animate`  
4. Enter/exit + FLIP-style helpers on top of `show` / `list`

See [`docs/ANIMATION.md`](./ANIMATION.md).

---

## Sensible next engineering milestones

1. **Phase 2.x** — tiny JSX or template compiler that *only* emits existing `h` / `bind*` calls  
2. **Components** — lightweight `component(setup)` / ownership helpers  
3. **SSR / islands** (Phase 3)  
4. **GSAP adapter** (when pro motion demand is real)  

Prefer: dogfood the browser demo, fix binding gaps, then compiler.

---

## Completed history

- [x] Phase 0 — manifesto + monorepo  
- [x] Phase 1 — `@power-ui/core`  
- [x] Phase 1.1 — store, resource, onError, stress tests, size  
- [x] Phase 1.2 — `@power-ui/animate`  
- [x] Phase 2.0 — `@power-ui/dom` thin bindings + browser demo  
