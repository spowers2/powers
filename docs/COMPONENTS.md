# Creating & customizing components

Powers is designed so **new primitives are cheap** and **brand overrides don’t require forking**.

---

## 30-second recipe

```tsx
import { component, type ComponentProps } from "@lab206/dom";
import { cx } from "@lab206/ui";
import { createStyleSheet } from "@lab206/ui";

const ensure = createStyleSheet(
  "my-widget",
  `
.pu-my-widget {
  padding: var(--pu-space-3);
  border-radius: var(--pu-radius-md);
  background: var(--pu-color-surface);
  border: 1px solid var(--pu-color-border);
  color: var(--pu-color-text);
}
.pu-my-widget--loud {
  background: color-mix(in srgb, var(--pu-color-accent) 12%, transparent);
  color: var(--pu-color-accent);
}
`,
);

export type MyWidgetProps = {
  loud?: boolean;
  class?: string | (() => string);
  children?: unknown;
};

export const MyWidget = component((raw: MyWidgetProps) => {
  ensure();
  const props = raw as ComponentProps<MyWidgetProps>;
  return (
    <div
      class={() =>
        cx(
          "pu-my-widget",
          props.loud && "pu-my-widget--loud",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      ref={(el) => ensure(el.ownerDocument)}
    >
      {props.children as never}
    </div>
  );
});
```

**Rules of thumb**

1. **Prefix classes** with `pu-` and inject once via `createStyleSheet(id, css)`.
2. Call `ensure()` at setup **and** `ensure(el.ownerDocument)` on the root `ref` (Lab iframes need this).
3. Prefer **CSS variables** (`var(--pu-color-accent)`) over hard-coded colors.
4. Accept `class` as `string | (() => string)` and merge with `cx`.
5. For reactive props, read accessors inside `() => …` class/style functions.

---

## Customize without rewriting

### 1. Tokens (global brand)

Edit `packages/ui/src/styles/tokens.css`:

- Blues / ink: `--pu-brand-*`
- Lime accent: `--pu-sage-*` / success greens (`#69BE28`)

### 2. Local CSS variables

```tsx
import { styleVars, Card } from "@lab206/ui";

<Card style={styleVars({ "pu-color-accent": "#69BE28" })}>
  Scoped accent for this branch of the tree
</Card>
```

### 3. Class overrides

Every primitive accepts `class`. Compose utilities or your own CSS:

```tsx
<Button class="my-cta" variant="solid">Ship</Button>
```

```css
.my-cta { letter-spacing: 0.04em; text-transform: uppercase; }
```

### 4. Density & theme

```ts
createTheme("dark").bind();
createDensity("compact").bind();
```

---

## Overlay / a11y helpers

| Helper | Use when |
|---|---|
| `trapFocus(root)` | Low-level Tab cycle inside a root (used by `attachOverlay`) |
| `attachOverlay({…})` | Shared layer: Escape stack · scroll-lock refcount · focus trap · outside dismiss |
| `Transition` | Enter/exit CSS phases (`pu-fade`, `pu-collapse`) |
| `Collapse` | Height animate open/close (`grid-template-rows: 0fr → 1fr`) |

Listen for Escape / backdrop on the **ownerDocument** (works inside Lab iframes).

---

## Kit map (more than Bootstrap)

| Group | Components |
|---|---|
| Layout | `Stack` `Grid` `Container` `Divider` `AspectRatio` `ScrollArea` `Collapse` |
| Type | `Text` `Code` `Kbd` `Link` |
| Forms | `Button` `Input` `Textarea` `Select` `Field` `Label` `Switch` `Checkbox` `RadioGroup` `Slider` `NumberInput` `ToggleGroup` `Combobox` |
| Surfaces | `Card` `Badge` `Chip` `Avatar` |
| Feedback | `Alert` `Spinner` `Progress` `Skeleton` `Empty` `Stat` `Toaster` |
| Structure | `Tabs` `Accordion` `Breadcrumb` `Pagination` `Steps` `Timeline` `List` `Table` |
| Overlays | `Dialog` `Drawer` `Tooltip` `Popover` `Menu` `Command` |
| Motion | `Transition` (+ `@lab206/animate` springs) |
| Authoring | `createStyleSheet` `styleVars` `trapFocus` `cx` |

React ships **no** UI kit. Bootstrap covers forms/nav/overlay well — Powers adds **product primitives** (Stat, Timeline, Steps, Empty, Command, Combobox, ToggleGroup, Table, List, Chip, NumberInput, AspectRatio, ScrollArea, Collapse, Transition) on a fine-grained reactive core.

---

## Export checklist

1. Add file under `packages/ui/src/components/YourThing.tsx`
2. Export from `packages/ui/src/index.ts`
3. Warm styles in `examples/browser/src/lab/warmStyles.ts` (so Lab iframe gets CSS)
4. Optional: System catalog card + Lab recipe
5. Optional: smoke test in `ui.test.ts`

See also: [STYLING.md](./STYLING.md) · [API.md](./API.md) · [LEARN.md](./LEARN.md)
