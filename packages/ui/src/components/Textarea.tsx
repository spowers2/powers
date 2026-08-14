import { effect, type Signal } from "@power-ux/core";
import { component, mergeProps, type ComponentProps } from "@power-ux/dom";
import { cx } from "../utils.js";
import { readBool, readStr, type MaybeReactive } from "../reactive.js";
import type { Bindable } from "../form.js";

export type TextareaProps = {
  value?: MaybeReactive<string>;
  /** Two-way bind a string signal — preferred over value + onInput. */
  bind?: Bindable<string> | Signal<string>;
  placeholder?: string;
  rows?: number;
  disabled?: MaybeReactive<boolean>;
  class?: MaybeReactive<string>;
  onInput?: (e: Event) => void;
  onBlur?: (e: FocusEvent) => void;
  id?: string;
  "aria-label"?: string;
  "aria-invalid"?: MaybeReactive<boolean>;
};

const styles = `
.pu-textarea {
  width: 100%;
  min-height: calc(var(--pu-control-h-md) * 2.2);
  padding: 0.65rem var(--pu-control-px);
  border-radius: var(--pu-radius-md);
  border: 1px solid var(--pu-color-border);
  background: var(--pu-color-surface);
  color: var(--pu-color-text);
  resize: vertical;
  line-height: 1.45;
  transition: border-color var(--pu-duration) var(--pu-ease), box-shadow var(--pu-duration) var(--pu-ease);
}
.pu-textarea::placeholder { color: var(--pu-color-text-muted); }
.pu-textarea:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--pu-color-border) 60%, var(--pu-color-text-muted));
}
.pu-textarea:focus {
  outline: none;
  border-color: var(--pu-color-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--pu-color-accent) 25%, transparent);
}
.pu-textarea:disabled { opacity: 0.55; cursor: not-allowed; }
.pu-textarea[aria-invalid="true"] {
  border-color: var(--pu-color-danger);
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "textarea");
  el.textContent = styles;
  document.head.appendChild(el);
}

/** Multiline text. Prefer `<Textarea bind={notes} />`. */
export const Textarea = component((raw: TextareaProps) => {
  ensureStyles();
  const props = mergeProps({ rows: 4 }, raw) as ComponentProps<
    TextareaProps & { rows: number }
  >;

  const bound = raw.bind;
  const controlled = raw.value !== undefined || bound !== undefined;
  let el: HTMLTextAreaElement | null = null;
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
    <textarea
      id={props.id}
      class={() =>
        cx(
          "pu-textarea",
          readStr(props.class as MaybeReactive<string>) || undefined,
        )
      }
      rows={props.rows}
      placeholder={props.placeholder}
      disabled={() => readBool(props.disabled as MaybeReactive<boolean>)}
      defaultValue={controlled ? initial : undefined}
      onInput={(e: Event) => {
        if (bound) {
          const t = (e.currentTarget ?? e.target) as HTMLTextAreaElement | null;
          if (t && "value" in t) bound.set(t.value);
        }
        props.onInput?.(e);
      }}
      onBlur={(e: FocusEvent) => {
        if (controlled && el) {
          const next = readValue();
          if (el.value !== next) el.value = next;
        }
        props.onBlur?.(e);
      }}
      ref={(node) => {
        el = node as HTMLTextAreaElement;
        if (controlled && el && el.ownerDocument.activeElement !== el) {
          const next = readValue();
          if (el.value !== next) el.value = next;
        }
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
