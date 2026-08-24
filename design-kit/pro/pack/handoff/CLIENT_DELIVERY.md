# Client delivery checklist (Pro)

Use when handing Figma → engineering on a Powers project.

## Before you send

- [ ] All screens use **Powers UI Kit** instances (no detached one-offs)  
- [ ] Spacing / radius / color from Variables or documented Pro theme  
- [ ] Light + dark checked for primary flows  
- [ ] Empty / loading / error states designed (see `patterns/empty.md`)  
- [ ] Interactive states: hover, focus-visible, disabled  
- [ ] Mobile breakpoint (or note “desktop only”)  

## What to include in the handoff zip/link

1. Figma file (or pages) + library enabled  
2. Which Pro theme (`slate` / `warm` / `mono` / custom)  
3. Screen list mapped to routes (see `starters/`)  
4. Copy deck / content source of truth  
5. Out of scope list (what eng should not build yet)

## What engineers install

```bash
pnpm create powers my-app
# or pnpm add @lab206/core @lab206/dom @lab206/ui
```

Point them at Lab recipes that match your patterns:  
https://lab206.com/lab?recipe=hello · form · tokens · admin-list
