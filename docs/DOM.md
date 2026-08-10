# `@power-ui/dom` — Phase 2 thin DOM

**Status:** v0.1.0 — explicit bindings, no compiler yet.

## Learn order

```
mount → h / text → bind* / on → show → list
```

Same reactivity you already know (`signal`, `effect`). The DOM layer only **subscribes** and **writes nodes**.

## Quick example

```ts
import { signal } from "@power-ui/core";
import { mount, h } from "@power-ui/dom";

mount(document.getElementById("app")!, () => {
  const count = signal(0);
  return h("button", {
    type: "button",
    onClick: () => count.update((n) => n + 1),
    text: () => `Count: ${count()}`,
  });
});
```

## API

| API | Role |
|---|---|
| `mount(parent, app)` | Create root, append nodes, return dispose |
| `h(tag, props?, ...children)` | Create element; functions in props are reactive |
| `text(value \| fn)` | Text node (static or reactive) |
| `bindText` / `bindAttr` / `bindProp` / `bindClass` / `bindStyle` | Explicit bindings |
| `on(el, type, handler)` | Event listener + dispose |
| `show(parent, when, factory)` | Conditional mount (dispose when hidden) |
| `list(parent, items, render, { key })` | Keyed list reconciliation |
| `insert` / `remove` | Low-level node helpers |

### `h` props conventions

- `text: () => …` → reactive textContent  
- `class` / `className` → string or `() => string | Record<string, boolean>`  
- `style: () => ({ opacity: "1" })` → reactive inline styles  
- `onClick`, `onInput`, … → event listeners  
- Other functions → reactive attributes (or DOM props for `value` / `checked` / …)

## Motion

Animate **signals**, bind the result:

```ts
import { animate, spring } from "@power-ui/animate";

const x = signal(0);
bindStyle(el, () => ({ transform: `translateX(${x()}px)` }));
animate(x, 100, spring());
```

## Not in v0.1

- JSX / templates (Phase 2.x compiler)  
- Components as first-class (`defineComponent`)  
- SSR / hydration  
- Built-in FLIP / enter-exit helpers  

## Parked (do not forget)

See [`docs/NEXT.md`](./NEXT.md):

- **GSAP adapter** (optional pro motion path)  
- Color interpolation, richer animate targets  
- Compiler that *emits* these bindings  

## Browser demo

```bash
pnpm example:browser
# → vite dev server
```
