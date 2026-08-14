# Power Lab

Interactive learning playground for Powers — **our own**, not a CodePen clone.

**Route:** `/lab` in the browser demo  
**Goal:** learn by editing real Powers code with an instant preview.

## Why it’s different

| CodePen / JSFiddle | Power Lab |
|---|---|
| Generic HTML/CSS/JS | First-class **signals, JSX, animate, UI kit** |
| Blank canvas tax | **Recipe curriculum** with teaching tips |
| Accounts / noise | Zero login — open and type |
| Opaque runtime | Same packages as the docs app |
| Share often brittle | **Shareable hash links** (`#lab/...`) |

## How it works

1. You edit TSX in the left pane (imports allowed for teaching).  
2. **esbuild-wasm** compiles in the browser.  
3. Imports are stripped; a live **Power Lab API** is injected (core, dom, animate, ui).  
4. Preview runs in a **sandboxed iframe**.  
5. Console captures `console.*` and compile/runtime errors.  

## Shortcuts

- **⌘/Ctrl + Enter** — Run  
- **Tab** — insert 2 spaces  
- **Auto-run** — debounced recompile while typing  
- **Copy share link** — encodes code (+ recipe id) in the URL hash  

## Recipes

Ordered curriculum with **Goal / Learn / How / Try this** on each card:

Hello · Computed · Spring · GSAP · Lists · Design system · Form · **createField** · **Cookbook: settings** · **Cookbook: admin-list** · Menu · Motion · Challenge · …

Deep-link examples: `/lab?recipe=form` · `/lab?recipe=settings` · `/lab?recipe=admin-list`

## Editor

- Lightweight **syntax highlighting** (keywords, strings, components) under a transparent textarea  
- Line/char meta · Tab inserts spaces · ⌘/Ctrl+Enter runs

## Try it

```bash
pnpm example:browser
# open http://localhost:5173/lab
```
