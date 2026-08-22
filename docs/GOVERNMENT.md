# Government & public-sector use

**Short answer:** Yes — Powers is suitable for **building** government-facing and internal UIs.  
**Not a claim:** Powers itself is **not** FedRAMP / StateRAMP / “ATO certified.” Those apply to **cloud services and deployed systems**, not a UI library.

---

## Recommended model

| Lane | What it means | Powers role |
|---|---|---|
| **1. Apps *for* government** (preferred) | Contractors / you ship portals, case tools, internal apps **using** Powers | UI system + Figma kit + secure defaults |
| **2. Sell Powers *to* an agency/SI** | They standardize on the kit under a commercial license | License + support — not a hosting ATO |
| **3. You host citizen/PII data under gov ATO** | Your servers hold regulated data | **Out of scope** unless a funded program requires it |

Authority to operate (ATO), identity (Login.gov / agency IdP), logging, data residency, and pen tests sit with the **application owner and their host** — not with `@powers/ui`.

---

## What we provide (honest)

| Area | Status |
|---|---|
| Product UI + Figma alignment | Strong — kit + Code Connect path |
| Secure-by-default rendering | Text via `textContent`; see [SECURITY.md](../SECURITY.md) |
| Accessibility trajectory | Focus management in overlays/menus; formal VPAT / Section 508 **not yet** — roadmap when funded |
| Supply chain | Private monorepo today; lockfile in CI; SBOM when publishing |
| Deploy on *their* hardened hosts | Static website folder — [DEPLOY.md](./DEPLOY.md) (+ gov checklist) |
| Commercial / contractor terms | [LICENSE-COMMERCIAL.md](../LICENSE-COMMERCIAL.md) · [OFFER.md](./OFFER.md) |

## What we do **not** provide

- FedRAMP authorization of the Powers packages  
- Guaranteed Section 508 / WCAG conformance certificate (yet)  
- Built-in Login.gov / CAC / PIV  
- Hosting of CUI / PII on Powers marketing demos  

If a contracting officer asks “Is Powers FedRAMP?” answer:

> **No. Powers is a UI system.** The deployed application and its accredited environment hold the ATO. We help teams build accessible, maintainable interfaces that fit inside that environment.

---

## Buyer guidance

| You are… | Do this |
|---|---|
| **Vendor / freelancer building a gov app** | Use Powers under BSL; deploy to the customer’s host; follow [SECURITY.md](../SECURITY.md) + [DEPLOY.md](./DEPLOY.md) |
| **Agency wanting Powers as the standard kit** | Talk commercial license — [LICENSE-COMMERCIAL.md](../LICENSE-COMMERCIAL.md) |
| **Looking for a website builder + gov hosting** | Wrong product — Powers is not Squarespace |

---

## Compliance roadmap (paid / on-demand)

These are **real** next steps when revenue justifies them — not checkbox theater:

1. Accessibility audit of core controls → gaps doc → fixes  
2. VPAT / Section 508 report (often via consultant)  
3. SBOM + signed releases when packages are published  
4. Pen-test of a **reference app**, not “the whole monorepo is secure” mythology  

---

## Related

- [SECURITY.md](../SECURITY.md) — reporting, secrets, app-builder XSS/CSP  
- [DEPLOY.md](./DEPLOY.md) — static deploy + public-sector checklist  
- [OFFER.md](./OFFER.md) — who pays  
- [LICENSING.md](./LICENSING.md) — BSL model  

*Not legal advice. Procurement and ATO decisions belong to counsel and the authorizing official.*
