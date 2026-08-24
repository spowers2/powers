# Pattern · Settings hub

**Frame:** `App / Settings` · desktop ~720–960 content column

## Layout

| Region | Components |
|--------|------------|
| Header | Text 2xl “Settings” · Text muted “Profile and preferences” |
| Nav (optional) | Tabs or List: Profile · Appearance · Billing · Danger |
| Profile card | Card → Field Name · Field Email · Button soft “Save” |
| Appearance | Card → Switch “Dark mode” · Select density · Badge “Pro theme” |
| Danger | Card soft → Text · Button danger “Delete account” |

## QA

- Switches use kit Switch (not custom toggles).  
- Destructive actions always Dialog confirm (see free Confirm pattern).
