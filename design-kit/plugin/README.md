# Powers Design Kit — Figma plugin (phase 3)

Runs **inside Figma**, so it can create/update **Local Variables** without Enterprise REST API.

## What it does

| Action | Effect |
|---|---|
| **Sync Variables** | Creates/updates `Powers / dual` and `Powers / instrument` collections (light/dark) from `tokens/export/figma-variables.json` (baked in at build) |
| **Audit catalog** | Compares component names in the open file to the 49-name catalog |
| **Create stubs** | Adds missing catalog names as simple components on page `Generated stubs` |

## Build

```bash
# from monorepo root
pnpm design-kit:plugin:build
```

Outputs `design-kit/plugin/dist/`.

## Install in Figma (one-time)

1. Open **Powers UI Kit** in Figma.  
2. Menu → **Plugins → Development → Import plugin from manifest…**  
3. Choose:

   `…/power-ui/design-kit/plugin/manifest.json`

4. Run **Plugins → Development → Powers Design Kit**.

After token/catalog changes in the repo:

```bash
pnpm design-kit:build && pnpm design-kit:plugin:build
```

Then re-run the plugin (rebuild embeds fresh data).

## Recommended run order

1. **Sync Variables**  
2. **Audit catalog** (expect 0 missing)  
3. Manually re-bind any weak components (Text, Dialog) to Variables if needed  
4. Publish library (see `../PUBLISH_LIBRARY.md`)

## Note

Stubs are placeholders only — your file already has full components; use stubs only if audit reports gaps.
