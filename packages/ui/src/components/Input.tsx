import { effect, type Signal } from "@powers/core";
import {
  component,
  getRawProp,
  mergeProps,
  type ComponentProps,
} from "@powers/dom";
import { cx } from "../utils.js";
import { readBool, readStr, type MaybeReactive } from "../reactive.js";
import type { Bindable } from "../form.js";
import { warnPossibleSnapshotValue } from "../dev.js";

export type InputProps = {
  type?: string;
  value?: MaybeReactive<string>;
  /**
   * Two-way bind a string signal — preferred over `value` + manual `onInput`.
   * @example <Input bind={email} />
   */
  bind?: Bindable<string> | Signal<string>;
  placeholder?: string;
  disabled?: MaybeReactive<boolean>;
  class?: MaybeReactive<string>;
  onInput?: (e: Event) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onFocus?: (e: FocusEvent) => void;
  ref?: (el: HTMLInputElement) => void;
  id?: string;
  name?: string;
  autocomplete?: string;
  "aria-label"?: string;
  "aria-invalid"?: MaybeReactive<boolean>;
};

const styles = `
.pu-input {
  width: 100%;
  height: var(--pu-control-h-md);
  padding: 0 var(--pu-control-px);
  border-radius: var(--pu-radius-md);
  border: 1px solid var(--pu-color-control-border, var(--pu-color-border));
  background: var(--pu-color-surface);
  color: var(--pu-color-text);
  box-shadow: var(--pu-shadow-xs);
  transition:
    border-color var(--pu-duration) var(--pu-ease),
    box-shadow var(--pu-duration) var(--pu-ease),
    background var(--pu-duration) var(--pu-ease);
}
.pu-input::placeholder { color: var(--pu-color-text-muted); }
.pu-input:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--pu-color-border) 40%, var(--pu-color-text-muted));
}
.pu-input:focus {
  outline: none;
  border-color: color-mix(in srgb, var(--pu-color-focus) 55%, var(--pu-color-border));
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--pu-color-focus) 18%, transparent),
    var(--pu-shadow-xs);
}
.pu-input:disabled { opacity: 0.55; cursor: not-allowed; }
.pu-input[aria-invalid="true"] {
  border-color: var(--pu-color-danger);
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "input");
  el.textContent = styles;
  document.head.appendChild(el);
}

/**
 * Text input.
 *
 * **Preferred:** `<Input bind={mySignal} />` — two-way, no casts.
 *
 * Controlled mode (`value={signal}` or `bind={signal}`):
 * - Seed via defaultValue once
 * - onInput updates your signal (automatic with `bind`)
 * - We never rewrite .value while focused (prevents caret reset + scroll jumps)
 * - When unfocused, signal → DOM for external updates (reset, etc.)
 */
export const Input = component((raw: InputProps) => {
  ensureStyles();
  const props = mergeProps({ type: "text" }, raw) as ComponentProps<
    InputProps & { type: string }
  >;

  // bind is not unwrapped by createProps; value is — use getRawProp for dev checks
  const bound = getRawProp(raw as object, "bind") as
    | Bindable<string>
    | Signal<string>
    | undefined;
  const valueRaw = getRawProp(raw as object, "value");
  warnPossibleSnapshotValue("Input", {
    hasBind: bound !== undefined && bound !== null,
    valueIsPlainString: typeof valueRaw === "string",
  });
  const controlled = raw.value !== undefined || bound !== undefined;
  let el: HTMLInputElement | null = null;

  const readValue = () =>
    bound
      ? readStr(bound as MaybeReactive<string>)
      : readStr(props.value as MaybeReactive<string>);

  const initial = controlled ? readValue() : "";

  if (controlled) {
    effect(() => {
      const next = readValue();
      const node = el;
      if (!node) return;
      if (node.ownerDocument.activeElement === node) return;
      if (node.value !== next) node.value = next;
    });
  }

  return (
    <input
      id={props.id}
      name={props.name}
      type={props.type}
      autocomplete={props.autocomplete}
      class={() =>
        cx("pu-input", readStr(props.class as MaybeReactive<string>) || undefined)
      }
      placeholder={props.placeholder}
      disabled={() => readBool(props.disabled as MaybeReactive<boolean>)}
      defaultValue={controlled ? initial : undefined}
      onInput={(e: Event) => {
        if (bound) {
          const t = (e.currentTarget ?? e.target) as HTMLInputElement | null;
          if (t && "value" in t) bound.set(t.value);
        }
        props.onInput?.(e);
      }}
      onKeyDown={props.onKeyDown}
      onBlur={(e: FocusEvent) => {
        if (controlled && el) {
          const next = readValue();
          if (el.value !== next) el.value = next;
        }
        props.onBlur?.(e);
      }}
      onFocus={props.onFocus}
      ref={(node) => {
        el = node as HTMLInputElement;
        if (controlled && el && el.ownerDocument.activeElement !== el) {
          const next = readValue();
          if (el.value !== next) el.value = next;
        }
        props.ref?.(el);
      }}
      aria-label={props["aria-label"]}
      aria-invalid={() =>
        readBool(props["aria-invalid"] as MaybeReactive<boolean>)
          ? true
          : undefined
      }
    />
  );
});
