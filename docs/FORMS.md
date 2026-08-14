# Forms & validation

Power UI keeps forms **boring and readable**: signals for state, `Field` for layout/errors, pure helpers for rules.

## Preferred pattern (bind)

```tsx
import { signal } from "@power-ui/core";
import {
  Field,
  Input,
  Button,
  required,
  emailFormat,
  firstError,
} from "@power-ui/ui";

const email = signal("");
const emailError = () =>
  firstError(required(email()), emailFormat(email()));

// Pass the signal itself — bind wires value + onInput
<Field label="Email" required error={emailError}>
  <Input bind={email} />
</Field>
```

**Do not** write `value={email()}` — that snapshots once and breaks typing.

### createField (touched + error)

```tsx
import { createField, required, emailFormat, firstError } from "@power-ui/ui";

const email = createField({
  validate: (v) => firstError(required(v), emailFormat(v)),
});

<Field label="Email" required error={email.error}>
  <Input bind={email.value} onBlur={email.touch} />
</Field>

// on submit
email.touch();
if (email.error()) return;
save(email.get());
```

### Select / checkbox

```tsx
const status = signal("active");
const ok = signal(true);

<Select
  bind={status}
  placeholder="Status"
  options={[
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
  ]}
/>
<Checkbox bind={ok} label="I agree" />
```

### Manual / spread helpers

Still supported when you need custom handlers:

```tsx
import { bindInput, eventValue } from "@power-ui/ui";

<Input
  {...bindInput(email)}
  onBlur={() => touched.set(true)}
/>
// equivalent legacy style:
<Input
  value={email}
  onInput={(e) => email.set(eventValue(e))}
/>
```

Controls accept `MaybeReactive<T>` (`T | (() => T)` / signals). Internally they use `readProp` / `readBool` / `readStr` so accessors stay consistent. While an input is **focused**, DOM is source of truth (caret stays put); on blur or external set, the signal syncs back to the DOM.

**Field auto-wiring:** pass `label="Email"` and a child `Input` — Field generates a matching `id` / `htmlFor` and sets `aria-invalid` / `aria-describedby` from `error` / `hint`. Override with explicit `htmlFor` + control `id` when needed.

Runtime contracts (why the page must not remount while typing): [`FOUNDATION.md`](./FOUNDATION.md).  
Usability overview: [`USABILITY.md`](./USABILITY.md).

## Helpers (`@power-ui/ui`)

| Helper | Role |
|---|---|
| **`bind={signal}`** | Two-way on Input, Textarea, Select, Checkbox, Switch |
| `bindInput` / `bindSelect` / `bindChecked` | Spread props if you prefer |
| `eventValue` / `eventChecked` | Safe event reads (no casts) |
| `createField({ validate })` | value + touched + error handle |
| `required` / `emailFormat` / `minLength` / `maxLength` / `matches` | Rules |
| `firstError(...msgs)` | First non-empty message |
| `validateForm({ field: () => error })` | Snapshot all errors on submit |

## Lab

Open **`/lab?recipe=form`** for the full signup flow (name + email + checkbox).

## What we intentionally skip (for now)

No schema DSL, no form context provider, no controlled form state machine.  
Add those only when product apps demand them — the signal + `bind` + helper path stays the default teach path.
