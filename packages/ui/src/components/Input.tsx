import { component, mergeProps, type ComponentProps } from "@power-ui/dom";
import { cx } from "../utils.js";

export type InputProps = {
  type?: string;
  value?: string | (() => string);
  placeholder?: string;
  disabled?: boolean | (() => boolean);
  class?: string | (() => string);
  onInput?: (e: Event) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  ref?: (el: HTMLInputElement) => void;
  "aria-label"?: string;
};

const styles = `
.pu-input {
  width: 100%;
  height: var(--pu-control-h-md);
  padding: 0 var(--pu-control-px);
  border-radius: var(--pu-radius-md);
  border: 1px solid var(--pu-color-border);
  background: var(--pu-color-surface);
  color: var(--pu-color-text);
  transition: border-color var(--pu-duration) var(--pu-ease), box-shadow var(--pu-duration) var(--pu-ease);
}
.pu-input::placeholder { color: var(--pu-color-text-muted); }
.pu-input:hover:not(:disabled) { border-color: color-mix(in srgb, var(--pu-color-border) 60%, var(--pu-color-text-muted)); }
.pu-input:focus {
  outline: none;
  border-color: var(--pu-color-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--pu-color-accent) 25%, transparent);
}
.pu-input:disabled { opacity: 0.55; cursor: not-allowed; }
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

export const Input = component((raw: InputProps) => {
  ensureStyles();
  const props = mergeProps({ type: "text" }, raw) as ComponentProps<
    InputProps & { type: string }
  >;

  return (
    <input
      type={props.type}
      class={() =>
        cx(
          "pu-input",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      placeholder={props.placeholder}
      disabled={
        typeof props.disabled === "function"
          ? props.disabled()
          : props.disabled
      }
      value={
        typeof props.value === "function" ? props.value() : props.value
      }
      onInput={props.onInput}
      onKeyDown={props.onKeyDown}
      ref={props.ref as (el: HTMLElement) => void}
      aria-label={props["aria-label"]}
    />
  );
});
