# Powers Figma UI Kit

Visual source of truth for the design kit. Machine specs stay in this repo (`tokens/export`, `components/export`); the Figma file is the canvas library.

## File

| | |
|---|---|
| **Name** | Powers UI Kit |
| **File key** | `bdfYWkMm5oJqKBIrwWCsSd` |
| **Open** | [figma.com/design/bdfYWkMm5oJqKBIrwWCsSd](https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd) |

Organization in Figma uses **Folders** (not Projects). Put the file in a folder such as `Powers` if you like; the **file key** is what tooling and agents need.

## What lives where

| Artifact | Location |
|---|---|
| Live components / layout | Figma file (above) |
| Tokens for Tokens Studio | `tokens/export/tokens.studio.json` |
| Component catalog / specs | `components/export/catalog.json` |
| How to hand-build in Figma | `components/FIGMA_BUILD.md` |

## Agent / API access

Tooling: `pnpm design-kit:figma-audit` (catalog match, binding sample, **Variables dump**).

### PAT scopes (required for full tooling)

Figma home → **avatar → Settings → Security → Personal access tokens → Generate**:

| Scope | Why |
|---|---|
| **File content: Read** | Pages, components, node tree |
| **File variables: Read** | Local Variable collections + names |

Without **File variables: Read**, audits still work for components but Variables export stays blocked.

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
# → design-kit/figma/variables-export.json  (when variables scope OK)
```

**Do not commit** `FIGMA_ACCESS_TOKEN`.

## Refresh tokens into Figma

```bash
pnpm design-kit:build
```

Then Tokens Studio → load `tokens/export/tokens.studio.json` → **Styles & Variables** as needed.

## Snapshots (optional)

Later: export Cover / Button matrix PNGs into `figma/snapshots/` for offline visual reference. Not required for the file key link to be valid.

## Agent audit

```bash
pnpm design-kit:figma-audit   # needs .env.local; writes figma/audit-report.json
```

Quality priorities after catalog match: **[QUALITY.md](./QUALITY.md)**.

| Check | Result |
|---|---|
| File name | Powers UI Kit |
| Structure | Single page `Page 1` → frame `power-ui-comp` |
| Catalog coverage | **49 / 49** names match `components/export/catalog.json` |
| Variable binding (sample) | Button/Input/Card strong; Text / some fills weaker — see QUALITY.md |
| Variables REST API | needs PAT scope `file_variables:read` |

**Token tip:** regenerate with **file content: read** + **file variables: read** for full Variable collection audit.
