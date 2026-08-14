# Learning path — Day 1 · Day 2 · Day 30

Progressive power: shallow start, deep ceiling. Don’t skip Day 1.

---

## Day 1 — First polished screen (~30–60 min)

**Goal:** one themed page with a button, text, and a form field that types correctly.

| Step | Where |
|---|---|
| 1. Three rules | Demo `/docs#rules` |
| 2. Hello signal | Lab `/lab?recipe=hello` |
| 3. Form with `bind` | Lab `/lab?recipe=form` |
| 4. Settings cookbook | Lab `/lab?recipe=settings` |
| 5. Copy a System card | Demo `/system` → Copy JSX / Open Lab |

**You should know**

- `signal` / `.set` / `count()`
- `{() => count()}` vs snapshot `{count()}`
- `<Input bind={email} />` + `Field`
- `import "@power-ux/ui/theme.css"` + `createTheme().bind()`

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

- `computed` for filtered lists
- `Table` + `Empty` + search field
- Dialog open signal pattern
- Deep links `?status=` via `router.query` / remount on search

---

## Day 30 — Power user

**Goal:** custom primitives, motion, async, optional SSR.

| Topic | Doc |
|---|---|
| New component | [COMPONENTS.md](./COMPONENTS.md) |
| Tokens / styling layers | [STYLING.md](./STYLING.md) |
| Motion language | [MOTION.md](./MOTION.md) |
| Fine-grained runtime | [LEARN.md](./LEARN.md) · [FOUNDATION.md](./FOUNDATION.md) |
| Animate / GSAP | [ANIMATION.md](./ANIMATION.md) · Lab `gsap` |
| SSR islands | [SSR.md](./SSR.md) |
| Ownership / effects | [ARCHITECTURE.md](./ARCHITECTURE.md) |

**You should know**

- `createStyleSheet` + token variables
- When CSS `Transition` vs `@power-ux/animate`
- `resource` for async data
- Dev warnings: snapshot values, double outlet, missing theme

---

## Design / UX track (parallel)

1. `/system#sys-play` — brand playground (accent, radius, density, dark)  
2. Export brand CSS → hand to eng  
3. Pattern states on System cards (default / soft / danger / empty)  
4. Open Lab from any card to tweak copy without a local repo  

No need to learn signals deeply — stay on System + tokens until a pattern needs interactivity.
