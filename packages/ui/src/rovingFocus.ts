/**
 * Roving tabindex helpers for Menu, Tabs, List, etc.
 * @see https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex
 */

export function listRovingItems(
  root: HTMLElement,
  selector: string,
): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(selector)].filter((el) => {
    if (el.hasAttribute("disabled")) return false;
    if (el.getAttribute("aria-disabled") === "true") return false;
    // hidden from a11y tree
    if (el.getAttribute("aria-hidden") === "true") return false;
    return true;
  });
}

/** Set tabindex so only `activeIndex` is in sequential tab order. */
export function applyRovingTabIndex(
  items: HTMLElement[],
  activeIndex: number,
): void {
  items.forEach((el, i) => {
    el.tabIndex = i === activeIndex ? 0 : -1;
  });
}

export function focusRovingItem(
  items: HTMLElement[],
  index: number,
): HTMLElement | null {
  if (items.length === 0) return null;
  const i = Math.max(0, Math.min(items.length - 1, index));
  applyRovingTabIndex(items, i);
  const el = items[i]!;
  el.focus();
  return el;
}

export function indexOfFocused(
  items: HTMLElement[],
  active: Element | null,
): number {
  if (!active) return -1;
  return items.findIndex((el) => el === active || el.contains(active));
}

export type RovingKeyOptions = {
  orientation?: "horizontal" | "vertical" | "both";
  loop?: boolean;
  /** Home / End jump to ends (default true) */
  homeEnd?: boolean;
  /**
   * Called when the focused item should activate (Enter / Space).
   * Return true if the event was handled.
   */
  onActivate?: (el: HTMLElement, index: number) => boolean | void;
  /**
   * Called when focus moves via arrows/home/end.
   * Return true to also activate (tabs pattern).
   */
  onMove?: (el: HTMLElement, index: number) => boolean | void;
};

/**
 * Handle Arrow / Home / End / Enter / Space on a composite widget.
 * Returns true when the event was consumed.
 */
export function handleRovingKeydown(
  e: KeyboardEvent,
  root: HTMLElement,
  selector: string,
  options: RovingKeyOptions = {},
): boolean {
  const {
    orientation = "vertical",
    loop = true,
    homeEnd = true,
    onActivate,
    onMove,
  } = options;

  const items = listRovingItems(root, selector);
  if (items.length === 0) return false;

  const doc = root.ownerDocument;
  let idx = indexOfFocused(items, doc.activeElement);
  if (idx < 0) idx = 0;

  const key = e.key;
  const vertical =
    orientation === "vertical" || orientation === "both";
  const horizontal =
    orientation === "horizontal" || orientation === "both";

  let next = idx;
  let moved = false;

  if (vertical && key === "ArrowDown") {
    next = loop
      ? (idx + 1) % items.length
      : Math.min(items.length - 1, idx + 1);
    moved = true;
  } else if (vertical && key === "ArrowUp") {
    next = loop
      ? (idx - 1 + items.length) % items.length
      : Math.max(0, idx - 1);
    moved = true;
  } else if (horizontal && key === "ArrowRight") {
    next = loop
      ? (idx + 1) % items.length
      : Math.min(items.length - 1, idx + 1);
    moved = true;
  } else if (horizontal && key === "ArrowLeft") {
    next = loop
      ? (idx - 1 + items.length) % items.length
      : Math.max(0, idx - 1);
    moved = true;
  } else if (homeEnd && key === "Home") {
    next = 0;
    moved = true;
  } else if (homeEnd && key === "End") {
    next = items.length - 1;
    moved = true;
  } else if (key === "Enter" || key === " ") {
    e.preventDefault();
    const el = items[idx]!;
    onActivate?.(el, idx);
    return true;
  } else {
    return false;
  }

  if (!moved || next === idx && key !== "Home" && key !== "End") {
    // still prevent scroll for arrows even if clamped
    if (
      key === "ArrowDown" ||
      key === "ArrowUp" ||
      key === "ArrowLeft" ||
      key === "ArrowRight" ||
      key === "Home" ||
      key === "End"
    ) {
      e.preventDefault();
      return true;
    }
    return false;
  }

  e.preventDefault();
  const el = focusRovingItem(items, next);
  if (el) onMove?.(el, next);
  return true;
}

/**
 * Initial tabindex setup + focus first/selected item.
 * Call when a menu opens or a list mounts.
 */
export function initRovingFocus(
  root: HTMLElement,
  selector: string,
  preferredIndex = 0,
): number {
  const items = listRovingItems(root, selector);
  if (items.length === 0) return -1;
  const i = Math.max(0, Math.min(items.length - 1, preferredIndex));
  applyRovingTabIndex(items, i);
  return i;
}
