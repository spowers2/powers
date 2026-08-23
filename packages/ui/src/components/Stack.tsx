import { component, mergeProps, type ComponentProps } from "@lab206/dom";
import { cx } from "../utils.js";

export type StackProps = {
  /** flex direction */
  direction?: "row" | "column";
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
  class?: string | (() => string);
  children?: unknown;
};

const styles = `
.pu-stack { display: flex; min-width: 0; }
.pu-stack--row { flex-direction: row; }
.pu-stack--column { flex-direction: column; }
.pu-stack--wrap { flex-wrap: wrap; }
.pu-stack--gap-0 { gap: var(--pu-space-0); }
.pu-stack--gap-1 { gap: var(--pu-space-1); }
.pu-stack--gap-2 { gap: var(--pu-space-2); }
.pu-stack--gap-3 { gap: var(--pu-space-3); }
.pu-stack--gap-4 { gap: var(--pu-space-4); }
.pu-stack--gap-5 { gap: var(--pu-space-5); }
.pu-stack--gap-6 { gap: var(--pu-space-6); }
.pu-stack--gap-8 { gap: var(--pu-space-8); }
.pu-stack--align-start { align-items: flex-start; }
.pu-stack--align-center { align-items: center; }
.pu-stack--align-end { align-items: flex-end; }
.pu-stack--align-stretch { align-items: stretch; }
.pu-stack--justify-start { justify-content: flex-start; }
.pu-stack--justify-center { justify-content: center; }
.pu-stack--justify-end { justify-content: flex-end; }
.pu-stack--justify-between { justify-content: space-between; }
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "stack");
  el.textContent = styles;
  document.head.appendChild(el);
}

/** Layout primitive — row/column with tokenized gap. */
export const Stack = component((raw: StackProps) => {
  ensureStyles();
  const props = mergeProps(
    {
      direction: "column" as const,
      gap: 3 as const,
      align: "stretch" as const,
      justify: "start" as const,
      wrap: false,
    },
    raw,
  ) as ComponentProps<Required<StackProps>>;

  return (
    <div
      class={() =>
        cx(
          "pu-stack",
          `pu-stack--${props.direction}`,
          `pu-stack--gap-${props.gap}`,
          `pu-stack--align-${props.align}`,
          `pu-stack--justify-${props.justify}`,
          props.wrap && "pu-stack--wrap",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
    >
      {props.children as never}
    </div>
  );
});
