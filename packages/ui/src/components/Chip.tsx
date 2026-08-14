import { component, mergeProps, type ComponentProps } from "@power-ux/dom";
import { cx } from "../utils.js";
import { createStyleSheet } from "../styles.js";

export type ChipTone = "neutral" | "accent" | "success" | "warning" | "danger";

export type ChipProps = {
  tone?: ChipTone;
  /** Show × remove control */
  onRemove?: () => void;
  onClick?: () => void;
  class?: string | (() => string);
  children?: unknown;
};

const ensure = createStyleSheet(
  "chip",
  `
.pu-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  max-width: 100%;
  padding: 0.2rem 0.55rem;
  border-radius: var(--pu-radius-full);
  font-size: var(--pu-text-xs);
  font-weight: var(--pu-font-semibold);
  line-height: 1.4;
  border: 1px solid transparent;
  white-space: nowrap;
}
.pu-chip--clickable { cursor: pointer; }
.pu-chip--clickable:hover { filter: brightness(0.97); }
.pu-chip--neutral {
  background: var(--pu-color-surface-2);
  color: var(--pu-color-text);
  border-color: var(--pu-color-border);
}
.pu-chip--accent {
  background: color-mix(in srgb, var(--pu-color-accent) 14%, transparent);
  color: var(--pu-color-accent);
}
.pu-chip--success {
  background: color-mix(in srgb, var(--pu-color-success, #69be28) 16%, transparent);
  color: var(--pu-color-success, #69be28);
}
.pu-chip--warning {
  background: color-mix(in srgb, var(--pu-color-warning, #d4a017) 18%, transparent);
  color: var(--pu-color-warning, #b8860b);
}
.pu-chip--danger {
  background: color-mix(in srgb, var(--pu-color-danger) 14%, transparent);
  color: var(--pu-color-danger);
}
.pu-chip__x {
  appearance: none;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  padding: 0;
  margin: 0;
  font-size: 0.95em;
  line-height: 1;
  opacity: 0.7;
  display: inline-flex;
}
.pu-chip__x:hover { opacity: 1; }
`,
);

/** Compact tag / filter chip. */
export const Chip = component((raw: ChipProps) => {
  ensure();
  const props = mergeProps({ tone: "neutral" as const }, raw) as ComponentProps<
    ChipProps & { tone: ChipTone }
  >;

  const className = () =>
    cx(
      "pu-chip",
      `pu-chip--${props.tone}`,
      props.onClick && "pu-chip--clickable",
      typeof props.class === "function" ? props.class() : props.class,
    );

  const removeBtn = props.onRemove ? (
    <button
      type="button"
      class="pu-chip__x"
      aria-label="Remove"
      onClick={(e: MouseEvent) => {
        e.stopPropagation();
        props.onRemove?.();
      }}
    >
      ×
    </button>
  ) : null;

  if (props.onClick) {
    return (
      <button
        type="button"
        class={className}
        onClick={props.onClick}
        ref={(el) => ensure(el.ownerDocument)}
      >
        {props.children as never}
        {removeBtn}
      </button>
    );
  }

  return (
    <span class={className} ref={(el) => ensure(el.ownerDocument)}>
      {props.children as never}
      {removeBtn}
    </span>
  );
});
