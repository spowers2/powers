# Powers

**Fine-grained UI kit with a design system built in.**

Signals, ownership, and near-zero runtime — plus tokens, primitives, and demos you can ship from. Not “React + a CSS framework”; one coherent stack.

> Named for **Powers** — the kit behind the name.  
> Status: **App stack v1** — core · animate · DOM/JSX · router · SSR foundation · **design system**.  
> Private monorepo while foundations harden (not on public npm yet).  
> npm scope: `@powers/*`  
> **License:** [Business Source License 1.1](./LICENSE) (source-available) · [Commercial](./LICENSE-COMMERCIAL.md) · [Licensing model](./docs/LICENSING.md) · [Trademarks](./docs/TRADEMARKS.md)

**New here?**

1. **Docs / Lab / System:** `pnpm example:browser` → http://localhost:5173 (`/docs` · `/lab` · `/system`)  
2. **designlab206:** `pnpm example:starter` → http://localhost:5180  
3. **Hearth restaurant:** `pnpm example:restaurant` → http://localhost:5181  
4. Hub: **[docs/GETTING_STARTED.md](./docs/GETTING_STARTED.md)** · [docs/README.md](./docs/README.md) · [docs/RELEASE.md](./docs/RELEASE.md)

### Design kit & Figma

Tokens, component catalog, and Community plugin live under **[`design-kit/`](./design-kit/README.md)**.

```bash
pnpm design-kit:build          # tokens + catalog export
pnpm design-kit:plugin:build   # Figma plugin → design-kit/plugin/dist
pnpm design-kit:figma-audit    # optional; needs .env.local + Figma PAT
```

Import the plugin in Figma via **`design-kit/plugin/manifest.json`** (Development).  
Library publish checklist: [`design-kit/PUBLISH_LIBRARY.md`](./design-kit/PUBLISH_LIBRARY.md).

> **npm:** `@powers/*` packages are **`private: true`** until a deliberate public cut. Do not `npm publish` yet. Exports currently point at TypeScript source for monorepo DX.

---

## Packages

| Package | Role |
|---|---|
| `@powers/core` | signals, computed, effect, store, resource, ownership |
| `@powers/animate` | tween / spring on signals |
| `@powers/dom` | mount, h, JSX, reactive props, Show, For |
| `@powers/router` | createRouter, Link, navigate |
| `@powers/ssr` | `renderToString` + **islands** hydrate API |
| `@powers/ui` | **integrated styling** — tokens + primitives + BEM-ish utilities |

---

## Quick start

```bash
cd path/to/powers   # monorepo root
pnpm install
pnpm run check        # typecheck · test · size budgets (use "run" — pnpm has its own "ci")
pnpm example:browser  # http://localhost:5173  — docs · lab · system
pnpm example:starter  # http://localhost:5180  — designlab206
pnpm example:restaurant  # http://localhost:5181  — Hearth
# Minimal Vite app:           pnpm create-app my-app
# Full product starter:       pnpm new-app my-feature
```

**Library quality:** [docs/USABILITY.md](./docs/USABILITY.md) · [docs/FOUNDATION.md](./docs/FOUNDATION.md) · [docs/STABLE.md](./docs/STABLE.md) · [docs/GOLDEN_PATH.md](./docs/GOLDEN_PATH.md) · [docs/SIZE.md](./docs/SIZE.md)

### Design system + router (sketch)

```tsx
import "@powers/ui/theme.css";
import { mount } from "@powers/dom";
import { createRouter, Link } from "@powers/router";
import { Button, Card, Stack, Text, createTheme } from "@powers/ui";

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
| `pnpm design-kit:build` | Tokens + Figma catalog |
| `pnpm design-kit:plugin:build` | Figma plugin bundle |
| `pnpm design-kit:figma-audit` | Live Figma ↔ catalog (local PAT) |

**Engines:** Node `>=20` (CI runs **Node 22**).

---

## License

**Business Source License 1.1** © Scott Powers  

Source-available: free for building apps; not free to ship a competing UI kit.  
See [LICENSE](./LICENSE), [LICENSE-COMMERCIAL.md](./LICENSE-COMMERCIAL.md), [NOTICE](./NOTICE), [docs/LICENSING.md](./docs/LICENSING.md), and [docs/TRADEMARKS.md](./docs/TRADEMARKS.md) (the **Powers** name).
