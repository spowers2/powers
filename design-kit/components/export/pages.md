# Figma file structure

Create one Figma page per section (or frames on a single Cover + kit page).

## 01 Foundations

### Text (`pu-text`)

Typography primitive. Prefer Text over raw HTML for token sizes.

- **Build order:** 1
- **Properties:**
  - `Size` (variant) [xs | sm | md | lg | xl | 2xl]
  - `Weight` (variant) [normal | medium | semibold | bold]
  - `Muted` (boolean)
  - `Label` (text)
- **Variants:** default, muted
- **Sizes:** xs, sm, md, lg, xl, 2xl
- **States:** default
- **Sample:** The quick brown fox
- **Key tokens:**
  - `fill` → `transparent`
  - `text` → `color.text`
  - `fontFamily` → `font.family.sans`
  - `fontSize` → `font.size.md`
  - `lineHeight` → `font.leading.default`

### Link (`pu-link`)

Inline text link.

- **Build order:** 2
- **Properties:**
  - `Label` (text)
- **States:** default, hover, focus
- **Sample:** Learn more
- **Notes:** Hover: underline or brightness; use accent color.
- **Key tokens:**
  - `text` → `color.accent`
  - `fontSize` → `font.size.sm`
  - `fontWeight` → `font.weight.semibold`

### Kbd (`pu-kbd`)

Keyboard key affordance.

- **Build order:** 3
- **Properties:**
  - `Label` (text)
- **States:** default, hover, disabled, focus
- **Sample:** ⌘K
- **Key tokens:**
  - `fill` → `color.surface.2`
  - `text` → `color.text.muted`
  - `border` → `color.border`
  - `radius` → `radius.sm`
  - `fontFamily` → `font.family.mono`
  - `fontSize` → `font.size.xs`
  - `paddingX` → `6`
  - `paddingY` → `2`

### Code (`pu-code`)

Inline or block code.

- **Build order:** 4
- **Properties:**
  - `Variant` (variant) [inline | block]
  - `Label` (text)
- **Variants:** inline, block
- **States:** default, hover, disabled, focus
- **Sample:** pnpm example:browser
- **Key tokens:**
  - `fill` → `color.surface.2`
  - `text` → `color.text`
  - `border` → `color.border`
  - `radius` → `radius.sm`
  - `fontFamily` → `font.family.mono`
  - `fontSize` → `font.size.sm`
  - `paddingX` → `space.2`
  - `paddingY` → `space.1`

### Divider (`pu-divider`)

Horizontal or vertical rule.

- **Build order:** 5
- **Properties:**
  - `Orientation` (variant) [horizontal | vertical]
- **States:** default
- **Sample:** —
- **Notes:** Horizontal: full width, 1px. Vertical: full height of parent, 1px.
- **Key tokens:**
  - `stroke` → `color.border`
  - `strokeWidth` → `1`

## 02 Actions

### Button (`pu-btn`)

Primary action control. Token-driven color and size.

- **Build order:** 10
- **Properties:**
  - `Variant` (variant) [solid | soft | ghost | danger]
  - `Size` (variant) [sm | md | lg]
  - `Disabled` (boolean)
  - `Label` (text)
- **Variants:** solid, soft, ghost, danger
- **Sizes:** sm, md, lg
- **States:** default, hover, active, disabled, focus
- **Sample:** Continue
- **Notes:** Focus ring: 2px surface + 2px focus (color.focus @ ~55%). Disabled opacity 0.5. Hover lift −1px Y.
- **Key tokens:**
  - `layout` → `horizontal`
  - `align` → `center`
  - `justify` → `center`
  - `gap` → `space.2`
  - `height` → `control.height.md`
  - `paddingX` → `control.paddingX`
  - `radius` → `radius.md`
  - `fontSize` → `font.size.sm`
  - `fontWeight` → `font.weight.semibold`
  - `borderWidth` → `1`
  - `fill` → `color.accent`
  - `text` → `color.accent.fg`

### ToggleGroup (`pu-toggle-group`)

Segmented toggle buttons (single or multi).

- **Build order:** 11
- **Properties:**
  - `Size` (variant) [sm | md]
- **Variants:** item-idle, item-active
- **Sizes:** sm, md
- **States:** default, hover, disabled, focus
- **Sample:** Day · Week · Month
- **Notes:** Build as component set: Track frame + Toggle items. Active item elevated surface.
- **Key tokens:**
  - `fill` → `color.surface.sunken`
  - `border` → `color.border`
  - `radius` → `radius.md`
  - `gap` → `2`
  - `padding` → `3`

## 03 Forms

### Label (`pu-label`)

Form field label.

- **Build order:** 20
- **Properties:**
  - `Label` (text)
- **States:** default
- **Sample:** Email
- **Key tokens:**
  - `text` → `color.text`
  - `fontSize` → `control.labelSize`
  - `fontWeight` → `font.weight.medium`

### Input (`pu-input`)

Text input. Height matches control.md.

- **Build order:** 21
- **Properties:**
  - `Placeholder` (text)
  - `Disabled` (boolean)
  - `Invalid` (boolean)
- **States:** default, hover, focus, disabled, invalid
- **Sample:** 
- **Notes:** Focus: border mixes focus token; outer glow 3px focus@18%. Invalid: border color.danger.
- **Key tokens:**
  - `height` → `control.height.md`
  - `paddingX` → `control.paddingX`
  - `radius` → `radius.md`
  - `fill` → `color.surface`
  - `text` → `color.text`
  - `border` → `color.border`
  - `borderWidth` → `1`
  - `shadow` → `shadow.xs`
  - `fontSize` → `font.size.sm`
  - `placeholder` → `color.text.muted`

### Textarea (`pu-textarea`)

Multi-line text. Same chrome as Input, min-height ~96px.

- **Build order:** 22
- **Properties:**
  - `Placeholder` (text)
  - `Disabled` (boolean)
- **States:** default, hover, focus, disabled, invalid
- **Sample:** Ship notes go here.
- **Key tokens:**
  - `minHeight` → `96`
  - `paddingX` → `control.paddingX`
  - `paddingY` → `space.3`
  - `radius` → `radius.md`
  - `fill` → `color.surface`
  - `text` → `color.text`
  - `border` → `color.border`
  - `shadow` → `shadow.xs`
  - `fontSize` → `font.size.sm`

### Select (`pu-select`)

Native-styled select trigger (closed state in kit).

- **Build order:** 23
- **Properties:**
  - `Label` (text)
  - `Disabled` (boolean)
- **States:** default, hover, focus, disabled, open
- **Sample:** United States
- **Notes:** Include chevron icon right. Open state can show Menu/list panel below.
- **Key tokens:**
  - `height` → `control.height.md`
  - `paddingX` → `control.paddingX`
  - `radius` → `radius.md`
  - `fill` → `color.surface`
  - `text` → `color.text`
  - `border` → `color.border`
  - `shadow` → `shadow.xs`
  - `fontSize` → `font.size.sm`

### NumberInput (`pu-number-input`)

Numeric field with optional steppers.

- **Build order:** 24
- **States:** default, hover, focus, disabled
- **Sample:** 42
- **Key tokens:**
  - `height` → `control.height.md`
  - `radius` → `radius.md`
  - `fill` → `color.surface`
  - `border` → `color.border`
  - `text` → `color.text`
  - `fontFamily` → `font.family.mono`
  - `fontSize` → `font.size.sm`

### Checkbox (`pu-checkbox`)

Checkbox + optional label.

- **Build order:** 25
- **Properties:**
  - `Checked` (boolean)
  - `Disabled` (boolean)
  - `Label` (text)
- **States:** default, hover, focus, disabled, checked
- **Sample:** Remember me
- **Key tokens:**
  - `gap` → `space.2`
  - `fontSize` → `font.size.sm`
  - `text` → `color.text`
  - `boxSize` → `17.6`
  - `boxRadius` → `5`
  - `boxBorder` → `color.border`
  - `boxFill` → `color.surface`
  - `checkedFill` → `color.accent`
  - `checkColor` → `color.accent.fg`

### Radio (`pu-radio`)

Radio control + label. Group radios on the kit page.

- **Build order:** 26
- **Properties:**
  - `Checked` (boolean)
  - `Label` (text)
- **States:** default, focus, disabled, checked
- **Sample:** Option A
- **Key tokens:**
  - `gap` → `space.2`
  - `fontSize` → `font.size.sm`
  - `text` → `color.text`
  - `outerSize` → `18`
  - `outerBorder` → `color.border`
  - `outerFill` → `color.surface`
  - `dotFill` → `color.accent`

### Switch (`pu-switch`)

Toggle switch. Track 40×22.4, thumb slides when checked.

- **Build order:** 27
- **Properties:**
  - `Checked` (boolean)
  - `Disabled` (boolean)
  - `Label` (text)
- **States:** default, focus, disabled, checked
- **Sample:** Enable alerts
- **Key tokens:**
  - `gap` → `space.2`
  - `fontSize` → `font.size.sm`
  - `text` → `color.text`
  - `trackWidth` → `40`
  - `trackHeight` → `22.4`
  - `trackRadius` → `radius.full`
  - `trackFill` → `color.border`
  - `trackFillChecked` → `color.accent`
  - `thumbFill` → `#ffffff`
  - `thumbShadow` → `shadow.sm`

### Slider (`pu-slider`)

Range slider track + thumb.

- **Build order:** 28
- **States:** default, hover, focus, disabled
- **Sample:** 50%
- **Key tokens:**
  - `trackHeight` → `6`
  - `trackFill` → `color.surface.sunken`
  - `trackActive` → `color.accent`
  - `thumbSize` → `16`
  - `thumbFill` → `color.surface`
  - `thumbBorder` → `color.accent`
  - `radius` → `radius.full`

### Field (`pu-field`)

Label + control + hint/error stack.

- **Build order:** 29
- **Properties:**
  - `Label` (text)
  - `Hint` (text)
  - `Error` (boolean)
- **States:** default, hover, disabled, focus
- **Sample:** Email field
- **Notes:** Compose from Label + Input instances in Figma.
- **Key tokens:**
  - `gap` → `control.fieldGap`
  - `labelSize` → `control.labelSize`
  - `labelColor` → `color.text`
  - `hintColor` → `color.text.muted`
  - `errorColor` → `color.danger`
  - `fontSize` → `font.size.sm`

### Combobox (`pu-combobox`)

Searchable select — trigger + list panel.

- **Build order:** 30
- **States:** default, open, focus, disabled
- **Sample:** Search…
- **Notes:** Build closed trigger + open overlay as variants or separate components.
- **Key tokens:**
  - `triggerHeight` → `control.height.md`
  - `fill` → `color.surface`
  - `border` → `color.border`
  - `radius` → `radius.md`
  - `panelShadow` → `shadow.lg`
  - `panelFill` → `color.surface.elevated`

## 04 Data display

### Badge (`pu-badge`)

Pill status badge.

- **Build order:** 40
- **Properties:**
  - `Tone` (variant) [neutral | accent | success | warning]
  - `Label` (text)
- **Variants:** neutral, accent, success, warning
- **States:** default
- **Sample:** Live
- **Key tokens:**
  - `paddingX` → `0.65em`
  - `paddingY` → `0.2em`
  - `radius` → `radius.full`
  - `fontSize` → `font.size.xs`
  - `fontWeight` → `font.weight.semibold`
  - `gap` → `space.1`
  - `borderWidth` → `1`

### Chip (`pu-chip`)

Filter/tag chip; optional remove ×.

- **Build order:** 41
- **Properties:**
  - `Tone` (variant) [neutral | accent | success | warning | danger]
  - `Removable` (boolean)
  - `Label` (text)
- **Variants:** neutral, accent, success, warning, danger
- **States:** default, hover, disabled, focus
- **Sample:** Design system
- **Key tokens:**
  - `paddingX` → `9`
  - `paddingY` → `3`
  - `radius` → `radius.full`
  - `fontSize` → `font.size.xs`
  - `fontWeight` → `font.weight.semibold`
  - `gap` → `5`

### Avatar (`pu-avatar`)

Initials or image circle.

- **Build order:** 42
- **Properties:**
  - `Size` (variant) [sm | md | lg]
  - `Initials` (text)
- **Sizes:** sm, md, lg
- **States:** default
- **Sample:** SP
- **Key tokens:**
  - `radius` → `radius.full`
  - `text` → `color.accent.fg`
  - `fillStart` → `color.brand.500`
  - `fillEnd` → `color.sage.600`
  - `border` → `color.border`
  - `shadow` → `shadow.xs`
  - `fontWeight` → `font.weight.semibold`

### Card (`pu-card`)

Surface container. Default padded.

- **Build order:** 43
- **Properties:**
  - `Variant` (variant) [default | glass | elevated | soft]
  - `Padded` (boolean)
  - `Interactive` (boolean)
- **Variants:** default, glass, elevated, soft
- **States:** default, hover
- **Sample:** Card title
Supporting copy
- **Notes:** Interactive hover: shadow.lg, border tint with focus cyan, −1px Y.
- **Key tokens:**
  - `fill` → `color.surface`
  - `border` → `color.border`
  - `radius` → `radius.lg`
  - `shadow` → `shadow.sm`
  - `padding` → `space.5`

### Stat (`pu-stat`)

KPI label + value + optional delta.

- **Build order:** 44
- **States:** default, hover, disabled, focus
- **Sample:** Revenue
$24.5k
+12%
- **Key tokens:**
  - `gap` → `space.1`
  - `labelColor` → `color.text.muted`
  - `labelSize` → `font.size.xs`
  - `valueSize` → `font.size.2xl`
  - `valueWeight` → `font.weight.bold`
  - `valueColor` → `color.text`

### Progress (`pu-progress`)

Determinate progress bar.

- **Build order:** 45
- **Properties:**
  - `Size` (variant) [sm | md]
  - `Label` (text)
- **Sizes:** sm, md
- **States:** default, hover, disabled, focus
- **Sample:** Uploading · 64%
- **Key tokens:**
  - `gap` → `space.2`
  - `trackFill` → `color.surface.sunken`
  - `trackBorder` → `color.border`
  - `trackRadius` → `radius.full`
  - `barStart` → `color.brand.500`
  - `barEnd` → `color.sage.400`
  - `metaSize` → `font.size.xs`
  - `metaColor` → `color.text.muted`

### Skeleton (`pu-skeleton`)

Loading placeholder shapes.

- **Build order:** 46
- **Properties:**
  - `Variant` (variant) [text | rect | circle]
- **Variants:** text, rect, circle
- **States:** default
- **Sample:** —
- **Notes:** Optional subtle shimmer; keep static in kit if preferred.
- **Key tokens:**
  - `fill` → `color.surface.2`
  - `radius` → `radius.md`

### Empty (`pu-empty`)

Empty state block: icon slot + title + body + action.

- **Build order:** 47
- **States:** default, hover, disabled, focus
- **Sample:** No results
Try a different filter.
- **Notes:** Compose with Text + Button instances.
- **Key tokens:**
  - `gap` → `space.3`
  - `align` → `center`
  - `titleSize` → `font.size.lg`
  - `titleWeight` → `font.weight.semibold`
  - `bodyColor` → `color.text.muted`
  - `bodySize` → `font.size.sm`
  - `padding` → `space.8`

### Table (`pu-table`)

Data table chrome (header + rows).

- **Build order:** 48
- **States:** default, hover, disabled, focus
- **Sample:** Name · Status · Role
- **Notes:** 3-column sample is enough for the kit; full data tables stay in product.
- **Key tokens:**
  - `fill` → `color.surface`
  - `border` → `color.border`
  - `radius` → `radius.md`
  - `headerFill` → `color.surface.2`
  - `headerText` → `color.text.muted`
  - `cellText` → `color.text`
  - `cellPaddingX` → `space.3`
  - `cellPaddingY` → `space.2`
  - `fontSize` → `font.size.sm`
  - `rowBorder` → `color.border`

### List (`pu-list`)

Stacked list rows with optional leading media.

- **Build order:** 49
- **States:** default, hover, disabled, focus
- **Sample:** List item · secondary
- **Key tokens:**
  - `gap` → `0`
  - `rowPaddingX` → `space.3`
  - `rowPaddingY` → `space.3`
  - `rowBorder` → `color.border`
  - `fill` → `color.surface`
  - `radius` → `radius.md`
  - `text` → `color.text`
  - `meta` → `color.text.muted`

### Timeline (`pu-timeline`)

Vertical timeline with dots and connectors.

- **Build order:** 50
- **States:** default, hover, disabled, focus
- **Sample:** Shipped · 2h ago
- **Key tokens:**
  - `gap` → `space.4`
  - `dotSize` → `10`
  - `dotFill` → `color.accent`
  - `line` → `color.border`
  - `titleSize` → `font.size.sm`
  - `metaSize` → `font.size.xs`
  - `metaColor` → `color.text.muted`

### Steps (`pu-steps`)

Horizontal stepper.

- **Build order:** 51
- **Properties:**
  - `State` (variant) [complete | current | upcoming]
- **States:** default, hover, disabled, focus
- **Sample:** 1 Account · 2 Plan · 3 Pay
- **Key tokens:**
  - `gap` → `space.2`
  - `circleSize` → `28`
  - `circleFill` → `color.surface`
  - `circleBorder` → `color.border`
  - `circleFillCurrent` → `color.accent`
  - `circleTextCurrent` → `color.accent.fg`
  - `labelSize` → `font.size.sm`
  - `connector` → `color.border`

## 05 Feedback

### Alert (`pu-alert`)

Inline status message with optional title.

- **Build order:** 60
- **Properties:**
  - `Tone` (variant) [info | success | warning | danger]
  - `Title` (text)
  - `Body` (text)
- **Variants:** info, success, warning, danger
- **States:** default
- **Sample:** Heads up
Check your connection.
- **Key tokens:**
  - `gap` → `space.1`
  - `paddingX` → `space.4`
  - `paddingY` → `space.3`
  - `radius` → `radius.md`
  - `borderWidth` → `1`
  - `fontSize` → `font.size.sm`
  - `titleWeight` → `font.weight.semibold`

### Toast (`pu-toast`)

Transient notification card (Toaster stack item).

- **Build order:** 61
- **Properties:**
  - `Tone` (variant) [info | success | danger]
  - `Title` (text)
  - `Description` (text)
- **Variants:** info, success, danger
- **States:** default, hover, disabled, focus
- **Sample:** Saved
Your changes are live.
- **Key tokens:**
  - `fill` → `color.surface.elevated`
  - `border` → `color.border`
  - `radius` → `radius.md`
  - `shadow` → `shadow.lg`
  - `padding` → `space.3`
  - `gap` → `space.2`
  - `titleSize` → `font.size.sm`
  - `titleWeight` → `font.weight.semibold`
  - `descSize` → `font.size.xs`
  - `descColor` → `color.text.muted`
  - `dotSize` → `7`

### Spinner (`pu-spinner`)

Loading indicator disk + optional label.

- **Build order:** 62
- **Properties:**
  - `Size` (variant) [sm | md | lg]
  - `Label` (text)
- **Sizes:** sm, md, lg
- **States:** default
- **Sample:** Loading
- **Notes:** In Figma use arc or ring; animate optional.
- **Key tokens:**
  - `gap` → `space.2`
  - `color` → `color.accent`
  - `fontSize` → `font.size.sm`

### Tooltip (`pu-tooltip`)

Small floating label near a control.

- **Build order:** 63
- **Properties:**
  - `Label` (text)
- **States:** default
- **Sample:** Keyboard shortcut ⌘S
- **Key tokens:**
  - `fill` → `color.brand.800`
  - `text` → `color.gray.0`
  - `radius` → `radius.sm`
  - `paddingX` → `space.2`
  - `paddingY` → `space.1`
  - `fontSize` → `font.size.xs`
  - `shadow` → `shadow.md`

## 06 Overlays

### Dialog (`pu-dialog`)

Modal: backdrop + panel (sm/md/lg).

- **Build order:** 70
- **Properties:**
  - `Size` (variant) [sm | md | lg]
  - `Title` (text)
  - `Description` (text)
- **Sizes:** sm, md, lg
- **States:** default, open
- **Sample:** Confirm · Cancel / Confirm buttons
- **Key tokens:**
  - `backdrop` → `color.overlay.scrim`
  - `panelFill` → `color.surface.elevated`
  - `panelBorder` → `color.border`
  - `panelRadius` → `radius.xl`
  - `panelShadow` → `shadow.lg`
  - `panelPadding` → `space.6`
  - `titleSize` → `font.size.xl`
  - `titleWeight` → `font.weight.bold`
  - `descColor` → `color.text.muted`
  - `descSize` → `font.size.sm`
  - `zIndex` → `z.overlay`

### Drawer (`pu-drawer`)

Side panel overlay (typically right).

- **Build order:** 71
- **States:** default, open
- **Sample:** Filters drawer
- **Key tokens:**
  - `backdrop` → `color.overlay.scrim`
  - `panelFill` → `color.surface.elevated`
  - `panelBorder` → `color.border`
  - `panelShadow` → `shadow.lg`
  - `panelWidth` → `360`
  - `padding` → `space.5`

### Menu (`pu-menu`)

Dropdown menu list.

- **Build order:** 72
- **States:** default, hover, disabled, focus
- **Sample:** Edit · Duplicate · Delete
- **Key tokens:**
  - `fill` → `color.surface.elevated`
  - `border` → `color.border`
  - `radius` → `radius.md`
  - `shadow` → `shadow.lg`
  - `padding` → `space.1`
  - `itemPaddingX` → `space.3`
  - `itemPaddingY` → `space.2`
  - `itemRadius` → `radius.sm`
  - `itemHover` → `color.surface.2`
  - `fontSize` → `font.size.sm`
  - `text` → `color.text`
  - `dangerText` → `color.danger`

### Popover (`pu-popover`)

Anchored floating panel.

- **Build order:** 73
- **States:** default, hover, disabled, focus
- **Sample:** Popover content
- **Key tokens:**
  - `fill` → `color.surface.elevated`
  - `border` → `color.border`
  - `radius` → `radius.md`
  - `shadow` → `shadow.lg`
  - `padding` → `space.4`
  - `maxWidth` → `320`

### Command (`pu-command`)

Command palette: search + grouped results.

- **Build order:** 74
- **States:** default, hover, disabled, focus
- **Sample:** Type a command…
- **Key tokens:**
  - `fill` → `color.surface.elevated`
  - `border` → `color.border`
  - `radius` → `radius.lg`
  - `shadow` → `shadow.lg`
  - `width` → `520`
  - `inputHeight` → `control.height.md`
  - `itemHover` → `color.surface.2`
  - `fontSize` → `font.size.sm`

## 07 Navigation

### Tabs (`pu-tabs`)

Segmented tabs list + panel.

- **Build order:** 80
- **Properties:**
  - `Active` (variant) [tab-1 | tab-2 | tab-3]
- **States:** default, hover, disabled, focus
- **Sample:** Overview · Activity · Settings
- **Key tokens:**
  - `gap` → `space.4`
  - `listFill` → `color.surface.sunken`
  - `listBorder` → `color.border`
  - `listRadius` → `radius.md`
  - `listPadding` → `3`
  - `listGap` → `2`
  - `tabPaddingX` → `14.4`
  - `tabPaddingY` → `7.2`
  - `tabRadius` → `6`
  - `tabFontSize` → `font.size.sm`
  - `tabWeight` → `font.weight.semibold`
  - `tabIdle` → `color.text.muted`

### Breadcrumb (`pu-breadcrumb`)

Path crumbs with separators.

- **Build order:** 81
- **States:** default, hover, disabled, focus
- **Sample:** Home / Projects / Powers
- **Key tokens:**
  - `gap` → `space.2`
  - `fontSize` → `font.size.sm`
  - `text` → `color.text.muted`
  - `textCurrent` → `color.text`
  - `separator` → `color.text.muted`

### Pagination (`pu-pagination`)

Page controls using Button/ghost items.

- **Build order:** 82
- **States:** default, hover, disabled, focus
- **Sample:** ‹ 1 2 3 ›
- **Notes:** Compose from Button sm ghost + solid for current page.
- **Key tokens:**
  - `gap` → `space.1`
  - `itemHeight` → `control.height.sm`
  - `itemMinWidth` → `control.height.sm`
  - `radius` → `radius.md`
  - `activeFill` → `color.accent`
  - `activeText` → `color.accent.fg`
  - `idleText` → `color.text`

### Accordion (`pu-accordion`)

Collapsible sections.

- **Build order:** 83
- **Properties:**
  - `Open` (boolean)
- **States:** default, open
- **Sample:** Section title · body
- **Key tokens:**
  - `border` → `color.border`
  - `radius` → `radius.md`
  - `fill` → `color.surface`
  - `triggerPadding` → `space.4`
  - `triggerWeight` → `font.weight.semibold`
  - `contentPadding` → `space.4`
  - `contentColor` → `color.text.muted`
  - `fontSize` → `font.size.sm`

## 08 Layout

### Stack (`pu-stack`)

Flex stack. Document gap tokens as variants.

- **Build order:** 90
- **Properties:**
  - `Direction` (variant) [vertical | horizontal]
  - `Gap` (variant) [0 | 1 | 2 | 3 | 4 | 5 | 6 | 8]
- **States:** default
- **Sample:** Stack children
- **Notes:** In Figma this is mostly auto-layout documentation, not a heavy component.
- **Key tokens:**
  - `gap` → `space.4`
  - `align` → `stretch`

### Grid (`pu-grid`)

CSS grid wrapper — document columns + gap.

- **Build order:** 91
- **Properties:**
  - `Columns` (variant) [2 | 3 | 4]
- **States:** default
- **Sample:** Grid cells
- **Key tokens:**
  - `gap` → `space.4`

### Container (`pu-container`)

Max-width content shell.

- **Build order:** 92
- **Properties:**
  - `Size` (variant) [sm | md | lg | xl]
- **Sizes:** sm, md, lg, xl
- **States:** default
- **Sample:** Page container
- **Key tokens:**
  - `paddingX` → `space.4`
  - `width` → `100%`

### ScrollArea (`pu-scroll-area`)

Scrollable region with border chrome.

- **Build order:** 93
- **States:** default
- **Sample:** Long content…
- **Key tokens:**
  - `fill` → `color.surface`
  - `border` → `color.border`
  - `radius` → `radius.md`
  - `maxHeight` → `240`

### AspectRatio (`pu-aspect-ratio`)

Fixed aspect media frame.

- **Build order:** 94
- **Properties:**
  - `Ratio` (variant) [1:1 | 16:9 | 4:3]
- **States:** default
- **Sample:** Media
- **Key tokens:**
  - `fill` → `color.surface.2`
  - `radius` → `radius.md`
  - `border` → `color.border`

### Collapse (`pu-collapse`)

Show/hide height animation region.

- **Build order:** 95
- **Properties:**
  - `Open` (boolean)
- **States:** default, open
- **Sample:** Collapsible body
- **Key tokens:**
  - `overflow` → `hidden`
