# Powers

**Fine-grained UI kit with a design system built in.**

Signals, ownership, and near-zero runtime — plus tokens, primitives, and demos you can ship from. Not “React + a CSS framework”; one coherent stack.

| | |
|---|---|
| **Try it** | [lab206.com](https://lab206.com) — Lab · Docs · System · product demos |
| **Figma** | Library **Powers UI Kit** · [Community plugin](https://www.figma.com/community/plugin/1671016490810398688) |
| **License** | [BSL-1.1](./LICENSE) (**source-available**, not OSI open source) · [Commercial](./LICENSE-COMMERCIAL.md) |
| **npm** | `@powers/*` — still **`private: true`** until a deliberate public cut |

---

## Start here

1. **See products** — [lab206.com](https://lab206.com) · [/workspace](https://lab206.com/workspace/) (designlab206) · [/hearth](https://lab206.com/hearth/)  
2. **Design** — enable **Powers UI Kit** in Figma Assets · install [Powers Design Kit](https://www.figma.com/community/plugin/1671016490810398688)  
3. **Learn** — [Lab · Start here](https://lab206.com/lab?recipe=hello) · [Docs](https://lab206.com/docs) · [System](https://lab206.com/system)

Hub in-repo: [GETTING_STARTED](./docs/GETTING_STARTED.md) · [GOLDEN_PATH](./docs/GOLDEN_PATH.md) · [USABILITY](./docs/USABILITY.md) · [LICENSING](./docs/LICENSING.md)

---

## Clone & run (from source)

Packages are not on the public registry yet. Develop against this monorepo:

```bash
git clone https://github.com/spowers2/powers.git
cd powers
pnpm install
pnpm example:browser     # Lab · Docs · System  → http://localhost:5173
pnpm example:starter     # designlab206         → http://localhost:5180
pnpm example:restaurant  # Hearth               → http://localhost:5181
pnpm run check           # typecheck · test · size budgets
```

Scaffold an app inside the workspace:

```bash
pnpm create-app my-ui      # minimal Vite + form + theme
pnpm new-app my-feature    # fuller product starter
```

Ship a static site (e.g. lab206.com):

```bash
pnpm build:lab206          # → sites/lab206.com.zip
```

See [docs/DEPLOY.md](./docs/DEPLOY.md) · [docs/LAB206_LIVECODE.md](./docs/LAB206_LIVECODE.md).

---

## Packages

| Package | Role |
|---|---|
| `@powers/core` | signals, computed, effect, store, resource, ownership |
| `@powers/animate` | tween / spring on signals |
| `@powers/dom` | mount, h, JSX, reactive props, Show, For |
| `@powers/router` | createRouter, Link, navigate |
| `@powers/ssr` | `renderToString` + islands hydrate API |
| `@powers/ui` | tokens + primitives + theme / density |

### Sketch

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

**Retheme:** edit `packages/ui/src/styles/tokens.css` · [DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md)

---

## Design kit & Figma

- **Library:** **Powers UI Kit** (publish/enable in Assets)  
- **Plugin (live):** [Powers Design Kit on Community](https://www.figma.com/community/plugin/1671016490810398688) — Sync Variables · Audit · Stubs  
- **Repo:** [`design-kit/`](./design-kit/README.md) · [FIGMA.md](./design-kit/FIGMA.md)

```bash
pnpm design-kit:build && pnpm design-kit:plugin:build
```

---

## Docs

| Doc | Topic |
|---|---|
| [LEARN.md](./docs/LEARN.md) | 10-minute mental model |
| [OFFER.md](./docs/OFFER.md) | Free vs paid (commercial / Pro) |
| [GOVERNMENT.md](./docs/GOVERNMENT.md) | Public sector — UI layer, not FedRAMP |
| [DEPLOY.md](./docs/DEPLOY.md) | Static hosting |
| [RELEASE.md](./docs/RELEASE.md) | Public / npm checklist |
| [STYLING.md](./docs/STYLING.md) · [DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) | Tokens & primitives |
| [POWER_LAB.md](./docs/POWER_LAB.md) | Lab playground |
| [SECURITY.md](./SECURITY.md) | Reporting · XSS/CSP notes |

---

## Contact

- **Email (lab206 / Powers):** [scott@lab206.com](mailto:scott@lab206.com?subject=Powers%20%E2%80%94%20contact)  
- **GitHub Issues:** [new issue](https://github.com/spowers2/powers/issues/new)  
- **Commercial / license:** [LICENSE-COMMERCIAL.md](./LICENSE-COMMERCIAL.md) · [scott@lab206.com](mailto:scott@lab206.com?subject=Powers%20commercial%20license) (GitHub profile mail: spowers2@me.com also fine)

Also on [lab206.com](https://lab206.com) — nav and footer **Contact**.

## License & commercial

**Business Source License 1.1** © Scott Powers

- **Free under BSL:** build apps and client work **with** Powers  
- **Not free:** ship a **competing UI kit / design system** based on Powers  
- **Commercial / Pro:** [LICENSE-COMMERCIAL.md](./LICENSE-COMMERCIAL.md) · [docs/OFFER.md](./docs/OFFER.md)

Say **source-available (BSL)**, not “open source,” until a Change Date flips a version to Apache-2.0 (see [LICENSE](./LICENSE)).

Trademark: the name **Powers** — [TRADEMARKS.md](./docs/TRADEMARKS.md).

---

## Scripts

| Command | What |
|---|---|
| `pnpm run check` | typecheck · test · size |
| `pnpm example:browser` | Lab · Docs · System |
| `pnpm example:starter` | designlab206 |
| `pnpm example:restaurant` | Hearth |
| `pnpm build:lab206` | Static zip for lab206.com |
| `pnpm design-kit:build` | Tokens + catalog |
| `pnpm design-kit:plugin:build` | Figma plugin bundle |

**Engines:** Node `>=20` (CI: Node 22).

---

## Status

- **App stack v1** — core · animate · DOM/JSX · router · SSR foundation · UI design system  
- **Public demos** — [lab206.com](https://lab206.com)  
- **npm** — not published yet; use this repo / workspace  
- **Announce draft** — [docs/ANNOUNCE.md](./docs/ANNOUNCE.md)
