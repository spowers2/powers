# Stable API surface (freeze notes)

**Status:** private monorepo · **intent:** treat the surfaces below as *stable enough to build apps on*. Breaking changes need a clear reason, a doc update, and preferably a test.

This is **not** a public semver promise until you publish. It is a working freeze so the library can stay clean and light.

Related: [`FOUNDATION.md`](./FOUNDATION.md) (runtime contracts) · [`API.md`](./API.md) (cheat sheet) · [`GOLDEN_PATH.md`](./GOLDEN_PATH.md)

---

## Stability tiers

| Tier | Meaning |
|---|---|
| **Stable** | Documented, tested, used by demos. Prefer additive changes. |
| **Solid** | Works in demos; smaller test surface. Avoid casual breaks. |
| **Experimental** | May move or rename before public npm. |
| **Internal** | Underscore / test helpers / size entries — do not import from apps. |

---

## `@power-ux/core` — Stable

| Export | Notes |
|---|---|
| `signal` · `computed` · `effect` | Core graph |
| `batch` · `flush` | Scheduling |
| `createRoot` · `untrack` | Ownership + isolation (**FOUNDATION**) |
| `store` · `cell` | Shallow multi-key store |
| `resource` | Async data |
| `onError` | Owner error handling |
| Types: `Signal`, `Dispose`, `Resource`, … | |

**Do not expand casually:** deep proxy stores, time-travel, built-in router.

---

## `@power-ux/dom` — Stable

| Export | Notes |
|---|---|
| `mount` | App bootstrap |
| JSX runtime (`jsxImportSource: "@power-ux/dom"`) | |
| `component` · `Show` · `For` | Components + control flow |
| `h` · `text` · `Fragment` | |
| `mergeProps` · `createProps` · `splitProps` | Reactive props |
| `bindText` · `bindAttr` · `bindProp` · `bindClass` · `bindStyle` | Equality-safe props |
| `list` · `show` · `on` | Imperative bindings |

**Contract:** `createRoot` isolation + keyed `list`/`For` identity (see FOUNDATION).

---

## `@power-ux/router` — Stable

| Export | Notes |
|---|---|
| `createRouter` · `Router` | Path match + `outlet` + `navigate` |
| `Link` | |
| `buildPath` · `matchPath` · `normalizePath` | |
| History helpers | browser / hash / memory |

**Contract:** outlet remounts **only** on path change; form signals must not remount.

---

## `@power-ux/animate` — Solid

| Export | Notes |
|---|---|
| `animate` · `spring` · `cancel` | Signal-driven motion (default) |
| `@power-ux/animate/gsap` | **Experimental / optional peer** — `gsapAnimate`, `createGsapBridge` |

Apps that never install `gsap` never pay for it.

---

## `@power-ux/ui` — Mixed

### Stable (app authoring)

- Theme: `createTheme` · `createDensity` · `cx`
- Forms: `Button` · `Input` · `Textarea` · `Select` · `Field` · `Label` · `Checkbox` · `Switch` · form helpers · `MaybeReactive` / `readProp*`
- Layout: `Stack` · `Grid` · `Container` · `Text` · `Card`
- Overlays: `Dialog` · `Drawer` · `Popover` · `Menu` · `attachOverlay` · `trapFocus`
- Feedback: `Alert` · `Toaster` / `createToaster` · `Empty` · `Stat`

### Solid (product kit)

`Tabs` · `Accordion` · `Command` · `Combobox` · `Table` · `List` · `Pagination` · `Breadcrumb` · `Progress` · `Skeleton` · `Tooltip` · `Transition` · `Collapse` · motion presets · remaining primitives in the System catalog.

### Internal (do not import from apps)

- `packages/ui/src/size-entries/*`
- `__overlayStackSize` · `__resetOverlayStack` (test-only)

**CSS:** import `@power-ux/ui/theme.css` once. Tokens live in `tokens.css` — retheme there, not with one-off component CSS when possible.

---

## `@power-ux/ssr` — Solid / document limits

`renderToString` + islands. Treat as advanced; see [`SSR.md`](./SSR.md).

---

## Size budgets (CI)

| Package | Measure | gzip budget |
|---|---|---|
| `core` | full bundle | ≤ 8 KB |
| `dom` | bundle, core external | ≤ 6 KB |
| `animate` | bundle, core external | ≤ 5 KB |
| `router` | bundle, core+dom external | ≤ 4 KB |
| `ui` full index | core+dom external | ≤ 32 KB |
| `ui` form-kit entry | Button/Input/Field/Stack/theme | ≤ 12 KB |

```bash
pnpm size   # fails if any budget exceeded
pnpm ci     # typecheck + test + size
```

---

## Change policy (until public 1.0)

1. **Prefer additive** APIs over renames.  
2. **Behavior contracts** in FOUNDATION need a regression test when touched.  
3. **New primitives** are fine if tree-shakeable and not required for Hello World.  
4. **Breaking** changes: update STABLE + API + demos in the same PR.  
5. Public npm still gated by you (`RELEASE.md`).
