# Contributing to Powers

Written for **public contributors** as well as maintainers. The repo is public on GitHub: [spowers2/powers](https://github.com/spowers2/powers).

## License & DCO

- Code is licensed under the **[Business Source License 1.1](./LICENSE)** (source-available; not OSI open source until the Change Date).  
- By contributing, you agree your work is under the same license (BSL-1.1, then Change License on the Change Date).  
- **Developer Certificate of Origin (DCO):** every commit must be signed off:

```bash
git commit -s -m "feat(ui): …"
```

That adds `Signed-off-by: Your Name <you@example.com>` (use the email tied to your GitHub account).

Licensing strategy & commercial notes: [`docs/LICENSING.md`](./docs/LICENSING.md) · [`docs/COMMERCIAL.md`](./docs/COMMERCIAL.md).  
Trademark: [`docs/TRADEMARKS.md`](./docs/TRADEMARKS.md).

## Consumers vs contributors

- **Using Powers in an app:** `pnpm create powers my-app` or install `@lab206/*@0.1.6+` — see [`docs/NPM.md`](./docs/NPM.md).  
- **Changing Powers itself:** this file + the monorepo setup below.

## Setup

```bash
pnpm install
pnpm run check         # typecheck · test · size budgets
pnpm smoke:consumer    # Vite template builds against workspace packages (also in CI)
pnpm build
pnpm example:browser   # http://localhost:5173 — Lab · Docs · System
```

Requirements: **Node ≥ 20**, **pnpm ≥ 9** (`packageManager` in root `package.json`).

Size ceilings: [`docs/SIZE.md`](./docs/SIZE.md). Runtime contracts: [`docs/FOUNDATION.md`](./docs/FOUNDATION.md).

## Docs first

Public documentation lives under [`docs/`](./docs/README.md). Live site: [lab206.com/docs](https://lab206.com/docs). When you change behavior:

1. Update the matching doc (`LEARN`, `STYLING`, `DOM`, `NPM`, package guide, …).  
2. Keep [`docs/README.md`](./docs/README.md) links accurate.  
3. Prefer teaching examples that match Power Lab recipes when possible.  
4. If the change affects first-time install/Vite, update **both** repo docs and the in-app Docs page (`examples/browser`).

## Packages (`@lab206/*`)

| Package | Change when… |
|---|---|
| `packages/core` | Reactivity graph, store, resource |
| `packages/dom` | mount, h, JSX, bindings, lists |
| `packages/animate` | Tweens / springs · optional `@lab206/animate/gsap` |
| `packages/router` | Routing |
| `packages/ssr` | String SSR / islands |
| `packages/ui` | **Tokens, primitives, utilities** (styling system) |
| `packages/create-powers` | `pnpm create powers` scaffold template |

Rules:

- Export only through each package’s `src/index.ts` (or documented CSS exports).  
- Published `exports` must point **`import` / `types` at `dist`** — do **not** add `"development": "./src/…"` (that breaks consumer Vite with a React JSX transform). Monorepo HMR uses [`examples/powers-vite-alias.mjs`](./examples/powers-vite-alias.mjs).  
- Publish with **`pnpm publish`** (rewrites `workspace:*`) — never bare `npm publish` from a workspace package.  
- **UI components must use `--pu-*` tokens only** — no hard-coded brand hex in component files.  
- Prefer new **primitives** over exploding **utilities**. Utilities stay token-mapped and BEM-ish.  
- Every public runtime API should have a test under `src/*.test.ts`.  
- Changing FOUNDATION contracts or size budgets needs tests/docs in the same PR.  
- Prefer the [golden path](./docs/GOLDEN_PATH.md) over new starter apps when teaching.

## Styling architecture

See [`docs/STYLING.md`](./docs/STYLING.md):

1. Tokens  
2. Primitives  
3. Optional utilities  

Do **not** add a full Tailwind clone. Do **not** require an external CSS framework for demos.

## Commits

Present-tense, scoped messages, **with DCO** (`git commit -s`):

- `feat(ui): add Alert primitive`
- `fix(dom): support function components in h()`
- `docs: expand STYLING for public readers`

## Branching

`main` is the default branch. Light protection: CI status checks expected; no force-push.

## Do not

- Commit secrets or `.env` files  
- Reintroduce package `exports.development` → `src`  
- Break the “one install just works” story (`create powers` / `@lab206/*@0.1.6+`) without an escape hatch  

## Questions

Check [`docs/ROADMAP.md`](./docs/ROADMAP.md) and [`docs/NEXT.md`](./docs/NEXT.md) before large features.  
Contact / commercial: [lab206.com/contact](https://lab206.com/contact).
