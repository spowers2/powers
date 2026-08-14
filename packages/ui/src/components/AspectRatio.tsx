import { component, mergeProps, type ComponentProps } from "@power-ux/dom";
import { cx } from "../utils.js";
import { createStyleSheet } from "../styles.js";

export type AspectRatioProps = {
  /** Width / height ratio, e.g. 16/9 */
  ratio?: number;
  class?: string | (() => string);
  children?: unknown;
};

const ensure = createStyleSheet(
  "aspect-ratio",
  `
.pu-aspect {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: var(--pu-radius-md);
  background: var(--pu-color-surface-2);
}
.pu-aspect::before {
  content: "";
  display: block;
  padding-bottom: calc(100% / var(--pu-aspect-ratio, 1.777));
}
.pu-aspect__content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pu-aspect__content > img,
.pu-aspect__content > video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
`,
);

/** Lock child media to a fixed aspect ratio. */
export const AspectRatio = component((raw: AspectRatioProps) => {
  ensure();
  const props = mergeProps({ ratio: 16 / 9 }, raw) as ComponentProps<
    AspectRatioProps & { ratio: number }
  >;

  return (
    <div
      class={() =>
        cx(
          "pu-aspect",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      style={() => ({ "--pu-aspect-ratio": String(props.ratio) })}
      ref={(el) => ensure(el.ownerDocument)}
    >
      <div class="pu-aspect__content">{props.children as never}</div>
    </div>
  );
});
