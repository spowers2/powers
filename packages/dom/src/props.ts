import type { Signal } from "@lab206/core";

/**
 * Reactive component props.
 *
 * Access like normal fields (`props.name`). If the parent passed a signal or
 * a zero-arg accessor `() => …`, the value is unwrapped **on read** and tracked.
 *
 * @example
 * ```tsx
 * // Parent — pass a signal or accessor for live updates:
 * <Hello name={name} />
 * <Hello name={() => user().name} />
 *
 * // Child — read as a plain field inside reactive scopes:
 * <p>{() => props.name}</p>
 * ```
 */
export type ReactiveProps<P extends object> = {
  readonly [K in keyof P]: P[K];
};

const reactivePropsSet = new WeakSet<object>();

/** True if value looks like a Powers signal. */
export function isSignal(value: unknown): value is Signal<unknown> {
  return (
    typeof value === "function" &&
    typeof (value as Signal<unknown>).peek === "function" &&
    typeof (value as Signal<unknown>).set === "function"
  );
}

/** True if this object was created by `createProps` / `mergeProps` / `splitProps`. */
export function isReactiveProps(value: unknown): value is object {
  return typeof value === "object" && value !== null && reactivePropsSet.has(value);
}

function isEventKey(key: string): boolean {
  return (
    key.startsWith("on") && key.length > 2 && key[2] === key[2]!.toUpperCase()
  );
}

/**
 * Unwrap a prop value for reactive read.
 * - Signals → call (tracked)
 * - Zero-arg functions (accessors) → call (tracked)
 * - Event handlers / multi-arg fns → return as-is
 * - Everything else → as-is
 */
export function unwrapProp(key: string, value: unknown): unknown {
  // children + bind must stay as passed (bind is a signal ref for two-way forms)
  if (key === "children" || key === "bind") return value;
  if (typeof value !== "function") return value;
  if (isEventKey(key)) return value;
  if (isSignal(value)) return value();
  if (value.length === 0) return (value as () => unknown)();
  return value;
}

const rawSourceMap = new WeakMap<object, object>();

/**
 * Peek at the raw prop bag value without unwrapping signals/accessors.
 * Useful for dev warnings (e.g. detect snapshot `value={sig()}` vs `value={sig}`).
 */
export function getRawProp(props: object, key: string): unknown {
  const src = rawSourceMap.get(props) ?? props;
  return Reflect.get(src, key);
}

/**
 * Wrap a raw props object so property access is reactive.
 * Idempotent — wrapping an existing reactive props object returns it as-is.
 */
export function createProps<P extends object>(raw: P): ReactiveProps<P> {
  if (isReactiveProps(raw)) {
    return raw as ReactiveProps<P>;
  }

  const source = (raw ?? {}) as object;

  const proxy = new Proxy(source, {
    get(target, key, receiver) {
      if (typeof key === "symbol") {
        return Reflect.get(target, key, receiver);
      }
      const value = Reflect.get(target, key, receiver);
      return unwrapProp(key, value);
    },
    set() {
      return false;
    },
    has(target, key) {
      return Reflect.has(target, key);
    },
    ownKeys(target) {
      return Reflect.ownKeys(target);
    },
    getOwnPropertyDescriptor(target, key) {
      if (!Reflect.has(target, key)) return undefined;
      return {
        enumerable: true,
        configurable: true,
        get: () =>
          unwrapProp(String(key), Reflect.get(target, key)),
      };
    },
  });

  reactivePropsSet.add(proxy);
  rawSourceMap.set(proxy, source);
  return proxy as ReactiveProps<P>;
}

type AnyProps = Record<string, unknown>;

/**
 * Merge default props with overrides. Later sources win.
 * Accessors stay lazy — resolved only when the child reads a key.
 */
export function mergeProps<T extends object, U extends object>(
  defaults: T,
  props: U,
): ReactiveProps<T & U>;
export function mergeProps<T extends object, U extends object, V extends object>(
  a: T,
  b: U,
  c: V,
): ReactiveProps<T & U & V>;
export function mergeProps(...sources: object[]): ReactiveProps<object> {
  const list = sources.filter(Boolean) as AnyProps[];

  const proxy = new Proxy(
    {},
    {
      get(_target, key) {
        if (typeof key === "symbol") return undefined;
        for (let i = list.length - 1; i >= 0; i--) {
          const src = list[i]!;
          if (key in src) {
            // If source is already reactive props, read through it
            // (already unwrapped). Prefer raw: if reactive, reading is fine.
            const value = src[key];
            // When reading from reactive source, value is already unwrapped.
            // When reading from plain source, unwrap.
            if (isReactiveProps(src)) return value;
            return unwrapProp(key, value);
          }
        }
        return undefined;
      },
      has(_target, key) {
        if (typeof key === "symbol") return false;
        return list.some((src) => key in src);
      },
      ownKeys() {
        const keys = new Set<string | symbol>();
        for (const src of list) {
          for (const k of Reflect.ownKeys(src)) keys.add(k);
        }
        return [...keys];
      },
      getOwnPropertyDescriptor(_target, key) {
        if (typeof key === "symbol") return undefined;
        if (!list.some((src) => key in src)) return undefined;
        return {
          enumerable: true,
          configurable: true,
          get: () => {
            for (let i = list.length - 1; i >= 0; i--) {
              const src = list[i]!;
              if (key in src) {
                if (isReactiveProps(src)) return src[key];
                return unwrapProp(String(key), src[key]);
              }
            }
            return undefined;
          },
        };
      },
    },
  );

  reactivePropsSet.add(proxy);
  return proxy as ReactiveProps<object>;
}

/**
 * Split props into a picked reactive bag + the rest.
 * Both bags read through the same underlying props (no snapshot).
 */
export function splitProps<P extends object, K extends keyof P>(
  props: P,
  keys: readonly K[],
): [ReactiveProps<Pick<P, K>>, ReactiveProps<Omit<P, K>>] {
  const keySet = new Set(keys as readonly string[]);

  const picked = new Proxy({} as object, {
    get(_t, key) {
      if (typeof key === "symbol") return undefined;
      if (!keySet.has(key)) return undefined;
      return (props as AnyProps)[key];
    },
    has(_t, key) {
      return typeof key === "string" && keySet.has(key) && key in (props as object);
    },
    ownKeys() {
      return [...keySet].filter((k) => k in (props as object));
    },
    getOwnPropertyDescriptor(_t, key) {
      if (typeof key !== "string" || !keySet.has(key)) return undefined;
      if (!(key in (props as object))) return undefined;
      return {
        enumerable: true,
        configurable: true,
        get: () => (props as AnyProps)[key],
      };
    },
  });

  const rest = new Proxy({} as object, {
    get(_t, key) {
      if (typeof key === "symbol") return undefined;
      if (keySet.has(key)) return undefined;
      return (props as AnyProps)[key];
    },
    has(_t, key) {
      return (
        typeof key === "string" &&
        !keySet.has(key) &&
        key in (props as object)
      );
    },
    ownKeys() {
      return Reflect.ownKeys(props as object).filter(
        (k) => typeof k !== "string" || !keySet.has(k),
      );
    },
    getOwnPropertyDescriptor(_t, key) {
      if (typeof key !== "string" || keySet.has(key)) return undefined;
      if (!(key in (props as object))) return undefined;
      return {
        enumerable: true,
        configurable: true,
        get: () => (props as AnyProps)[key],
      };
    },
  });

  reactivePropsSet.add(picked);
  reactivePropsSet.add(rest);

  return [
    picked as ReactiveProps<Pick<P, K>>,
    rest as ReactiveProps<Omit<P, K>>,
  ];
}
