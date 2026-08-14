# Public release checklist

Use this before the first public npm publish / website launch.

**Repo today:** private monorepo (GitHub remote may still be named `power-ui`; product name is **Powers**) · MIT license present.

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

- [x] `pnpm run check` green (**typecheck · test · size budgets**) — 2026-08-13  
  (alias: `pnpm run ci` → same; bare `pnpm ci` is **not** this script)
- [x] `pnpm size` within ceilings in [`SIZE.md`](./SIZE.md)
- [x] No accidental private secrets in the repo (`.env*` gitignored; none committed)
- [x] `package.json` names `@powers/*`, exports present, UI `sideEffects` for CSS
- [x] README install + 30-second example for public readers
- [x] [`STABLE.md`](./STABLE.md) + [`GOLDEN_PATH.md`](./GOLDEN_PATH.md) current for Powers

## Docs (public hub)

- [x] [`docs/README.md`](./README.md) is the entry  
- [x] LEARN · STYLING · DESIGN_SYSTEM · POWER_LAB · ROADMAP present  
- [x] CONTRIBUTING present  
- [x] LICENSE (MIT) at repo root  

## Publish sequence (still open — first public cut)

1. [ ] Set coordinated versions (`0.1.0` or keep current package versions and tag)
2. [ ] Build packages that emit `dist` if required for publish
3. [ ] `npm publish --access public` per package (or changesets)
4. [ ] Tag `v0.1.0` (or matching)
5. [ ] Optional: GitHub Pages / marketing site from `examples/browser` build
6. [ ] Optional: rename GitHub repo `power-ui` → `powers` + update remote
7. [ ] Announce with link to Lab + LEARN  

## Explicitly later

- GSAP optional adapter — shipped as `@powers/animate/gsap` (peer)  
- Streaming SSR  
- Full a11y audit / ARIA cookbook  
- Syntax highlight upgrade (Tree-sitter / CodeMirror) if Lab outgrows the lightweight highlighter  

---

**Last updated:** Sprint E — `pnpm run check` green; checklist product gates closed; **npm publish still pending**.
