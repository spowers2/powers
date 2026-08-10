# Power UI documentation

**For public users and contributors.** Start here and follow the path that matches your goal.

Private repo today; these docs are written so they can ship as-is when the project goes public.

---

## Start here

| Goal | Doc / route |
|---|---|
| **How to use + API (in the demo)** | **http://localhost:5173/docs** |
| API cheat sheet (markdown) | [API.md](./API.md) |
| Learn the runtime in ~10 minutes | [LEARN.md](./LEARN.md) |
| Styling: tokens, components, utilities | [STYLING.md](./STYLING.md) |
| Design system primitives reference | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) |
| Interactive coding playground | [POWER_LAB.md](./POWER_LAB.md) + demo `/lab` |
| Public release checklist | [RELEASE.md](./RELEASE.md) |
| Ordered product plan | [ROADMAP.md](./ROADMAP.md) |

**Recommended path for a new developer**

1. Demo **`/docs`** — install, three rules, first app, API tables  
2. Demo **`/lab`** — recipes with Goal / Learn / How / Try this  
3. Demo **`/system`** — every component live  
4. Markdown deep-dives as needed (LEARN, DOM, ROUTER, …)

---

## By package

| Package | Doc |
|---|---|
| `@power-ui/core` | [LEARN.md](./LEARN.md) · [ARCHITECTURE.md](./ARCHITECTURE.md) |
| `@power-ui/dom` | [DOM.md](./DOM.md) |
| `@power-ui/animate` | [ANIMATION.md](./ANIMATION.md) |
| `@power-ui/router` | [ROUTER.md](./ROUTER.md) |
| `@power-ui/ssr` | [SSR.md](./SSR.md) |
| `@power-ui/ui` | [STYLING.md](./STYLING.md) · [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) |

---

## Quick install (when published)

```bash
pnpm add @power-ui/core @power-ui/dom @power-ui/ui
```

```tsx
import "@power-ui/ui/theme.css";
import { signal } from "@power-ui/core";
import { mount } from "@power-ui/dom";
import { Button, createTheme } from "@power-ui/ui";

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
# /todos   — small app demo
```

---

## Mental model

```
signal → computed → effect → store → resource
       ↓
  mount / JSX / component
       ↓
  @power-ui/ui  (tokens · primitives · utilities)
```

One library for **behavior and look**. External CSS frameworks are optional escape hatches, not required.

---

## For maintainers

- [ROADMAP.md](./ROADMAP.md) — source of truth for sequence  
- [NEXT.md](./NEXT.md) — short checklist  
- [../CONTRIBUTING.md](../CONTRIBUTING.md) — how to change the monorepo  
