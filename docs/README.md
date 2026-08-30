# Powers documentation

**For public users and contributors.** Start here and follow the path that matches your goal.

Live hub: [lab206.com/docs](https://lab206.com/docs) · packages on npm as `@lab206/*@0.1.5+`.

---

## Start here

| Goal | Doc / route |
|---|---|
| **How to use + API** | **https://lab206.com/docs** |
| API cheat sheet (markdown) | [API.md](./API.md) |
| **Create & customize components** | [COMPONENTS.md](./COMPONENTS.md) |
| Getting started | [GETTING_STARTED.md](./GETTING_STARTED.md) · `pnpm create powers my-app` |
| **Put an app online (static host)** | [DEPLOY.md](./DEPLOY.md) · `pnpm deploy:zip` |
| **lab206.com → LiveCode** | [LAB206_LIVECODE.md](./LAB206_LIVECODE.md) · `pnpm build:lab206` |
| **npm install / publish** | [NPM.md](./NPM.md) |
| **Commercial license (inquire)** | [COMMERCIAL.md](./COMMERCIAL.md) · [lab206.com/contact](https://lab206.com/contact?subject=Commercial%20license) |
| **What we sell** | [OFFER.md](./OFFER.md) |
| **Government / public sector** | [GOVERNMENT.md](./GOVERNMENT.md) · [SECURITY.md](../SECURITY.md) |
| **Golden path (~15 min first screen)** | [GOLDEN_PATH.md](./GOLDEN_PATH.md) |
| Stable API freeze notes | [STABLE.md](./STABLE.md) |
| Size budgets | [SIZE.md](./SIZE.md) · `pnpm size` |
| Runtime contracts | [FOUNDATION.md](./FOUNDATION.md) |
| Usability patterns (bind, router, lists) | [USABILITY.md](./USABILITY.md) |
| Day 1 / 2 / 30 learning path | [LEARN_PATH.md](./LEARN_PATH.md) |
| Forms & validation helpers | [FORMS.md](./FORMS.md) |
| Motion language | [MOTION.md](./MOTION.md) |
| **Five words: signal → resource (designers + developers)** | [LEARN.md](./LEARN.md) |
| Styling: tokens, components, utilities | [STYLING.md](./STYLING.md) |
| Design system primitives reference | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) |
| Interactive coding playground | [POWER_LAB.md](./POWER_LAB.md) + demo `/lab` |
| Public release checklist | [RELEASE.md](./RELEASE.md) |
| Ordered product plan | [ROADMAP.md](./ROADMAP.md) |
| DX strategy (how we win) | [DX_STRATEGY.md](./DX_STRATEGY.md) |
| **License & commercial model** | [LICENSING.md](./LICENSING.md) · [LICENSE-COMMERCIAL.md](../LICENSE-COMMERCIAL.md) · [TRADEMARKS.md](./TRADEMARKS.md) |

**Recommended path for a new developer**

1. `pnpm create powers my-app` → first screen locally  
2. [LEARN.md](./LEARN.md) — five words (`signal` … `resource`) in plain English  
3. [lab206.com/docs](https://lab206.com/docs) — three rules, API  
4. [lab206.com/lab](https://lab206.com/lab?recipe=hello) — Start here recipes  
5. [lab206.com/system](https://lab206.com/system) — brand playground + every component  
6. Day 1 / 2 / 30: [LEARN_PATH.md](./LEARN_PATH.md)

**Recommended path for a designer / UX**

1. [lab206.com/system](https://lab206.com/system) — tokens + components  
2. [LEARN.md](./LEARN.md) — Rosetta stone only (10 min; same words eng uses)  
3. Open Lab from any System card · Figma Community plugin

**Scaffold**

```bash
pnpm create powers my-app
# from this monorepo: pnpm create-app my-ui
```

---

## By package

| Package | Doc |
|---|---|
| `@lab206/core` | [LEARN.md](./LEARN.md) · [ARCHITECTURE.md](./ARCHITECTURE.md) · [FOUNDATION.md](./FOUNDATION.md) |
| `@lab206/dom` | [DOM.md](./DOM.md) |
| `@lab206/animate` | [ANIMATION.md](./ANIMATION.md) |
| `@lab206/router` | [ROUTER.md](./ROUTER.md) |
| `@lab206/ssr` | [SSR.md](./SSR.md) |
| `@lab206/ui` | [STYLING.md](./STYLING.md) · [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) · [COMPONENTS.md](./COMPONENTS.md) |

---

## Quick install

```bash
pnpm create powers my-app
# or
pnpm add @lab206/core @lab206/dom @lab206/ui
```

```tsx
import "@lab206/ui/theme.css";
import { signal } from "@lab206/core";
import { mount } from "@lab206/dom";
import { Button, createTheme } from "@lab206/ui";

createTheme("light").bind();

const n = signal(0);
mount(document.getElementById("root")!, () => (
  <Button onClick={() => n.update((x) => x + 1)}>
    {() => `Clicks: ${n()}`}
  </Button>
));
```

**Rules of thumb**

1. Read signals with `count()`; write with `.set` / `.update`.  
2. Live UI: `{() => count()}` not `{count()}`.  
3. Prefer **primitives** over inventing CSS; retheme via **tokens**.  
4. Utilities (`pu-gap-3`) are optional one-liners — not a second framework.

---

## Local demo (development)

```bash
pnpm install
pnpm example:browser   # http://localhost:5173
# /docs    — how to use + API reference (start here)
# /lab     — interactive recipes
# /system  — design system explorer
```

---

## Mental model

```
signal → computed → effect → store → resource
       ↓
  mount / JSX / component
       ↓
  @lab206/ui  (tokens · primitives · utilities)
```

| Code | Means |
|---|---|
| `signal` | Live value |
| `computed` | Formula |
| `effect` | Reaction |
| `store` | Small model |
| `resource` | Loaded data |

Full dual-audience explainer: [LEARN.md](./LEARN.md). One library for **behavior and look**. External CSS frameworks are optional escape hatches, not required.

---

## For maintainers

- [ROADMAP.md](./ROADMAP.md) — source of truth for sequence  
- [NEXT.md](./NEXT.md) — short checklist  
- [../CONTRIBUTING.md](../CONTRIBUTING.md) — how to change the monorepo  
