# Component specs (phase 2)

Not built yet. This folder will hold machine-readable specs that:

1. Designers can follow to rebuild components in Figma by hand  
2. The phase-3 plugin will use to generate component sets  

## Planned shape

```
components/
  _schema.ts          # TypeScript types for a ComponentSpec
  Button.spec.json
  Input.spec.json
  Card.spec.json
  …
```

Each spec will reference **token paths** from `tokens/source.ts`, e.g.:

- `fill` → `color.accent`
- `height` → `control.height.md`
- `radius` → `radius.md`
- variants: `solid` | `soft` | `ghost` | `danger`
- sizes: `sm` | `md` | `lg`

## Core set (first pass)

| Component | Maps to |
|---|---|
| Button | `@powers/ui` Button |
| Input | Input |
| Textarea | Textarea |
| Select | Select |
| Checkbox | Checkbox |
| Card | Card |
| Badge | Badge |
| Alert | Alert |
| Tabs | Tabs |
| Dialog | Dialog |

## Status

Phase 1 tokens are ready. Specs come next.
