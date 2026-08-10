# Power UI

**The reactive UI system that’s powerful under the hood and tiny to learn.**

Fine-grained updates. Explicit ownership. No virtual DOM. No dependency arrays.

> Status: **App stack v1** — core · animate · DOM/JSX · router · SSR foundation · **design system**.  
> Private while foundations harden.

**New here?**

1. Run the demo → open **`/docs`** (how to use + **API reference**)  
2. Repo hub: **[docs/README.md](./docs/README.md)** · API: [`docs/API.md`](./docs/API.md) · learn: [`LEARN.md`](./docs/LEARN.md)

---

## Packages

| Package | Role |
|---|---|
| `@power-ui/core` | signals, computed, effect, store, resource, ownership |
| `@power-ui/animate` | tween / spring on signals |
| `@power-ui/dom` | mount, h, JSX, reactive props, Show, For |
| `@power-ui/router` | createRouter, Link, navigate |
| `@power-ui/ssr` | `renderToString` + **islands** hydrate API |
| `@power-ui/ui` | **integrated styling** — tokens + primitives + BEM-ish utilities |

---

## Quick start

```bash
cd ~/Documents/power-ui
pnpm install
pnpm test
pnpm example:browser   # http://localhost:5173
# Power Lab (learn by coding): http://localhost:5173/lab
```

### Design system + router (sketch)

```tsx
import "@power-ui/ui/theme.css";
import { mount } from "@power-ui/dom";
import { createRouter, Link } from "@power-ui/router";
import { Button, Card, Stack, Text, createTheme } from "@power-ui/ui";

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
