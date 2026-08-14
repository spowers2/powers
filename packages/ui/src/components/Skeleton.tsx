import { component, mergeProps, type ComponentProps } from "@power-ux/dom";
import { cx } from "../utils.js";

export type SkeletonProps = {
  /** Visual shape */
  variant?: "text" | "rect" | "circle";
  width?: string;
  height?: string;
  /** Number of text lines when variant is text */
  lines?: number;
  class?: string | (() => string);
};

const styles = `
.pu-skeleton {
  display: block;
  background: linear-gradient(
    90deg,
    var(--pu-color-surface-2) 0%,
    color-mix(in srgb, var(--pu-color-surface-2) 55%, var(--pu-color-surface)) 50%,
    var(--pu-color-surface-2) 100%
  );
  background-size: 200% 100%;
  animation: pu-skeleton-shimmer 1.4s ease-in-out infinite;
  border-radius: var(--pu-radius-sm);
}
.pu-skeleton--text {
  height: 0.75rem;
  width: 100%;
  margin-bottom: 0.45rem;
  border-radius: 4px;
}
.pu-skeleton--text:last-child {
  width: 72%;
  margin-bottom: 0;
}
.pu-skeleton--rect {
  width: 100%;
  height: 6rem;
  border-radius: var(--pu-radius-md);
}
.pu-skeleton--circle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
}
.pu-skeleton-stack {
  display: flex;
  flex-direction: column;
  width: 100%;
}
@keyframes pu-skeleton-shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .pu-skeleton { animation: none; }
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "skeleton");
  el.textContent = styles;
  document.head.appendChild(el);
}

/** Loading placeholder with soft shimmer. */
export const Skeleton = component((raw: SkeletonProps) => {
  ensureStyles();
  const props = mergeProps(
    { variant: "text" as const, lines: 1 },
    raw,
  ) as ComponentProps<
    SkeletonProps & { variant: "text" | "rect" | "circle"; lines: number }
  >;

  const style = () => {
    const s: Record<string, string> = {};
    if (props.width) s.width = props.width;
    if (props.height) s.height = props.height;
    return s;
  };

  if (props.variant === "text" && props.lines > 1) {
    const n = Math.max(1, Math.min(12, props.lines));
    const host = document.createElement("div");
    host.className = cx(
      "pu-skeleton-stack",
      typeof props.class === "function" ? props.class() : props.class,
    );
    host.setAttribute("aria-hidden", "true");
    for (let i = 0; i < n; i++) {
      const line = document.createElement("span");
      line.className = "pu-skeleton pu-skeleton--text";
      host.appendChild(line);
    }
    return host;
  }

  return (
    <span
      class={() =>
        cx(
          "pu-skeleton",
          `pu-skeleton--${props.variant}`,
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      style={style}
      aria-hidden="true"
    />
  );
});
