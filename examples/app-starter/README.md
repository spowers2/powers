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
- **No Lab/System chrome** — just an app built with `@powers/*`

## Stack

- `@powers/core` — signals, computed, effect  
- `@powers/dom` — JSX  
- `@powers/router` — routes  
- `@powers/ui` — design system  

## Reset data

**Settings → Reset demo data** restores the seed workspace.

## Note

Data never leaves the browser. No backend.
