# Publish Powers UI Kit as a Figma library

**Status:** library is **published** (2026-08). Use this doc for republish after kit changes.

## First publish / republish (Figma UI)

1. Open **Powers UI Kit** (source file).  
2. **Assets** → **Publish library** / **Publish changes**.  
3. Include all kit components you want shared.  
4. Publish.

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
