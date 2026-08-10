import type { Child } from "./h.js";
import { h } from "./h.js";
import { show } from "./show.js";
import { list, type ListOptions } from "./list.js";
import { createProps, type ReactiveProps } from "./props.js";

export type ComponentProps<P extends object> = ReactiveProps<
  P & { children?: unknown }
>;

export type ComponentSetup<P extends object> = (
  props: ComponentProps<P>,
) => Node | DocumentFragment | null | undefined;

export type Component<P extends object = Record<string, never>> = (
  props?: P & { children?: unknown },
) => Node | DocumentFragment | null | undefined;

/**
 * Declare a function component with **reactive props**.
 *
 * Setup runs **once** per instance. Reading `props.x` inside effects /
 * JSX reactive scopes tracks the parent's signal or accessor.
 *
 * @example
 * ```tsx
 * const Hello = component((props: { name: string }) => (
 *   <p>{() => `Hello, ${props.name}`}</p>
 * ));
 *
 * // Live updates — pass a signal or accessor:
 * <Hello name={name} />
 * <Hello name={() => user().name} />
 * ```
 */
export function component<P extends object>(
  setup: ComponentSetup<P>,
): Component<P> {
  const Comp: Component<P> = (raw) => {
    // If JSX already applied createProps, `raw` is a Proxy — still safe
    // to wrap again only when we have a plain object. Detect proxy via
    // missing own keys reliability: always normalize through createProps
    // on a shallow bag of current keys so double-proxy still reads source.
    const props = createProps(
      (raw ?? {}) as P & { children?: unknown },
    ) as ComponentProps<P>;
    return setup(props);
  };
  Object.defineProperty(Comp, "name", {
    value: setup.name || "Component",
    configurable: true,
  });
  return Comp;
}

/**
 * Conditional render for JSX.
 * `when` may be a boolean, signal, or zero-arg accessor — unwrapped on read
 * when used with reactive props / JSX.
 */
export function Show(props: {
  when: boolean | (() => boolean);
  children: (() => Node) | Node | Child;
  fallback?: (() => Node) | Node | Child;
}): HTMLElement {
  // Normalize so accessors stay lazy for the show() effect.
  const p = props;
  const whenFn = (): boolean => {
    const w = p.when;
    if (typeof w === "function") return !!(w as () => boolean)();
    return !!w;
  };

  const host = document.createElement("div");
  host.style.display = "contents";

  const resolve = (
    value: (() => Node) | Node | Child | undefined,
  ): Node => {
    if (value == null || value === false || value === true) {
      return document.createComment("show");
    }
    if (typeof value === "function") {
      const result = (value as () => unknown)();
      if (result instanceof Node) return result;
      return h("span", { text: value as () => string | number });
    }
    if (typeof value === "string" || typeof value === "number") {
      return document.createTextNode(String(value));
    }
    return value as Node;
  };

  show(host, whenFn, () => resolve(p.children as (() => Node) | Node));

  if (p.fallback !== undefined) {
    const fallbackHost = document.createElement("div");
    fallbackHost.style.display = "contents";
    show(fallbackHost, () => !whenFn(), () => resolve(p.fallback));
    const outer = document.createElement("div");
    outer.style.display = "contents";
    outer.append(host, fallbackHost);
    return outer;
  }

  return host;
}

/**
 * Keyed list for JSX.
 */
export function For<T>(props: {
  each: readonly T[] | (() => readonly T[]);
  children: (item: () => T, index: () => number) => Node;
  key?: ListOptions<T>["key"];
}): HTMLElement {
  const host = document.createElement("div");
  host.style.display = "contents";
  const getItems = (): readonly T[] => {
    const e = props.each;
    return typeof e === "function" ? (e as () => readonly T[])() : e;
  };
  list(host, getItems, props.children, {
    ...(props.key ? { key: props.key } : {}),
  });
  return host;
}
