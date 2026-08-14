# Foundation contracts

**Purpose:** Keep Power UX clean, powerful, and light by freezing *how* the runtime behaves — not by adding more primitives.

These contracts were extracted from real app bugs (designlab206 forms remounting, Select options, controlled inputs). Tests in `packages/*/src/*.test.ts` encode them. Do not break them for convenience.

---

## 1. Ownership & tracking isolation

| Rule | Detail |
|---|---|
| **`createRoot` clears tracking** | While `fn` runs, `activeNode` is `null`. Parent effects (e.g. router outlet) must not subscribe to signals read during child setup. |
| **`createRoot` still owns nodes** | Signals/effects created inside are owned by the root and disposed with it. |
| **Effects inside a root track normally** | Only the *parent* tracking context is cleared; child `effect`s subscribe as usual. |
| **`untrack(fn)`** | Reads inside `fn` never subscribe the active consumer. |

**Why it matters:** A route component that reads `value={email}` during setup must not re-run the outlet effect when `email` changes. That remount was wiping form focus and scrolling the page.

```ts
// ✅ outlet-safe pattern (already in createRouter)
effect(() => {
  path(); // only this is a dependency
  createRoot((dispose) => {
    // setup may read form signals freely
    component();
  });
});
```

---

## 2. Router outlet

| Rule | Detail |
|---|---|
| **Outlet depends on path only** | The outlet effect must subscribe to the matched pathname, not to arbitrary signals read by the page. |
| **Params writes are untracked** | `params.set(...)` runs under `untrack` so writing params does not loop the outlet. |
| **Location for the page is untracked** | Pass `history.location()` via `untrack` into the route component. |
| **Child tree is disposed on navigation** | Previous `createRoot` dispose runs before the next page mounts. |
| **Same path → no remount** | Updating local form/store signals must not remount the outlet. Navigating to the *current* path must not remount either. |

---

## 3. Controlled form controls

| Rule | Detail |
|---|---|
| **Props are `T \| (() => T)` (or signals)** | Prefer `mergeProps` / `createProps` so reads unwrap and track. |
| **Controlled text inputs** | While focused, DOM is source of truth (no rewrite of `.value` → caret stays). Unfocused / blur: sync signal → DOM. |
| **`bindProp` is equality-safe** | Skip assignment when `el[name] === next` (caret + perf). |
| **Disabled / aria-invalid track** | Accessors and signals must update the control without remounting the page. |
| **Select options are reactive** | `options={...}` may be a list, accessor, or signal; rebuild options inside an effect. |

Shared helpers: `@power-ux/ui` → `readProp` / `MaybeReactive` in `reactive.ts`.

---

## 4. Lists (`list` / `For`)

| Rule | Detail |
|---|---|
| **Keyed reconciliation** | With `key`, identity is preserved across reorder; nodes move, they are not recreated. |
| **Index-only keys** | Default key is index — fine for append-only demos; prefer stable ids in real apps. |
| **Item/index signals** | Each entry gets `item` + `index` signals so row content updates without remount when data changes. |
| **Dispose removed rows** | Leaving keys are disposed and removed from the DOM. |

---

## 5. Overlays (Dialog · Drawer · Popover · Menu · Command)

| Rule | Detail |
|---|---|
| **One runtime** | `attachOverlay()` owns Escape, body scroll lock, focus trap, outside dismiss. Components keep only chrome + layout. |
| **Stack** | Multiple open layers: only the **topmost** Escape / outside-dismiss handler runs. |
| **Scroll lock refcount** | Two modals open → body stays locked until the last one closes. |
| **Modal vs light** | Dialog / Drawer / Command: `scrollLock` + focus trap. Popover / Menu / Combobox: Escape + outside dismiss, no body lock. |
| **Portals** | Combobox list + Tooltip bubble append to `document.body` (no clip by overflow parents). Use `isInside` when the “root” spans multiple nodes. |
| **ownerDocument** | All listeners use the root’s document (Lab iframes). |

Source: `packages/ui/src/overlay.ts`.

---

## 6. Size & scope (light)

| Package | Intent |
|---|---|
| `core` | ~2 KB gzip class — graph, signals, ownership only |
| `dom` | Thin bindings + JSX + list/show — no design system |
| `router` | Path match + outlet contracts above |
| `ui` | Tree-shakeable primitives; no second state library |

Prefer **hardening these contracts** over new components until the spine feels inevitable.

---

## Related docs

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — reactive graph internals  
- [`STABLE.md`](./STABLE.md) — API freeze tiers  
- [`SIZE.md`](./SIZE.md) — gzip budgets · `pnpm size`  
- [`GOLDEN_PATH.md`](./GOLDEN_PATH.md) — first polished screen  
- [`FORMS.md`](./FORMS.md) — app-level form patterns  
- [`ROUTER.md`](./ROUTER.md) — router API  
- [`NEXT.md`](./NEXT.md) — hardening status  
