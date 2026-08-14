# Hearth — restaurant demo (Power UI)

A **local-first neighborhood restaurant** product example: guest-facing floor, menu with photos, reservations, and a service/kitchen board.

Photos load from the **Unsplash CDN** (free license — see in-app credit).

## Run

From the monorepo root:

```bash
pnpm example:restaurant
```

Open **http://localhost:5181**

| Route | Purpose |
|---|---|
| `/` | Floor — hero, covers, featured dishes, tonight’s book |
| `/menu` | Menu board — search, 86 items, add/edit dishes + Unsplash photos |
| `/reservations` | Book / seat parties |
| `/service` | Kitchen tickets (queue → prep → ready → served) |
| `/tables` | Floor plan — open/reserved/seated/dirty, seat guests |
| `/settings` | Profile, theme, reset seed |
| **`/visit`** | **Guest site** — public home, menu, book a table |
| `/visit/menu` | Guest menu (available dishes only) |
| `/visit/book` | Guest reservation form → same book as staff |

## Stack

- `@power-ui/core` · `@power-ui/dom` · `@power-ui/router` · `@power-ui/ui`

## Note

Data never leaves the browser. No backend.

## Imagery

Unsplash License: https://unsplash.com/license
