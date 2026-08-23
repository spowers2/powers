# designlab206 — Powers flagship product demo

**This is the primary “show product” surface** for Powers: a local-first freelance /
small-studio workspace (clients, projects, tasks, invoices, time, portal).

Not a kitchen sink. Design screens for this app should use the published Figma
library **Powers UI Kit** (see monorepo `design-kit/FIGMA.md`).

## Run

From the monorepo root:

```bash
pnpm example:starter
```

Open **http://localhost:5180**

Kit / Lab (learn the stack): **http://localhost:5173**

| Route | Purpose |
|---|---|
| `/` | Dashboard — clickable stats deep-link to filtered lists |
| `/projects?view=pipeline` | Open project fees (not done) |
| `/invoices?status=overdue` | Filtered invoices (also `outstanding`, `paid`, `draft`) |
| `/clients` | CRM-lite — search, add/edit drawer, delete with confirm |
| `/projects` | Engagements — status, value, due dates, client link |
| `/tasks` | Work queue — complete toggle, priority, filters |
| `/invoices` | Billing — draft/sent/paid/overdue, line items, mark paid |
| `/time` | Time log — hours, billable, invoice unbilled @ hourly rate |
| `/settings` | Profile, theme/density, hourly rate, reset demo data |

## What makes it “real”

- **Domain model** with realistic seed data (health client, e‑com, fintech lead)
- **One persisted store** (`localStorage`) — survives refresh
- **Workflows**: create/edit drawers, delete confirms, toasts, overdue highlighting
- **No Lab/System chrome** — just an app built with `@lab206/*`

## Stack

- `@lab206/core` — signals, computed, effect  
- `@lab206/dom` — JSX  
- `@lab206/router` — routes  
- `@lab206/ui` — design system  

## Put this online

```bash
# from monorepo root
pnpm deploy:zip:starter
# → examples/app-starter/site-upload.zip
```

Upload/extract to your host web root. No Node on the server required.  
Guide: [`docs/DEPLOY.md`](../../docs/DEPLOY.md).

## Reset data

**Settings → Reset demo data** restores the seed workspace.

## Note

Data never leaves the browser. No backend.
