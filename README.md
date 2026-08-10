# Power UI

**A fine-grained reactive UI system** — ownership-first, near-zero runtime, built to be clearer than the VDOM era and readable by humans *and* machines.

> Status: **Phase 1** — core reactivity only. No DOM yet. Private while foundations harden.

---

## Manifesto

The front-runners (React, Angular, Vue, Svelte, Solid, Qwik) are excellent — and each is constrained by history:

| Constraint | Typical cost |
|---|---|
| VDOM reconciliation | Work proportional to component trees, not changed data |
| Dual mental models | “When does this re-render?” vs “what subscribed?” |
| Hydration that re-executes | Pay for interactivity you already described on the server |
| A11y & intent as afterthoughts | Accessibility and structure bolted on, not in the contract |
| Opaque graphs | Hard for tools and AI agents to refactor safely |

**Power UI’s thesis:**

> Treat *reactivity, ownership, and time* as first-class. Ship near-zero runtime. Make the UI graph explicit enough for compilers, DevTools, and agents.

### Principles (non-negotiable)

1. **Fine-grained reactivity is the runtime** — no VDOM by default.
2. **Explicit ownership** — every reactive node has an owner; dispose is structural.
3. **Progressive compilation** — plain TS works; the compiler only rewrites what it can prove.
4. **Web-native path** — DOM/Custom Elements and SSR are projections of the same model.
5. **Time is a primitive** — batching today; transitions, undo, and optimistic UI next.
6. **Accessibility is not a plugin** — (view layer) roles and focus are part of the contract.
7. **AI-readable surface** — stable APIs, structured errors, intent metadata later.
8. **Zero-cost until you pay** — tree-shake; features cost only when used.

### Non-goals (for now)

- Competing on ecosystem size day one
- Full React API compatibility
- A CSS-in-JS runtime as the default styling path
- Magic globals or implicit `this` reactivity
- Boiling the ocean on resumability before a solid client core exists

---

## Monorepo layout

```
power-ui/
├── packages/
│   └── core/          # @power-ui/core — signals, computed, effect, batch, ownership
├── examples/
│   └── counter/       # CLI demo with no DOM
├── package.json
└── pnpm-workspace.yaml
```

**Coming later:** `packages/dom`, `packages/compiler`, `packages/router`, `packages/ui`.

---

## Quick start

Requirements: **Node ≥ 20**, **pnpm ≥ 9**.

```bash
pnpm install
pnpm test
pnpm example:counter
pnpm bench
```

### Core API (Phase 1)

```ts
import {
  signal,
  computed,
  effect,
  batch,
  createRoot,
  untrack,
} from "@power-ui/core";

const count = signal(0);
const double = computed(() => count() * 2);

const stop = effect(() => {
  console.log(double());
});

batch(() => {
  count.set(1);
  count.update((n) => n + 1);
});

stop();
```

| API | Role |
|---|---|
| `signal(init)` | Writable reactive cell — `()`, `.set`, `.update`, `.peek` |
| `computed(fn)` | Lazy derived value |
| `effect(fn)` | Sync subscribe; optional cleanup; returns dispose |
| `batch(fn)` | Coalesce writes; flush effects once |
| `createRoot(fn)` | Ownership boundary; dispose tears down the subtree |
| `untrack(fn)` | Read without subscribing |

---

## Roadmap

| Phase | Focus | Status |
|---|---|---|
| **0** | Manifesto, non-goals, monorepo | ✅ |
| **1** | `@power-ui/core` reactivity + tests + bench | ✅ (v0.1) |
| **2** | View compiler + DOM runtime | Planned |
| **3** | SSR + selective hydration / islands | Planned |
| **4** | App kit (router, loaders, actions) | Planned |
| **5** | Design system + docs site | Planned |
| **6** | Ecosystem (Vite, lint, LS, AI skills) | Planned |

### Scoreboard (targets)

| Axis | Target |
|---|---|
| Runtime size (hello core) | Measure & publish each release |
| Update cost | O(changed bindings), not O(tree) |
| Type safety | Strict TS end-to-end |
| DX | Clear errors; no invisible dependency arrays |

---

## Why start with core only?

A UI library is only as honest as its reactive graph. If signals, ownership, and batching are wrong, every view-layer feature becomes a workaround. Phase 1 ships a **usable, tested, dependency-free** reactivity package you can already use in Node, workers, or games — before any JSX exists.

---

## License

MIT © Scott Powers

---

## Contributing

Private for now. Foundations first; public contribution model later.
