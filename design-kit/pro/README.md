# Powers Design Kit — Pro vs free

Core monorepo stays **BUSL-1.1**. Pro is a **separate paid design deliverable** (EULA: [LICENSE-PRO.md](./LICENSE-PRO.md)).

**Product stance:** sell the **design system + Figma wedge**, not Squarespace-style hosting. See [docs/OFFER.md](../../docs/OFFER.md).

---

## Free (Community / BSL)

| Asset | Where |
|---|---|
| Published Figma library **Powers UI Kit** | Figma Assets (file key in [FIGMA.md](../FIGMA.md)) |
| Community plugin **Powers Design Kit** | **Live** — [Community](https://www.figma.com/community/plugin/1671016490810398688) |
| Token exports | `tokens/export/` |
| Component catalog specs | `components/export/` |

---

## Pro (paid SKU) — deliverable ready

Build the customer zip:

```bash
pnpm design-kit:pro:pack
# → design-kit/pro/dist/powers-pro-design-kit-0.1.0.zip
```

| Asset | In pack? |
|---|---|
| Pattern recipes (auth, settings, admin, billing, dashboard, empty) | ✅ `pack/patterns/` |
| Theme packs slate / warm / mono (CSS + token JSON) | ✅ `pack/themes/` |
| Handoff + quality gates | ✅ `pack/handoff/` |
| Starter screen maps (designlab206 / Hearth) | ✅ `pack/starters/` |
| Token + catalog export snapshot | ✅ copied into zip `exports/` |
| LICENSE-PRO | ✅ |
| Private Figma **Pro Patterns** file | 🛠 Build with [FIGMA_PRO_PATTERNS.md](./FIGMA_PRO_PATTERNS.md) · invite after sale |
| Pro plugin features | ❌ Roadmap |

**Indicative price:** Indie Pro **$149** one-time (subject to change) · Studio seats TBD.

---

## Status

| Item | State |
|---|---|
| Free library + plugin | Live |
| Pro pack zip | **Buildable** — `pnpm design-kit:pro:pack` |
| Storefront | Not live — inquire / notify via contact |
| Commercial *code* license | Inquire — [docs/COMMERCIAL.md](../../docs/COMMERCIAL.md) |

Sell Pro when: checkout live **or** you’re ready to email the zip + Figma invite manually.

### Maintainer: build the Figma file

Follow **[FIGMA_PRO_PATTERNS.md](./FIGMA_PRO_PATTERNS.md)** — page map, frame names, instance lists, build order, acceptance checklist, screenshot set for Docs `#pro`.
