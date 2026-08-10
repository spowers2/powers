import { component, mergeProps, type ComponentProps } from "@power-ui/dom";
import { cx } from "../utils.js";
import { Label } from "./Label.js";

export type FieldProps = {
  label?: string;
  htmlFor?: string;
  hint?: string | (() => string);
  error?: string | (() => string | undefined | null | false);
  required?: boolean;
  class?: string | (() => string);
  children?: unknown;
};

const styles = `
.pu-field {
  display: flex;
  flex-direction: column;
  gap: var(--pu-field-gap);
  min-width: 0;
}
.pu-field__hint {
  margin: 0;
  font-size: var(--pu-text-xs);
  color: var(--pu-color-text-muted);
  line-height: 1.4;
}
.pu-field__error {
  margin: 0;
  font-size: var(--pu-text-xs);
  color: var(--pu-color-danger);
  font-weight: var(--pu-font-medium);
  line-height: 1.4;
}
.pu-field--invalid :is(.pu-input, .pu-textarea, .pu-select) {
  border-color: var(--pu-color-danger);
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "field");
  el.textContent = styles;
  document.head.appendChild(el);
}

/**
 * Form field layout: label + control + hint/error.
 */
export const Field = component((raw: FieldProps) => {
  ensureStyles();
  const props = mergeProps({}, raw) as ComponentProps<FieldProps>;

  const errorText = () => {
    const e = props.error;
    if (typeof e === "function") return e() || "";
    return e || "";
  };
  const hintText = () => {
    const h = props.hint;
    if (typeof h === "function") return h();
    return h || "";
  };

  return (
    <div
      class={() =>
        cx(
          "pu-field",
          errorText() && "pu-field--invalid",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
    >
      {props.label
        ? Label({
            ...(props.htmlFor !== undefined ? { htmlFor: props.htmlFor } : {}),
            ...(props.required !== undefined
              ? { required: props.required }
              : {}),
            children: props.label,
          })
        : null}
      {props.children as never}
      <p
        class="pu-field__hint"
        hidden={() => {
          const h = hintText();
          return !h || !!errorText();
        }}
      >
        {() => hintText()}
      </p>
      <p class="pu-field__error" role="alert" hidden={() => !errorText()}>
        {() => errorText()}
      </p>
    </div>
  );
});
