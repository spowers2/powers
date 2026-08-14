# Power UI usability guide

Short mental model + preferred patterns. Prefer this over inventing one-offs.

---

## 1. Mental model (learn once)

| Layer | You write | It does |
|---|---|---|
| **core** | `signal` / `computed` / `effect` | Fine-grained state |
| **dom** | JSX + `mount` | Reactive DOM (no VDOM) |
| **ui** | `Button`, `Field`, `bind=…` | Design system |
| **router** | `createRouter` · `outlet()` once | Navigation |

**Rules that prevent 90% of bugs**

1. Pass **signals**, not snapshots: `value={email}` or `bind={email}` — never `value={email()}`.
2. Call **`router.outlet()` once** per app (store the node if the shell re-renders).
3. Read reactive data **inside** `() => …` scopes, effects, or component prop accessors.
4. Prefer **`bind={signal}`** on form controls over manual `onInput` + casts.

---

## 2. Forms (preferred path)

```tsx
import { signal } from "@power-ui/core";
import {
  Field,
  Input,
  Select,
  Button,
  createField,
  required,
  emailFormat,
  firstError,
} from "@power-ui/ui";

// A) Simple bind
const notes = signal("");
<Textarea bind={notes} rows={3} />

// B) Field with validation
const email = signal("");
const touched = signal(false);
const emailError = () =>
  !touched() ? "" : firstError(required(email()), emailFormat(email()));

<Field label="Email" required error={emailError}>
  <Input bind={email} onBlur={() => touched.set(true)} />
</Field>

// C) createField (value + touched + error in one handle)
const name = createField({
  validate: (v) => required(v, "Name required"),
});
<Field label="Name" required error={name.error}>
  <Input bind={name.value} onBlur={name.touch} />
</Field>

// submit
name.touch();
if (name.error()) return;
```

### Select

```tsx
const status = signal("active");
<Select
  bind={status}
  placeholder="Choose…"
  options={[
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
  ]}
/>
```

### Checkbox / Switch

```tsx
const notify = signal(true);
<Checkbox bind={notify} label="Email me" />
<Switch bind={notify} label="Notifications" />
```

### Spread helpers (when you need extra handlers)

```tsx
import { bindInput, bindSelect, eventValue } from "@power-ui/ui";

<Input {...bindInput(email)} onBlur={…} />
// or keep bind + onInput side effects:
<Input bind={email} onInput={(e) => console.log(eventValue(e))} />
```

---

## 3. Lists & conditionals

```tsx
import { Show, For } from "@power-ui/dom";

<Show when={() => items().length > 0} fallback={<Empty title="Nothing yet" />}>
  {() => (
    <For each={items}>
      {(item) => <div>{() => item().name}</div>}
    </For>
  )}
</Show>
```

For simple staff apps, mapping to a `DocumentFragment` inside `{() => { … }}` is also fine — keep one pattern per team.

---

## 4. Router

```tsx
const router = createRouter({ routes: […] });
const outlet = router.outlet(); // once

// Deep links
router.navigate("/invoices?status=overdue");
router.query("status");       // "overdue" (reactive in effects)
router.searchParams().get("status");

// Links
<Link router={router} to="/clients" activeClass="is-active">Clients</Link>
```

---

## 5. Theme & layout

```tsx
import "@power-ui/ui/theme.css";
import { createTheme, createDensity, Stack, Card, Text } from "@power-ui/ui";

const theme = createTheme("light");
theme.bind();
createDensity("comfortable").bind();
```

Retheme globally via `packages/ui/src/styles/tokens.css`.

---

## 6. Anti-patterns

| Avoid | Prefer |
|---|---|
| `value={email()}` | `bind={email}` or `value={email}` |
| Manual `(e.target as HTMLInputElement).value` everywhere | `bind` / `eventValue` |
| Calling `outlet()` twice | Single outlet host |
| Putting form state in `localStorage` every keystroke without care | `effect` + debounce, or save on submit |
| Giant page remounts while typing | Stable route components + signals |

---

## 7. Where to look next

| Need | Doc / demo |
|---|---|
| Day 1 / 2 / 30 path | [LEARN_PATH.md](./LEARN_PATH.md) |
| Forms deep dive | [FORMS.md](./FORMS.md) |
| Components + brand playground | System `/system#sys-play` |
| Cookbook Lab | `/lab?recipe=settings` · `admin-list` |
| Motions | [MOTION.md](./MOTION.md) |
| Scaffold | `pnpm create-app my-ui` |
| Contracts (why inputs don’t remount) | [FOUNDATION.md](./FOUNDATION.md) |
| Product patterns | designlab206 `:5180` · Hearth `:5181` |
