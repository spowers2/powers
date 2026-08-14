import { component, mergeProps, type ComponentProps } from "@power-ux/dom";
import { cx } from "../utils.js";

export type DividerProps = {
  /** Visual label centered on the line */
  label?: string;
  class?: string | (() => string);
};

const styles = `
.pu-divider {
  display: flex;
  align-items: center;
  gap: var(--pu-space-3);
  width: 100%;
  border: 0;
  margin: var(--pu-space-4) 0;
  color: var(--pu-color-text-muted);
  font-size: var(--pu-text-xs);
  font-weight: var(--pu-font-semibold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.pu-divider::before,
.pu-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--pu-color-border);
}
.pu-divider--plain {
  height: 1px;
  margin: var(--pu-space-4) 0;
  background: var(--pu-color-border);
  gap: 0;
  text-indent: -9999px;
  overflow: hidden;
}
.pu-divider--plain::before,
.pu-divider--plain::after { display: none; }
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "divider");
  el.textContent = styles;
  document.head.appendChild(el);
}

export const Divider = component((raw: DividerProps) => {
  ensureStyles();
  const props = mergeProps({}, raw) as ComponentProps<DividerProps>;
  const hasLabel = !!props.label;

  return (
    <div
      role="separator"
      class={() =>
        cx(
          "pu-divider",
          !hasLabel && "pu-divider--plain",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
    >
      {hasLabel ? props.label : "\u00a0"}
    </div>
  );
});
