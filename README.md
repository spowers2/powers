# Power UI

**The reactive UI system that’s powerful under the hood and tiny to learn.**

Fine-grained updates. Explicit ownership. No virtual DOM. No dependency arrays.

> Status: **Phase 2.y** — core + animate + DOM/JSX + **reactive props**. Private while foundations harden.

**New here?** Read [`docs/LEARN.md`](./docs/LEARN.md) — small surface, real apps.

---

## Why Power UI?

| You want | Power UI |
|---|---|
| Small learning curve | **5 core ideas** — not a framework textbook |
| Real power | Fine-grained graph, async resources, stores, ownership, error boundaries |
| Predictable updates | Only what you read re-runs — never “the whole component” |
| Future-proof core | DOM / compiler / SSR plug in later without changing these primitives |

### Learn order

```
signal → computed → effect → store → resource
```

That’s the whole core. Master those and you can build serious app state *today* (even before the view layer).

---

## Quick start

Requirements: **Node ≥ 20**, **pnpm ≥ 9**.

```bash
cd ~/Documents/power-ui
pnpm install
pnpm test
pnpm example:kitchen-sink
pnpm example:animate
pnpm example:browser
pnpm size
```

### Hello browser UI (JSX)

```tsx
import { signal } from "@power-ui/core";
import { animate, spring } from "@power-ui/animate";
import { mount, component, bindStyle } from "@power-ui/dom";

const App = component(() => {
  const count = signal(0);
  const x = signal(0);
  const ball = <div class="ball" /> as HTMLElement;
  bindStyle(ball, () => ({ transform: `translateX(${x()}px)` }));

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          count.update((n) => n + 1);
          animate(x, 100, spring());
        }}
      >
        {() => `Count: ${count()}`}
      </button>
      {ball}
    </div>
  );
});

mount(document.getElementById("app")!, () => <App />);
```

---

## Core API cheat sheet

| API | Role |
|---|---|
| `signal(init)` | Writable cell — `()`, `.set`, `.update`, `.peek` |
| `computed(fn)` | Lazy derived value |
| `effect(fn)` | Auto-tracking side effect; optional cleanup |
| `store({…})` | Shallow multi-field state; each key is a signal |
| `resource(fn)` / `resource(source, fn)` | Async data + loading/error/latest/refetch |
| `batch(fn)` | Many writes → one update wave |
| `createRoot(fn)` | Ownership boundary; dispose tears down the tree |
| `onError(fn)` | Catch effect errors for the current root |
| `untrack(fn)` | Read without subscribing |
| `flush()` | Run pending effects now (tests/demos) |
| `animate(signal, to, opts?)` | Tween or spring a number signal (`@power-ui/animate`) |
| `spring(opts?)` | Spring config for `animate` |
| `mount` / JSX / `component` / `Show` / `For` | DOM + JSX (`@power-ui/dom`) |
| `mergeProps` / `splitProps` / `createProps` | Reactive component props |

Docs: [`LEARN`](./docs/LEARN.md) · [`DOM`](./docs/DOM.md) · [`ANIMATION`](./docs/ANIMATION.md) · [`NEXT`](./docs/NEXT.md) (includes parked GSAP adapter)

---

## Monorepo

```
power-ui/
├── packages/
│   ├── core/       # @power-ui/core
│   ├── animate/    # @power-ui/animate
│   └── dom/        # @power-ui/dom
├── examples/
│   ├── counter/
│   ├── kitchen-sink/
│   ├── animate-demo/
│   └── browser/    # Vite demo
└── docs/
```

**Coming next:** optional compiler sugar, then (when it makes sense) **GSAP adapter**. See [`docs/NEXT.md`](./docs/NEXT.md).

---

## Scripts

| Command | What |
|---|---|
| `pnpm test` | Unit + stress tests |
| `pnpm typecheck` / `pnpm build` | TypeScript |
| `pnpm bench` | Micro-benchmarks |
| `pnpm size` | Min+gzip budget for core (≤ 8 KB gzip) |
| `pnpm example:counter` | Minimal demo |
| `pnpm example:kitchen-sink` | Full core tour |
| `pnpm example:animate` | Motion foundation demo |
| `pnpm example:browser` | Vite UI demo (dom + animate) |

---

## Manifesto (short)

1. Fine-grained reactivity is the runtime — no VDOM by default  
2. Explicit ownership — dispose is structural  
3. Progressive compilation — plain TS first; compiler later  
4. Easy to learn — small surface, deep power  
5. Accessibility & intent are product features (view layer)  
6. Zero-cost until you pay — tree-shake everything  

### Non-goals (for now)

- React API clones · CSS-in-JS runtime default · magic globals · full SSR/resumability before a solid client core

---

## Roadmap

| Phase | Focus | Status |
|---|---|---|
| **0** | Manifesto, monorepo | ✅ |
| **1** | Core signals / effects | ✅ v0.1 |
| **1.1** | `store`, `resource`, `onError`, stress tests, size budget | ✅ v0.1.1 |
| **1.2** | Signal-native animation (`@power-ui/animate`) | ✅ v0.1.0 |
| **2** | Thin DOM bindings (`@power-ui/dom`) + browser demo | ✅ |
| **2.x** | JSX runtime + `component` / `Show` / `For` | ✅ |
| **2.y** | Reactive props (`mergeProps`, …) | ✅ v0.3.0 |
| **—** | **GSAP adapter** + richer motion | **Parked** — see [`docs/NEXT.md`](./docs/NEXT.md) |
| **3** | SSR + selective hydration | Planned |
| **4** | App kit (router, actions) | Planned |
| **5** | Design system + docs site | Planned |

---

## License

MIT © Scott Powers
