# Licensing & making money (honest model)

## Hard truth

| Wish | Reality |
|---|---|
| “Nobody steals my code” | If source is on the internet, people can **copy** it. Law limits *how they may use* it (license + enforcement), not whether eyes can see it. |
| “Open source + nobody can use it free” | Contradiction. OSI open source (MIT/Apache) **allows** commercial use and forks. |
| “A little cash” | Needs a **product or license** people pay for—not hope that free Apache code somehow pays you. |

**Apache-2.0 (previous default)** = true open source. Legal free commercial use. Great for adoption; weak if your goal is to stop competitors cloning the kit.

---

## What Powers uses now

| Item | Term |
|---|---|
| Core monorepo (`@lab206/*`) | **[Business Source License 1.1](../LICENSE)** (source-available) |
| Commercial / competing uses | **[LICENSE-COMMERCIAL.md](../LICENSE-COMMERCIAL.md)** |
| Brand **“Powers”** | Trademark reserved — [TRADEMARKS.md](./TRADEMARKS.md) |
| Contributions | DCO sign-off ([CONTRIBUTING.md](../CONTRIBUTING.md)) |

### What BSL means for users

**Allowed free:** build real apps and client work **with** Powers.  
**Not allowed free:** ship a **Competing Offering** — a rebranded / forked **UI kit or design system** that replaces Powers as a product.  
**After Change Date** (see LICENSE): that version becomes **Apache-2.0** (true open source).

This is **not** OSI open source until the Change Date. Say “source available” in marketing, not “open source,” if you use BSL.

---

## How you make cash (practical)

Ranked for a UI kit:

1. **Commercial license** — companies that want to resell/host a competing kit, or need indemnity/support  
2. **Powers Pro** — paid extras (components, themes, Figma, templates) under a proprietary license  
3. **Support / consulting** — “I’ll help you ship on Powers”  
4. **Hosted Lab / design tokens cloud** — later SaaS  
5. **Do not rely on** “they can’t read the code” if the repo is public  

Normal app developers stay free under BSL Additional Use Grant → adoption without giving away the *product category*.

---

## Going public checklist (protection-minded)

- [x] Relicense sole-owned code to **BSL-1.1** with clear Competing Offering grant  
- [x] Commercial contact path documented + [COMMERCIAL.md](./COMMERCIAL.md) inquire guide  
- [x] Trademark policy for the name  
- [x] README / CONTRIBUTING / RELEASE / footer say **BSL / source-available**  
- [x] package.json `license` fields = `BUSL-1.1`  
- [x] Repo **public** · npm `@lab206/*` published  
- [x] Offer sheet — [OFFER.md](./OFFER.md)  
- [x] Pro kit packaging outline — [design-kit/pro/](../design-kit/pro/) (not sold yet)  
- [x] Friendly static deploy path — [DEPLOY.md](./DEPLOY.md)  
- [ ] Optional: LemonSqueezy / Gumroad self-serve SKU  
- [ ] Pro design deliverable before selling Pro  

---

## What “public” should mean for you

| Mode | Code visible? | Cash path | Steal risk |
|---|---|---|---|
| **Stay private** | No | Sell licenses / access | Lowest |
| **Public BSL repo** | Yes | Competing-kit ban + Pro + support | Medium (copy possible; enforce license) |
| **Public Apache** | Yes | Support / Pro only | High free clones are legal |

Recommendation: **public BSL when ready**, keep **npm publish** until pricing exists, sell **Pro + commercial license** for cash.

---

## Contributions

External PRs under BSL still need **DCO**. Prefer not taking large third-party code under Apache into a BSL tree without counsel.

---

*Not legal advice. For real revenue, have a lawyer review BSL parameters and any commercial EULA.*
