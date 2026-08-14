const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

function listFocusable(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
  );
}

/**
 * Trap Tab focus inside `root` (for Dialog / Command / Drawer).
 * Returns a dispose that removes the listener and restores prior focus.
 */
export function trapFocus(root: HTMLElement): () => void {
  const doc = root.ownerDocument;
  const prev = doc.activeElement as HTMLElement | null;

  const focusFirst = () => {
    const items = listFocusable(root);
    (items[0] ?? root).focus?.();
  };

  // Defer so open animation / mount finishes
  const win = doc.defaultView ?? window;
  const t = win.setTimeout(focusFirst, 0);

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const items = listFocusable(root);
    if (items.length === 0) {
      e.preventDefault();
      return;
    }
    const first = items[0]!;
    const last = items[items.length - 1]!;
    const active = doc.activeElement as HTMLElement | null;
    if (e.shiftKey) {
      if (active === first || !root.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else if (active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  doc.addEventListener("keydown", onKey, true);

  return () => {
    win.clearTimeout(t);
    doc.removeEventListener("keydown", onKey, true);
    if (prev && typeof prev.focus === "function") {
      try {
        prev.focus();
      } catch {
        /* ignore */
      }
    }
  };
}
