# Powers Pro Design Kit

Thank you for purchasing (or evaluating) **Powers Pro**.

This pack is licensed under **LICENSE-PRO.md** (not BSL). It is for design and product work in your organization — not for reselling as a competing UI kit.

---

## What’s inside

| Folder | Contents |
|--------|----------|
| `patterns/` | Screen recipes to build in Figma from **Powers UI Kit** instances (auth, settings, admin, billing, dashboard, empty) |
| `themes/` | Extra brand palettes as CSS + Figma-oriented token tables (beyond free dual/instrument) |
| `handoff/` | Client delivery checklist, catalog snapshot, quality gates |
| `figma/` | How to get / use the private kit file + import variables |
| `starters/` | Screen maps for designlab206-class and Hearth-class product UIs |
| `exports/` | Snapshot of token + component catalog exports (at pack build time) |

**Version:** see `MANIFEST.json`

---

## Quick start (designers)

1. Enable the free **Powers UI Kit** library in Figma (Assets), or use the private Pro duplicate if provided in your purchase email.  
2. Open `patterns/` and build screens with **instances only** (do not detach).  
3. Apply a Pro theme from `themes/` (CSS for code; tables for Figma Variables).  
4. Use `handoff/CLIENT_DELIVERY.md` when sending work to engineering.

## Quick start (engineers)

1. Keep using `@lab206/ui` from npm (BSL).  
2. Drop a Pro theme CSS file after `theme.css`:

```ts
import "@lab206/ui/theme.css";
import "./powers-pro-theme-slate.css"; // from themes/
```

3. Match Lab / product demos to the pattern recipes for parity with design.

---

## Support

Email **scott@lab206.com** with subject **Powers Pro** · include your purchase email.

Commercial *code* license (competing kit / indemnity): separate — [lab206.com/contact](https://lab206.com/contact?subject=Commercial%20license).

---

## Not included (yet)

- Custom Pro-only Figma plugin builds  
- Hosted “publish my site” product  

Core code stays on npm under BSL; Pro is the **design + handoff wedge**.
