/**
 * Lightweight form helpers — pure functions for Field `error` props,
 * two-way bind helpers, and a small `createField` pattern.
 *
 * No schema DSL. Keep validation next to signals.
 *
 * @example Preferred control wiring
 * ```tsx
 * const email = signal("");
 * <Input bind={email} />
 * // or spread: <Input {...bindText(email)} />
 * ```
 *
 * @example Validation
 * ```tsx
 * const emailError = () => firstError(required(email()), emailFormat(email()));
 * <Field label="Email" error={emailError}><Input bind={email} /></Field>
 * ```
 */

import { signal, type Signal } from "@powers/core";

export type FieldError = string | undefined | null | false;

/** Anything that behaves like a writable signal (Powers signal). */
export type Bindable<T> = {
  (): T;
  set: (value: T) => void;
};

/** First truthy message wins (empty string / false / null skipped). */
export function firstError(
  ...msgs: Array<FieldError | (() => FieldError)>
): string {
  for (const m of msgs) {
    const v = typeof m === "function" ? m() : m;
    if (v) return String(v);
  }
  return "";
}

export function required(
  value: unknown,
  message = "Required",
): FieldError {
  if (value == null) return message;
  if (typeof value === "string" && value.trim() === "") return message;
  if (Array.isArray(value) && value.length === 0) return message;
  return "";
}

export function minLength(
  value: string,
  min: number,
  message?: string,
): FieldError {
  if (!value) return "";
  if (value.length < min) {
    return message ?? `At least ${min} characters`;
  }
  return "";
}

export function maxLength(
  value: string,
  max: number,
  message?: string,
): FieldError {
  if (!value) return "";
  if (value.length > max) {
    return message ?? `At most ${max} characters`;
  }
  return "";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailFormat(
  value: string,
  message = "Enter a valid email",
): FieldError {
  if (!value || !value.trim()) return "";
  return EMAIL_RE.test(value.trim()) ? "" : message;
}

export function matches(
  value: string,
  other: string,
  message = "Does not match",
): FieldError {
  if (!value && !other) return "";
  return value === other ? "" : message;
}

/**
 * Run a map of field → error string. Returns `{ ok, errors }`.
 * Use after submit or whenever you want a full-form snapshot.
 */
export function validateForm<K extends string>(
  fields: Record<K, () => FieldError>,
): { ok: boolean; errors: Partial<Record<K, string>> } {
  const errors: Partial<Record<K, string>> = {};
  let ok = true;
  for (const key of Object.keys(fields) as K[]) {
    const msg = fields[key]!();
    if (msg) {
      errors[key] = String(msg);
      ok = false;
    }
  }
  return { ok, errors };
}

/** Read string value from an input / textarea / select event. */
export function eventValue(e: Event): string {
  const t = e.currentTarget ?? e.target;
  // Duck-type (works in happy-dom / SSR stubs without instanceof globals)
  if (t && typeof t === "object" && "value" in t) {
    return String((t as { value: unknown }).value ?? "");
  }
  return "";
}

/** Read checked state from a checkbox / switch-like event. */
export function eventChecked(e: Event): boolean {
  const t = e.currentTarget ?? e.target;
  if (t && typeof t === "object" && "checked" in t) {
    return !!(t as { checked: unknown }).checked;
  }
  return false;
}

/**
 * Props to spread onto `Input` / `Textarea` for two-way signal binding.
 *
 * Prefer the control’s `bind={signal}` prop when available.
 * Named `bindInput` (not `bindText`) so it doesn’t clash with `@powers/dom`’s
 * DOM `bindText` helper.
 */
export function bindInput(sig: Bindable<string>): {
  value: Bindable<string>;
  onInput: (e: Event) => void;
} {
  return {
    value: sig,
    onInput: (e: Event) => {
      sig.set(eventValue(e));
    },
  };
}

/** Alias of bindInput. */
export const bindString = bindInput;

/**
 * Props to spread onto `Select` for two-way signal binding.
 * Prefer `bind={signal}` on Select when available.
 */
export function bindSelect(sig: Bindable<string>): {
  value: Bindable<string>;
  onChange: (e: Event) => void;
} {
  return {
    value: sig,
    onChange: (e: Event) => {
      sig.set(eventValue(e));
    },
  };
}

/**
 * Adapt a typed string-union signal (`Signal<"a" | "b">`) for `<Select bind={…} />`.
 */
export function asSelectBind<T extends string>(sig: {
  (): T;
  set: (value: T) => void;
}): Bindable<string> {
  const bound = (() => sig()) as unknown as Bindable<string>;
  bound.set = (value: string) => {
    sig.set(value as T);
  };
  return bound;
}

/**
 * Props for checkbox / switch patterns that use `checked` + `onChange(boolean)`.
 */
export function bindChecked(sig: Bindable<boolean>): {
  checked: Bindable<boolean>;
  onChange: (checked: boolean) => void;
} {
  return {
    checked: sig,
    onChange: (checked: boolean) => {
      sig.set(checked);
    },
  };
}

export type CreateFieldOptions = {
  /** Initial string value */
  initial?: string;
  /**
   * Validate when touched (or always if `validateWhen: "always"`).
   * Return a message or falsy.
   */
  validate?: (value: string) => FieldError;
  /** Default `"touched"` — only show errors after blur/submit. */
  validateWhen?: "touched" | "always";
};

export type FieldHandle = {
  /** Writable signal — pass to `bind={field.value}` or `value={field.value}` */
  value: Signal<string>;
  touched: Signal<boolean>;
  /** Accessor for Field `error={field.error}` */
  error: () => string;
  /** Mark touched (call on blur or before submit) */
  touch: () => void;
  /** Reset value + untouched */
  reset: (next?: string) => void;
  /** Current string (sugar for value()) */
  get: () => string;
  set: (v: string) => void;
};

/**
 * One field’s state: value signal + touched + error accessor.
 *
 * @example
 * ```tsx
 * const name = createField({
 *   validate: (v) => required(v, "Name required"),
 * });
 *
 * <Field label="Name" required error={name.error}>
 *   <Input bind={name.value} onBlur={name.touch} />
 * </Field>
 *
 * // on submit:
 * name.touch();
 * if (name.error()) return;
 * ```
 */
export function createField(options: CreateFieldOptions = {}): FieldHandle {
  const initial = options.initial ?? "";
  const value = signal(initial);
  const touched = signal(false);
  const when = options.validateWhen ?? "touched";

  const error = (): string => {
    if (when === "touched" && !touched()) return "";
    if (!options.validate) return "";
    return firstError(options.validate(value()));
  };

  return {
    value,
    touched,
    error,
    touch: () => touched.set(true),
    reset: (next = initial) => {
      value.set(next);
      touched.set(false);
    },
    get: () => value(),
    set: (v: string) => value.set(v),
  };
}
