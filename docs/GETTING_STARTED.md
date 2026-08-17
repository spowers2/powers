# Getting started (private monorepo)

You are **not** on public npm yet. Develop against workspace packages.

## 10-minute path (recommended first)

```bash
cd powers   # monorepo root
pnpm install
pnpm example:browser   # http://localhost:5173
```

1. Open **http://localhost:5173/lab**  
2. In the sidebar **Start here**, run in order:  
   - **Hello Powers** — signals + button  
   - **Form validation** — `bind={signal}`  
   - **Tokens & utilities** — theme toggle  
3. Then browse **System** (Copy JSX) or **Docs**.

Rules that prevent most bugs: [USABILITY.md](./USABILITY.md) · full walkthrough: [GOLDEN_PATH.md](./GOLDEN_PATH.md).

## Paths

| Goal | Command / route |
|---|---|
| **Lab (learn)** | `pnpm example:browser` → `/lab` (Start here) |
| **designlab206** (freelance workspace) | `pnpm example:starter` → http://localhost:5180 |
| **Hearth** (restaurant) | `pnpm example:restaurant` → http://localhost:5181 |
| Design system + Docs | `pnpm example:browser` → `/docs` `/system` |
| New app from starter | `pnpm new-app my-feature` → `examples/my-feature` |
| Minimal Vite scaffold | `pnpm create-app hello-ui` |

## 1. Install once

```bash
cd powers
pnpm install
```

## 2. Preferred product demo: designlab206

```bash
pnpm example:starter
```

→ **http://localhost:5180**

**designlab206** is a local-first freelance workspace:

- Dashboard (pipeline $, outstanding invoices, paid YTD, hours this week)  
- Clients · Projects · Tasks · Invoices · **Time** (billable log → draft invoices)  
- Settings (profile, hourly rate, theme, reset seed data)  
- Persisted in `localStorage`  

Source: `examples/app-starter/`.

## 2b. Restaurant demo (Hearth)

```bash
pnpm example:restaurant
```

→ **http://localhost:5181**

**Hearth** is a neighborhood restaurant:

- Floor home with Unsplash hero + featured dishes  
- Menu (photos, 86 items, categories)  
- Reservations + kitchen service board + **table map**  
- Local `localStorage`  

Source: `examples/restaurant-demo/`.

### Minimal Vite app (recommended for learning)

```bash
pnpm create-app hello-ui
pnpm install
pnpm --filter @powers/hello-ui dev
# → http://localhost:5190  (form + theme + bind)
```

### Full product starter (clients / projects)

```bash
pnpm new-app billing-ui
pnpm install
pnpm --filter @powers/billing-ui dev
```

Or copy outside the repo (still private — keep `workspace:*` or `file:` deps until publish):

```bash
./scripts/new-app.sh ../experiments/dashboard
```

## 3. Authoring loop (components)

1. `pnpm example:browser` → **System**  
2. **Copy JSX** or **Open Lab** (snippet is a full program)  
3. Paste into `examples/app-starter/src/pages/…`  
4. Retheme: `packages/ui/src/styles/tokens.css`

## 4. App shape (reference)

```tsx
import { signal } from "@powers/core";
import { mount } from "@powers/dom";
import {
  createTheme,
  Button,
  Card,
  Stack,
  Text,
  Field,
  Input,
} from "@powers/ui";
import "@powers/ui/theme.css";

const theme = createTheme("light");
theme.bind();
const name = signal("");

mount(document.getElementById("root")!, () => (
  <Card>
    <Stack gap={3}>
      <Text as="h1" size="xl">Hello</Text>
      <Field label="Name">
        <Input bind={name} placeholder="Your name" />
      </Field>
      <Text muted size="sm">{() => name() || "…"}</Text>
      <Button onClick={() => theme.toggle()}>Theme</Button>
    </Stack>
  </Card>
));
```

**Usability patterns (bind, router, lists):** [USABILITY.md](./USABILITY.md)

**tsconfig / Vite JSX**

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@powers/dom"
  }
}
```

```ts
// vite.config.ts
esbuild: { jsx: "automatic", jsxImportSource: "@powers/dom" }
```

## 5. Forms & motion

- [FORMS.md](./FORMS.md)  
- [MOTION.md](./MOTION.md)  
- [COMPONENTS.md](./COMPONENTS.md)  

Lab: `/lab?recipe=form` · `/lab?recipe=motion`

## 6. Public later (not now)

When you *do* open-source or publish:

1. Harden the starter  
2. Follow [RELEASE.md](./RELEASE.md)  
3. Swap `workspace:*` for versioned packages  

Until then: **starter + browser demo** are the product surface for DX.
