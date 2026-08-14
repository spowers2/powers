import { trapFocus } from "./focusTrap.js";

/**
 * Shared overlay runtime for Dialog · Drawer · Popover · Command · Menu.
 *
 * Goals (FOUNDATION week 2):
 * - One place for Escape, body scroll lock, focus trap, outside dismiss
 * - Stacked layers: only the topmost Escape / outside-dismiss handler fires
 * - Scroll lock is ref-counted (two dialogs open → one unlock when both close)
 * - ownerDocument-aware (Lab iframes)
 */

export type OverlayContext = {
  doc: Document;
  win: Window & typeof globalThis;
  root: HTMLElement | null;
};

export type OverlayAttachOptions = {
  /** Overlay root (for document + outside-click containment). */
  getRoot: () => HTMLElement | null;
  /** Panel to focus-trap; omit for non-modal popovers/menus. */
  getFocusRoot?: () => HTMLElement | null;
  /** Close / dismiss callback. */
  onClose: () => void;
  /** Lock document.body scroll while open. Default false. */
  scrollLock?: boolean;
  /** Escape closes (topmost only). Default true. */
  escape?: boolean;
  /** Pointer down outside `getRoot()` closes (topmost only). Default false. */
  dismissOutside?: boolean;
  /**
   * Optional override for “inside” detection (portaled lists, multi-node roots).
   * When omitted, uses `getRoot()?.contains(node)`.
   */
  isInside?: (node: Node) => boolean;
  /**
   * Run after deferred attach (refs ready). Return optional extra cleanup
   * (e.g. Popover reposition on scroll/resize).
   */
  onAttach?: (ctx: OverlayContext) => (() => void) | void;
};

type Layer = {
  id: number;
  doc: Document;
  onClose: () => void;
  escape: boolean;
  dismissOutside: boolean;
  /** Root for outside-click tests */
  getRoot: () => HTMLElement | null;
  isInside?: (node: Node) => boolean;
};

let nextLayerId = 1;
const layers: Layer[] = [];

function topLayer(
  doc: Document,
  pred: (l: Layer) => boolean,
): Layer | undefined {
  for (let i = layers.length - 1; i >= 0; i--) {
    const l = layers[i]!;
    if (l.doc === doc && pred(l)) return l;
  }
  return undefined;
}

function pushLayer(layer: Layer): () => void {
  layers.push(layer);
  return () => {
    const i = layers.findIndex((l) => l.id === layer.id);
    if (i >= 0) layers.splice(i, 1);
  };
}

/** Per-document scroll lock refcount. */
const scrollLocks = new WeakMap<Document, { count: number; prev: string }>();

function lockBodyScroll(doc: Document): () => void {
  let entry = scrollLocks.get(doc);
  if (!entry) {
    entry = { count: 0, prev: doc.body.style.overflow };
    scrollLocks.set(doc, entry);
  }
  if (entry.count === 0) {
    entry.prev = doc.body.style.overflow;
    doc.body.style.overflow = "hidden";
  }
  entry.count++;
  return () => {
    const e = scrollLocks.get(doc);
    if (!e) return;
    e.count--;
    if (e.count <= 0) {
      e.count = 0;
      doc.body.style.overflow = e.prev;
    }
  };
}

/**
 * Attach overlay behaviors while open. Call from an `effect` when open is true;
 * return the dispose as the effect cleanup.
 *
 * Attach is deferred one macrotask so `ref` callbacks have run.
 *
 * @example
 * ```ts
 * effect(() => {
 *   if (!isOpen()) return;
 *   return attachOverlay({
 *     getRoot: () => rootEl,
 *     getFocusRoot: () => panelEl,
 *     onClose: () => props.onClose?.(),
 *     scrollLock: true,
 *   });
 * });
 * ```
 */
export function attachOverlay(options: OverlayAttachOptions): () => void {
  const escape = options.escape !== false;
  const dismissOutside = !!options.dismissOutside;
  const scrollLock = !!options.scrollLock;

  let disposed = false;
  const cleanups: Array<() => void> = [];

  const attach = () => {
    if (disposed) return;

    const root = options.getRoot();
    const doc = root?.ownerDocument ?? document;
    const win = (doc.defaultView ?? window) as Window & typeof globalThis;
    const focusRoot = options.getFocusRoot?.() ?? null;

    const layer: Layer = {
      id: nextLayerId++,
      doc,
      onClose: options.onClose,
      escape,
      dismissOutside,
      getRoot: options.getRoot,
      ...(options.isInside ? { isInside: options.isInside } : {}),
    };
    cleanups.push(pushLayer(layer));

    if (scrollLock) {
      cleanups.push(lockBodyScroll(doc));
    }

    if (escape) {
      const onKey = (e: KeyboardEvent) => {
        if (e.key !== "Escape") return;
        const top = topLayer(doc, (l) => l.escape);
        if (!top || top.id !== layer.id) return;
        e.preventDefault();
        e.stopPropagation();
        options.onClose();
      };
      win.addEventListener("keydown", onKey, true);
      cleanups.push(() => win.removeEventListener("keydown", onKey, true));
    }

    if (dismissOutside) {
      const contains = (node: Node) => {
        if (options.isInside) return options.isInside(node);
        const r = options.getRoot();
        return !!(r && r.contains(node));
      };
      const onPointer = (e: Event) => {
        const top = topLayer(doc, (l) => l.dismissOutside);
        if (!top || top.id !== layer.id) return;
        const t = e.target as Node | null;
        if (!t) return;
        if (contains(t)) return;
        options.onClose();
      };
      // Skip the opening interaction
      const skipTimer = win.setTimeout(() => {
        if (disposed) return;
        doc.addEventListener("pointerdown", onPointer, true);
      }, 0);
      cleanups.push(() => {
        win.clearTimeout(skipTimer);
        doc.removeEventListener("pointerdown", onPointer, true);
      });
    }

    if (focusRoot) {
      cleanups.push(trapFocus(focusRoot));
    }

    const extra = options.onAttach?.({ doc, win, root });
    if (typeof extra === "function") cleanups.push(extra);
  };

  const win =
    typeof window !== "undefined"
      ? window
      : (undefined as unknown as Window | undefined);
  const timer = win?.setTimeout(attach, 0);
  if (timer != null && win) {
    cleanups.push(() => win.clearTimeout(timer));
  } else {
    attach();
  }

  return () => {
    disposed = true;
    // LIFO cleanup for stable lock / stack order
    for (let i = cleanups.length - 1; i >= 0; i--) {
      try {
        cleanups[i]!();
      } catch {
        /* ignore */
      }
    }
    cleanups.length = 0;
  };
}

/** Test helper — current stack depth (all documents). */
export function __overlayStackSize(): number {
  return layers.length;
}

/** Test helper — clear stack (does not restore scroll). */
export function __resetOverlayStack(): void {
  layers.length = 0;
  nextLayerId = 1;
}
