# Styling in Power UI

**Product stance:** Power UI is the **runtime and the look**.  
One install should be enough to ship a coherent UI. External CSS frameworks are optional, not required.

**Default palette:** **deep ink blue + forest green** on quiet graphite neutrals (no neon).  
Retheme entirely by editing `packages/ui/src/styles/tokens.css`.

---

## Three layers

```
1. Tokens        →  contracts (--pu-*)
2. Primitives    →  components (Button, Field, Stack…)
3. Utilities     →  small BEM-ish helpers (optional)
```

### 1. Tokens (source of truth)

**File:** `packages/ui/src/styles/tokens.css`

| Concern | Mechanism |
|---|---|
| Brand / neutrals / semantic color | CSS variables |
| Space, radius, type, elevation | CSS variables |
| Light / dark | `data-pu-theme` on `<html>` (`createTheme`) |
| Comfortable / compact | `data-pu-density` (`createDensity`) |

**Rule:** primitives never hard-code hex; they only use `--pu-*`.

```ts
import "@power-ui/ui/theme.css"; // tokens + base + utilities
import { createTheme, createDensity } from "@power-ui/ui";

createTheme("dark").bind();
createDensity("comfortable").bind();
```

Minimal CSS (no utilities):

```ts
import "@power-ui/ui/tokens.css";
import "@power-ui/ui/base.css";
```

### 2. Primitives (default way to build UI)

Use `@power-ui/ui` components. They own structure, a11y patterns, and `pu-*` classes:

```tsx
import { Button, Stack, Card, Field, Input } from "@power-ui/ui";

<Card>
  <Stack gap={3}>
    <Field label="Email">
      <Input type="email" />
    </Field>
    <Button>Save</Button>
  </Stack>
</Card>
```

This is the Bootstrap *component* story — complete controls that match — without a separate framework.

### 3. Utilities (optional, BEM-flavored)

**File:** `packages/ui/src/styles/utilities.css`  
**Import:** included in `theme.css`, or `@power-ui/ui/utilities.css`

```html
<div class="pu-flex pu-flex--row pu-items-center pu-gap-3 pu-p-4">
  <span class="pu-text-muted pu-text-sm">Status</span>
</div>
```

| Do | Don’t |
|---|---|
| Token-mapped scales (`pu-gap-3`) | Arbitrary `mt-[13px]` soup |
| BEM-ish names (`pu-flex--row`) | Competing with full Tailwind |
| One-off layout | Replacing Button/Field |

---

## Why not “React + Tailwind” as the default?

That split is historical: React solved components; CSS came from elsewhere.

For Power UI it would mean:

- Two docs / two mental models  
- Token drift (Tailwind config vs `--pu-*`)  
- Weaker Lab (“install Power + Tailwind + configure…”)  
- Weaker “just works” product story  

**Advanced users can still use Tailwind or custom BEM alongside** — real DOM, normal cascade. Power does not fight that. It simply does not *require* it.

---

## Compared to Bootstrap / Tailwind / BEM

| Tool | What we take | What we skip |
|---|---|---|
| Bootstrap | Complete form/nav/component kits | Cloning its look or JS plugins |
| Tailwind | Fast composition | Infinite arbitrary utilities as core |
| BEM | Naming discipline for `pu-*` | Ceremony without tokens |

---

## Escape hatches

1. Plain CSS files — always fine  
2. Your own BEM — use tokens: `color: var(--pu-color-accent)`  
3. Tailwind (optional) — coexistence, not a dependency  
4. Headless later — unstyled primitives if the ecosystem needs them  

---

## Mental model (one sentence)

> **Write signals for behavior. Use primitives for UI. Edit tokens to rebrand. Sprinkle utilities only when layout needs a one-liner.**

## Public learning path

1. [docs/README.md](./README.md) — hub  
2. [LEARN.md](./LEARN.md) — runtime  
3. This file — styling  
4. [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) — primitive list  
5. Demo `/system` + Power Lab recipe **“Tokens & utilities”**  

See also: Power Lab ([POWER_LAB.md](./POWER_LAB.md)).
