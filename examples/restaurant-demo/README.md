# Restaurant Power — restaurant demo (Powers)

A **session playground** for a neighborhood restaurant: guest-facing site, menu with photos, reservations, kitchen board, and floor map.

**Playground only** — edits live in `sessionStorage` for the current tab/visit. Closing the tab clears them. Nothing is saved on a server or across return visits.

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

- `@lab206/core` · `@lab206/dom` · `@lab206/router` · `@lab206/ui`

## Put this online

```bash
# from monorepo root
pnpm deploy:zip:restaurant
# → examples/restaurant-demo/site-upload.zip
```

Upload/extract to your host web root. Guide: [`docs/DEPLOY.md`](../../docs/DEPLOY.md).

## Note

Session-only playground. Data never leaves the browser. No backend.

## Imagery

Unsplash License: https://unsplash.com/license
