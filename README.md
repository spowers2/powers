# Power UI

**The reactive UI system that’s powerful under the hood and tiny to learn.**

Fine-grained updates. Explicit ownership. No virtual DOM. No dependency arrays.

> Status: **Phase 1.1** — core reactivity (`signal`, `computed`, `effect`, `store`, `resource`). No DOM yet. Private while foundations harden.

**New here?** Read [`docs/LEARN.md`](./docs/LEARN.md) — five ideas, ten minutes.

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
pnpm size
```

### Hello core

```ts
import { signal, computed, effect, store, resource } from "@power-ui/core";

// 1. signal
const count = signal(0);

// 2. computed
const label = computed(() => `Count: ${count()}`);

// 3. effect — no dependency array
effect(() => console.log(label()));

// 4. store — multi-field state
const app = store({ count: 0, name: "Ada" });
app.count.set(1);
app.set({ name: "Grace" });

// 5. resource — async without spaghetti
const users = resource(async () => {
  const res = await fetch("/api/users");
  return res.json();
});
// users()  users.loading()  users.error()  users.refetch()
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

Architecture notes: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)

---

## Monorepo

```
power-ui/
├── packages/core/     # @power-ui/core v0.1.1
├── examples/
│   ├── counter/
│   └── kitchen-sink/
├── docs/
│   ├── LEARN.md
│   └── ARCHITECTURE.md
└── package.json
```

**Coming next:** `@power-ui/dom` (Phase 2) — explicit bindings, then syntax sugar.

---

## Scripts

| Command | What |
|---|---|
| `pnpm test` | Unit + stress tests |
| `pnpm typecheck` / `pnpm build` | TypeScript |
| `pnpm bench` | Micro-benchmarks |
| `pnpm size` | Min+gzip budget for core (≤ 8 KB gzip) |
| `pnpm example:counter` | Minimal demo |
| `pnpm example:kitchen-sink` | Full Phase 1.1 tour |

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
| **2** | DOM runtime + bindings → then compiler sugar | Next |
| **3** | SSR + selective hydration | Planned |
| **4** | App kit (router, actions) | Planned |
| **5** | Design system + docs site | Planned |

---

## License

MIT © Scott Powers
