# Pattern · Auth · Sign in

**Frame:** `Auth / Sign in` · max width 360 · vertical stack gap `space/4`

| Layer | Component | Props / notes |
|-------|-----------|---------------|
| Brand | Text | size `sm`, muted, “Your product” |
| Title | Text | size `xl` or `2xl`, weight semibold, “Sign in” |
| Email | Field + Input | label Email, required, placeholder |
| Password | Field + Input | label Password, type password |
| Row | Stack horizontal | “Remember me” Switch · Link “Forgot?” |
| CTA | Button | solid, md, full width, “Continue” |
| Alt | Text muted + Link | “No account? Create one” |

**States to duplicate:** Default · Email error · Loading (Button loading / disabled) · SSO row (optional Button soft “Continue with Google”).
