import { component, mergeProps, type ComponentProps } from "@power-ui/dom";
import { cx } from "../utils.js";

export type TextareaProps = {
  value?: string | (() => string);
  placeholder?: string;
  rows?: number;
  disabled?: boolean | (() => boolean);
  class?: string | (() => string);
  onInput?: (e: Event) => void;
  id?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean | (() => boolean);
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

export const Textarea = component((raw: TextareaProps) => {
  ensureStyles();
  const props = mergeProps({ rows: 4 }, raw) as ComponentProps<
    TextareaProps & { rows: number }
  >;
  return (
    <textarea
      id={props.id}
      class={() =>
        cx(
          "pu-textarea",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      rows={props.rows}
      placeholder={props.placeholder}
      disabled={
        typeof props.disabled === "function" ? props.disabled() : props.disabled
      }
      value={typeof props.value === "function" ? props.value() : props.value}
      onInput={props.onInput}
      aria-label={props["aria-label"]}
      aria-invalid={
        typeof props["aria-invalid"] === "function"
          ? props["aria-invalid"]()
          : props["aria-invalid"]
      }
    />
  );
});
