# Code Connect — Powers UI Kit ↔ `@powers/ui`

Code Connect shows real `@powers/ui` snippets in Figma **Dev Mode** when you select a kit component. Designers stay in Figma; engineers copy production-shaped code.

## Status

| Piece | Location |
|---|---|
| Templates (49) | `packages/ui/src/code-connect/*.figma.ts` |
| Node map | `packages/ui/src/code-connect/nodes.json` |
| CLI config | monorepo root `figma.config.json` |
| Figma file | **Powers UI Kit** · key `bdfYWkMm5oJqKBIrwWCsSd` |
| Label in Dev Mode | **Powers** |

## Requirements

1. **Figma plan** — Code Connect publish needs **Organization** or **Enterprise** (not available on free/Professional alone).
2. **PAT** with:
   - **Code Connect: Write** (publish)
   - **File content: Read** (already used for audits)
3. **Node.js 18+** and monorepo deps.

```bash
# monorepo root
pnpm add -Dw @figma/code-connect
```

Store the token in gitignored `.env.local` (never commit):

```bash
FIGMA_FILE_KEY=bdfYWkMm5oJqKBIrwWCsSd
FIGMA_ACCESS_TOKEN=figd_…   # Code Connect Write + File content Read
```

## Template format

Each file is a **template** (framework-agnostic). Metadata comments bind to a Figma node:

```ts
// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=5-38
// source=packages/ui/src/components/Button.tsx
// component=Button

import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('Label')
// …

export default {
  example: figma.code`<Button>${label}</Button>`,
  imports: ["import { Button } from '@powers/ui'"],
  id: 'button',
}
```

Property names match Figma component properties (`Label`, `Variant`, `Size`, …). Node IDs were pulled from the live kit file.

## Commands

From the monorepo root:

```bash
# Dry-run / validate templates (no publish)
pnpm code-connect:parse

# Publish all mappings into the kit file (needs Org/Enterprise + Write scope)
pnpm code-connect:publish

# Remove all published mappings for this label (careful)
pnpm code-connect:unpublish
```

Equivalent raw CLI:

```bash
export FIGMA_ACCESS_TOKEN=…   # or --token=
npx figma connect parse
npx figma connect publish
npx figma connect unpublish --label=Powers
```

## Verify in Figma

1. Open **Powers UI Kit**.
2. Select a component (e.g. **Button**).
3. Switch to **Dev Mode**.
4. Inspect panel should show a **Powers** snippet with imports from `@powers/ui`.

If nothing appears: plan may not include Code Connect, PAT missing **Code Connect Write**, or publish failed — re-run `pnpm code-connect:publish` and read CLI errors.

## Workflow when the kit changes

| Change | Action |
|---|---|
| New Figma component | Add `packages/ui/src/code-connect/Name.figma.ts` with `// url=…node-id=…`, then publish |
| Renamed prop / variant | Update `getString` / `getEnum` maps; publish |
| Node recreated | Update `// url=` (and `nodes.json`); publish |
| Code API change | Adjust `example` to match `@powers/ui` props; publish |

Refresh node IDs from the API (file content read):

```bash
# same token as design-kit audit
node --import tsx design-kit/scripts/…  # or re-run the extract used for nodes.json
```

`nodes.json` is the quick lookup of name → node-id → URL.

## Product story

| Surface | Role |
|---|---|
| **Powers UI Kit** (library) | Design source of truth |
| **Powers Design Kit** plugin | Sync variables / audit / stubs |
| **Code Connect** | Dev Mode code from the same components |
| **`@powers/ui`** | Runtime implementation |

Together: design in product files with library instances → Dev Mode shows Powers imports → ship with the monorepo packages.

## Plan / billing note

If publish returns a plan or scope error, upgrade the Figma seat that owns the kit file to Org/Enterprise and regenerate a PAT with **Code Connect Write**. Templates can still live in the repo without publishing; they become active only after a successful publish.
