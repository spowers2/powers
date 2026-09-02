# Logistics Power — product brief (lab206 demo)

**Name:** **Logistics Power** — blunt on purpose. No clever metaphor; the demo *is* the category.

**One-liner:** Logistics ops control tower for shipments, exceptions, and partner status — built with Powers to show **dense data UI** and “any backend” hooks.

**Role on lab206:** Third vertical proof (not studio, not restaurant).  
**Live product stays external:** [designlab206.com](https://designlab206.com/) · **Hearth** stays hospitality on lab206.

---

## Monetization job

| Buyer | What they see | What we sell |
|---|---|---|
| Agency / studio | “Client logistics / 3PL portal we can reskin” | Studio license + Pro kit |
| Product team | “Internal ops console matching our system” | Studio / Enterprise |
| Gov / contractor | “Port / fleet / emergency logistics desk” | Commercial + security story |

**Screenshot test:** Would this still impress if the logo said *their* brand? If yes, it monetizes.

---

## Positioning

| | |
|---|---|
| **Is** | Fictional mid-market shipper ops desk + light partner view |
| **Is not** | Real TMS, map platform, or warehouse engine |
| **Data story** | Feels “big data”: KPIs, fat tables, filters, paged queries — via `createApiClient` + fake/paged JSON |
| **Design story** | Distinct tokens (industrial / signal accent) — not Hearth warm, not studio purple |
| **Naming story** | Smack-in-the-face clarity: **Logistics Power** — Powers applied to logistics |

---

## Entities (MVP)

| Entity | Fields (starter) |
|---|---|
| **Shipment** | id, reference, lane (origin→dest), status, ETA, carrier, priority, updatedAt |
| **Exception** | id, shipmentId, type, severity, openedAt, note |
| **Partner** | id, name, type (carrier / consignee), score, activeShipments |
| **KPI snapshot** | onTimePct, inTransit, exceptionsOpen, avgDwellHours |

**Statuses:** `draft` · `booked` · `in_transit` · `at_risk` · `delivered` · `cancelled`

---

## Routes (app base `/logistics/` on lab206)

| Path | Screen | Powers proof |
|---|---|---|
| `/logistics/` | **Overview** | KPI strip, exception feed, sparkline-ish stats, `createQuery` |
| `/logistics/shipments` | **Shipments** | Dense `Table`, filters, Empty/Spinner/Alert, pagination |
| `/logistics/shipments/:id` | **Shipment detail** | Timeline, form actions, Dialog confirm, bind fields |
| `/logistics/exceptions` | **Exceptions** | Queue UX, severity chips, bulk “ack” |
| `/logistics/partners` | **Partners** | Simpler portal-style list + detail drawer |
| `/logistics/settings` | **Settings** | Theme/density dogfood (optional thin) |

Deep links: `?status=at_risk`, `?q=` search — outlet remount-on-query already in router contracts.

---

## MVP UX (must ship)

1. **Overview** — 4 KPIs + top 5 exceptions → click through  
2. **Shipments table** — ≥ 500 fake rows, client page or `createQuery` page param; status filter  
3. **Detail** — status timeline + “Update ETA” / “Flag exception”  
4. **Loading / error / empty** — every list uses the Data playbook  
5. **Distinct brand** — `createTheme` + token override (slate + signal green / amber risk)

**Explicit non-goals (v1):** real maps, auth, websockets, CSV import, multi-tenant.

---

## lab206 placement

| Surface | Change |
|---|---|
| **Nav** | Add **Logistics Power** next to Hearth (`/logistics/`, new tab OK) |
| **Landing Products** | Card: “Ops · Logistics Power” — dense logistics control tower |
| **Phone Menu** | `Logistics Power` entry |
| **Zip build** | `pnpm build:lab206` includes `logistics/` like `hearth/` |
| **`/workspace/`** | Keep build optional; **do not** market as flagship (designlab206.com owns that) |

---

## Tech spine (match Hearth / starter)

- Package: `examples/logistics-power` (Vite + `@lab206/*@0.1.6+`)  
- Router: `createRouter` · **one outlet**  
- Data: `createApiClient` + in-memory / static JSON faker (swap URL later)  
- UI: Table, Empty, Alert, Spinner, Dialog, Drawer, Badge, Stack, Field  
- Docs cross-link: Lab `data-list` / `data-detail` · `docs/DATA.md`

---

## Success metrics

- Stranger understands “ops data product” in **5 seconds** on Overview  
- Agency lead says “we build these for clients” without explaining Powers first  
- Demo runs fully offline/fake-data on lab206 static host  
- Name needs no explanation: **Logistics Power**

---

## Build order (when executing)

1. Accent / industrial theme direction ✅ (sci-fi LED HUD)  
2. Scaffold `examples/logistics-power` + fake data module ✅  
3. Overview + Shipments + Detail ✅  
4. Exceptions + Partners ✅  
5. Wire lab206 nav + `build-lab206-site.sh` ✅  
6. Zip + spot-check (when you ask)  

---

## One-sentence pitch (site card)

> **Logistics Power** — KPIs, exception queues, and shipment detail for freight ops. The data-dense app agencies and product teams keep rebuilding — powered by Powers.
