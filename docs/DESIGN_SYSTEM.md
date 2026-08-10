# Design system (`@power-ui/ui`)

**Goal:** adaptable, editable, clear, easy to use — without locking you into one brand.

**Architecture:** Power UI owns styling as a **product pillar** (not an afterthought next to Tailwind).  
Full model: [`STYLING.md`](./STYLING.md) — tokens · primitives · optional utilities.

## 60-second start

```tsx
import "@power-ui/ui/theme.css";
import { Button, Stack, Text, Card, createTheme } from "@power-ui/ui";

const theme = createTheme("light");
theme.bind(); // sets data-pu-theme on <html>

function App() {
  return (
    <Card>
      <Stack gap={3}>
        <Text as="h2" size="xl">Hello</Text>
        <Button onClick={() => theme.toggle()}>Toggle theme</Button>
      </Stack>
    </Card>
  );
}
```

## How to retheme (primary edit surface)

**File:** `packages/ui/src/styles/tokens.css`

| Layer | What to edit |
|---|---|
| Brand scale | `--pu-brand-50` … `--pu-brand-900` |
| Neutrals | `--pu-gray-*` |
| Semantic colors | `--pu-color-bg`, `-surface`, `-text`, `-accent`, … |
| Space / radius / type | `--pu-space-*`, `--pu-radius-*`, `--pu-text-*` |
| Dark mode | `[data-pu-theme="dark"] { … }` overrides |
| Density | `[data-pu-density="compact"]` control heights + gaps |

```ts
const theme = createTheme("light");
theme.bind();
const density = createDensity("comfortable");
density.bind();
density.toggle(); // compact ↔ comfortable
```

Primitives **must** use semantic tokens (`--pu-color-accent`), not raw brand steps, so one token file restyles the app.

## Primitives (v0.1)

| Component | Role |
|---|---|
| `Button` | solid / soft / ghost / danger · sm/md/lg |
| `Input` | text field |
| `Stack` | flex layout + gap scale |
| `Text` | type ramp + muted |
| `Card` | surface panel · `default` / `glass` / `elevated` / `soft` |
| `Badge` | status / accent chips |
| `Container` | max-width page shell |
| `Grid` | responsive columns |
| `Code` | inline + block code |
| `Alert` | info / success / warning / danger messages |
| `Divider` | section rule (± label) |
| `Spinner` | loading indicator (a11y + reduced motion) |
| `Dialog` | modal + glass scrim · Escape / backdrop |
| `Tabs` | segmented pill track |
| `Progress` | 0–100 bar |
| `Skeleton` | shimmer loading placeholders |
| `Avatar` | initials / image |
| `Tooltip` | hover/focus tip |
| `Toaster` / `createToaster` | ephemeral toast stack |
| `Label` / `Field` | accessible form layout + hint/error |
| `Textarea` / `Select` | multi-line + dropdown |
| `Switch` / `Checkbox` | boolean controls |
| `createTheme` | light/dark (`data-pu-theme`) |
| `createDensity` | comfortable / compact (`data-pu-density`) |

## Rules for new primitives

1. Styles use **only** `--pu-*` tokens  
2. Inject scoped CSS once (`data-pu-ui="name"`) or share a sheet  
3. Props via `component` + `mergeProps`  
4. No hard-coded hex in component files  

## Roadmap for the system

See ordered plan in [`ROADMAP.md`](./ROADMAP.md) § “Design system expansion”.
