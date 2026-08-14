# Licensing & commercial model

**Goal:** Powers stays **open and available** (true open source) so people can adopt, fork, and ship. You can still **build a business** around it without bait-and-switch on the core.

---

## What the code uses today

| Item | Term |
|---|---|
| Core monorepo packages (`@powers/*`) | **[Apache License 2.0](../LICENSE)** |
| Copyright | **Scott Powers** (and future contributors under DCO) |
| Brand / name **“Powers”** | **Trademark reserved** — see [TRADEMARKS.md](./TRADEMARKS.md) |

Apache-2.0 means others may use, modify, and redistribute (including commercially), with patent grant and attribution. That is intentional for a UI kit.

---

## Why not AGPL / BSL / “source available only”

| Option | Why we avoided it for the core kit |
|---|---|
| **AGPL** | Viral network terms scare product teams; kills adoption for a component library. |
| **BSL / SSPL / Elastic** | Not OSI “open source”; fine for some databases, wrong first impression for a UI stack. |
| **MIT forever, no plan** | Fine legally, but you still need a **product** plan to profit. |

You can always ship **additional** packages later under different terms (e.g. a commercial “Pro” kit). Already-released Apache-2.0 code stays Apache-2.0 for those versions.

---

## How to profit while staying open

These models work with Apache-2.0 and match successful open UI/tooling businesses:

1. **Hosted product** — managed Lab, design tokens cloud, preview hosting  
2. **Paid support / enterprise** — SLAs, private Slack, security review  
3. **Powers Pro (optional package)** — extra components, themes, or Figma kit under a **commercial** license; core stays free  
4. **Templates & training** — paid starters, workshops  
5. **Dual-license only for new code** — e.g. a server/plugin under AGPL + paid commercial license (not the client UI core)

**Do not plan on:** taking MIT/Apache core private after people build on it. That burns trust and is hard once contributors exist.

---

## Contributions (DCO)

All contributions require a **Developer Certificate of Origin** sign-off so copyright and license stay clear.

In every commit message:

```
Signed-off-by: Your Name <you@example.com>
```

Or: `git commit -s …`

See [CONTRIBUTING.md](../CONTRIBUTING.md).

This preserves the option to dual-license **future** modules without murky ownership—not to relicense away Apache rights on past releases.

---

## Trademark (separate from copyright)

Apache-2.0 does **not** give rights to the **Powers** name or logos.  
Others may say “built with Powers” factually; they may **not** imply official endorsement or ship a confusingly named fork as “Powers”.

Details: [TRADEMARKS.md](./TRADEMARKS.md).

---

## Going public checklist (license-related)

- [x] `LICENSE` = Apache-2.0  
- [x] `NOTICE` present  
- [x] Package `license` fields match  
- [x] DCO in CONTRIBUTING  
- [ ] When publishing npm: `"license": "Apache-2.0"` on every package  
- [ ] Optional: GitHub “License: Apache-2.0” metadata (auto from LICENSE)  
- [ ] Optional later: `powers-pro` package with separate commercial LICENSE  

---

## Summary for you

| Want | Approach |
|---|---|
| Available like open source | **Apache-2.0** on `@powers/*` |
| Profit later | Hosted + support + **Pro** add-ons + trademark |
| Keep control of the brand | **Trademark “Powers”** |
| Keep ownership clean | **DCO** on contributions |

Not legal advice—if you raise funding or sign enterprise deals, have a lawyer review trademark registration and any Pro EULA.
