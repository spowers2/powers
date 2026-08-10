# Learn Power UI in 10 minutes

You only need **five ideas**. Everything else is optional power.

```
signal → computed → effect → store → resource
```

---

## 1. `signal` — a value that can change

```ts
import { signal } from "@power-ui/core";

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
import { computed } from "@power-ui/core";

const double = computed(() => count() * 2);
double(); // always up to date, cached until deps change
```

**Rule:** pure functions only. No async, no side effects.

---

## 3. `effect` — run when data changes

```ts
import { effect } from "@power-ui/core";

const stop = effect(() => {
  console.log(double());
  // optional cleanup:
  return () => { /* undo */ };
});

stop(); // unsubscribe
```

**Rule:** read signals/computeds inside the effect — Power UI tracks them automatically.  
No dependency arrays. Ever.

---

## 4. `store` — several fields that update independently

```ts
import { store } from "@power-ui/core";

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
import { resource, signal } from "@power-ui/core";

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

> **Write signals. Read them in computeds and effects. Power UI updates only what depended on the change.**

No virtual DOM. No “re-render the component.” No dependency arrays.

---

## What you do *not* need yet

- JSX / components (Phase 2)
- Routers, SSR, design system (later)
- Proxies, decorators, or special file extensions

Master the five ideas above and you already know Power UI’s core.
