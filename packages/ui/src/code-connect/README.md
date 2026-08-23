# Code Connect templates

Maps **Powers UI Kit** Figma components → `@lab206/ui` snippets for Dev Mode.

See monorepo docs: [`design-kit/CODE_CONNECT.md`](../../../../design-kit/CODE_CONNECT.md).

| File | Purpose |
|---|---|
| `*.figma.ts` | One template per kit component (49) |
| `nodes.json` | Figma node ids + URLs (from live file) |

```bash
# from monorepo root
pnpm code-connect:parse
pnpm code-connect:publish
```
