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

## Agent / API access (optional)

To let tooling **read** the file (structure, component names) via Figma REST API:

1. Figma → Settings → Security → **Personal access tokens** → create a token with file read access.  
2. In the monorepo root, copy [`.env.example`](../.env.example) → `.env.local` (gitignored).  
3. Set:

```bash
FIGMA_FILE_KEY=bdfYWkMm5oJqKBIrwWCsSd
FIGMA_ACCESS_TOKEN=figd_…   # never commit
```

4. Ask the agent to use those env vars when comparing Figma ↔ catalog.

**Do not commit** `FIGMA_ACCESS_TOKEN`. The file key may live in this doc; the token must not.

## Refresh tokens into Figma

```bash
pnpm design-kit:build
```

Then Tokens Studio → load `tokens/export/tokens.studio.json` → **Styles & Variables** as needed.

## Snapshots (optional)

Later: export Cover / Button matrix PNGs into `figma/snapshots/` for offline visual reference. Not required for the file key link to be valid.

## Agent audit (step 6)

**Last pull:** 2026-08-17 via Figma REST API (`file_content:read`).

| Check | Result |
|---|---|
| File name | Powers UI Kit |
| Structure | Single page `Page 1` → frame `power-ui-comp` |
| Catalog coverage | **49 / 49** component names match `components/export/catalog.json` |
| Button matrix | solid/soft/ghost/danger × sm/md/lg (12 variants) |
| Text matrix | 24 variants (Size × Weight) |
| Library components endpoint | 403 with current token (node walk still works) |
| Variables endpoint | 403 — needs `file_variables:read` scope on the PAT |

**Token tip:** regenerate with **file content: read** + **file variables: read** if you want Variable collections audited via API.
