# Power UX Vite template

Minimal app: theme, form with `createField` + `bind`, dark mode toggle.

## From the monorepo

```bash
# at repo root
bash scripts/create-power-ux.sh my-app
# or
pnpm create-app my-app

cd examples/my-app   # default destination
pnpm install
pnpm dev             # http://localhost:5190
```

## Outside the monorepo (later)

Point `package.json` dependencies at published packages or `file:` paths to this repo’s `packages/*`, then `pnpm install && pnpm dev`.

## Learn more

- Three rules + API: monorepo `docs/` + demo `/docs`
- Lab cookbooks: `/lab?recipe=settings` · `admin-list`
- Day 1 / 2 / 30: `docs/LEARN_PATH.md`
