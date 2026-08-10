import { component, mergeProps, type ComponentProps } from "@power-ui/dom";
import { cx } from "../utils.js";

export type ContainerProps = {
  size?: "sm" | "md" | "lg" | "xl";
  class?: string | (() => string);
  children?: unknown;
};

const styles = `
.pu-container {
  width: 100%;
  margin-inline: auto;
  padding-inline: var(--pu-space-4);
}
@media (min-width: 640px) {
  .pu-container { padding-inline: var(--pu-space-6); }
}
.pu-container--sm { max-width: 40rem; }
.pu-container--md { max-width: 48rem; }
.pu-container--lg { max-width: 64rem; }
.pu-container--xl { max-width: 80rem; }
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "container");
  el.textContent = styles;
  document.head.appendChild(el);
}

export const Container = component((raw: ContainerProps) => {
  ensureStyles();
  const props = mergeProps({ size: "lg" as const }, raw) as ComponentProps<
    ContainerProps & { size: NonNullable<ContainerProps["size"]> }
  >;
  return (
    <div
      class={() =>
        cx(
          "pu-container",
          `pu-container--${props.size}`,
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
    >
      {props.children as never}
    </div>
  );
});
