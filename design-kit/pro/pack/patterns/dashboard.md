# Pattern · Dashboard

**Frame:** `App / Dashboard`

| Region | Components |
|--------|------------|
| Header | Text 2xl · Text muted date range |
| Stats | Grid 2–4 × Stat (clickable → deep link with query) |
| Primary | Card “Pipeline” · List or Table |
| Secondary | Card “Activity” · Timeline or List |
| Empty | Empty in secondary if no activity |

**Deep links:** Stat click → `/invoices?status=overdue` style (hash or history). Document target routes in starters/.
