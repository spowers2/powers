# API reference (cheat sheet)

**For new developers.** Full narrative: [LEARN.md](./LEARN.md).  
**In the demo app:** open **`/docs`** (same content, interactive).

---

## Three rules

1. **Read** signals with `count()` · **write** with `.set` / `.update`  
2. Live JSX: `{() => count()}` not `{count()}`  
3. Prefer `@power-ui/ui` primitives; retheme via `tokens.css`

---

## `@power-ui/core`

| API | Usage |
|---|---|
| `signal(init)` | `v()` · `v.set` · `v.update` · `v.peek` |
| `computed(fn)` | derived, cached |
| `effect(fn)` | side effects; optional cleanup return |
| `store(fields)` | per-key signals + `set` batch |
| `resource(source, fetcher)` | async loading / error / value |
| `batch(fn)` / `flush()` | group updates / test flush |
| `createRoot(fn)` | ownership + dispose |
| `untrack(fn)` | read without tracking |
| `onError(handler)` | owner error handler |

---

## `@power-ui/dom`

| API | Usage |
|---|---|
| `mount(el, () => tree)` | bootstrap app |
| JSX | `"jsxImportSource": "@power-ui/dom"` |
| `component(setup)` | reactive props component |
| `Show` | conditional mount |
| `For` | keyed list; `item()` live |
| `bindText` / `bindStyle` / … | fine-grained bindings |
| `mergeProps` / `splitProps` | prop helpers |

---

## `@power-ui/ui`

```ts
import "@power-ui/ui/theme.css";
import { createTheme, createDensity, Button, … } from "@power-ui/ui";
```

| Area | Exports |
|---|---|
| Theme | `createTheme` · `createDensity` · `cx` |
| Layout | `Stack` · `Grid` · `Container` · `Divider` |
| Type | `Text` · `Code` · `Kbd` |
| Forms | `Button` · `Input` · `Textarea` · `Select` · `Field` · `Label` · `Switch` · `Checkbox` |
| Feedback | `Alert` · `Spinner` · `Progress` · `Skeleton` · `Badge` · `Avatar` |
| Overlays | `Dialog` · `Tabs` · `Tooltip` · `Popover` · `Menu` · `Toaster` / `createToaster` |
| Surfaces | `Card` (variants: default / glass / elevated / soft) |

**Retheme:** edit `packages/ui/src/styles/tokens.css` (`--pu-brand-*` blues, `--pu-sage-*` green `#69BE28`).

---

## `@power-ui/animate`

| API | Usage |
|---|---|
| `animate(signal, to, opts)` | tween number signal |
| `spring(opts?)` | spring options for `animate` |
| `cancel(signal)` | stop animation |

---

## `@power-ui/router`

| API | Usage |
|---|---|
| `createRouter({ routes })` | SPA router |
| `router.outlet()` | matched view |
| `router.navigate(path)` | go to path |
| `Link` | declarative navigation |

---

## `@power-ui/ssr`

| API | Usage |
|---|---|
| `renderToString(fn)` | HTML string |
| islands / hydrate | progressive enhancement (see [SSR.md](./SSR.md)) |

---

## Learn path

1. This file or demo **`/docs`**  
2. Demo **`/lab`** recipes (with teaching panels)  
3. Demo **`/system`** component gallery  
4. [LEARN.md](./LEARN.md) · [STYLING.md](./STYLING.md) · [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
