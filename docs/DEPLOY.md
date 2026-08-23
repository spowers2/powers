# Put your Powers app on the internet

**Checklist**

- [ ] Build the website folder  
- [ ] Make an upload zip (optional but handy)  
- [ ] Upload to your host (File Manager or FTP)  
- [ ] Open your domain and click around  
- [ ] Refresh an inner page — it should still work  

You do **not** need Node on the server for a normal Powers app.  
You do **not** need Netlify, Vercel, or a special “Powers host.”  
Any place that can serve a normal website (GoDaddy, cPanel, LiveCode static folder, a VPS `nginx` root, etc.) works.

---

## What you’re doing (30 seconds)

A Powers app **builds into a website folder**: HTML + CSS + JavaScript.

That folder **is** the site. You upload it the same way you’d upload any static site.

```text
Your project  →  build  →  website folder (dist/)  →  upload  →  https://yoursite.com
```

---

## 1. Prepare the files

From the monorepo (example: designlab206 starter):

```bash
# at repo root
pnpm --filter @lab206/app-starter build
pnpm --filter @lab206/app-starter deploy:zip
```

Or inside the app folder:

```bash
cd examples/app-starter
pnpm build
pnpm deploy:zip
```

**Result:**

| Path | Meaning |
|---|---|
| `dist/` | Website folder (upload these files) |
| `site-upload.zip` | Same contents, zipped for File Manager |

Minimal apps from `pnpm create-app` use the same scripts once you’re in that app folder.

---

## 2. Upload (GoDaddy / cPanel style)

These steps are the same idea on most shared hosts.

1. Log into your host → open **File Manager**.  
2. Go to the site’s web root (often `public_html`).  
3. **Upload** `site-upload.zip`.  
4. **Extract** it so `index.html` sits in the web root (not buried in an extra folder unless you want a subdirectory).  
5. Visit your domain.

**FTP alternate:** upload everything inside `dist/` into the web root.

### Subdirectory (example.com/app/)

1. Put files in `public_html/app/`.  
2. Rebuild with a base path (in that app’s `vite.config.ts`):

```ts
export default defineConfig({
  base: "/app/",
  // …existing config
});
```

3. Rebuild and upload again.

---

## 3. Check that it works

| Check | Good |
|---|---|
| Homepage loads | Layout, theme, buttons look right |
| Click an inner page | URL changes; page content changes |
| Refresh on that inner page | Still works (not a host 404) |
| Mobile width | Usable on a phone |

---

## If something’s wrong

| Symptom | Likely fix |
|---|---|
| Domain shows host default page | Files aren’t in the right web root |
| Blank white page | Open browser console; often wrong `base` path or missing files |
| Homepage OK, refresh on `/clients` → 404 | Need the Apache helper file (see below) **or** use simple links |
| Styles / JS 404 | `assets/` folder didn’t upload; re-upload full `dist/` |
| Looks unstyled fonts | Host blocks Google Fonts; or you’re offline — app still works with fallbacks |

### Page links after refresh (Apache / GoDaddy)

Powers apps use in-app page links. On Apache, the build includes a small helper file (`.htaccess`) so refresh keeps working.

If your host **ignores** `.htaccess`, switch the router to **simple links** in code:

```ts
createRouter({
  mode: "hash", // URLs look like /#/clients — works almost everywhere
  routes: [/* … */],
});
```

That’s optional. Try the default first.

---

## What you do *not* upload

- `node_modules/`  
- Powers source packages  
- Your `.env.local` or secrets  

Only the **website folder** (`dist/` contents). The server just serves files.

---

## Node / SSR (optional later)

Most Powers apps are client UI + maybe `localStorage` or external APIs. **Static upload is enough.**

If you later need server rendering (`@lab206/ssr`) or your own API on the same machine, you need a **Node-capable host** (VPS, “Node app” product, etc.). That’s a different setup — not required to ship a normal Powers UI app. See [SSR.md](./SSR.md) when you’re ready.

Powers is a **product UI system**, not a Squarespace replacement. Hosting the finished app is ordinary website hosting.

---

## Public-sector / hardened host checklist

Use this when shipping into a hardened or regulated customer environment (not lab206 demos). See [GOVERNMENT.md](./GOVERNMENT.md).

- [ ] **HTTPS only** (redirect HTTP → HTTPS at the edge)  
- [ ] **Security headers** as required by the agency (examples teams often set): `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Frame-Ancestors` / clickjacking controls  
- [ ] **No secrets** in the uploaded website folder (see [SECURITY.md](../SECURITY.md))  
- [ ] **Auth** via the customer IdP (Login.gov, agency SSO, etc.) — not baked into Powers  
- [ ] **APIs** on accredited backends; browser calls only over TLS  
- [ ] **Logging / monitoring** owned by the system operator  
- [ ] **Accessibility** plan (Powers components help; formal VPAT is separate — [GOVERNMENT.md](./GOVERNMENT.md))  
- [ ] **Supply chain** — pin versions / lockfile; scan the app you ship  

Do **not** put real CUI/PII only on a casual shared-host demo account. Use the customer’s approved environment.

---

## lab206.com on LiveCode

Full demos (Lab + designlab206 + Hearth) as one upload:

```bash
pnpm build:lab206
# → sites/lab206.com/  and  sites/lab206.com.zip
```

See [LAB206_LIVECODE.md](./LAB206_LIVECODE.md).

---

## Related

- [GETTING_STARTED.md](./GETTING_STARTED.md) — create and run locally  
- [LAB206_LIVECODE.md](./LAB206_LIVECODE.md) — domain → LiveCode directory  
- [OFFER.md](./OFFER.md) — free vs paid (commercial / Pro)  
- [GOVERNMENT.md](./GOVERNMENT.md) — public-sector stance  
- [SECURITY.md](../SECURITY.md) — XSS / CSP / secrets  
- [ROUTER.md](./ROUTER.md) — `history` vs `hash` modes  
