# Security

## Reporting

If you find a vulnerability in Powers, contact the repository owner privately (GitHub security advisory or owner contact). Do not open a public issue with exploit details.

## Secrets

- Never commit API keys, Figma personal access tokens, or `.env.local`.
- Figma tokens for design-kit audits belong only in gitignored `.env.local` (see `.env.example`).
- Rotate tokens if they are pasted into chat, tickets, or screenshots.

## Supply chain

- Prefer `pnpm install --frozen-lockfile` in CI.
- Packages are **not** published to npm until an explicit release; treat `@powers/*` as monorepo-private for now.
