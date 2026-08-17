# Pattern screens (Figma page `99 Patterns`)

Compose **only** from kit instances. Match these recipes when polishing.

## Pattern / Sign in

| Layer | Component | Props / notes |
|---|---|---|
| Title | Text | size xl or 2xl, weight semibold |
| Email | Field or Label + Input | placeholder email |
| Password | Input | type password chrome |
| CTA | Button | solid, md, “Continue” |
| Alt | Link | “Forgot password?” |

Layout: vertical stack, gap `space/4`, max width ~360.

## Pattern / Settings row

| Layer | Component |
|---|---|
| Shell | Card (default or soft) |
| Title | Label or Text sm semibold |
| Control | Switch |
| Status | Badge accent |
| Help | Text muted xs |

## Pattern / Confirm dialog

| Layer | Component |
|---|---|
| Overlay | Dialog md |
| Title | Text lg / dialog title |
| Body | Text muted sm |
| Cancel | Button ghost sm |
| Confirm | Button danger sm |

## QA

- All layers are **instances** (not detached).  
- Spacing from Variables.  
- No new one-off colors.
