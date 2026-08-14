import { component, type ComponentProps } from "@power-ux/dom";
import { cx } from "../utils.js";

export type KbdProps = {
  class?: string | (() => string);
  children?: unknown;
};

const styles = `
.pu-kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.4em;
  padding: 0.12em 0.4em;
  border-radius: 6px;
  border: 1px solid var(--pu-color-border);
  border-bottom-width: 2px;
  background: var(--pu-color-surface-2);
  color: var(--pu-color-text-muted);
  font-family: var(--pu-font-mono);
  font-size: 0.78em;
  font-weight: var(--pu-font-semibold);
  line-height: 1.3;
  letter-spacing: 0.02em;
  white-space: nowrap;
  box-shadow: var(--pu-shadow-xs);
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "kbd");
  el.textContent = styles;
  document.head.appendChild(el);
}

/** Keyboard key affordance for shortcuts and docs. */
export const Kbd = component((raw: KbdProps) => {
  ensureStyles();
  const props = raw as ComponentProps<KbdProps>;
  return (
    <kbd
      class={() =>
        cx(
          "pu-kbd",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
    >
      {props.children as never}
    </kbd>
  );
});
