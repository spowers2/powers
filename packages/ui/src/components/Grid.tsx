import { component, mergeProps, type ComponentProps } from "@power-ui/dom";
import { cx } from "../utils.js";

export type GridProps = {
  cols?: 1 | 2 | 3 | 4;
  gap?: 2 | 3 | 4 | 5 | 6 | 8;
  class?: string | (() => string);
  children?: unknown;
};

const styles = `
.pu-grid {
  display: grid;
  width: 100%;
}
.pu-grid--gap-2 { gap: var(--pu-space-2); }
.pu-grid--gap-3 { gap: var(--pu-space-3); }
.pu-grid--gap-4 { gap: var(--pu-space-4); }
.pu-grid--gap-5 { gap: var(--pu-space-5); }
.pu-grid--gap-6 { gap: var(--pu-space-6); }
.pu-grid--gap-8 { gap: var(--pu-space-8); }
.pu-grid--cols-1 { grid-template-columns: 1fr; }
.pu-grid--cols-2 { grid-template-columns: 1fr; }
.pu-grid--cols-3 { grid-template-columns: 1fr; }
.pu-grid--cols-4 { grid-template-columns: 1fr; }
@media (min-width: 640px) {
  .pu-grid--cols-2 { grid-template-columns: repeat(2, 1fr); }
  .pu-grid--cols-3 { grid-template-columns: repeat(2, 1fr); }
  .pu-grid--cols-4 { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 900px) {
  .pu-grid--cols-3 { grid-template-columns: repeat(3, 1fr); }
  .pu-grid--cols-4 { grid-template-columns: repeat(4, 1fr); }
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "grid");
  el.textContent = styles;
  document.head.appendChild(el);
}

export const Grid = component((raw: GridProps) => {
  ensureStyles();
  const props = mergeProps(
    { cols: 3 as const, gap: 4 as const },
    raw,
  ) as ComponentProps<Required<Pick<GridProps, "cols" | "gap">> & GridProps>;
  return (
    <div
      class={() =>
        cx(
          "pu-grid",
          `pu-grid--cols-${props.cols}`,
          `pu-grid--gap-${props.gap}`,
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
    >
      {props.children as never}
    </div>
  );
});
