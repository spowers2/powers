# Next steps

**Canonical order:** [`ROADMAP.md`](./ROADMAP.md)  
**Public docs hub:** [`README.md`](./README.md)

## Just completed

- [x] Public docs hub + launch-ready CONTRIBUTING  
- [x] LEARN / STYLING cross-links for public readers  
- [x] Primitives: Alert, Divider, Spinner  
- [x] Utilities expansion + Lab recipe “Alerts & loading”  
- [x] Modern surfaces: glass, elevation, multi-shadow, bento utilities  
- [x] Primitives: Dialog, Tabs, Progress, Skeleton, Avatar  
- [x] Lab recipe “Dialog, Tabs & Progress”  

## Just fixed (UX)

- [x] Landing: smooth section scroll + sticky anchors + back-to-top  
- [x] Lab: recipe switching updates editor / tip / preview (race-safe)  
- [x] Lab vs System clarified; Playground folded into System  
- [x] Lab visual polish (IDE chrome, numbered recipes, glass toolbar)  
- [x] Primitives: Tooltip, Toaster / createToaster  
- [x] Lab teaching panel (goal / learn / how / try this)  
- [x] Green base → `#69BE28` (blues unchanged)  
- [x] Primitives: Popover, Menu  
- [x] Lab syntax highlight (lightweight overlay) + Menu/Popover recipe  
- [x] Primitive: Kbd  
- [x] Public release checklist (`docs/RELEASE.md`)  
- [x] In-app **Docs** route (`/docs`) + `docs/API.md` cheat sheet  
- [x] Combobox + Command palette  
- [x] Lab: Async resource + Form validation recipes  
- [x] Docs: Common patterns section  

## Just shipped (kit expansion)

- [x] `createStyleSheet` + `styleVars` authoring helpers  
- [x] `trapFocus` on Dialog / Drawer / Command  
- [x] `Transition` + `Collapse` motion primitives  
- [x] Bulk kit: Accordion, Drawer, Breadcrumb, Pagination, RadioGroup, Slider, NumberInput, ToggleGroup, List, Table, Empty, Stat, Steps, Timeline, Chip, ScrollArea, AspectRatio, Link  
- [x] `docs/COMPONENTS.md` — create & customize guide  
- [x] System **Layout** section + Lab **Layout kit** recipe  

## Sprint A (trust) — done

- [x] TOC pin + bottom-of-page last section  
- [x] Roving tabindex: Menu · Tabs · List  
- [x] Unit tests + Playwright smoke (`pnpm --filter @power-ux/example-browser smoke`)  
- [x] Focus-visible polish on primary controls  

## Sprint B (authoring) — done

- [x] Copy JSX on key System demos (`sysDemo.tsx`)  
- [x] Docs patterns → `/lab?recipe=…` deep links  
- [x] Lab error overlay + Reset recipe action  
- [x] Command palette demoted from demo (dormant export only)  

## Sprint C — done

- [x] Form helpers (`required`, `emailFormat`, `firstError`, `validateForm`) + Lab form recipe  
- [x] Motion language (`MOTION_PRESETS`, `motionVars`, Lab `motion` recipe)  
- [x] GETTING_STARTED + FORMS + MOTION docs  
- [x] Copy JSX = full Lab programs; Open Lab loads snippet via share hash  

## Private scaffold — done

- [x] `examples/app-starter` (Vite product shell)  
- [x] `pnpm example:starter` · `pnpm new-app <name>`  
- [x] GETTING_STARTED oriented to private monorepo (no public cut)  

## Critical fix + product depth

- [x] **Input/Textarea/Button controlled props** — values/disabled track signals (forms work)  
- [x] Field live errors · bindProp caret-safe updates  
- [x] Starter Activity page (`resource()` loading / error / refetch)  
- [x] Starter Items + Settings product patterns  
- [x] Lab Scaffold + humanized errors  

## Real-world example apps

- [x] **designlab206** (`pnpm example:starter` → :5180) — clients, projects, tasks, invoices, dashboard  
- [x] **Invoices** — draft/sent/paid/overdue, line items, outstanding + paid YTD  
- [x] **Hearth** (`pnpm example:restaurant` → :5181) — menu photos (Unsplash), reservations, service board  
- [x] **Demo links** on System site nav, landing, and Docs → :5180 / :5181  

## Just shipped (product depth)

- [x] **designlab206 time** — log hours, unbilled value, invoice unbilled → draft invoices  
- [x] **Hearth table map** — floor plan, seat/reserve/clear, tickets per table  

## Foundation hardening (library-first) — in progress

- [x] **Week 1** — contracts + tests + form prop consistency  
  - `docs/FOUNDATION.md` (createRoot, outlet, forms, list)  
  - Tests: createRoot isolation · outlet no remount · keyed list · bindProp  
  - `readProp` / `MaybeReactive` on form controls  

- [x] **Week 2** — shared overlay core  
  - `attachOverlay()` — Escape stack · scroll-lock refcount · focus trap · outside dismiss  
  - Dialog · Drawer · Popover · Command use it; Menu inherits via Popover  
  - `overlay.test.ts`  

- [x] **Week 3** — ship-ready spine  
  - Size budgets: core · dom · animate · router · ui full + form-kit (`pnpm size`)  
  - CI: `.github/workflows/ci.yml` → typecheck · test · size  
  - `docs/STABLE.md` · `docs/GOLDEN_PATH.md` · `docs/SIZE.md`  
  - Root `pnpm run check`  

### Just done

- [x] Dogfood demos + golden-path links in Docs  
- [x] Optional **GSAP adapter** (`@power-ux/animate/gsap`)  
- [x] Lab recipe **GSAP adapter** (`/lab?recipe=gsap`)  
- [x] Review pass: Dialog unique title ids · Select fallback · Combobox overlay · GSAP harden · smoke  
- [x] **Tighten batch:** Field auto `htmlFor`/aria · Combobox + Tooltip **body portal** · overlay `isInside` · designlab206/Hearth **More** nav · Playwright GSAP **x advances** assert  

### Product UX (just done)

- [x] designlab206 dashboard stats → filtered deep links (`?status=` / `?view=pipeline`)  
- [x] Renamed **Project pipeline** + explainer card  
- [x] Hearth **guest site** `/visit` · menu · book (staff chrome separate)  
- [x] Router tracks `search` so query changes remount list pages  

### Next (optional)

- Keep tightening from real dogfood  
- Public cut when you decide (`RELEASE.md`)  

**Not now:** public npm until you flip the switch · more product apps as primary work.

