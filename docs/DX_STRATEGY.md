# Developer experience strategy — best UI kit on the market

**Thesis:** Power UX wins if a developer goes from install → first polished screen faster than React+library soup, and never hits a “why is this broken?” wall.

Components are necessary. **Trust, speed, and teaching** are the product.

---

## What “best” means (measurable)

| Signal | Target |
|---|---|
| Time to first interactive UI | &lt; 10 minutes (docs + Lab recipe 01) |
| Time to retheme brand | &lt; 5 minutes (`tokens.css` only) |
| Time to new primitive | &lt; 15 minutes (`COMPONENTS.md` recipe) |
| Demo “broken” moments | Zero (TOC, overlays, text, focus) |
| Learn curve | Signals + JSX + tokens — three ideas, deep power later |

Not: largest component count. Bootstrap/React ecosystems win on volume. We win on **coherence**.

---

## Four pillars

### 1. Trust (demo never lies)
Every public surface (Home / System / Lab / Docs) must feel intentional:
- Navigation (TOC pin + bottom sections) works
- Overlays flip and trap focus
- Content never stringifies as `[object HTML…]`
- Motion respects reduced motion but feels alive by default

**How we continue:** bug bashes against the demo weekly; every regression gets a test.

### 2. Authoring speed (write less, ship prettier)
- `createStyleSheet` + tokens already lower cost of new UI
- Next: **snippet-first System** — every card has Copy JSX
- Next: **Lab 2.0** — clear errors, recipe reset, optional AI-free autocomplete of imports
- Next: **vite template** / one-command scaffold

### 3. Integrated design (one brain)
Tokens + primitives + motion + density in one package. No “pick a CSS framework” fork.
- Document a **motion language** (enter / pop / collapse / spring)
- Field + validation as a **finished form story**
- Density + theme as first-class product controls

### 4. Progressive power (shallow start, deep ceiling)
- Day 1: signal, Button, Card, Stack  
- Day 2: resource, router, dialogs  
- Day 30: ownership, SSR islands, custom primitives, optional GSAP  

Never force advanced APIs into Hello World.

---

## Next steps (execution order)

### Sprint A — Trust the demo (now)
1. ~~TOC/scroll-spy pin + end-of-page last section~~  
2. ~~Keyboard roving on Menu / Tabs / List~~ (`rovingFocus.ts`)  
3. ~~Smoke tests~~ — `pnpm --filter @power-ux/example-browser smoke` + unit tests  
4. Focus-visible rings on Button / Menu / Tabs / List

### Sprint B — Authoring loop ✅
1. ~~System: **Copy JSX** on key demos~~ (`sysDemo.tsx`)  
2. ~~Docs: deep-link Lab recipes (`/lab?recipe=…`)~~  
3. ~~Error UX in Lab (overlay + Reset)~~  
4. ~~Cookbook recipes~~ (`settings`, `admin-list`) + start paths on landing/docs  

### Sprint C — Forms & data ✅ (base)
1. ~~Field validation helpers~~ (`bind`, `createField`, form helpers)  
2. ~~Table + Empty “admin list” recipe~~  
3. Combobox/Command polish (loading, empty, async) — still open  

### Sprint D — Motion language
1. ~~Export named transition presets~~  
2. ~~Document when to use CSS Transition vs `@power-ux/animate`~~ (`MOTION.md`)  
3. Micro-interaction audit of all controls — still open  

### Sprint E — Ship
1. ~~`create-power-ux` / Vite template~~ (`pnpm create-app`, `templates/power-ux-vite`)  
2. Execute `RELEASE.md`  
3. Public positioning: *fine-grained UI kit with a design system built in*  
4. ~~Dev warnings~~ (theme missing, double `outlet()`, snapshot `value` on Input)  
5. ~~Brand playground + export CSS~~ on System `#sys-play`  
6. ~~Day 1/2/30 path~~ (`docs/LEARN_PATH.md`)

---

## How we work day to day

1. **Demo-driven** — if it’s not visible in System/Lab/Docs, it doesn’t count as shipped  
2. **Small loops** — one trust bug or one DX feature per session, tests green  
3. **Write for strangers** — docs assume zero monorepo knowledge  
4. **Kill papercuts** — ObjectHTML, jumping TOC, menus off-screen are P0  
5. **Resist kit bloat** — add components when a real product pattern needs them, not for parity tables  

---

## Competitive frame (honest)

| | Bootstrap | React ecosystem | Power UX |
|---|---|---|---|
| Components | Many | Infinite (fragmented) | Growing, coherent |
| Runtime | CSS/JS widgets | VDOM + state lib + UI lib | Fine-grained signals |
| Design system | Themes/skins | Bring your own | Built-in tokens + primitives |
| Learn path | HTML classes | Framework + 3 tools | Core + DOM + UI |
| Moat if we execute | — | — | **Speed + trust + teaching** |

---

## Success check (before “best on market” claim)

- [ ] New hire ships a themed settings page in Lab without asking for help  
- [ ] No P0 demo bugs for a week of daily use  
- [ ] COMPONENTS.md path used to land a third-party-looking primitive in &lt;30 min  
- [ ] Public template install works cold  
- [ ] Landing promise matches System/Lab reality  
