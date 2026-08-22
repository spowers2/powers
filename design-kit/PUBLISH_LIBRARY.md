# Publish Powers UI Kit as a Figma library

**Status:** library is **published** (2026-08). Use this doc for republish after kit changes.

## First publish / republish (Figma UI)

1. Open **Powers UI Kit** (source file).  
2. **Assets** → **Publish library** / **Publish changes**.  
3. If **Invalid assets** appears, expand it and fix each item (see below) before publishing.  
4. Include all kit components you want shared.  
5. Publish.

### Invalid assets (common: unused properties)

Figma blocks (or warns on) library components that define **component properties that are not applied to any layer**.

**Known case: `Card`**

| Property | Type | Problem |
|---|---|---|
| `Padded` | boolean | Defined but not linked to padding / any layer |
| `Interactive` | boolean | Defined but not linked to any layer |

`Variant` (`default` / `glass` / `elevated` / `soft`) is fine.

**Fix in Figma (2 minutes):**

1. Open the **Card** component set (Assets → Card, or select it on the Components page).  
2. Right sidebar → **Properties**.  
3. Delete **`Padded`** and **`Interactive`** (⋯ → Delete), **or** wire them to layers (visibility / content) so they are “used”.  
4. Fastest for publish: **delete** the two unused booleans.  
5. Re-open **Publish library** — Card should leave Invalid assets.  

Code still supports `padded` / `interactive` on `<Card />`; they just aren’t Figma instance props until you rebuild them as real variants later.

## Use in product files

1. **File → New design file** (e.g. product screens — not the kit).  
2. Assets → enable **Powers UI Kit**.  
3. Drag **instances**:
   - `Button` (Variant / Size)  
   - `Input` · `Field`  
   - `Card` · `Text` · `Dialog`  
4. Confirm purple **instance** badge (not detached).  
5. Variables: prefer `color/*`, `space/*`, `radius/*` from the kit.

## After code token changes

```bash
pnpm design-kit:build && pnpm design-kit:plugin:build
```

1. Kit file → plugin **Sync Variables**  
2. **Publish library** again  
3. Product files accept updates when prompted  

## Team / folder

- Source of truth: **Powers UI Kit** file only  
- Product work: separate files consuming the library  
- See [FIGMA.md](./FIGMA.md) for file key and workflow
