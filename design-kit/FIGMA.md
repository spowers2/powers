# Powers Figma UI Kit

Visual source of truth for the design kit. Machine specs stay in this repo (`tokens/export`, `components/export`); the Figma file is the canvas library.

## Status (2026-08)

| Piece | Status |
|---|---|
| Source file **Powers UI Kit** | Live (file key below) |
| **Team / personal library** | **Published** — enable in Assets on product files |
| Figma plugin **Powers Design Kit** | Community submit / update (id `1671016490810398688`) |
| Code mirror | `@powers/ui` + this design-kit |

## Design with the library (product workflow)

1. **New product file** (e.g. `designlab206 screens`, `Hearth ops`) — not the kit source.  
2. **Assets** → enable library **Powers UI Kit**.  
3. Place **instances** only: `Button`, `Input`, `Field`, `Card`, `Text`, `Dialog`, …  
4. Prefer **semantic Variables** (`color/accent`, `space/4`) over hard hex.  
5. When tokens change in code: plugin **Sync Variables** on the kit file → **Publish library** update → product files pick it up.

**Do not** detach components or copy kit frames into product files. Improve the kit source, then republish.

## File

| | |
|---|---|
| **Name** | Powers UI Kit |
| **Library name** | Powers UI Kit (as shown in Assets) |
| **File key** | `bdfYWkMm5oJqKBIrwWCsSd` |
| **Open** | [figma.com/design/bdfYWkMm5oJqKBIrwWCsSd](https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd) |

Organization in Figma uses **Folders**. Keep the kit source under a **Powers** folder; product files can live beside it.

## What lives where

| Artifact | Location |
|---|---|
| Live components / layout | Figma file (above) |
| Tokens for Tokens Studio | `tokens/export/tokens.studio.json` |
| Component catalog / specs | `components/export/catalog.json` |
| How to hand-build in Figma | `components/FIGMA_BUILD.md` |

## Agent / API access

Tooling: `pnpm design-kit:figma-audit` (catalog match, binding sample; Variables dump only on Enterprise).

### PAT scopes (what you’ll see in the UI)

Figma home → **avatar → Settings → Security → Personal access tokens → Generate**.

| UI label (typical) | Enough for |
|---|---|
| **Read the contents of and render images from files** | Pages, components, bindings — **required** |
| Read metadata of files | Optional |
| Design systems → read components/styles | Optional (published libraries) |

**You will not see “File variables: Read” unless the account is on Figma Enterprise.**  
That API scope (`file_variables:read`) is [Enterprise-only](https://developers.figma.com/docs/rest-api/scopes/).  
Without it, audits still cover **components + bindings**. Manage Variables in the Figma UI + Tokens Studio.

```bash
# monorepo root
cp .env.example .env.local   # if needed
# edit .env.local:
FIGMA_FILE_KEY=bdfYWkMm5oJqKBIrwWCsSd
FIGMA_ACCESS_TOKEN=figd_…    # never commit
```

```bash
pnpm design-kit:figma-audit
# → design-kit/figma/audit-report.json
# → variables-export.json only with Enterprise variables scope
```

**Do not commit** `FIGMA_ACCESS_TOKEN`.

## Refresh tokens into Figma

```bash
pnpm design-kit:build
```

Then Tokens Studio → load `tokens/export/tokens.studio.json` → **Styles & Variables** as needed.

## Snapshots (optional)

Later: export Cover / Button matrix PNGs into `figma/snapshots/` for offline visual reference. Not required for the file key link to be valid.

## Agent audit + in-file plugin

```bash
pnpm design-kit:figma-audit    # needs .env.local; writes figma/audit-report.json
pnpm design-kit:plugin:build   # embed tokens/catalog → plugin/dist
```

**Figma plugin (phase 3):** import `plugin/manifest.json` via  
Plugins → Development → Import plugin from manifest — see [plugin/README.md](./plugin/README.md).

- Sync Variables (works without Enterprise REST)  
- Audit catalog  
- Stub missing components  

Publish library: [PUBLISH_LIBRARY.md](./PUBLISH_LIBRARY.md).  
Quality: [QUALITY.md](./QUALITY.md).

| Check | Result |
|---|---|
| File name | Powers UI Kit |
| Structure | Single page `Page 1` → frame `power-ui-comp` |
| Catalog coverage | **49 / 49** names match `components/export/catalog.json` |
| Variable binding (sample) | Button/Input/Card strong; Text / some fills weaker — see QUALITY.md |
| Variables REST API | needs PAT scope `file_variables:read` |

**Token tip:** regenerate with **file content: read** + **file variables: read** for full Variable collection audit.
