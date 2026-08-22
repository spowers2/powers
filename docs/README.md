# Powers documentation

**For public users and contributors.** Start here and follow the path that matches your goal.

Private repo today; these docs are written so they can ship as-is when the project goes public.

---

## Start here

| Goal | Doc / route |
|---|---|
| **How to use + API (in the demo)** | **http://localhost:5173/docs** |
| API cheat sheet (markdown) | [API.md](./API.md) |
| **Create & customize components** | [COMPONENTS.md](./COMPONENTS.md) |
| Getting started (private starter) | [GETTING_STARTED.md](./GETTING_STARTED.md) · `pnpm example:starter` |
| **Put an app online (static host)** | [DEPLOY.md](./DEPLOY.md) · `pnpm deploy:zip` |
| **lab206.com → LiveCode** | [LAB206_LIVECODE.md](./LAB206_LIVECODE.md) · `pnpm build:lab206` |
| **npm install / publish** | [NPM.md](./NPM.md) |
| **What we sell (offer draft)** | [OFFER.md](./OFFER.md) |
| **Government / public sector** | [GOVERNMENT.md](./GOVERNMENT.md) · [SECURITY.md](../SECURITY.md) |
| **Golden path (~15 min first screen)** | [GOLDEN_PATH.md](./GOLDEN_PATH.md) |
| Stable API freeze notes | [STABLE.md](./STABLE.md) |
| Size budgets | [SIZE.md](./SIZE.md) · `pnpm size` |
| Runtime contracts | [FOUNDATION.md](./FOUNDATION.md) |
| Usability patterns (bind, router, lists) | [USABILITY.md](./USABILITY.md) |
| Day 1 / 2 / 30 learning path | [LEARN_PATH.md](./LEARN_PATH.md) |
| Forms & validation helpers | [FORMS.md](./FORMS.md) |
| Motion language | [MOTION.md](./MOTION.md) |
| Learn the runtime in ~10 minutes | [LEARN.md](./LEARN.md) |
| Styling: tokens, components, utilities | [STYLING.md](./STYLING.md) |
| Design system primitives reference | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) |
| Interactive coding playground | [POWER_LAB.md](./POWER_LAB.md) + demo `/lab` |
| Public release checklist | [RELEASE.md](./RELEASE.md) |
| Ordered product plan | [ROADMAP.md](./ROADMAP.md) |
| DX strategy (how we win) | [DX_STRATEGY.md](./DX_STRATEGY.md) |
| **License & commercial model** | [LICENSING.md](./LICENSING.md) · [TRADEMARKS.md](./TRADEMARKS.md) |

**Recommended path for a new developer**

1. Demo **`/docs`** — pick a path (eng / design / cookbook), three rules, API  
2. Demo **`/lab`** — recipes with Goal / Learn / How / Try this  
3. Demo **`/system`** — brand playground + every component live  
4. Day 1 / 2 / 30: [LEARN_PATH.md](./LEARN_PATH.md)  
5. Markdown deep-dives as needed (LEARN, DOM, ROUTER, …)

**Scaffold a minimal app**

```bash
pnpm create-app my-ui    # or: bash scripts/create-powers.sh my-ui
```

---

## By package

| Package | Doc |
|---|---|
| `@powers/core` | [LEARN.md](./LEARN.md) · [ARCHITECTURE.md](./ARCHITECTURE.md) · [FOUNDATION.md](./FOUNDATION.md) |
| `@powers/dom` | [DOM.md](./DOM.md) |
| `@powers/animate` | [ANIMATION.md](./ANIMATION.md) |
| `@powers/router` | [ROUTER.md](./ROUTER.md) |
| `@powers/ssr` | [SSR.md](./SSR.md) |
| `@powers/ui` | [STYLING.md](./STYLING.md) · [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) · [COMPONENTS.md](./COMPONENTS.md) |

---

## Quick install (when published)

```bash
pnpm add @powers/core @powers/dom @powers/ui
```

```tsx
import "@powers/ui/theme.css";
import { signal } from "@powers/core";
import { mount } from "@powers/dom";
import { Button, createTheme } from "@powers/ui";

createTheme("light").bind();

const n = signal(0);
mount(document.getElementById("app")!, () => (
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
  @powers/ui  (tokens · primitives · utilities)
```

One library for **behavior and look**. External CSS frameworks are optional escape hatches, not required.

---

## For maintainers

- [ROADMAP.md](./ROADMAP.md) — source of truth for sequence  
- [NEXT.md](./NEXT.md) — short checklist  
- [../CONTRIBUTING.md](../CONTRIBUTING.md) — how to change the monorepo  
