# Bank Power — product brief (lab206 demo)

**Name:** **Bank Power** — blunt on purpose. Powers applied to personal banking.

**One-liner:** Personal banking console — balances, transfers, and cards — built with Powers to show calm product UI and “any backend” data hooks.

**Role on lab206:** Fourth vertical proof (studio · restaurant · logistics · bank).  
**Reference:** Figma Make export in `localonly/` (visual/IA only — not shipped).

---

## Positioning

| | |
|---|---|
| **Is** | Fictional personal banking app |
| **Is not** | Real bank, Stripe Capital, or React/shadcn remount |
| **Data story** | Accounts, transactions, cards, transfers via `createApiClient` + in-memory mutations |
| **Design story** | Calm neutrals + sky accent — distinct from Logistics ops teal and Restaurant Power warmth |
| **Live path** | `/bank/` (hash routes when deployed) · local `:5183` |

---

## Routes

| Path | Screen |
|---|---|
| `/` | Overview — KPIs, account cards, recent activity |
| `/accounts` | Account list |
| `/accounts/:id` | Account detail + transactions |
| `/activity` | Cross-account feed + filters |
| `/transfer` | Transfer form + confirm Dialog |
| `/cards` | Cards + freeze/unfreeze |
| `/settings` | Theme / density |

---

## Run

```bash
pnpm example:bank   # http://localhost:5183
```
