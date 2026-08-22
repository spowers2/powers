# Powers Vite template

Minimal app: theme, form with `createField` + `bind`, dark mode toggle.

## From the monorepo

```bash
# at repo root
bash scripts/create-powers.sh my-app
# or
pnpm create-app my-app

cd examples/my-app   # default destination
pnpm install
pnpm dev             # http://localhost:5190
```

## Outside the monorepo (later)

Point `package.json` dependencies at published packages or `file:` paths to this repo’s `packages/*`, then `pnpm install && pnpm dev`.

## Put this online

Powers apps build to a normal website folder. No Node required on the host.

```bash
pnpm build
pnpm deploy:zip   # → site-upload.zip
```

Upload/extract into your host web root (often `public_html`).  
Full checklist: monorepo `docs/DEPLOY.md`.

## Learn more

- Three rules + API: monorepo `docs/` + demo `/docs`
- Lab cookbooks: `/lab?recipe=settings` · `admin-list`
- Day 1 / 2 / 30: `docs/LEARN_PATH.md`
- Free vs paid: `docs/OFFER.md`
