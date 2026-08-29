# Learning path — Day 1 · Day 2 · Day 30

Progressive power: shallow start, deep ceiling. Don’t skip Day 1.

**Before Day 1 (10 min):** read [LEARN.md](./LEARN.md) — the five words (`signal`, `computed`, `effect`, `store`, `resource`) in plain English for designers and developers. Same industry names; no new jargon.

---

## Day 1 — First polished screen (~30–60 min)

**Goal:** one themed page with a button, text, and a form field that types correctly.

| Step | Where |
|---|---|
| 0. Five words | [LEARN.md](./LEARN.md) (Rosetta stone) |
| 1. Three rules | Demo `/docs#rules` · live values refresher `/docs#reactivity` |
| 2. Hello signal | Lab `/lab?recipe=hello` |
| 3. Form with `bind` | Lab `/lab?recipe=form` |
| 4. Settings cookbook | Lab `/lab?recipe=settings` |
| 5. Copy a System card | Demo `/system` → Copy JSX / Open Lab |

**You should know**

- `signal` = live value · `.set` / `.update` · `count()`
- `{() => count()}` vs snapshot `{count()}`
- `<Input bind={email} />` + `Field`
- `import "@lab206/ui/theme.css"` + `createTheme().bind()`

**Do not** dig into ownership, SSR, or GSAP yet.

---

## Day 2 — Product patterns (~half day)

**Goal:** lists, navigation, overlays.

| Step | Where |
|---|---|
| 1. Admin list | Lab `/lab?recipe=admin-list` |
| 2. Dialog / Drawer / Menu | Lab recipes + `/system#sys-overlay` |
| 3. Router sketch | [ROUTER.md](./ROUTER.md) · `createRouter` · **outlet once** |
| 4. Real app | `pnpm example:starter` (designlab206) or `example:restaurant` |

**You should know**

- `computed` = formula (e.g. filtered lists)
- `Table` + `Empty` + search field
- Dialog open **signal** (live boolean) pattern
- Deep links `?status=` via `router.query` / remount on search

---

## Day 30 — Power user

**Goal:** custom primitives, motion, async, optional SSR.

| Topic | Doc |
|---|---|
| New component | [COMPONENTS.md](./COMPONENTS.md) |
| Tokens / styling layers | [STYLING.md](./STYLING.md) |
| Motion language | [MOTION.md](./MOTION.md) |
| Reactivity (five words) | [LEARN.md](./LEARN.md) · [FOUNDATION.md](./FOUNDATION.md) |
| Animate / GSAP | [ANIMATION.md](./ANIMATION.md) · Lab `gsap` |
| SSR islands | [SSR.md](./SSR.md) |
| Ownership / effects | [ARCHITECTURE.md](./ARCHITECTURE.md) |

**You should know**

- `createStyleSheet` + token variables
- When CSS `Transition` vs `@lab206/animate`
- `resource` = loaded data (loading / error / ready)
- Dev warnings: snapshot values, double outlet, missing theme

---

## Design / UX track (parallel)

1. [LEARN.md](./LEARN.md) — **Rosetta stone only** (same five words eng uses)  
2. `/system#sys-play` — brand playground (accent, radius, density, dark)  
3. Export brand CSS → hand to eng  
4. Pattern states on System cards (default / soft / danger / empty)  
5. Open Lab from any card to tweak copy without a local repo  

You do not need to write `effect` or `resource` on Day 1. You *do* want the plain-English meanings so handoff and Lab recipes are not a foreign language.
