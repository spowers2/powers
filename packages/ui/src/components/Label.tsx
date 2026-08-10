import { component, mergeProps, type ComponentProps } from "@power-ui/dom";
import { cx } from "../utils.js";

export type LabelProps = {
  htmlFor?: string;
  required?: boolean;
  class?: string | (() => string);
  children?: unknown;
};

const styles = `
.pu-label {
  display: inline-flex;
  align-items: baseline;
  gap: 0.25rem;
  font-size: var(--pu-label-size);
  font-weight: var(--pu-font-semibold);
  color: var(--pu-color-text);
  line-height: 1.3;
}
.pu-label__req {
  color: var(--pu-color-danger);
  font-weight: var(--pu-font-bold);
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "label");
  el.textContent = styles;
  document.head.appendChild(el);
}

export const Label = component((raw: LabelProps) => {
  ensureStyles();
  const props = mergeProps({}, raw) as ComponentProps<LabelProps>;
  return (
    <label
      class={() =>
        cx(
          "pu-label",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      for={props.htmlFor}
    >
      {props.children as never}
      {props.required ? <span class="pu-label__req" aria-hidden="true">*</span> : null}
    </label>
  );
});
