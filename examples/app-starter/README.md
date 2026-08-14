# designlab206 — real-world Power UX example

A **local-first freelance / small-studio workspace**: clients, projects, tasks, invoices, pipeline value, and settings.

This is the product-shaped example under `examples/app-starter` — not a component kitchen sink.

## Run

From the monorepo root:

```bash
pnpm example:starter
```

Open **http://localhost:5180**

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
- **No Lab/System chrome** — just an app built with `@power-ux/*`

## Stack

- `@power-ux/core` — signals, computed, effect  
- `@power-ux/dom` — JSX  
- `@power-ux/router` — routes  
- `@power-ux/ui` — design system  

## Reset data

**Settings → Reset demo data** restores the seed workspace.

## Note

Data never leaves the browser. No backend.
