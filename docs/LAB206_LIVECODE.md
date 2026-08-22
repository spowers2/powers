# lab206.com on LiveCode

Host the Powers demos on your LiveCode server and point **lab206.com** at that directory.

## Local preview (right now)

| Demo | URL |
|---|---|
| Lab · System · Docs | http://localhost:5173/ |
| designlab206 | http://localhost:5180/ |
| Hearth | http://localhost:5181/ |

```bash
pnpm example:browser    # :5173
pnpm example:starter    # :5180
pnpm example:restaurant # :5181
```

## Site layout (production)

| Path | App |
|---|---|
| `/` | Lab landing |
| `/lab` | Power Lab |
| `/system` | Design system |
| `/docs` | Docs |
| `/contact` | Contact **form** (no mail app) → `contact.php` → scott@lab206.com |
| `/workspace/` | designlab206 (hash routes: `/workspace/#/clients`) |
| `/hearth/` | Hearth (hash routes: `/hearth/#/menu`) |

Sub-apps use **hash routing** so deep links work even if LiveCode does not honor Apache `.htaccess` rewrites. Lab at the domain root uses normal paths when rewrites work.

**Contact form:** the site root must include `contact.php` (copied from `public/` on build). cPanel needs PHP `mail()` enabled, and a mailbox/forwarder for **scott@lab206.com**.

## Build the upload folder

From the monorepo root:

```bash
pnpm build:lab206
```

Creates:

- `sites/lab206.com/` — upload this **entire** folder  
- `sites/lab206.com.zip` — same contents, zipped  

## DNS

1. In your domain registrar for **lab206.com**, set:
   - **A record** → LiveCode server IP, **or**
   - **CNAME** → the hostname LiveCode gives you  
2. In LiveCode hosting, attach **lab206.com** (or the matching site) to the **document root / directory** where you will upload the files.  
3. Wait for DNS (often minutes–hours). Check with `dig lab206.com` or your registrar’s DNS tool.

## Upload (cPanel File Manager)

Most LiveCode / shared hosts give you **cPanel → File Manager**. Use that.

1. On your Mac, the zip is:  
   `sites/lab206.com.zip`  
   (full path: monorepo `…/power-ui/sites/lab206.com.zip`)
2. cPanel → **File Manager**.
3. Open the folder for **lab206.com**:
   - Often `public_html` if this is the **main** domain on the account, **or**
   - `public_html/lab206.com` / `lab206.com` / a domain folder if it’s an **addon domain**  
   (cPanel → **Domains** / **Addon Domains** shows which folder is tied to lab206.com.)
4. Optional: delete old placeholder `index.html` in that folder so it doesn’t confuse you.
5. **Upload** → choose `lab206.com.zip`.
6. Right‑click the zip → **Extract**.
7. You should see **in that folder** (not inside another nested folder):
   - `index.html`
   - `assets/`
   - `workspace/`
   - `hearth/`
   - `.htaccess`
8. If extract created an extra nested `lab206.com` folder, move those files **up** one level into the domain folder.
9. Visit `https://lab206.com/` (cPanel → SSL / Let’s Encrypt if HTTPS isn’t on yet).

SFTP/FTP works the same: upload into the same domain folder and unzip (or upload the unzipped files).

## Verify

- [ ] `https://lab206.com/` loads Lab home  
- [ ] `https://lab206.com/lab` works (refresh once)  
- [ ] `https://lab206.com/workspace/` opens designlab206  
- [ ] Click Clients — URL like `/workspace/#/clients`  
- [ ] `https://lab206.com/hearth/` opens Hearth  

## If the page is blank / MIME errors for JS/CSS

Browser console says something like:

> Loading module … was blocked because of a disallowed MIME type (“text/html”)

That usually means the server returned **HTML** (often `index.html` or a 404 page) instead of the real `.js` / `.css` file.

**Checklist:**

1. In File Manager, open `assets/` and confirm files like `index-….js` and `index-….css` are really there.  
2. Re-upload a fresh `sites/lab206.com.zip` (the `.htaccess` must only rewrite **missing** paths, not `/assets/*`).  
3. Hard-refresh the browser (or clear cache).

## If Lab deep links 404 on refresh

Host may not run `.htaccess`. Options:

1. Use in-app navigation (works without rewrite), or  
2. Rebuild Lab with hash mode too (ask / we can switch), or  
3. Host-specific rewrite for unknown paths → `index.html`  

`/workspace/` and `/hearth/` already use hash routes for this reason.

## Rebuild after code changes

```bash
pnpm build:lab206
# re-upload sites/lab206.com/ (or zip)
```

## Related

- [DEPLOY.md](./DEPLOY.md) — general static hosting  
- [OFFER.md](./OFFER.md) — product positioning  
- [GOVERNMENT.md](./GOVERNMENT.md) — demos ≠ ATO’d production data  
- Figma plugin (live): [Community · Powers Design Kit](https://www.figma.com/community/plugin/1671016490810398688)  
