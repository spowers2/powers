import { component, mergeProps, type ComponentProps } from "@power-ui/dom";
import { cx } from "../utils.js";

export type AvatarSize = "sm" | "md" | "lg";

export type AvatarProps = {
  /** Initials when no src (e.g. "SP") */
  name?: string;
  src?: string;
  alt?: string;
  size?: AvatarSize;
  class?: string | (() => string);
};

const styles = `
.pu-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  font-weight: var(--pu-font-semibold);
  letter-spacing: -0.02em;
  color: var(--pu-color-accent-fg);
  background: linear-gradient(
    145deg,
    var(--pu-brand-500),
    var(--pu-sage-600)
  );
  border: 1px solid color-mix(in srgb, var(--pu-color-border) 50%, transparent);
  box-shadow: var(--pu-shadow-xs);
  user-select: none;
}
.pu-avatar--sm { width: 1.75rem; height: 1.75rem; font-size: 0.65rem; }
.pu-avatar--md { width: 2.25rem; height: 2.25rem; font-size: 0.75rem; }
.pu-avatar--lg { width: 3rem; height: 3rem; font-size: 0.9rem; }
.pu-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "avatar");
  el.textContent = styles;
  document.head.appendChild(el);
}

function initials(name?: string): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export const Avatar = component((raw: AvatarProps) => {
  ensureStyles();
  const props = mergeProps({ size: "md" as AvatarSize }, raw) as ComponentProps<
    AvatarProps & { size: AvatarSize }
  >;

  return (
    <span
      class={() =>
        cx(
          "pu-avatar",
          `pu-avatar--${props.size}`,
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      title={() => props.name ?? ""}
      role="img"
      aria-label={() => props.alt ?? props.name ?? "Avatar"}
    >
      {props.src ? (
        <img src={props.src} alt={props.alt ?? props.name ?? ""} />
      ) : (
        () => initials(props.name)
      )}
    </span>
  );
});
