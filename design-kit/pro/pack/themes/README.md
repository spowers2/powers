# Pro theme packs

Free kit ships **instrument** and **dual** palettes via `data-pu-palette`.  
Pro adds drop-in CSS overlays + token tables for Figma Variables.

| Theme | File | Feel |
|-------|------|------|
| Slate | `slate.css` + `slate.tokens.json` | Cool gray product UI |
| Warm | `warm.css` + `warm.tokens.json` | Soft sand + ember accent |
| Mono | `mono.css` + `mono.tokens.json` | Near-achromatic, high contrast |

## In code

```ts
import "@lab206/ui/theme.css";
import "./slate.css"; // after theme.css
```

Themes set CSS variables on `:root` / `[data-pu-theme="dark"]`. They do **not** replace `@lab206/ui` — they override brand accents.

## In Figma

1. Create Variables collections matching keys in `*.tokens.json`.  
2. Bind component fills/strokes to those Variables.  
3. Or duplicate the Pro kit file modes if provided in your purchase.
