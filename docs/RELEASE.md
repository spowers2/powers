# Public release checklist

Use this before the first public npm publish / website launch.

**Repo today:** private monorepo **https://github.com/spowers2/powers** · product **Powers** · **BSL-1.1** (source-available) + commercial path + trademark policy.

---

## Product readiness

- [x] Core story is clear: **runtime + design system**, not “React alternative + Tailwind”  
      (README + docs hub: fine-grained kit with design system built in)
- [x] Demo site routes work: `/` · `/docs` · `/lab` · `/system`
- [x] Lab recipes load, teach (goal / learn / how / try), and run with design-system CSS in the iframe
- [x] Design tokens retheme via `packages/ui/src/styles/tokens.css` only
- [x] Light + dark theme smoke-tested (browser smoke + Hearth guest/staff)
- [x] Dense / comfortable density smoke-tested (System page)

## Packages

| Package | Ready? | Notes |
|---|---|---|
| `@powers/core` | [x] | signals, computed, effect, store, resource · size OK |
| `@powers/dom` | [x] | mount, JSX, Show, For, props · size OK |
| `@powers/animate` | [x] | tween / spring (GSAP **not** required) · size OK |
| `@powers/router` | [x] | history / hash / memory · size OK |
| `@powers/ssr` | [x] | string render + islands (document limits) · tests green |
| `@powers/ui` | [x] | tokens + primitives · size OK (full + form-kit) |

## Quality gates

- [x] `pnpm run check` green (**typecheck · test · size budgets**) — 2026-08-17  
  (alias: `pnpm run ci` → same; bare `pnpm ci` is **not** this script)
- [x] CI Node **22**; `engines.node` `>=20`
- [x] `pnpm size` within ceilings in [`SIZE.md`](./SIZE.md)
- [x] No accidental private secrets in the repo (`.env*` gitignored; none committed)
- [x] `package.json` names `@powers/*`, exports present, UI `sideEffects` for CSS
- [x] README install + 30-second example for public readers
- [x] [`STABLE.md`](./STABLE.md) + [`GOLDEN_PATH.md`](./GOLDEN_PATH.md) current for Powers
- [x] Design-kit: `pnpm design-kit:check` + Figma plugin build in CI
- [x] `@powers/*` marked **`private: true`** until deliberate public npm cut

## Docs (public hub)

- [x] [`docs/README.md`](./README.md) is the entry  
- [x] LEARN · STYLING · DESIGN_SYSTEM · POWER_LAB · ROADMAP present  
- [x] CONTRIBUTING present  
- [x] LICENSE (BSL-1.1) + LICENSE-COMMERCIAL.md + NOTICE at repo root  
- [x] LICENSING.md · TRADEMARKS.md · DCO in CONTRIBUTING · SECURITY.md  
- [x] All package.json `license` fields = `BUSL-1.1`  
- [x] Design kit + Figma plugin docs under [`design-kit/`](../design-kit/README.md)

## Design / Figma

- [x] Tokens export + 49-component catalog  
- [x] Figma plugin id `1671016490810398688` (Community submit)  
- [ ] Plugin **approved/live** on Community (watch review)  
- [ ] Publish **Powers UI Kit** as a Figma library  
- [ ] Optional: Pro SKU (`design-kit/pro/`)

## Publish sequence (still open — first public cut)

1. [ ] Set coordinated versions (today: independent; core `0.1.1`, dom `0.3.0`, others `0.1.0` — document or align)
2. [ ] Switch package exports from `src` → built `dist` for consumers
3. [ ] Remove `"private": true` only when ready; `npm publish --access public` — **BUSL-1.1**
4. [ ] Tag `v0.1.0` (or matching)
5. [ ] Optional: GitHub Pages / marketing site from `examples/browser` build
6. [x] Rename GitHub repo → `powers` + update local remote  
7. [ ] Optional: register **Powers** trademark (see TRADEMARKS.md)
8. [ ] **Make repo public** only when you are ready (does not equal npm publish)
9. [ ] Announce with link to Lab + LEARN — say **source-available (BSL)**, not “open source”
10. [ ] Optional: LemonSqueezy / Gumroad SKU for commercial / Pro (see LICENSING.md)

Core is **BSL-1.1** by design (protect Competing Offerings + commercial path). See [LICENSING.md](./LICENSING.md).

## Explicitly later

- GSAP optional adapter — shipped as `@powers/animate/gsap` (peer)  
- Streaming SSR  
- Full a11y audit / ARIA cookbook  
- Syntax highlight upgrade (Tree-sitter / CodeMirror) if Lab outgrows the lightweight highlighter  
- AI Lab features (parked)

---

**Last updated:** 2026-08-17 — harden pass: private packages, design-kit CI, clean dist, SECURITY.md; **npm/public still pending**.
