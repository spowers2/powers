import { component, mergeProps, type ComponentProps } from "@powers/dom";
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
.pu-chip--clickable {
  cursor: pointer;
  transition:
    filter var(--pu-duration-fast) var(--pu-ease),
    box-shadow var(--pu-duration-fast) var(--pu-ease);
}
.pu-chip--clickable:hover { filter: brightness(0.97); }
.pu-chip--clickable:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--pu-color-surface),
    0 0 0 4px color-mix(in srgb, var(--pu-color-focus) 55%, transparent);
}
.pu-chip--neutral {
  background: var(--pu-color-surface-2);
  color: var(--pu-color-text);
  border-color: var(--pu-color-border-strong, var(--pu-color-border));
}
.pu-chip--accent {
  background: var(--pu-color-soft-bg);
  color: var(--pu-color-soft-fg);
  border-color: var(--pu-color-soft-border);
}
.pu-chip--success {
  background: color-mix(in srgb, var(--pu-color-success, #69be28) 16%, var(--pu-color-surface));
  color: var(--pu-sage-800, #2a5410);
  border-color: color-mix(in srgb, var(--pu-color-success, #69be28) 36%, var(--pu-color-border));
}
.pu-chip--warning {
  background: color-mix(in srgb, var(--pu-color-warning, #d4a017) 18%, var(--pu-color-surface));
  color: var(--pu-color-warning-fg, #5c4018);
  border-color: color-mix(in srgb, var(--pu-color-warning, #d4a017) 32%, var(--pu-color-border));
}
.pu-chip--danger {
  background: color-mix(in srgb, var(--pu-color-danger) 14%, var(--pu-color-surface));
  color: var(--pu-color-danger);
  border-color: color-mix(in srgb, var(--pu-color-danger) 32%, var(--pu-color-border));
}
[data-pu-theme="dark"] .pu-chip--success {
  color: var(--pu-sage-300, #8fd44f);
}
[data-pu-theme="dark"] .pu-chip--warning {
  color: #f0c14d;
}
[data-pu-theme="dark"] .pu-chip--danger {
  color: #fda4af;
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
.pu-chip__x:focus-visible {
  outline: none;
  opacity: 1;
  border-radius: 50%;
  box-shadow:
    0 0 0 2px var(--pu-color-surface),
    0 0 0 4px color-mix(in srgb, var(--pu-color-focus) 55%, transparent);
}
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
