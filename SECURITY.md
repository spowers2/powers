# Security

## Reporting

If you find a vulnerability in Powers, contact the repository owner privately:

- GitHub **Security advisory** on [spowers2/powers](https://github.com/spowers2/powers)  
- Or email [spowers2@me.com](mailto:spowers2@me.com?subject=Powers%20security) with subject **Powers security**

Do not open a public issue with exploit details.

## Secrets

- Never commit API keys, Figma personal access tokens, or `.env.local`.
- Figma tokens for design-kit audits belong only in gitignored `.env.local` (see `.env.example`).
- Rotate tokens if they are pasted into chat, tickets, or screenshots.

## Supply chain

- Prefer `pnpm install --frozen-lockfile` in CI.
- Public packages: `@lab206/*` and `create-powers` on npm (use **0.1.5+** only; 0.1.0–0.1.2 are deprecated). Prefer `pnpm publish` so `workspace:*` deps rewrite.
- Keep shipping lockfile discipline; plan an SBOM (e.g. CycloneDX) for downstream compliance teams.

---

## For app builders (XSS, HTML, CSP)

Powers is a **UI runtime + component kit**. It does not replace your auth, API, or hosting hardening.

### What Powers aims to do

| Behavior | Detail |
|---|---|
| **Default text is safe** | Children and `text` props go through `textContent` / text nodes — not HTML parse |
| **Fixed chrome markup** | A few components set `innerHTML` to **constant, trusted** snippets (e.g. checkbox check SVG, layout spacers). Not user input. |
| **Overlays / focus** | Dialogs, drawers, menus use focus trap / restore patterns meant for keyboard users |

### What your app must do

| Risk | Your responsibility |
|---|---|
| **Untrusted HTML** | Do **not** pass attacker-controlled strings as `innerHTML` (the DOM layer allows the prop for advanced cases). Sanitize or avoid HTML. Prefer text children. |
| **URLs** | Validate `href` / navigations; avoid `javascript:` URLs from user data |
| **Secrets in the bundle** | Anything in a static `dist/` is public. No API keys in client code. |
| **Auth / sessions** | Use your IdP (Auth0, Cognito, Login.gov, agency SSO). Powers has no built-in auth. |
| **CSP** | Prefer a Content-Security-Policy. Powers UI injects `<style>` for some primitives — allow `'unsafe-inline'` for styles **or** plan a nonce/hash strategy if your policy forbids inline CSS. Scripts from your Vite build are normal external files (good for `script-src`). |
| **Dependencies** | Keep the monorepo / lockfile updated; run your own vuln scanning on the app you ship |

### Example: prefer text, not HTML

```tsx
// Good — treated as text
<Text>{userDisplayName}</Text>

// Dangerous — only if you fully trust or sanitize the string
<div innerHTML={untrustedCmsHtml} />
```

---

## Public sector

Powers is used to build product UIs in many environments, including public-sector projects. See [docs/GOVERNMENT.md](./docs/GOVERNMENT.md).

## Related

- [docs/DEPLOY.md](./docs/DEPLOY.md) — ship static apps; public-sector host checklist  
- [docs/OFFER.md](./docs/OFFER.md) — commercial licensing for contractors / agencies  
