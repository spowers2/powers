import type { Child } from "./h.js";
import { h } from "./h.js";
import { show } from "./show.js";
import { list, type ListOptions } from "./list.js";

export type ComponentProps<P> = P & {
  children?: unknown;
};

export type Component<P extends object = Record<string, never>> = (
  props: ComponentProps<P>,
) => Node | DocumentFragment | null | undefined;

/**
 * Declare a function component (identity helper for types + future tooling).
 *
 * @example
 * ```tsx
 * const Counter = component((props: { start?: number }) => {
 *   const count = signal(props.start ?? 0);
 *   return (
 *     <button type="button" onClick={() => count.update(n => n + 1)}>
 *       {() => count()}
 *     </button>
 *   );
 * });
 * ```
 */
export function component<P extends object>(
  setup: Component<P>,
): Component<P> {
  const Comp: Component<P> = (props) => setup(props);
  // Help DevTools / error messages later
  Object.defineProperty(Comp, "name", {
    value: setup.name || "Component",
    configurable: true,
  });
  return Comp;
}

/**
 * Conditional render for JSX.
 *
 * @example
 * ```tsx
 * <Show when={() => todos().length === 0}>
 *   {() => <p>No todos</p>}
 * </Show>
 * ```
 */
export function Show(props: {
  when: () => boolean;
  children: (() => Node) | Node | Child;
  /** Optional content when `when` is false */
  fallback?: (() => Node) | Node | Child;
}): HTMLElement {
  const host = document.createElement("div");
  host.style.display = "contents";

  const resolve = (
    value: (() => Node) | Node | Child | undefined,
  ): Node => {
    if (value == null || value === false || value === true) {
      return document.createComment("show");
    }
    if (typeof value === "function") {
      // Could be reactive text factory OR node factory — try call.
      const result = (value as () => unknown)();
      if (result instanceof Node) return result;
      // Reactive text: re-bind by wrapping
      const span = document.createElement("span");
      span.style.display = "contents";
      // If they passed () => string, use as text child via h
      const t = h("span", { text: value as () => string | number });
      return t;
    }
    if (typeof value === "string" || typeof value === "number") {
      return document.createTextNode(String(value));
    }
    return value as Node;
  };

  // Primary branch
  show(host, props.when, () => resolve(props.children as (() => Node) | Node));

  // Fallback lives in a sibling host so both can be managed simply
  if (props.fallback !== undefined) {
    const fallbackHost = document.createElement("div");
    fallbackHost.style.display = "contents";
    show(
      fallbackHost,
      () => !props.when(),
      () => resolve(props.fallback),
    );
    // Wrap both in an outer contents box
    const outer = document.createElement("div");
    outer.style.display = "contents";
    outer.append(host, fallbackHost);
    return outer;
  }

  return host;
}

/**
 * Keyed list for JSX.
 *
 * @example
 * ```tsx
 * <ul>
 *   <For each={() => items()} key={(t) => t.id}>
 *     {(item) => <li>{() => item().title}</li>}
 *   </For>
 * </ul>
 * ```
 */
export function For<T>(props: {
  each: () => readonly T[];
  children: (item: () => T, index: () => number) => Node;
  key?: ListOptions<T>["key"];
}): HTMLElement {
  const host = document.createElement("div");
  host.style.display = "contents";
  list(host, props.each, props.children, {
    ...(props.key ? { key: props.key } : {}),
  });
  return host;
}
