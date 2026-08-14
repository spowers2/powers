# Public release checklist

Use this before the first public npm publish / website launch.

**Repo today:** private `spowers2/power-ux` · MIT license already present.

---

## Product readiness

- [ ] Core story is clear: **runtime + design system**, not “React alternative + Tailwind”
- [ ] Demo site routes work: `/` · `/docs` · `/lab` · `/system`
- [ ] Lab recipes load, teach (goal / learn / how / try), and run with design-system CSS in the iframe
- [ ] Design tokens retheme via `packages/ui/src/styles/tokens.css` only
- [ ] Light + dark theme smoke-tested
- [ ] Dense / comfortable density smoke-tested

## Packages

| Package | Ready? | Notes |
|---|---|---|
| `@power-ux/core` | [ ] | signals, computed, effect, store, resource |
| `@power-ux/dom` | [ ] | mount, JSX, Show, For, props |
| `@power-ux/animate` | [ ] | tween / spring (GSAP **not** required) |
| `@power-ux/router` | [ ] | history / hash / memory |
| `@power-ux/ssr` | [ ] | string render + islands (document limits) |
| `@power-ux/ui` | [ ] | tokens + primitives |

## Quality gates

- [ ] `pnpm ci` green (**typecheck · test · size budgets**)  
- [ ] `pnpm size` within ceilings in [`SIZE.md`](./SIZE.md)  
- [ ] No accidental private secrets in the repo  
- [ ] `package.json` names, versions, exports, `sideEffects` for CSS  
- [ ] README install + 30-second example for public readers  
- [ ] [`STABLE.md`](./STABLE.md) + [`GOLDEN_PATH.md`](./GOLDEN_PATH.md) still accurate  

## Docs (public hub)

- [ ] [`docs/README.md`](./README.md) is the entry  
- [ ] LEARN · STYLING · DESIGN_SYSTEM · POWER_LAB · ROADMAP current  
- [ ] CONTRIBUTING present and accurate  
- [ ] LICENSE (MIT) at repo root  

## Publish sequence (suggested)

1. Set versions (`0.1.0` or coordinated set)  
2. Build packages that emit `dist` if any  
3. `npm publish --access public` per package (or changesets)  
4. Tag `v0.1.0`  
5. Optional: GitHub Pages / marketing site from `examples/browser` build  
6. Announce with link to Lab + LEARN  

## Explicitly later

- GSAP optional adapter — shipped as `@power-ux/animate/gsap` (peer)  
- Streaming SSR  
- Full a11y audit / ARIA cookbook  
- Syntax highlight upgrade (Tree-sitter / CodeMirror) if Lab outgrows the lightweight highlighter  

---

**Last updated:** Power UX rename · Combobox/Command loading · micro-interaction audit.
