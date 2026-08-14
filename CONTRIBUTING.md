# Contributing to Power UX

Written for **public contributors** as well as maintainers. The repo may be private today; this guide is launch-ready.

## Setup

```bash
pnpm install
pnpm run check         # typecheck · test · size budgets (what CI runs)
pnpm build
pnpm example:browser   # http://localhost:5173
```

Requirements: **Node ≥ 20**, **pnpm ≥ 9**.

Size ceilings: [`docs/SIZE.md`](./docs/SIZE.md). Runtime contracts: [`docs/FOUNDATION.md`](./docs/FOUNDATION.md).

## Docs first

Public documentation lives under [`docs/`](./docs/README.md). When you change behavior:

1. Update the matching doc (`LEARN`, `STYLING`, `DOM`, package guide, …).  
2. Keep [`docs/README.md`](./docs/README.md) links accurate.  
3. Prefer teaching examples that match Power Lab recipes when possible.

## Packages

| Package | Change when… |
|---|---|
| `packages/core` | Reactivity graph, store, resource |
| `packages/dom` | mount, h, JSX, bindings, lists |
| `packages/animate` | Tweens / springs |
| `packages/router` | Routing |
| `packages/ssr` | String SSR / islands |
| `packages/ui` | **Tokens, primitives, utilities** (styling system) |

Rules:

- Export only through each package’s `src/index.ts` (or documented CSS exports).  
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

Present-tense, scoped messages:

- `feat(ui): add Alert primitive`
- `fix(dom): support function components in h()`
- `docs: expand STYLING for public readers`

## Branching

`main` is the default branch.

## Do not

- Commit secrets or `.env` files  
- Expand into GSAP unless the roadmap says it’s time (parked optional path)  
- Break the “one install just works” story without an escape hatch  

## Questions

Check [`docs/ROADMAP.md`](./docs/ROADMAP.md) for sequence and parked work before large features.
