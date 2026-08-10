# Contributing to Power UI

Private repository for now. This document is for the maintainer(s).

## Setup

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm build
```

## Packages

- Change reactivity in `packages/core`.
- Keep the public surface small; export only through `src/index.ts`.
- Every public API needs a test in `src/*.test.ts`.

## Commits

Prefer clear, present-tense messages:

- `feat(core): add untrack helper`
- `fix(core): cover nested batch behavior`
- `docs: expand manifesto non-goals`

## Branching

`main` is the default branch. Feature branches optional while solo.

## Do not

- Commit secrets or `.env` files
- Expand scope into DOM/compiler until Phase 1 metrics feel solid
