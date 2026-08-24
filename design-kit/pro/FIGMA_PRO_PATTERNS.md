# Figma build plan — Powers Pro Patterns

**Goal:** A private Figma file buyers can open and *see* finished screens (instances only), not just markdown recipes.

**Outcome:** File you duplicate + invite after each Pro sale. Export 3–4 PNGs into Docs `#pro` later.

**Time estimate:** ~4–8 focused hours if the free **Powers UI Kit** library is healthy.

---

## 0. Setup (15 min)

1. **File → New design file** named **`Powers Pro Patterns`**  
   - Put it in a private **Powers / Pro** folder (not the public kit source).  
2. **Assets** → enable library **Powers UI Kit** (`bdfYWkMm5oJqKBIrwWCsSd`).  
3. Confirm fonts: **DM Sans**, **IBM Plex Mono**.  
4. Optional: add Variable collection **`Powers Pro / Themes`** with modes **Slate · Warm · Mono** (values from `pack/themes/*.tokens.json`).  
5. Page size: use **Desktop 1280** frames + **Mobile 390** variants where noted.

**Do not** edit the public kit source for Pro-only screens. Build here with **instances**.

---

## 1. Page map (create these pages)

| # | Page name | Purpose |
|---|-----------|---------|
| — | **Cover** | Wordmark, “Pro Patterns v0.1”, light/dark note, theme mode note |
| **01** | **Auth** | Sign in · Sign up · Forgot |
| **02** | **App shell** | Top nav + content column (desktop) · phone Menu shell |
| **03** | **Dashboard** | Stats + lists |
| **04** | **Admin list** | Toolbar + table/cards |
| **05** | **Billing** | Stats + invoice list + drawer |
| **06** | **Settings** | Profile / appearance / danger |
| **07** | **Empty states** | Empty · error · loading |
| **08** | **Theme board** | Same Card+Button row in Slate / Warm / Mono |
| **99** | **_Specs** | Optional: sticky checklist from this doc |

Use Auto layout everywhere. Name frames exactly as below (helps screenshots + handoff).

---

## 2. Cover page

**Frame:** `Cover / Hero` · 1280 × 720

| Layer | Kit component | Notes |
|-------|---------------|-------|
| Mark | — | Simple rectangle using `color/accent` Variable or brand |
| Title | Text | “Powers Pro Patterns” · size 2xl |
| Sub | Text muted | “Instance-only screens · v0.1.0” |
| Badge | Badge | “Pro” |
| Row | Button soft + Button solid | “View Auth” / “View Dashboard” (prototype optional) |

Add a second frame `Cover / Dark` with `data` note or dark mode Variables if you use modes.

---

## 3. Page 01 — Auth

Build three desktop frames (max content width **360**, centered). Recipes: `pack/patterns/auth-*.md`.

### `Auth / Sign in`

| Order | Instance | Key props |
|-------|----------|-----------|
| 1 | Text sm muted | “Your product” |
| 2 | Text xl semibold | “Sign in” |
| 3 | Field + Input | Email |
| 4 | Field + Input | Password |
| 5 | Stack row | Switch “Remember” · Link “Forgot?” |
| 6 | Button solid | “Continue” · full width |
| 7 | Text + Link | “No account? Create one” |

**Also duplicate:**

- `Auth / Sign in / Error` — Field error on email  
- `Auth / Sign in / Loading` — Button disabled / Spinner beside CTA  

### `Auth / Sign up`

Name, Email, Password, Checkbox+terms, Button “Create account”, Link back.

### `Auth / Forgot`

Title, muted body, Email Field, Button “Send reset link”, Link back.  
Duplicate `Auth / Forgot / Sent` with Alert success.

### Mobile

For each happy path, duplicate frame → width **390**, stack still vertical (same instances).

**Screenshot candidates:** Sign in (light), Sign in error, Forgot sent.

---

## 4. Page 02 — App shell

### `Shell / Desktop`

1280 wide. Matches product demos:

| Region | Build with |
|--------|------------|
| Top bar | Frame auto-layout · brand mark + Text “Product” · nav Links-as-Text/Button ghost pills · Button soft “Portal” · Button ghost theme |
| Content | Container-width column (~960–1120) · padding |

Keep nav **instance-based** (Text/Button), not a custom navbar component.

### `Shell / Phone`

390 wide:

| Region | Build |
|--------|--------|
| Top | Brand · Button/Text “Menu” · theme |
| Note | Text muted xs: “Menu opens kit Menu / list of routes” |

Optional: overlay frame `Shell / Phone / Menu open` using **Menu** or **List** instances.

---

## 5. Page 03 — Dashboard

### `App / Dashboard`

Use **Shell / Desktop** as parent (or nest content only and note “place in shell”).

| Block | Instances |
|-------|-----------|
| Header | Text 2xl “Dashboard” · Text muted |
| Stats | Grid 4 × **Stat** (or Card+Text if Stat missing in file) |
| Main | Card “Pipeline” · List rows (Text + Badge) |
| Side | Card “Activity” · Timeline **or** stacked Text muted |

**Deep-link annotation** (text layer, not for users):  
`Stat Overdue → /invoices?status=overdue`

### `App / Dashboard / Empty activity`

Secondary Card uses **Empty**.

**Screenshot candidate:** Dashboard with 4 stats.

---

## 6. Page 04 — Admin list

### `App / Admin list`

| Block | Instances |
|-------|-----------|
| Header | Text 2xl · Button solid “Add” |
| Toolbar | Input search · Select · Button ghost |
| Body | **Table** (desktop) |
| Row menu | Menu trigger “⋯” |

### `App / Admin list / Mobile`

390: Card list instead of Table (title · Badge · Menu).

### `App / Admin list / Empty`

Empty + Button “Add first”.

**Screenshot candidate:** Admin list with 3–5 rows.

---

## 7. Page 05 — Billing

### `App / Billing`

| Block | Instances |
|-------|-----------|
| Stats | Stat Outstanding · Paid · Overdue |
| Filters | Select + Input |
| Rows | Text client · Text money · **Badge** status · due date |
| Detail | **Drawer** open: Fields + Select status (Draft/Sent/Paid only) · Buttons |

Annotation on overdue Badge: “Derived — sent + past due”.

### `App / Billing / Drawer`

Focused frame of the drawer content alone for engineering zoom.

**Screenshot candidate:** Billing list + one Drawer open.

---

## 8. Page 06 — Settings

### `App / Settings`

Tabs or vertical List: Profile · Appearance · Danger.

| Card | Instances |
|------|-----------|
| Profile | Field Name · Field Email · Button soft Save |
| Appearance | Switch Dark · Select density · Badge “Pro theme” |
| Danger | Text · Button danger → links to Dialog confirm |

Include `Settings / Dialog confirm` using free Confirm pattern (Dialog + ghost + danger).

---

## 9. Page 07 — Empty states

Three frames side by side:

| Frame | Instances |
|-------|-----------|
| `State / Empty` | Empty + CTA |
| `State / Error` | Alert danger + Button Retry |
| `State / Loading` | Skeleton ×3 **or** Spinner + Text |

---

## 10. Page 08 — Theme board

One frame per theme mode (or Variable modes on one frame):

`Theme / Slate` · `Theme / Warm` · `Theme / Mono`

Each shows the **same** row:

Card → Text title · Button solid · Button soft · Badge · Switch · Input  

Swap brand/accent Variables per mode (from `pack/themes/*.tokens.json`).

**Screenshot candidate:** Theme board (sells Pro themes visually).

---

## 11. Build order (do this sequence)

1. Cover  
2. Auth Sign in (+ error + loading) ← fastest win  
3. App shell desktop + phone  
4. Admin list  
5. Dashboard  
6. Billing + drawer  
7. Settings + confirm  
8. Empty states  
9. Theme board  
10. Auth sign up + forgot  

Stop after step 4 if time-boxed — enough for Docs previews + first sales.

---

## 12. Acceptance checklist (ship the file)

- [ ] Every interactive control is a **Powers UI Kit instance** (no detached)  
- [ ] Frame names match this doc  
- [ ] Light mode complete for Auth + Admin list + Dashboard  
- [ ] At least one dark frame (Cover or Shell)  
- [ ] Theme board shows 3 Pro themes  
- [ ] File is in a **private** folder; not published to Community  
- [ ] You can duplicate file → invite a test email in &lt; 2 minutes  

### Screenshot set for Docs `#pro` (export 2× PNG)

1. `Auth / Sign in`  
2. `App / Admin list`  
3. `App / Billing` (with drawer) **or** `App / Dashboard`  
4. `Theme / Warm` (or full theme board)

Store exports under `design-kit/pro/pack/previews/` (add in a follow-up) and embed on the site.

---

## 13. Fulfillment (per sale)

1. Duplicate **Powers Pro Patterns** (and optionally kit) in Figma.  
2. Invite buyer’s Figma email (view or edit per tier).  
3. Send `powers-pro-design-kit-*.zip` from `pnpm design-kit:pro:pack`.  
4. Point them at Cover page + `pack/README.md`.

---

## Related

- Recipes: `pack/patterns/*.md`  
- Themes: `pack/themes/`  
- Buyer Figma notes: `pack/figma/README.md`  
- Free kit source: [FIGMA.md](../FIGMA.md) · library publish: [PUBLISH_LIBRARY.md](../PUBLISH_LIBRARY.md)
