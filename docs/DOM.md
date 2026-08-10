# `@power-ui/dom` — Phase 2 DOM + JSX

**Status:** v0.2.0 — explicit bindings **and** automatic JSX runtime.

## Learn order

```
mount → h / JSX → component → Show / For → bind* when you need escape hatches
```

Same reactivity you already know (`signal`, `effect`). The DOM layer only **subscribes** and **writes nodes**.

## Quick example (JSX)

```tsx
import { signal } from "@power-ui/core";
import { mount, component } from "@power-ui/dom";

const Counter = component(() => {
  const count = signal(0);
  return (
    <button type="button" onClick={() => count.update((n) => n + 1)}>
      {() => `Count: ${count()}`}
    </button>
  );
});

mount(document.getElementById("app")!, () => <Counter />);
```

**Reactive rule:** pass a **function** for anything that should update — children, `class`, `style`, etc.  
`{count()}` runs once; `{() => count()}` stays live.

### Vite / TS config

```ts
// vite.config.ts
esbuild: {
  jsx: "automatic",
  jsxImportSource: "@power-ui/dom",
}
```

```json
// tsconfig
"jsx": "react-jsx",
"jsxImportSource": "@power-ui/dom"
```

## API

| API | Role |
|---|---|
| `mount(parent, app)` | Create root, append nodes, return dispose |
| `h` / JSX | Create elements; functions in props/children are reactive |
| `component(setup)` | Function component helper (types + name) |
| `Show` / `For` | JSX control flow (conditional + keyed list) |
| `Fragment` | JSX fragments |
| `text` / `bind*` / `on` | Explicit bindings |
| `show` / `list` | Imperative control flow (same engines as Show/For) |

### Props conventions

- `{() => count()}` → reactive text child  
- `class={() => …}` / `style={() => ({ … })}` → reactive  
- `onClick`, `onInput`, … → event listeners  
- `ref={(el) => …}` → element callback  

## Motion

```ts
import { animate, spring } from "@power-ui/animate";
import { bindStyle } from "@power-ui/dom";

const x = signal(0);
bindStyle(el, () => ({ transform: `translateX(${x()}px)` }));
animate(x, 100, spring());
```

## Not yet

- Full template compiler / SFC files  
- SSR / hydration  
- Built-in FLIP / enter-exit  
- **GSAP adapter** (parked — [`docs/NEXT.md`](./NEXT.md))  

## Browser demo

```bash
pnpm example:browser
```
