# Figma plugin (phase 3)

Not built yet. Planned flow:

1. `pnpm design-kit:build` regenerates `tokens/export/figma-variables.json`  
2. Plugin (run inside Figma) reads that file (or a published URL)  
3. Creates **Variable collections** for instrument + dual (light/dark modes)  
4. Later: builds **component sets** from `components/*.spec.json`

## Why not now

Phase 1 is importable today via **Tokens Studio** without a custom plugin.  
The plugin is for one-click rebuild when tokens/components change.

## Scaffold (when we start)

```
plugin/
  manifest.json
  code.ts          # Figma main thread
  ui.html          # optional UI
  package.json
```

Will consume: `../tokens/export/figma-variables.json` + `../components/*.spec.json`.

## Status

Waiting on phase 1 (done) + phase 2 specs.
