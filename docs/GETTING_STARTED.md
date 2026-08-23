# Getting started

**Fastest path:** scaffold → install → first screen (&lt; 10 minutes).

## 1. Create an app

```bash
pnpm create powers my-app
# or: npm create powers@latest my-app
cd my-app
pnpm install
pnpm dev   # → http://localhost:5190
```

You get a themed form (`createField` + `bind`) and a light/dark toggle using `@lab206/core`, `@lab206/dom`, and `@lab206/ui`.

## 2. Or add to an existing Vite app

```bash
pnpm add @lab206/core @lab206/dom @lab206/ui
```

Wire JSX once:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@lab206/dom"
  }
}
```

```ts
// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@lab206/dom",
  },
});
```

```tsx
import "@lab206/ui/theme.css";
import { mount } from "@lab206/dom";
import { Button, createTheme } from "@lab206/ui";

createTheme("light").bind();
mount(document.getElementById("root")!, () => (
  <Button onClick={() => alert("Powers")}>Hello</Button>
));
```

More: [NPM.md](./NPM.md) · [GOLDEN_PATH.md](./GOLDEN_PATH.md) · [FORMS.md](./FORMS.md)

## 3. Learn on lab206.com

| Goal | Link |
|---|---|
| Lab Start here (~10 min) | https://lab206.com/lab?recipe=hello |
| Docs (API + patterns) | https://lab206.com/docs |
| System (every component) | https://lab206.com/system |
| designlab206 demo | https://lab206.com/workspace/ |
| Hearth demo | https://lab206.com/hearth/ |
| Figma | [Powers Design Kit plugin](https://www.figma.com/community/plugin/1671016490810398688) |

Rules: [USABILITY.md](./USABILITY.md) · Day 1/2/30: [LEARN_PATH.md](./LEARN_PATH.md)

## 4. Put it online

```bash
pnpm build
pnpm deploy:zip   # → site-upload.zip
```

Upload to any static host — [DEPLOY.md](./DEPLOY.md).  
Free vs paid: [OFFER.md](./OFFER.md).

---

## From source (contributors)

```bash
git clone https://github.com/spowers2/powers.git
cd powers
pnpm install
pnpm example:browser     # Lab · Docs · System  → :5173
pnpm example:starter     # designlab206         → :5180
pnpm example:restaurant  # Hearth               → :5181
pnpm create-app hello-ui # workspace-linked scaffold under examples/
```
