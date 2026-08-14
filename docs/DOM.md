# `@power-ui/dom` — Phase 2 DOM + JSX

**Status:** v0.3.0 — bindings, JSX, and **reactive component props**.

## Learn order

```
mount → h / JSX → component → reactive props → Show / For
```

Same reactivity you already know (`signal`, `effect`). The DOM layer only **subscribes** and **writes nodes**.

## Quick example (JSX + props)

```tsx
import { signal } from "@power-ui/core";
import { mount, component, mergeProps } from "@power-ui/dom";

const Hello = component((props: { name: string; mood?: string }) => {
  const p = mergeProps({ mood: "🙂" }, props);
  return <p>{() => `${p.mood} Hello, ${p.name}`}</p>;
});

const App = component(() => {
  const name = signal("Ada");
  return (
    <div>
      {/* Live: pass the signal (or () => name()) */}
      <Hello name={name} />
      <button type="button" onClick={() => name.set("Grace")}>
        Rename
      </button>
    </div>
  );
});

mount(document.getElementById("app")!, () => <App />);
```

### Reactive rules (memorize these)

| Write | Live? |
|---|---|
| `{() => count()}` child | ✅ |
| `{count()}` child | ❌ once at create |
| `<Child name={name} />` signal | ✅ |
| `<Child name={() => user().name} />` | ✅ |
| `<Child name={name()} />` snapshot | ❌ once at create |
| `class={() => …}` / `style={() => …}` | ✅ |

Setup in `component()` runs **once**. Props stay live via accessors — the child does **not** re-mount.

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
| `component(setup)` | Function component; props are reactive |
| `createProps` / `mergeProps` / `splitProps` | Reactive props utilities |
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
- **GSAP adapter** — shipped as `@power-ui/animate/gsap` (optional peer)  

## Browser demo

```bash
pnpm example:browser
```
