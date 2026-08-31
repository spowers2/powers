# How Powers stays live — five words

**For designers and developers.** Same industry names Powers uses in code (`signal`, `computed`, `effect`, `store`, `resource`). Plain meaning first, then how to use them.

You do not need a CS background. If you have ever built a Figma prototype, filled a spreadsheet, or wired a form, you already know the *ideas*.

---

## One sentence

> **A signal holds a changing value. A computed is a formula. An effect is a reaction. A store groups related values. A resource is data that loads.** Powers updates only what depends on what changed.

Industry name for this pattern: **signals** (Solid, Preact, Angular, and others use the same family). Powers did not invent the words — it uses them so they match the industry, then explains them so outsiders get them the first time.

---

## Rosetta stone (read this once)

| Word in code | Plain English | Designer analogy | Developer one-liner |
|---|---|---|---|
| **`signal`** | A **live value** you can read and change | A prototype variable, or a component property that updates on the canvas | Mutable reactive cell; call `x()` to read, `.set` / `.update` to write |
| **`computed`** | A **formula** that stays correct | Auto Layout size from children, or `fullName = first + last` | Cached derived value; re-runs when deps change; keep it pure |
| **`effect`** | A **reaction** — when values change, do something | Prototype interaction: “when X changes → do Y” | Side effect subscribed to the graph; no dependency arrays |
| **`store`** | A **small model** — several live fields together | Form state: name, email, errors in one place | Object of per-key signals + batched `.set` |
| **`resource`** | **Loaded data** with loading / error / ready | Content that arrives after a spinner or empty state | Async fetch bound to a source; exposes `loading` / `error` / value |

Keep the **code names** in conversation and PRs. Use the **plain English** column when explaining to someone new.

---

## The five words

### 1. `signal` — live value

```ts
import { signal } from "@lab206/core";

const count = signal(0);

count();                 // read → 0
count.set(1);            // write
count.update((n) => n + 1);
count.peek();            // read without subscribing (advanced)
```

**Designer:** Think “this number (or string, or boolean) can change, and anything that depends on it should update.”

**Developer:** Reading inside a computed, effect, or live JSX binding **subscribes**. Writing notifies dependents.

---

### 2. `computed` — formula

```ts
import { computed } from "@lab206/core";

const double = computed(() => count() * 2);
double(); // always up to date; cached until deps change
```

**Designer:** A read-only value calculated from other live values — like a spreadsheet cell with a formula.

**Developer:** Pure functions only. No async, no DOM, no writes. For “filtered list,” “is form valid,” “display label.”

---

### 3. `effect` — reaction

```ts
import { effect } from "@lab206/core";

const stop = effect(() => {
  console.log(double());
  return () => {
    /* optional cleanup */
  };
});

stop(); // unsubscribe
```

**Designer:** Not the UI itself — the *when this changes, do that* rule (save, analytics, focus, sync to `document.title`).

**Developer:** Powers tracks which signals/computeds you read. No dependency arrays. Ever. Return a cleanup if you opened something that must close.

---

### 4. `store` — small model

```ts
import { store } from "@lab206/core";

const app = store({ count: 0, name: "Vince" });

app.count();                          // 0
app.count.set(1);
app.set({ name: "Grace", count: 2 }); // batch several fields
app();                                // snapshot { count, name }
```

**Designer:** One bag for related fields (a settings panel, a reservation form) instead of five loose sticky notes.

**Developer:** Each top-level key is its own signal. Nested objects are one value — replace the nest, or make another `store`.

---

### 5. `resource` — loaded data

```ts
import { resource, signal } from "@lab206/core";

const id = signal(1);

const user = resource(
  () => id(),
  async (id) => {
    const res = await fetch(`/api/users/${id}`);
    return res.json();
  },
);

user();         // data | undefined
user.loading(); // boolean
user.error();   // unknown
user.latest();  // last good value during refetch
user.refetch();
```

**Designer:** Maps to UI states you already design: loading → content, or loading → error. Refetch when the source (here `id`) changes.

**Developer:** If the source returns `null`, `undefined`, or `false`, the fetch is skipped (wait-until-ready). Prefer this over hand-rolled `useEffect` fetch spaghetti.

---

## How they connect

```
signal  →  computed  →  effect
   \          ↑
    \→ store /
              \
               resource  (async in, signals out)
                    ↓
              mount / JSX / @lab206/ui
```

1. Put truth in **`signal`** / **`store`**.  
2. Derive display and validation with **`computed`**.  
3. React to the outside world with **`effect`** (sparingly).  
4. Load remote data with **`resource`**.  
5. Bind the graph to the page with JSX — live text uses `{() => count()}`, not a one-shot `{count()}`.

---

## Three rules (memorize these)

1. **Read** with `count()` · **write** with `.set` / `.update`.  
2. **Live UI** needs an accessor: `{() => count()}` or pass the **signal** into controls (`bind={email}`). `{count()}` is a snapshot.  
3. **Look + behavior ship together** — prefer `@lab206/ui` primitives and tokens over inventing a second design system.

---

## Glue you’ll use later (not Day 1)

| API | When |
|---|---|
| `batch(() => { … })` | Many writes, one update wave |
| `createRoot(dispose => { … })` | Own a whole tree; `dispose()` cleans it |
| `onError(err => { … })` | Catch effect errors for that root |
| `untrack(() => …)` | Read without subscribing |
| `flush()` | Run pending effects now (tests / demos) |

Motion (optional): animate **signals**, then let the DOM read them — see [ANIMATION.md](./ANIMATION.md).

---

## Designers: what you need vs skip

| Do learn (10 minutes) | Can wait |
|---|---|
| The Rosetta stone table above | Ownership, SSR, `peek` / `untrack` |
| That live UI re-reads signals | Writing `effect` by hand |
| Tokens + System + Open Lab from a card | Building a custom `resource` |

You can retheme and compose on **System** without writing signals. When a pattern needs interactivity, come back here — same five words your engineer already uses.

---

## Developers: what you do *not* need

- A virtual DOM “re-render the component” model  
- Dependency arrays  
- A separate CSS framework to look good  
- GSAP for everyday motion — default is signal tweens; optional `@lab206/animate/gsap` when you need pro motion  

---

## Practice

| Step | Where |
|---|---|
| Hello signal | [lab206.com/lab?recipe=hello](https://lab206.com/lab?recipe=hello) |
| Form + `bind` | [lab206.com/lab?recipe=form](https://lab206.com/lab?recipe=form) |
| Docs three rules + first app | [lab206.com/docs#rules](https://lab206.com/docs#rules) |
| Day 1 / 2 / 30 | [LEARN_PATH.md](./LEARN_PATH.md) |
| Usability patterns | [USABILITY.md](./USABILITY.md) |

Master these five words + JSX + UI tokens/primitives and you can ship real apps.
