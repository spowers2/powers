import { component, type ComponentProps } from "@lab206/dom";
import { cx } from "../utils.js";
import { createStyleSheet } from "../styles.js";

export type EmptyProps = {
  title?: string;
  description?: string;
  /** Optional emoji / icon glyph */
  icon?: string;
  class?: string | (() => string);
  children?: unknown;
};

const ensure = createStyleSheet(
  "empty",
  `
.pu-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.5rem;
  padding: 2.5rem 1.5rem;
  border: 1px dashed var(--pu-color-border);
  border-radius: var(--pu-radius-lg);
  background: color-mix(in srgb, var(--pu-color-surface-2) 50%, transparent);
}
.pu-empty__icon {
  font-size: 1.75rem;
  line-height: 1;
  opacity: 0.85;
  margin-bottom: 0.25rem;
}
.pu-empty__title {
  margin: 0;
  font-size: var(--pu-text-md);
  font-weight: var(--pu-font-semibold);
  color: var(--pu-color-text);
}
.pu-empty__desc {
  margin: 0;
  font-size: var(--pu-text-sm);
  color: var(--pu-color-text-muted);
  max-width: 22rem;
  line-height: 1.5;
}
.pu-empty__actions {
  margin-top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}
`,
);

/** Empty state for lists, tables, and panels. */
export const Empty = component((raw: EmptyProps) => {
  ensure();
  const props = raw as ComponentProps<EmptyProps>;
  return (
    <div
      class={() =>
        cx(
          "pu-empty",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      ref={(el) => ensure(el.ownerDocument)}
    >
      {props.icon ? (
        <div class="pu-empty__icon" aria-hidden="true">
          {props.icon}
        </div>
      ) : null}
      {props.title ? <h3 class="pu-empty__title">{props.title}</h3> : null}
      {props.description ? (
        <p class="pu-empty__desc">{props.description}</p>
      ) : null}
      {props.children ? (
        <div class="pu-empty__actions">{props.children as never}</div>
      ) : null}
    </div>
  );
});
