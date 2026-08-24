# Golden path — first polished screen (~15 minutes)

**Goal:** A themed form that *actually works* (live validation, no remount weirdness).

```bash
pnpm create powers my-app && cd my-app && pnpm install && pnpm dev
```

Or learn in the browser: https://lab206.com/lab?recipe=hello

---

## 1. Lab Start here (2 min)

Open **https://lab206.com/lab** → sidebar **Start here**:

| # | Recipe | URL |
|---|---|---|
| 1 | Hello Powers | `/lab?recipe=hello` |
| 2 | Form validation | `/lab?recipe=form` |
| 3 | Tokens & theme | `/lab?recipe=tokens` |

Then: System (**Copy JSX**) · Docs · product demos on lab206.com.

---

## 2. Three rules (1 min)

1. Read signals with `count()` · write with `.set` / `.update`  
2. Live JSX needs an accessor: `{() => count()}` or pass the **signal** into controls  
3. Prefer primitives + `tokens.css` — don’t invent a second design system  

Runtime contracts (why forms stay mounted): [`FOUNDATION.md`](./FOUNDATION.md).

---

## 3. Vite + Powers sketch (5 min)

`tsconfig` (relevant bits):

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@lab206/dom"
  }
}
```

`vite.config.ts`:

```ts
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@lab206/dom", // not React
  },
  optimizeDeps: {
    include: ["@lab206/core", "@lab206/dom", "@lab206/ui"],
  },
});
```

`main.tsx`:

```tsx
import "@lab206/ui/theme.css";
import { signal } from "@lab206/core";
import { mount } from "@lab206/dom";
import {
  Button,
  Card,
  Field,
  Input,
  Stack,
  Text,
  createTheme,
  required,
  emailFormat,
  firstError,
} from "@lab206/ui";

createTheme(
  matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
).bind();

const email = signal("");
const emailError = () =>
  firstError(required(email(), "Email required"), emailFormat(email()));

mount(document.getElementById("root")!, () => (
  <Card>
    <Stack gap={4}>
      <Text as="h1" size="xl">
        Hello Powers
      </Text>
      <Field label="Email" required error={emailError}>
        <Input
          type="email"
          value={email}
          onInput={(e) =>
            email.set((e.target as HTMLInputElement).value)
          }
        />
      </Field>
      <Button
        disabled={() => !!emailError() || !email()}
        onClick={() => alert(email())}
      >
        Continue
      </Button>
    </Stack>
  </Card>
));
```

**Do not** write `value={email()}` — that snapshots once and breaks typing.

Prefer `createField` + `bind` (what `pnpm create powers` scaffolds). See [FORMS.md](./FORMS.md).

---

## 4. Retheme (2 min)

Powers ships CSS variables on `:root` via `@lab206/ui/theme.css`. Override in your app CSS:

```css
:root {
  --pu-brand-500: #2563eb;
  --pu-sage-500: #69be28;
}
```

In the monorepo, the source tokens live in `packages/ui/src/styles/tokens.css`.

---

## 5. Add a route (3 min)

```tsx
import { createRouter, Link } from "@lab206/router";

const router = createRouter({
  routes: [
    { path: "/", component: () => <Home /> },
    { path: "/settings", component: () => <Settings /> },
  ],
});

// In shell:
<nav>
  <Link router={router} to="/" exact>
    Home
  </Link>
  <Link router={router} to="/settings">
    Settings
  </Link>
</nav>
<main>{router.outlet()}</main>
```

Outlet remounts only when the **path** changes — form state on the page is safe (FOUNDATION).

---

## 6. Optional next rungs

| Want | Go |
|---|---|
| Drawers / dialogs | `Drawer` · `Dialog` (shared `attachOverlay`) |
| Async data | `resource()` + Lab **Async** recipe |
| Full product patterns | designlab206 `:5180` · Hearth `:5181` |
| New primitive | [`COMPONENTS.md`](./COMPONENTS.md) |

---

## Checklist: “it feels right”

- [ ] Typing in Input does not scroll-jump or remount the page  
- [ ] Field error appears without `role="alert"` thrash  
- [ ] Theme toggle works (if you wired `createTheme`)  
- [ ] `pnpm size` still green after your changes  

If something feels broken, check FOUNDATION contracts before adding workarounds.
