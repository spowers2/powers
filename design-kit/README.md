# Powers design kit

Design-side companion to `@powers/ui`.

**Live Figma file:** see **[FIGMA.md](./FIGMA.md)** (file key, link, API env).

| Phase | Status | What |
|---|---|---|
| **1. Tokens** | **Ready** | Figma / Tokens Studio export of instrument + dual electric |
| **2. Component specs** | **Ready** | Full UI kit catalog + Figma build guide |
| **3. Figma file** | **Linked + audited** | [FIGMA.md](./FIGMA.md) · [QUALITY.md](./QUALITY.md) |
| **4. Figma plugin** | Scaffold only | One-click Variables + components |

```bash
pnpm design-kit:build         # tokens + component catalog
pnpm design-kit:figma-audit   # live Figma ↔ catalog (needs .env.local)
```

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

### Import with Tokens Studio (recommended)

Figma has **no built-in “Import tokens.”** Use the **Tokens Studio for Figma** plugin (tested with **v2.11.x**).

1. Install [Tokens Studio for Figma](https://tokens.studio/) from Community plugins.  
2. Open your Powers design file → **Run** Tokens Studio.  
3. Load `tokens/export/tokens.studio.json` (Load / Import from file — wording varies).  
4. You should see groups: **Color**, **Spacing**, **Border Radius**, **Font Size**, **Sizing**, etc.  
5. **Theme is optional.** If the Theme dropdown says **None** or is missing, ignore it.  
   - If you have multiple **sets** (`dual/light`, …), enable **`dual/light`**.  
   - If everything is one set, leave it on.  
6. Click **Styles & Variables** (bottom of the plugin) → create **Variables** (colors + numbers).  
7. In Figma (outside the plugin): open **Local variables** — you should see `color/…`, `space/…`, `radius/…`.  
8. Install **DM Sans** + **IBM Plex Mono** (or map fonts later).

**Smoke test:** rectangle fill → Variables → `color/accent` or `color/surface`.

Token sets in the JSON (when preserved as separate sets):

| Set | CSS equivalent |
|---|---|
| `instrument/light` | `:root` default |
| `instrument/dark` | `[data-pu-theme="dark"]` |
| `dual/light` | `html[data-pu-palette="dual"]` (product default) |
| `dual/dark` | `html[data-pu-palette="dual"][data-pu-theme="dark"]` |

Notes:

- Spacing / radius / type sizes are **px** (16px root; matches CSS rem).  
- CSS `color-mix(...)` is **pre-resolved** to hex/rgba in `tokens/source.ts`.  
- When you change `packages/ui/src/styles/tokens.css`, update `tokens/source.ts` and rebuild.  
- Free Tokens Studio is enough for Variables; “Get Pro” is not required for phase 1.

### Source of truth

| Runtime (apps) | Design export |
|---|---|
| `packages/ui/src/styles/tokens.css` | `design-kit/tokens/source.ts` → `tokens/export/*` |

Keep them in sync by hand for now (phase 1). A CSS→token extractor can come later.

## Phase 2 — build the Figma UI kit

1. Import tokens (phase 1) with Tokens Studio.  
2. Follow **[`components/FIGMA_BUILD.md`](./components/FIGMA_BUILD.md)**.  
3. Use the checklist: [`components/export/index.md`](./components/export/index.md).  
4. Per-component detail: [`components/export/pages.md`](./components/export/pages.md).  
5. Machine catalog: [`components/export/catalog.json`](./components/export/catalog.json).

Edit specs in [`components/catalog.ts`](./components/catalog.ts), then `pnpm design-kit:build`.

## Phase 3 (planned)

- Plugin scaffold: [`plugin/`](./plugin/)  
- Will consume `tokens/export/figma-variables.json` + `components/export/catalog.json`

Same token **paths** (`color.accent`, `control.height.md`, …) bind tokens, specs, and the future plugin.

## License

Same as the monorepo (**BUSL-1.1**). A paid **Powers Pro** design kit can later ship under a separate proprietary license; this folder is the foundation.
