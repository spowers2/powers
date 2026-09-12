# Getting started

**Fastest path:** scaffold → first screen (under 10 minutes).

This is the **public start page**. Then Lab: https://lab206.com/lab?recipe=hello

## 1. Create an app

```bash
pnpm create powers my-app
# or: npm create powers@latest my-app
cd my-app
pnpm install
pnpm dev   # → http://localhost:5190
```

You get a themed form (`createField` + `bind`) and a light/dark toggle using `@lab206/core`, `@lab206/dom`, and `@lab206/ui`. Vite is already wired with `plugins: [powers()]`.

## 2. Or add to an existing Vite app

```bash
pnpm add @lab206/core @lab206/dom @lab206/ui
```

Use **`@lab206/*@0.1.9+`**. Older tags break Vite (`React is not defined`), Dialog form caret (pre-0.1.5), or lack `createApiClient` (pre-0.1.6). `powers()` requires **0.1.9**. See [NPM.md](./NPM.md).

**`tsconfig.json`:**

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@lab206/dom"
  }
}
```

**`vite.config.ts`:** Vite ignores tsconfig for JSX. Use the plugin — do not install React.

```ts
import { defineConfig } from "vite";
import { powers } from "@lab206/dom/vite";

export default defineConfig({
  plugins: [powers()],
});
```

If `jsxImportSource` is overridden to something else, **build throws** instead of `React is not defined`.

```tsx
import "@lab206/ui/theme.css";
import { mount } from "@lab206/dom";
import { Button, createTheme } from "@lab206/ui";

createTheme("light").bind();
mount(document.getElementById("root")!, () => (
  <Button onClick={() => alert("Powers")}>Hello</Button>
));
```

More: [NPM.md](./NPM.md) · [FORMS.md](./FORMS.md)

## 3. Learn on lab206.com

| Goal | Link |
|---|---|
| Lab Start here (~10 min) | https://lab206.com/lab?recipe=hello |
| Docs (API + patterns) | https://lab206.com/docs |
| System (every component) | https://lab206.com/system |
| **Flagship product** | [designlab206.com](https://designlab206.com/) (`pnpm example:starter`) |
| Restaurant Power | https://lab206.com/hearth/ (`pnpm example:restaurant`) — URL `/hearth/` is stable |
| Logistics Power · Bank Power | https://lab206.com/logistics/ · https://lab206.com/bank/ |
| Five words (`signal` … `resource`) | [LEARN.md](./LEARN.md) |
| Figma | [Powers Design Kit plugin](https://www.figma.com/community/plugin/1671016490810398688) |

## 4. Put it online

```bash
pnpm build
pnpm deploy:zip   # → site-upload.zip
```

[DEPLOY.md](./DEPLOY.md) · free vs paid: [OFFER.md](./OFFER.md)

---

## From source (contributors)

```bash
git clone https://github.com/spowers2/powers.git
cd powers
pnpm install
pnpm example:browser     # Lab · Docs · System  → :5173
pnpm example:starter     # designlab206 (flagship) → :5180
pnpm example:restaurant  # Restaurant Power        → :5181
pnpm run check           # typecheck · test · size budgets
```
