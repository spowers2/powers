# Public release checklist

Use this before the first public npm publish / website launch.

**Repo:** **https://github.com/spowers2/powers** · product **Powers** · site **[lab206.com](https://lab206.com)** · **BSL-1.1** (source-available) + commercial path + trademark policy.

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
| `@lab206/core` | [x] | signals, computed, effect, store, resource · size OK |
| `@lab206/dom` | [x] | mount, JSX, Show, For, props · size OK |
| `@lab206/animate` | [x] | tween / spring (GSAP **not** required) · size OK |
| `@lab206/router` | [x] | history / hash / memory · size OK |
| `@lab206/ssr` | [x] | string render + islands (document limits) · tests green |
| `@lab206/ui` | [x] | tokens + primitives · size OK (full + form-kit) |

## Quality gates

- [x] `pnpm run check` green (**typecheck · test · size budgets**) — 2026-08-17  
  (alias: `pnpm run ci` → same; bare `pnpm ci` is **not** this script)
- [x] CI Node **22**; `engines.node` `>=20`
- [x] `pnpm size` within ceilings in [`SIZE.md`](./SIZE.md)
- [x] No accidental private secrets in the repo (`.env*` gitignored; none committed)
- [x] `package.json` names `@lab206/*`, exports present, UI `sideEffects` for CSS
- [x] README install + 30-second example for public readers
- [x] [`STABLE.md`](./STABLE.md) + [`GOLDEN_PATH.md`](./GOLDEN_PATH.md) current for Powers
- [x] Design-kit: `pnpm design-kit:check` + Figma plugin build in CI
- [x] `@lab206/*` marked **`private: true`** until deliberate public npm cut

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
- [x] Figma plugin id `1671016490810398688`  
- [x] Plugin **approved / live** on [Figma Community](https://www.figma.com/community/plugin/1671016490810398688)  
- [x] Publish **Powers UI Kit** as a Figma library (use in product files)  
- [ ] Optional: Pro SKU (`design-kit/pro/`)

## Public debut sequence (site + GitHub — **not** npm)

1. [x] lab206.com live with Lab · Docs · System · demos · Figma plugin link  
2. [x] README for strangers (lab206.com first; source-available wording)  
3. [x] Announce draft — [ANNOUNCE.md](./ANNOUNCE.md)  
4. [x] Secret sweep (`.env.local` gitignored; no real tokens in git history)  
5. [x] **`pnpm run check` green** (2026-08-22)  
6. [x] **Push `main`** · **GitHub repo is public** (2026-08-22) · homepage https://lab206.com  
7. [x] GitHub Release announce — [v0.1.2](https://github.com/spowers2/powers/releases/tag/v0.1.2) (X still optional — paste from [ANNOUNCE.md](./ANNOUNCE.md))  
8. [x] Light `main` protection — no force-push/delete; CI status check on PRs; admins not enforced  
9. [ ] Optional: rotate Figma PAT if it was ever pasted outside `.env.local`  
10. [ ] Optional: post short social from [ANNOUNCE.md](./ANNOUNCE.md)

## npm cut (`0.1.2`)

1. [x] Coordinated versions — all `@lab206/*` at **0.1.2**
2. [x] Exports point at **`dist`** (plus `development` → `src` for monorepo Vite)
3. [x] `"private": false` + `publishConfig.access: public`
4. [x] **`pnpm publish:packages`** → `@lab206/*@0.1.2` (use pnpm so `workspace:*` rewrites)
5. [x] Tag **`v0.1.2`** on GitHub
6. [x] Announce npm install in release notes + [ANNOUNCE.md](./ANNOUNCE.md)
7. [ ] Optional: LemonSqueezy / Gumroad SKU for commercial / Pro
8. [ ] Optional: register **Powers** trademark (see TRADEMARKS.md)

Dry run: `pnpm publish:dry-run` · Docs: [NPM.md](./NPM.md)

Core is **BSL-1.1** by design (protect Competing Offerings + commercial path). See [LICENSING.md](./LICENSING.md).

## Explicitly later

- GSAP optional adapter — shipped as `@lab206/animate/gsap` (peer)  
- Streaming SSR  
- Full a11y audit / ARIA cookbook (VPAT / Section 508 when funded — see [GOVERNMENT.md](./GOVERNMENT.md))  
- Syntax highlight upgrade (Tree-sitter / CodeMirror) if Lab outgrows the lightweight highlighter  
- AI Lab features (parked)

---

**Last updated:** 2026-08-23 — public debut + npm `@lab206/*@0.1.2` + release tag + light `main` protection.
