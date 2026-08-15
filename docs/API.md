# API reference (cheat sheet)

**For new developers.** Full narrative: [LEARN.md](./LEARN.md).  
**In the demo app:** open **`/docs`** (same content, interactive).

---

## Three rules

1. **Read** signals with `count()` · **write** with `.set` / `.update`  
2. Live JSX: `{() => count()}` not `{count()}`  
3. Prefer `@powers/ui` primitives; retheme via `tokens.css`

---

## `@powers/core`

| API | Usage |
|---|---|
| `signal(init)` | `v()` · `v.set` · `v.update` · `v.peek` |
| `computed(fn)` | derived, cached |
| `effect(fn)` | side effects; optional cleanup return |
| `store(fields)` | per-key signals + `set` batch |
| `resource(source, fetcher)` | async loading / error / value |
| `createQuery({ queryKey, queryFn })` | signal-keyed async query (ergonomic `resource`) |
| `batch(fn)` / `flush()` | group updates / test flush |
| `createRoot(fn)` | ownership + dispose |
| `untrack(fn)` | read without tracking |
| `onError(handler)` | owner error handler |

---

## `@powers/dom`

| API | Usage |
|---|---|
| `mount(el, () => tree)` | bootstrap app |
| JSX | `"jsxImportSource": "@powers/dom"` |
| `component(setup)` | reactive props component |
| `Show` | conditional mount |
| `For` | keyed list; `item()` live |
| `bindText` / `bindStyle` / … | fine-grained bindings |
| `mergeProps` / `splitProps` | prop helpers |

---

## `@powers/ui`

```ts
import "@powers/ui/theme.css";
import { createTheme, createDensity, Button, … } from "@powers/ui";
```

| Area | Exports |
|---|---|
| Theme | `createTheme` · `createDensity` · `cx` |
| Authoring | `createStyleSheet` · `styleVars` · `trapFocus` · `attachOverlay` · `readProp` |
| Forms | `required` · `emailFormat` · `minLength` · `maxLength` · `matches` · `firstError` · `validateForm` |
| Motion | `Transition` · `MOTION_PRESETS` · `motionVars` |
| Layout | `Stack` · `Grid` · `Container` · `Divider` · `AspectRatio` · `ScrollArea` · `Collapse` |
| Type | `Text` · `Code` · `Kbd` · `Link` |
| Forms | `Button` · `Input` · `Textarea` · `Select` · `Field` · `Label` · `Switch` · `Checkbox` · `RadioGroup` · `Slider` · `NumberInput` · `ToggleGroup` · `Combobox` |
| Surfaces | `Card` · `Badge` · `Chip` · `Avatar` |
| Feedback | `Alert` · `Spinner` · `Progress` · `Skeleton` · `Empty` · `Stat` · `Toaster` / `createToaster` |
| Structure | `Tabs` · `Accordion` · `Breadcrumb` · `Pagination` · `Steps` · `Timeline` · `List` · `Table` |
| Overlays | `Dialog` · `Drawer` · `Tooltip` · `Popover` · `Menu` · `Command` |

**Stable surface / freeze notes:** [STABLE.md](./STABLE.md) · **First screen:** [GOLDEN_PATH.md](./GOLDEN_PATH.md)
| Motion | `Transition` |

**Retheme:** edit `packages/ui/src/styles/tokens.css` (`--pu-brand-*` blues, `--pu-sage-*` green `#69BE28`).  
**Write a component:** [COMPONENTS.md](./COMPONENTS.md).

---

## `@powers/animate`

| API | Usage |
|---|---|
| `animate(signal, to, opts)` | tween number signal |
| `spring(opts?)` | spring options for `animate` |
| `cancel(signal)` | stop animation |

### Optional: `@powers/animate/gsap` (peer: `gsap`)

| API | Usage |
|---|---|
| `gsapAnimate(signal, to, opts?)` | GSAP tween; duration in **ms** |
| `gsapFromTo(signal, from, to, opts?)` | GSAP fromTo |
| `createGsapBridge(gsap)` | inject GSAP / mock |

---

## `@powers/router`

| API | Usage |
|---|---|
| `createRouter({ routes })` | SPA router |
| `router.outlet()` | matched view |
| `router.navigate(path)` | go to path |
| `Link` | declarative navigation |

---

## `@powers/ssr`

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
