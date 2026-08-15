# Powers design kit

Design-side companion to `@powers/ui`.

| Phase | Status | What |
|---|---|---|
| **1. Tokens** | **Ready** | Figma / Tokens Studio export of instrument + dual electric |
| **2. Component specs** | Scaffold only | JSON specs for Button, Card, … |
| **3. Figma plugin** | Scaffold only | One-click Variables + components |

## Phase 1 — import tokens into Figma

### Rebuild exports

```bash
# from monorepo root
pnpm design-kit:build
```

Writes:

| File | Use |
|---|---|
| [`tokens/export/tokens.studio.json`](./tokens/export/tokens.studio.json) | **Tokens Studio** → Import |
| [`tokens/export/figma-variables.json`](./tokens/export/figma-variables.json) | Future plugin + tooling |
| [`tokens/export/manifest.json`](./tokens/export/manifest.json) | Version metadata |

### Themes (token sets)

| Set | CSS equivalent |
|---|---|
| `instrument/light` | `:root` default |
| `instrument/dark` | `[data-pu-theme="dark"]` |
| `dual/light` | `html[data-pu-palette="dual"]` |
| `dual/dark` | `html[data-pu-palette="dual"][data-pu-theme="dark"]` |

### Import with Tokens Studio (recommended)

1. Install [Tokens Studio for Figma](https://tokens.studio/) (community plugin).  
2. Open your Powers design file.  
3. Tokens Studio → **Load from file / URL** → choose `tokens/export/tokens.studio.json`.  
4. Enable a theme set (start with **`dual/light`** — matches current product default).  
5. **Export to Figma** → create Variables / styles as you prefer.  
6. Install **DM Sans** + **IBM Plex Mono** on the machine (or swap fonts in Figma).

Notes:

- Spacing / radius / type sizes are **px** (16px root; matches CSS rem).  
- CSS `color-mix(...)` is **pre-resolved** to hex/rgba in `tokens/source.ts`.  
- When you change `packages/ui/src/styles/tokens.css`, update `tokens/source.ts` and rebuild.

### Source of truth

| Runtime (apps) | Design export |
|---|---|
| `packages/ui/src/styles/tokens.css` | `design-kit/tokens/source.ts` → `tokens/dist/*` |

Keep them in sync by hand for now (phase 1). A CSS→token extractor can come later.

## Phase 2 & 3 (planned)

- Specs: [`components/`](./components/)  
- Plugin: [`plugin/`](./plugin/)  

Same token **paths** (`color.accent`, `control.height.md`, …) will bind components and the plugin so nothing diverges.

## License

Same as the monorepo (**BUSL-1.1**). A paid **Powers Pro** design kit can later ship under a separate proprietary license; this folder is the foundation.
