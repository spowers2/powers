import { effect } from "@power-ux/core";
import { h, type Props } from "@power-ux/dom";
import type { Router } from "./router.js";

export interface LinkProps extends Props {
  /** Destination path, e.g. `/about` */
  to: string | (() => string);
  replace?: boolean;
  /** Class when the link matches the current path */
  activeClass?: string;
  /** Exact match only (default: path prefix match for nested routes) */
  exact?: boolean;
  children?: unknown;
}

/**
 * Navigation anchor that uses the router (no full page reload).
 * Pass the router instance — keeps the API explicit and easy to learn.
 *
 * @example
 * ```tsx
 * <Link router={router} to="/about">About</Link>
 * ```
 */
export function Link(props: LinkProps & { router: Router }): HTMLAnchorElement {
  const { router, to, replace, activeClass, exact, children, ...rest } = props;

  const getTo = () => (typeof to === "function" ? to() : to);

  const a = h(
    "a",
    {
      ...rest,
      href: typeof to === "function" ? "#" : to,
      onClick: (e: MouseEvent) => {
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.altKey ||
          e.ctrlKey ||
          e.shiftKey
        ) {
          return;
        }
        e.preventDefault();
        router.navigate(getTo(), { replace: !!replace });
        const userClick = rest.onClick as ((ev: MouseEvent) => void) | undefined;
        userClick?.(e);
      },
    } as Props,
  ) as HTMLAnchorElement;

  // Reactive href + active class (preserves any static class from props)
  effect(() => {
    const dest = getTo();
    a.setAttribute("href", dest);
    const current = router.path();
    const active = exact
      ? current === dest
      : current === dest ||
        (dest !== "/" && current.startsWith(`${dest}/`));
    if (activeClass) {
      a.classList.toggle(activeClass, active);
    }
    // Always reflect active for aria; CSS can target [aria-current="page"]
    if (active) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });

  // Children: string / node / reactive text factory
  if (children != null && children !== false) {
    if (typeof children === "function") {
      const text = document.createTextNode("");
      a.appendChild(text);
      effect(() => {
        text.data = String((children as () => unknown)() ?? "");
      });
    } else if (typeof children === "string" || typeof children === "number") {
      a.textContent = String(children);
    } else if (children instanceof Node) {
      a.appendChild(children);
    } else if (Array.isArray(children)) {
      for (const c of children) {
        if (c instanceof Node) a.appendChild(c);
        else if (c != null && c !== false)
          a.appendChild(document.createTextNode(String(c)));
      }
    }
  }

  return a;
}
