# Bank Power — product brief (lab206 demo)

**Name:** **Bank Power** — blunt on purpose. Powers applied to business banking.

**One-liner:** Business banking console — accounts, workflows, capital, and cards — built with Powers for calm corporate product UI and “any backend” data hooks.

**Role on lab206:** Fourth vertical proof (studio · restaurant · logistics · bank).  
**Reference:** Figma Make export in `localonly/` (visual/IA only — not shipped).

---

## Positioning

| | |
|---|---|
| **Is** | Fictional mid-market business banking / fintech console |
| **Is not** | Real bank, live lender, or React/shadcn remount |
| **Data story** | Accounts, transactions, workflows, capital via `createApiClient` + in-memory mutations |
| **Design story** | Corporate navy + neutrals (IBM Plex) — distinct from Logistics ops teal and Restaurant Power warmth |
| **Live path** | `/bank/` (hash routes when deployed) · local `:5183` |

---

## Routes

| Path | Screen |
|---|---|
| `/` | Marketing landing |
| `/dashboard` | Signed-in overview — KPIs, accounts, recent activity |
| `/accounts` | Account list |
| `/accounts/:id` | Account detail + transactions |
| `/workflows` | Automation queue — pause / resume / clear error |
| `/capital` | Facility + loan products + platform story |
| `/activity` | Cross-account feed + filters |
| `/transfer` | Transfer form + confirm Dialog |
| `/cards` | Cards + freeze/unfreeze |
| `/settings` | Theme / density |

---

## Run

```bash
pnpm example:bank   # http://localhost:5183
```
