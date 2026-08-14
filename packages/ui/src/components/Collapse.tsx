import { signal, effect } from "@powers/core";
import { component, type ComponentProps } from "@powers/dom";
import { cx } from "../utils.js";
import { createStyleSheet } from "../styles.js";

export type CollapseProps = {
  open: boolean | (() => boolean);
  class?: string | (() => string);
  children?: unknown;
};

const ensure = createStyleSheet(
  "collapse",
  `
.pu-collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--pu-duration-slow) var(--pu-ease-out);
}
.pu-collapse.is-open {
  grid-template-rows: 1fr;
}
.pu-collapse__inner {
  overflow: hidden;
  min-height: 0;
}
@media (prefers-reduced-motion: reduce) {
  .pu-collapse { transition: none; }
}
`,
);

/**
 * Height-animated show/hide region (CSS grid 0fr → 1fr).
 * Prefer this over manual max-height hacks.
 */
export const Collapse = component((raw: CollapseProps) => {
  ensure();
  const props = raw as ComponentProps<CollapseProps>;
  const isOpen = () =>
    typeof props.open === "function"
      ? !!(props.open as () => boolean)()
      : !!props.open;

  // Keep children mounted while open so height can animate; optionally keep for exit
  const mounted = signal(isOpen());

  effect(() => {
    if (isOpen()) {
      mounted.set(true);
      return;
    }
    // delay unmount slightly so exit anim can run (grid collapse is CSS-driven)
    const t = window.setTimeout(() => {
      if (!isOpen()) mounted.set(false);
    }, 280);
    return () => window.clearTimeout(t);
  });

  return (
    <div
      class={() =>
        cx(
          "pu-collapse",
          isOpen() && "is-open",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      ref={(el) => ensure(el.ownerDocument)}
    >
      <div class="pu-collapse__inner">
        {() => (mounted() || isOpen() ? (props.children as never) : null)}
      </div>
    </div>
  );
});
