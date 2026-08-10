import { batch } from "./scheduler.js";
import { signal } from "./signal.js";
import type { Signal, SignalOptions } from "./types.js";

type PlainObject = Record<string, unknown>;

/** Per-key signal accessors on a store. */
export type StoreFields<T extends PlainObject> = {
  readonly [K in keyof T]: Signal<T[K]>;
};

/**
 * Shallow reactive object — each top-level key is a signal.
 *
 * This is the easiest multi-field state model to learn:
 * ```ts
 * const app = store({ count: 0, name: "Ada" });
 * app.count();           // read
 * app.count.set(1);      // write one field
 * app.set({ count: 2, name: "Grace" }); // write many (batched)
 * app();                 // snapshot { count, name } (tracks all keys)
 * ```
 */
export type Store<T extends PlainObject> = StoreFields<T> & {
  /** Reactive snapshot of all fields. */
  (): { [K in keyof T]: T[K] };
  /** Untracked snapshot. */
  peek(): { [K in keyof T]: T[K] };
  /** Batch-update one or more fields. */
  set(partial: Partial<{ [K in keyof T]: T[K] }>): void;
  /** Replace every field from a full object. */
  replace(next: { [K in keyof T]: T[K] }): void;
};

export interface StoreOptions {
  name?: string;
}

/**
 * Create a shallow store from a plain object.
 * Nested objects are treated as single values (replace the whole nest to update).
 * Prefer nesting `store()` calls if you need deep fine-grained fields.
 */
export function store<T extends PlainObject>(
  initial: T,
  options?: StoreOptions,
): Store<T> {
  const keys = Object.keys(initial) as Extract<keyof T, string>[];
  const fields = {} as { [K in Extract<keyof T, string>]: Signal<T[K]> };

  for (const key of keys) {
    fields[key] = signal(initial[key], {
      name: options?.name ? `${options.name}.${String(key)}` : String(key),
    });
  }

  const snapshot = (): { [K in keyof T]: T[K] } => {
    const out = {} as { [K in keyof T]: T[K] };
    for (const key of keys) {
      out[key] = fields[key]();
    }
    return out;
  };

  const peek = (): { [K in keyof T]: T[K] } => {
    const out = {} as { [K in keyof T]: T[K] };
    for (const key of keys) {
      out[key] = fields[key].peek();
    }
    return out;
  };

  const set = (partial: Partial<{ [K in keyof T]: T[K] }>): void => {
    batch(() => {
      for (const key of Object.keys(partial) as Extract<keyof T, string>[]) {
        if (Object.prototype.hasOwnProperty.call(fields, key)) {
          fields[key].set(partial[key] as T[typeof key]);
        }
      }
    });
  };

  const replace = (next: { [K in keyof T]: T[K] }): void => {
    batch(() => {
      for (const key of keys) {
        fields[key].set(next[key]);
      }
    });
  };

  // Callable store + field properties.
  const api = snapshot as Store<T>;
  api.peek = peek;
  api.set = set;
  api.replace = replace;

  for (const key of keys) {
    Object.defineProperty(api, key, {
      enumerable: true,
      configurable: false,
      get: () => fields[key],
    });
  }

  if (options?.name !== undefined) {
    Object.defineProperty(api, "name", { value: options.name });
  }

  return api;
}

/**
 * Convenience: create a single named signal with the same options shape.
 * Prefer `signal()` — this exists for API symmetry with `store`.
 */
export function cell<T>(initial: T, options?: SignalOptions<T>): Signal<T> {
  return signal(initial, options);
}
