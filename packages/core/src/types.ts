/** A function that reads reactive sources and may return a cleanup. */
export type EffectFn = () => void | (() => void);

/** Dispose callback that tears down an owner subtree or effect. */
export type Dispose = () => void;

/** Options for creating a writable signal. */
export interface SignalOptions<T> {
  /**
   * Equality check. Defaults to `Object.is`.
   * Return true when the next value should be treated as unchanged.
   */
  equals?: (prev: T, next: T) => boolean;
  /** Optional debug name for DevTools / error messages. */
  name?: string;
}

/** Readable reactive value. */
export interface ReadonlySignal<T> {
  /** Tracked read — registers the active effect/computed as a dependent. */
  (): T;
  /** Untracked read — does not register a dependency. */
  peek(): T;
  readonly name?: string;
}

/** Writable reactive value. */
export interface Signal<T> extends ReadonlySignal<T> {
  set(value: T): void;
  update(fn: (prev: T) => T): void;
}

/** Internal node kinds used by the graph. */
export type NodeKind = "signal" | "computed" | "effect";
