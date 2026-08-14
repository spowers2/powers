import { component, mergeProps, type ComponentProps } from "@powers/dom";
import { cx } from "../utils.js";

export type CardVariant = "default" | "glass" | "elevated" | "soft";

export type CardProps = {
  padded?: boolean;
  /** Visual treatment — glass/elevated for modern layered UIs */
  variant?: CardVariant;
  /** Subtle hover lift (for interactive tiles) */
  interactive?: boolean;
  class?: string | (() => string);
  children?: unknown;
};

const styles = `
.pu-card {
  background: var(--pu-color-surface);
  border: 1px solid var(--pu-color-border);
  border-radius: var(--pu-radius-lg);
  box-shadow: var(--pu-shadow-sm);
  transition:
    box-shadow var(--pu-duration) var(--pu-ease),
    border-color var(--pu-duration) var(--pu-ease),
    transform var(--pu-duration) var(--pu-ease),
    background var(--pu-duration) var(--pu-ease);
}
.pu-card--padded { padding: var(--pu-space-5); }
.pu-card--glass {
  background: var(--pu-glass-bg);
  border-color: var(--pu-glass-border);
  backdrop-filter: blur(var(--pu-glass-blur)) saturate(1.2);
  -webkit-backdrop-filter: blur(var(--pu-glass-blur)) saturate(1.2);
  box-shadow: var(--pu-shadow-float);
}
.pu-card--elevated {
  box-shadow: var(--pu-shadow-md);
  border-color: color-mix(in srgb, var(--pu-holo-cyan, transparent) 12%, var(--pu-color-border));
}
.pu-card--soft {
  background: var(--pu-color-surface-2);
  border-color: transparent;
  box-shadow: none;
}
.pu-card--interactive {
  cursor: default;
}
.pu-card--interactive:hover {
  box-shadow: var(--pu-shadow-lg);
  border-color: color-mix(in srgb, var(--pu-holo-cyan, var(--pu-color-accent)) 22%, var(--pu-color-border));
  transform: translateY(-1px);
}
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
  const props = mergeProps(
    { padded: true, variant: "default" as CardVariant, interactive: false },
    raw,
  ) as ComponentProps<
    CardProps & {
      padded: boolean;
      variant: CardVariant;
      interactive: boolean;
    }
  >;
  return (
    <section
      class={() =>
        cx(
          "pu-card",
          props.padded && "pu-card--padded",
          props.variant !== "default" && `pu-card--${props.variant}`,
          props.interactive && "pu-card--interactive",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
    >
      {props.children as never}
    </section>
  );
});
