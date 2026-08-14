# Learn Power UX in 10 minutes

You only need **five ideas**. Everything else is optional power.

```
signal → computed → effect → store → resource
```

---

## 1. `signal` — a value that can change

```ts
import { signal } from "@power-ux/core";

const count = signal(0);

count();           // read → 0
count.set(1);      // write
count.update(n => n + 1);
count.peek();      // read WITHOUT subscribing
```

**Rule:** call it like a function to read. Use `.set` / `.update` to write.

---

## 2. `computed` — a value derived from others

```ts
import { computed } from "@power-ux/core";

const double = computed(() => count() * 2);
double(); // always up to date, cached until deps change
```

**Rule:** pure functions only. No async, no side effects.

---

## 3. `effect` — run when data changes

```ts
import { effect } from "@power-ux/core";

const stop = effect(() => {
  console.log(double());
  // optional cleanup:
  return () => { /* undo */ };
});

stop(); // unsubscribe
```

**Rule:** read signals/computeds inside the effect — Power UX tracks them automatically.  
No dependency arrays. Ever.

---

## 4. `store` — several fields that update independently

```ts
import { store } from "@power-ux/core";

const app = store({ count: 0, name: "Ada" });

app.count();              // 0
app.count.set(1);
app.set({ name: "Grace", count: 2 }); // batch several fields
app();                    // snapshot { count, name }
```

**Rule:** each top-level key is its own signal. Nested objects are one value — replace the nest, or make another `store`.

---

## 5. `resource` — async data without spaghetti

```ts
import { resource, signal } from "@power-ux/core";

const id = signal(1);

const user = resource(
  () => id(),
  async (id) => {
    const res = await fetch(`/api/users/${id}`);
    return res.json();
  },
);

user();            // data | undefined
user.loading();    // boolean
user.error();      // unknown
user.latest();     // last good value (stable during refetch)
user.refetch();
```

**Rule:** if the source returns `null`, `undefined`, or `false`, the fetch is skipped (great for “wait until ready”).

---

## Glue you’ll use daily

| API | When |
|---|---|
| `batch(() => { … })` | Many writes, one update wave |
| `createRoot(dispose => { … })` | Own a whole tree; `dispose()` cleans it |
| `onError(err => { … })` | Catch effect errors for that root |
| `untrack(() => …)` | Read without subscribing |
| `flush()` | Run pending effects now (tests / demos) |

---

## Mental model (one sentence)

> **Write signals. Read them in computeds and effects. Power UX updates only what depended on the change.**

No virtual DOM. No “re-render the component.” No dependency arrays.

---

## 6. `animate` — move a signal over time (optional)

```ts
import { animate, spring } from "@power-ux/animate";

const x = signal(0);

// Tween
await animate(x, 100, { duration: 300, ease: "easeOut" }).finished;

// Spring (interactive feel)
animate(x, 0, spring({ stiffness: 200, damping: 20 }));

// Interrupt: just call animate again on the same signal
animate(x, 50, { duration: 200 });
```

**Rule:** animate **values** (signals). The DOM (Phase 2) will only *read* those values — one mental model.

Honors `prefers-reduced-motion` by default (snaps to the end).

---

## 7. DOM / JSX — bind signals to the page

```tsx
import { mount, component, mergeProps } from "@power-ux/dom";

const Hello = component((props: { name: string }) => (
  <p>{() => `Hello, ${props.name}`}</p>
));

const App = component(() => {
  const name = signal("Ada");
  return (
    <div>
      <Hello name={name} />
      <button type="button" onClick={() => name.set("Grace")}>
        Rename
      </button>
    </div>
  );
});

mount(document.getElementById("app")!, () => <App />);
```

**Remember:**

- `{() => count()}` updates; `{count()}` does not  
- Pass **`name={name}`** (signal) or **`name={() => …}`** for live props — not `name={name()}`  

Also: `mergeProps`, `Show`, `For`, … — see [`docs/DOM.md`](./DOM.md).

---

## 8. Styling — built in (not a second framework)

```tsx
import "@power-ux/ui/theme.css";
import { Button, Stack, createTheme } from "@power-ux/ui";

createTheme("light").bind();

// Prefer primitives…
<Button variant="soft">Save</Button>

// …token-mapped utilities for one-off layout (BEM-ish):
<div class="pu-flex pu-gap-3 pu-p-4">…</div>
```

**Rule:** retheme via `tokens.css`. Prefer components over inventing CSS.  
Full story: [`STYLING.md`](./STYLING.md).

---

## Practice in the browser

- **Power Lab** (`/lab`) — edit real recipes, live preview  
- **System** (`/system`) — tokens & primitives explorer  

See the docs hub: [`docs/README.md`](./README.md).

---

## What you do *not* need

- A separate CSS framework to look good  
- Dependency arrays  
- **GSAP** for everyday motion — default is signal tweens; optional `@power-ux/animate/gsap` when you need pro motion  

Master signals + JSX + UI tokens/primitives and you can ship real apps.
