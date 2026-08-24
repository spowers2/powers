# Pattern · Billing / invoices

**Frame:** `App / Billing`

| Region | Components |
|--------|------------|
| Summary | Grid of Stat: Outstanding · Paid YTD · Overdue count |
| Filters | Select status (All / Draft / Sent / Paid / Overdue) · Input search |
| List | Rows: client · amount · Badge status · due date |
| Drawer | Drawer: Field client · Select status · dates · line items · Button Save |
| Overdue | Badge danger — **derived** from sent + past due (don’t store as editable status) |

Align with designlab206 **Invoices** demo behavior.
