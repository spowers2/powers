/**
 * Shared in-page section navigation: smooth scroll, hash sync, active section.
 * Used by Home, Docs, System — any page with a sticky submenu / TOC.
 */
import { effect, signal, type Signal } from "@power-ui/core";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Smooth-scroll to an element by id. Updates the URL hash without a jump.
 * Pass `top` (or empty) to scroll to the top of the document.
 */
export function scrollToSection(
  id: string,
  options?: { behavior?: ScrollBehavior },
): void {
  if (typeof document === "undefined") return;

  const behavior: ScrollBehavior =
    options?.behavior ??
    (prefersReducedMotion() ? "auto" : "smooth");

  if (!id || id === "top") {
    window.scrollTo({ top: 0, behavior });
    history.replaceState(null, "", location.pathname + location.search);
    return;
  }

  const el = document.getElementById(id);
  if (!el) return;

  el.scrollIntoView({ behavior, block: "start" });
  history.replaceState(
    null,
    "",
    `${location.pathname}${location.search}#${id}`,
  );
}

export type SectionNav = {
  activeId: Signal<string>;
  /** Call once when the page mounts (honors location.hash). */
  initFromHash: () => void;
  /** Scroll spy + cleanup via effect return. Call inside a reactive root. */
  bindScrollSpy: () => void;
  scrollTo: (id: string) => void;
};

/**
 * Create active-section tracking for a list of section ids (in document order).
 * @param sectionIds ordered list of element ids
 * @param topId value used when above the first section (default `"top"`)
 * @param activateOffset px from top of viewport when a section becomes active
 */
export function createSectionNav(
  sectionIds: readonly string[],
  options?: { topId?: string; activateOffset?: number },
): SectionNav {
  const topId = options?.topId ?? "top";
  const activateOffset = options?.activateOffset ?? 120;
  const activeId = signal(topId);

  const scrollTo = (id: string) => {
    scrollToSection(id);
    // Optimistic active state while smooth scroll runs
    activeId.set(id || topId);
  };

  const initFromHash = () => {
    const hash = location.hash.replace(/^#/, "");
    if (hash && sectionIds.includes(hash)) {
      // slight delay so layout/sticky chrome are ready
      requestAnimationFrame(() => scrollToSection(hash));
      activeId.set(hash);
    }
  };

  const bindScrollSpy = () => {
    effect(() => {
      const onScroll = () => {
        let current = topId;
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (!el) continue;
          if (el.getBoundingClientRect().top <= activateOffset) {
            current = id;
          }
        }
        activeId.set(current);
      };

      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    });
  };

  return { activeId, initFromHash, bindScrollSpy, scrollTo };
}

/** Class helper for TOC buttons: active when activeId matches. */
export function tocActiveClass(
  activeId: Signal<string>,
  id: string,
  base = "",
): () => string {
  return () => {
    const on = activeId() === id;
    return [base, on ? "is-active" : ""].filter(Boolean).join(" ");
  };
}
