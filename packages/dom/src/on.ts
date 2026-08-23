import type { Dispose } from "@lab206/core";

/**
 * Attach a DOM event listener. Returns a dispose that removes it.
 * Does not track signals inside the handler (handlers are events, not renders).
 */
export function on<K extends keyof HTMLElementEventMap>(
  el: EventTarget,
  type: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): Dispose;

export function on(
  el: EventTarget,
  type: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
): Dispose;

export function on(
  el: EventTarget,
  type: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
): Dispose {
  el.addEventListener(type, handler, options);
  return () => {
    el.removeEventListener(type, handler, options);
  };
}
