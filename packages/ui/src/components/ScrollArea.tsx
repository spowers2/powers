import { component, type ComponentProps } from "@lab206/dom";
import { cx } from "../utils.js";
import { createStyleSheet } from "../styles.js";

export type ScrollAreaProps = {
  /** Max height (CSS length) */
  maxHeight?: string;
  class?: string | (() => string);
  children?: unknown;
};

const ensure = createStyleSheet(
  "scroll-area",
  `
.pu-scroll {
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  border-radius: var(--pu-radius-md);
}
.pu-scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.pu-scroll::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--pu-color-text-muted) 35%, transparent);
  border-radius: 999px;
}
.pu-scroll::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--pu-color-text-muted) 55%, transparent);
}
.pu-scroll::-webkit-scrollbar-track {
  background: transparent;
}
`,
);

/** Scrollable region with refined scrollbars. */
export const ScrollArea = component((raw: ScrollAreaProps) => {
  ensure();
  const props = raw as ComponentProps<ScrollAreaProps>;
  return (
    <div
      class={() =>
        cx(
          "pu-scroll",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      style={() =>
        props.maxHeight ? { maxHeight: props.maxHeight } : undefined
      }
      ref={(el) => ensure(el.ownerDocument)}
    >
      {props.children as never}
    </div>
  );
});
