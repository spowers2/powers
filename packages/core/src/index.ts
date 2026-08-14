/**
 * @power-ux/core
 *
 * Fine-grained reactivity primitives.
 * No DOM. No framework. Just a correct reactive graph.
 *
 * Learning order (intentionally short):
 *   1. signal  2. computed  3. effect  4. store  5. resource
 */

export { signal, computed } from "./signal.js";
export { effect } from "./effect.js";
export type { EffectOptions } from "./effect.js";
export { batch, flush, isBatching } from "./scheduler.js";
export {
  createRoot,
  untrack,
  getActiveOwner,
  runWithOwner,
  createOwner,
  disposeOwner,
} from "./graph.js";
export { store, cell } from "./store.js";
export type { Store, StoreFields, StoreOptions } from "./store.js";
export { resource } from "./resource.js";
export type {
  Resource,
  ResourceState,
  ResourceOptions,
  ResourceFetcher,
  ResourceFetcherInfo,
} from "./resource.js";
export { onError } from "./errors.js";

export type {
  Signal,
  ReadonlySignal,
  SignalOptions,
  EffectFn,
  Dispose,
} from "./types.js";

export type { Owner } from "./graph.js";
