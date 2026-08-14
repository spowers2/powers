# Power UX

**The reactive UI system that’s powerful under the hood and tiny to learn.**

Fine-grained updates. Explicit ownership. No virtual DOM. No dependency arrays.

> Status: **App stack v1** — core · animate · DOM/JSX · router · SSR foundation · **design system**.  
> Private while foundations harden.

**New here? (private monorepo — not public npm yet)**

1. **designlab206 demo:** `pnpm example:starter` → http://localhost:5180  
2. **Hearth restaurant:** `pnpm example:restaurant` → http://localhost:5181  
3. **Docs / Lab / System:** `pnpm example:browser` → `/docs` `/lab` `/system` (nav links to demos)  
4. Hub: **[docs/GETTING_STARTED.md](./docs/GETTING_STARTED.md)** · [docs/README.md](./docs/README.md)

---

## Packages

| Package | Role |
|---|---|
| `@power-ux/core` | signals, computed, effect, store, resource, ownership |
| `@power-ux/animate` | tween / spring on signals |
| `@power-ux/dom` | mount, h, JSX, reactive props, Show, For |
| `@power-ux/router` | createRouter, Link, navigate |
| `@power-ux/ssr` | `renderToString` + **islands** hydrate API |
| `@power-ux/ui` | **integrated styling** — tokens + primitives + BEM-ish utilities |

---

## Quick start

```bash
cd ~/Documents/power-ux
pnpm install
pnpm ci                  # typecheck · test · size budgets
pnpm example:starter     # http://localhost:5180  — designlab206 (freelance workspace)
pnpm example:restaurant  # http://localhost:5181  — Hearth (restaurant + Unsplash photos)
pnpm example:browser     # http://localhost:5173  — docs · lab · system
# Minimal Vite app:           pnpm create-app my-ui
# Full product starter:       pnpm new-app my-feature
```

**Library quality:** [docs/USABILITY.md](./docs/USABILITY.md) · [docs/FOUNDATION.md](./docs/FOUNDATION.md) · [docs/STABLE.md](./docs/STABLE.md) · [docs/GOLDEN_PATH.md](./docs/GOLDEN_PATH.md) · [docs/SIZE.md](./docs/SIZE.md)

### Design system + router (sketch)

```tsx
import "@power-ux/ui/theme.css";
import { mount } from "@power-ux/dom";
import { createRouter, Link } from "@power-ux/router";
import { Button, Card, Stack, Text, createTheme } from "@power-ux/ui";

const theme = createTheme("light");
theme.bind();

const router = createRouter({
  routes: [
    { path: "/", component: () => <Text as="h1" size="2xl">Home</Text> },
    { path: "/about", component: () => <Text>About</Text> },
  ],
});

mount(document.getElementById("app")!, () => (
  <Stack gap={4}>
    <Link router={router} to="/">Home</Link>
    <Link router={router} to="/about">About</Link>
    <Card>
      <Button onClick={() => theme.toggle()}>Toggle theme</Button>
    </Card>
    {router.outlet()}
  </Stack>
));
```

**Retheme everything:** edit `packages/ui/src/styles/tokens.css`  
Guide: [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md)

---

## Learn order

```
signal → computed → effect → store → resource
  → animate → mount/JSX → props → router → ui tokens/primitives
```

---

## Docs

| Doc | Topic |
|---|---|
| [`LEARN.md`](./docs/LEARN.md) | 10-minute mental model |
| [`ROADMAP.md`](./docs/ROADMAP.md) | **Ordered plan** (source of truth) |
| [`STYLING.md`](./docs/STYLING.md) | **Integrated styling** (tokens · primitives · utilities) |
| [`DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md) | Tokens + primitives |
| [`POWER_LAB.md`](./docs/POWER_LAB.md) | Learn-by-coding playground |
| [`DOM.md`](./docs/DOM.md) | DOM + JSX + props |
| [`ROUTER.md`](./docs/ROUTER.md) | Routing |
| [`ANIMATION.md`](./docs/ANIMATION.md) | Motion (+ parked GSAP) |
| [`NEXT.md`](./docs/NEXT.md) | Short checklist |

---

## Roadmap (summary)

Canonical detail: **[`docs/ROADMAP.md`](./docs/ROADMAP.md)**

| Done | Next (in order) | Parked |
|---|---|---|
| core → animate → dom → props → **router** → **ssr foundation** → **ui tokens** | Design system expansion → SSR islands → … | **GSAP adapter** (optional pro motion) |

---

## Scripts

| Command | What |
|---|---|
| `pnpm test` | All packages |
| `pnpm build` / `pnpm typecheck` | TypeScript |
| `pnpm example:browser` | Full demo (router + design system) |
| `pnpm example:kitchen-sink` | Core only |
| `pnpm example:animate` | Motion demo |

---

## License

MIT © Scott Powers
