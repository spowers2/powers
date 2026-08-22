# Powers UI Kit — quality & next actions

Status after API audit (**49/49** catalog names present).  
This is the prioritized path to a **library-ready** kit.

## Health (automated)

```bash
# from monorepo root — needs .env.local with FIGMA_* 
pnpm design-kit:figma-audit
```

Writes `figma/audit-report.json`. Re-run after Figma edits.

| Signal | Current | Target |
|---|---|---|
| Component names vs catalog | **49/49** | keep |
| Button / Input / Card Variable binding | ~90–100% of nodes | keep |
| Text / typography Variables | weaker (many raw fills; little text size binding) | bind type ramp to Variables |
| Hard-coded solid fills | some remain on Badge, Dialog, Switch, Text muted | drive from color Variables |
| Variables REST API | token lacks `file_variables:read` | optional — regenerate PAT |
| File structure | one page, one mega-frame | optional split by section pages |
| Team library published | published (republish after kit edits) | keep |
| Invalid assets on publish | **Card** had unused `Padded` / `Interactive` props | delete or wire them — see [PUBLISH_LIBRARY.md](./PUBLISH_LIBRARY.md) |
| Pattern screens | page **99 Patterns** | expand as needed |

## Priority order (most important first)

### 1. Typography + remaining fills → Variables (highest leverage)

You already bound most chrome (radius, padding, many fills). Gaps:

- **Text** sizes/weights should use number/string Variables (`font/size/*`, weights) where possible  
- **Muted** text → `color/text/muted` (not a free hex)  
- Spot-fix **Badge / Switch / Dialog** for leftover solid fills  

When Variables are solid, one mode switch rethemes the whole kit.

### 2. Publish as a private library

In Figma:

1. Assets → team library (or publish file library)  
2. Enable **Powers UI Kit** in a sandbox file  
3. Insert `Button` / `Input` / `Card` as instances  

If instances work, the kit is real product infrastructure.

### 3. One pattern page (proof)

Add a page **99 Patterns** with only **instances** of kit components:

- Login / email field + Button  
- Settings row: Label + Switch + Badge  
- Confirm Dialog  

No new one-off frames. Gaps you hit = polish list.

### 4. File hygiene (nice)

| Now | Better |
|---|---|
| `Page 1` / `power-ui-comp` | Rename page → **Components** |
| Section TEXT labels inside one frame | Optional pages: Foundations, Actions, Forms, … |
| Cover missing | Page **Cover**: name, date, dual/instrument note |

### 5. Variables API (Enterprise-only — skip if not on plan)

`file_variables:read` is **Figma Enterprise only** and often **does not appear** in the PAT scope list on other plans.

On Professional / non-Enterprise:

- Use **Figma Local variables UI** + Tokens Studio  
- Rely on `pnpm design-kit:figma-audit` for **catalog + binding** only  
- Ignore **Variables API: MISSING SCOPE** in the audit output  

On Enterprise: enable variables read on the PAT → audit writes `figma/variables-export.json`.

### 6. Tooling shipped

- Phase 3 plugin: `pnpm design-kit:plugin:build` → import `plugin/manifest.json` in Figma  
- Publish guide: `PUBLISH_LIBRARY.md`  
- Pro scaffold: `pro/`  
- Patterns recipes: `components/export/patterns.md`  

Still human in Figma: **Publish library**, product screens with instances.  

## Do not block on

- Perfect 0 raw fills (some icons/checks are fine as white/black)  
- Splitting every page before publishing library  
- Plugin before patterns exist  

## Definition of “right enough”

- [x] All catalog components exist and are named correctly  
- [ ] Core types use Variables for color + space + radius + type  
- [ ] Published library; instances work in another file  
- [ ] ≥2 pattern screens from instances only  
- [ ] `pnpm design-kit:figma-audit` stays green after changes  
