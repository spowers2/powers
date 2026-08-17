# Powers Design Kit — Community playground file

Figma Community often asks for a **playground / demo file** users can duplicate.

## What to put in the playground `.fig`

Create a file named **`Powers Design Kit — Playground`** with:

### Page: Cover
- Title: Powers Design Kit  
- Tagline: Sync tokens & audit your UI kit  
- Link note: Run plugin **Powers Design Kit** (Development or Community)  
- Steps: 1 Sync Variables · 2 Audit · 3 Browse Components · 4 Try Patterns  

### Page: Components
- Duplicate (or instance) a **subset** of the kit so the file stays light:
  - Text, Button, Input, Field, Checkbox, Switch  
  - Badge, Card, Alert  
  - Dialog, Tabs  
- Label: “Full kit lives in Powers UI Kit source file”

### Page: 99 Patterns
- Sign in · Settings row · Confirm dialog (from `../components/export/patterns.md`)

### Page: How to run the plugin
- Import plugin from manifest (dev) or install from Community  
- Buttons map: Sync / Audit / Stubs  

### Page: Variables
- Screenshot or live panel note: after Sync, collections  
  `Powers / dual` and `Powers / instrument` (light/dark)

## Publish tips

1. Start from your real **Powers UI Kit** file → **Duplicate** → strip to playground subset (faster downloads).  
2. Or build playground from scratch using only instances of published library.  
3. Set Community file to **Allow duplication**.  
4. Cover thumbnail: use `../assets/thumbnail.png`.

## Checklist before upload

- [ ] No private secrets / internal links  
- [ ] Plugin name matches listing  
- [ ] 49 full components optional — playground can be a **subset**  
- [ ] Patterns use instances only  
