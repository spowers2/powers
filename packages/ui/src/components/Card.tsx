import { component, mergeProps, type ComponentProps } from "@power-ui/dom";
import { cx } from "../utils.js";

export type CardProps = {
  padded?: boolean;
  class?: string | (() => string);
  children?: unknown;
};

const styles = `
.pu-card {
  background: var(--pu-color-surface);
  border: 1px solid var(--pu-color-border);
  border-radius: var(--pu-radius-lg);
  box-shadow: var(--pu-shadow-sm);
}
.pu-card--padded { padding: var(--pu-space-5); }
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "card");
  el.textContent = styles;
  document.head.appendChild(el);
}

export const Card = component((raw: CardProps) => {
  ensureStyles();
  const props = mergeProps({ padded: true }, raw) as ComponentProps<
    CardProps & { padded: boolean }
  >;
  return (
    <section
      class={() =>
        cx(
          "pu-card",
          props.padded && "pu-card--padded",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
    >
      {props.children as never}
    </section>
  );
});
