# Build the Powers UI kit in Figma (phase 2)

You have a licensed Figma and use it regularly — this is the hand-build path.  
Phase 3 will automate Variables + components from the same JSON.

## Prerequisites

1. **Tokens imported** (phase 1) via Tokens Studio from  
   `design-kit/tokens/export/tokens.studio.json`  
   Enable **`dual/light`** first (product default). Also keep **instrument** sets available.
2. Fonts installed: **DM Sans**, **IBM Plex Mono**
3. Open the catalog:  
   - Human: [`export/index.md`](./export/index.md) + [`export/pages.md`](./export/pages.md)  
   - Machine: [`export/catalog.json`](./export/catalog.json)

## File structure (recommended)

| Page | Contents |
|---|---|
| **Cover** | Powers wordmark, version, theme switch note |
| **00 Tokens** | Color / space / type boards (from Variables) |
| **01 Foundations** | Text, Link, Kbd, Code, Divider |
| **02 Actions** | Button, ToggleGroup |
| **03 Forms** | Label → Field stack, all controls |
| **04 Data display** | Badge, Chip, Avatar, Card, Table, … |
| **05 Feedback** | Alert, Toast, Spinner, Tooltip |
| **06 Overlays** | Dialog, Drawer, Menu, Popover, Command |
| **07 Navigation** | Tabs, Breadcrumb, Pagination, Accordion |
| **08 Layout** | Stack, Grid, Container, ScrollArea, … |
| **99 Patterns** | Optional: login form, settings row, empty page |

Use **Auto layout** on everything interactive.

## Component set conventions

For each component in the catalog:

1. Create a **Component set** named exactly **`Name`** (e.g. `Button`, `Badge`).
2. Map catalog **properties** to Figma properties:
   - `kind: "variant"` → Variant property  
   - `kind: "boolean"` → Boolean  
   - `kind: "text"` → Text  
3. Bind fills / strokes / text / radii / spacing to **Variables** using the token paths  
   (Tokens Studio → Variables: `color/accent` ≈ path `color.accent`).
4. Include **states** listed in the catalog as either:
   - Interactive variants (`State=Default|Hover|Disabled|Focus`), or  
   - Separate documentation frames (hover) if you prefer lighter sets.
5. Put **sample content** from the catalog on the default instance.

### Axis order (keep consistent)

1. `Variant` / `Tone` (visual)  
2. `Size`  
3. `State` (if in the set)  
4. Boolean props (`Disabled`, `Checked`, …)

## Build order (do these first)

Full list is in `export/pages.md`. **Must-ship first:**

| Order | Component | Why |
|---|---|---|
| 1 | Text | Typography system |
| 10 | Button | Every pattern |
| 21 | Input | Forms |
| 25–27 | Checkbox, Radio, Switch | Forms |
| 40 | Badge | Status |
| 43 | Card | Layout surface |
| 60 | Alert | Feedback |
| 70 | Dialog | Overlays |
| 80 | Tabs | Navigation |

Then fill the rest of the catalog (~45 components total).

## Binding tokens (cheat sheet)

| CSS | Token path | Figma variable (typical) |
|---|---|---|
| `--pu-color-accent` | `color.accent` | `color/accent` |
| `--pu-color-surface` | `color.surface` | `color/surface` |
| `--pu-color-text` | `color.text` | `color/text` |
| `--pu-control-h-md` | `control.height.md` | `control/height/md` |
| `--pu-radius-md` | `radius.md` | `radius/md` |
| `--pu-space-4` | `space.4` | `space/4` |
| `--pu-text-sm` | `font.size.sm` | `font/size/sm` |

Resolved hex for mixed colors lives in the token export (no CSS `color-mix` in Figma).

## Light / dark + instrument / dual

- Prefer **Variables modes**: collection `Powers / dual` with modes `light` | `dark`.  
- Second collection `Powers / instrument` for the alternate palette.  
- Components should only reference **semantic** tokens (`color.accent`, not raw brand steps) so mode switches retheme the whole kit.

## Quality checklist

- [ ] Every catalog component exists as a Component or Component set  
- [ ] Names match `catalog.json` → `name` field (PascalCase)  
- [ ] Button has solid/soft/ghost/danger × sm/md/lg  
- [ ] Form controls share `control.height.md`  
- [ ] Focus rings use `color.focus`  
- [ ] No hard-coded brand hex on components (Variables only)  
- [ ] Cover notes version + `pnpm design-kit:build` date  
- [ ] Publish as **Team library** when ready (Pro SKU later)

## Syncing with code

| Changes in… | Update… |
|---|---|
| `packages/ui/.../tokens.css` | `design-kit/tokens/source.ts` → `pnpm design-kit:build` |
| New UI component / variant | `design-kit/components/catalog.ts` → `pnpm design-kit:build` |
| Figma-only polish | Optional notes in catalog `notes` field |

## Phase 3 (next)

Plugin will read:

- `tokens/export/figma-variables.json`  
- `components/export/catalog.json`  

…and create Variables + component sets automatically. Specs you build against now are the contract.
