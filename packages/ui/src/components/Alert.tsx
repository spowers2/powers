import { component, mergeProps, type ComponentProps } from "@power-ui/dom";
import { cx } from "../utils.js";

export type AlertTone = "info" | "success" | "warning" | "danger";

export type AlertProps = {
  tone?: AlertTone;
  title?: string;
  class?: string | (() => string);
  children?: unknown;
};

const styles = `
.pu-alert {
  display: flex;
  flex-direction: column;
  gap: var(--pu-space-1);
  padding: var(--pu-space-3) var(--pu-space-4);
  border-radius: var(--pu-radius-md);
  border: 1px solid var(--pu-color-border);
  font-size: var(--pu-text-sm);
  line-height: 1.45;
}
.pu-alert__title {
  font-weight: var(--pu-font-semibold);
  margin: 0;
}
.pu-alert__body { margin: 0; color: inherit; opacity: 0.92; }

.pu-alert--info {
  background: color-mix(in srgb, var(--pu-color-accent) 12%, var(--pu-color-surface));
  border-color: color-mix(in srgb, var(--pu-color-accent) 35%, var(--pu-color-border));
  color: var(--pu-color-text);
}
.pu-alert--success {
  background: color-mix(in srgb, var(--pu-sage-500) 12%, var(--pu-color-surface));
  border-color: color-mix(in srgb, var(--pu-sage-500) 40%, var(--pu-color-border));
}
.pu-alert--warning {
  background: color-mix(in srgb, #a67c3d 10%, var(--pu-color-surface));
  border-color: color-mix(in srgb, #a67c3d 35%, var(--pu-color-border));
}
.pu-alert--danger {
  background: color-mix(in srgb, var(--pu-color-danger) 12%, var(--pu-color-surface));
  border-color: color-mix(in srgb, var(--pu-color-danger) 40%, var(--pu-color-border));
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "alert");
  el.textContent = styles;
  document.head.appendChild(el);
}

/**
 * Inline status message. Uses role="status" (info/success) or role="alert" (warning/danger).
 */
export const Alert = component((raw: AlertProps) => {
  ensureStyles();
  const props = mergeProps({ tone: "info" as AlertTone }, raw) as ComponentProps<
    AlertProps & { tone: AlertTone }
  >;
  const tone = () => props.tone;
  const role = () =>
    tone() === "warning" || tone() === "danger" ? "alert" : "status";

  return (
    <div
      class={() =>
        cx(
          "pu-alert",
          `pu-alert--${tone()}`,
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      role={role()}
    >
      {props.title ? <p class="pu-alert__title">{props.title}</p> : null}
      {props.children != null ? (
        <div class="pu-alert__body">{props.children as never}</div>
      ) : null}
    </div>
  );
});
