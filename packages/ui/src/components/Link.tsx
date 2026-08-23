import { component, type ComponentProps } from "@lab206/dom";
import { cx } from "../utils.js";
import { createStyleSheet } from "../styles.js";

export type LinkProps = {
  href?: string;
  external?: boolean;
  muted?: boolean;
  class?: string | (() => string);
  onClick?: (e: MouseEvent) => void;
  children?: unknown;
};

const ensure = createStyleSheet(
  "link",
  `
.pu-link {
  color: var(--pu-color-accent);
  text-decoration: none;
  font-weight: var(--pu-font-medium);
  transition: color var(--pu-duration) var(--pu-ease);
  cursor: pointer;
}
.pu-link:hover {
  text-decoration: underline;
  text-underline-offset: 2px;
}
.pu-link:focus-visible {
  outline: none;
  border-radius: 2px;
  box-shadow:
    0 0 0 2px var(--pu-color-surface),
    0 0 0 4px color-mix(in srgb, var(--pu-color-focus) 55%, transparent);
}
.pu-link--muted {
  color: var(--pu-color-text-muted);
  font-weight: var(--pu-font-normal);
}
.pu-link--muted:hover {
  color: var(--pu-color-text);
}
`,
);

/** Styled anchor (or button-like when no href). */
export const Link = component((raw: LinkProps) => {
  ensure();
  const props = raw as ComponentProps<LinkProps>;

  if (props.href) {
    return (
      <a
        class={() =>
          cx(
            "pu-link",
            props.muted && "pu-link--muted",
            typeof props.class === "function" ? props.class() : props.class,
          )
        }
        href={props.href}
        target={props.external ? "_blank" : undefined}
        rel={props.external ? "noopener noreferrer" : undefined}
        onClick={props.onClick}
        ref={(el) => ensure(el.ownerDocument)}
      >
        {props.children as never}
      </a>
    );
  }

  return (
    <button
      type="button"
      class={() =>
        cx(
          "pu-link",
          props.muted && "pu-link--muted",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      onClick={props.onClick}
      ref={(el) => ensure(el.ownerDocument)}
    >
      {props.children as never}
    </button>
  );
});
