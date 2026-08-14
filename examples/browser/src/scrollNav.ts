/**
 * Shared in-page section navigation: smooth scroll, hash sync, active section.
 * Used by Home, Docs, System — any page with a sticky submenu / TOC.
 *
 * Design notes:
 * - Clicking a TOC item **pins** the active state until scroll settles, so the
 *   spy cannot snap back to Color/Space while Code is still scrolling into place.
 * - Last sections often never reach `top <= offset` (not enough page below).
 *   We treat “scrolled to document end” as activating the final section.
 */
import { effect, signal, type Signal } from "@power-ux/core";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/** Sticky site nav (~4rem) + sticky page TOC (~3.5rem) — keep in sync with CSS. */
export const DEFAULT_SCROLL_OFFSET = 120;

/**
 * Smooth-scroll to an element by id. Updates the URL hash without a jump.
 * Pass `top` (or empty) to scroll to the top of the document.
 */
export function scrollToSection(
  id: string,
  options?: { behavior?: ScrollBehavior; offset?: number },
): void {
  if (typeof document === "undefined") return;

  const behavior: ScrollBehavior =
    options?.behavior ?? (prefersReducedMotion() ? "auto" : "smooth");
  const offset = options?.offset ?? DEFAULT_SCROLL_OFFSET;

  if (!id || id === "top") {
    window.scrollTo({ top: 0, behavior });
    try {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    } catch {
      /* happy-dom / file origins */
    }
    return;
  }

  const el = document.getElementById(id);
  if (!el) return;

  // Manual offset is more reliable than scrollIntoView with nested sticky chrome
  const y =
    window.scrollY + el.getBoundingClientRect().top - offset;
  const max = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  window.scrollTo({ top: Math.min(Math.max(0, y), max), behavior });
  try {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#${id}`,
    );
  } catch {
    /* happy-dom / file origins */
  }
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
 */
export function createSectionNav(
  sectionIds: readonly string[],
  options?: { topId?: string; activateOffset?: number },
): SectionNav {
  const topId = options?.topId ?? "top";
  const activateOffset = options?.activateOffset ?? DEFAULT_SCROLL_OFFSET;
  const activeId = signal(topId);

  /** While set, scroll spy must not override the user’s TOC click. */
  let pinnedId: string | null = null;
  let pinTimer: ReturnType<typeof setTimeout> | null = null;
  let pinGen = 0;

  const clearPin = () => {
    pinnedId = null;
    if (pinTimer != null) {
      clearTimeout(pinTimer);
      pinTimer = null;
    }
  };

  const lastSectionId = () => sectionIds[sectionIds.length - 1] ?? topId;

  const nearDocumentEnd = () => {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return true;
    return window.scrollY >= maxScroll - 32;
  };

  /** True when a clicked section still “owns” the viewport after scroll. */
  const targetStillRelevant = (target: string) => {
    if (target === topId) return window.scrollY < 40;
    const el = document.getElementById(target);
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    // Last section: any time we're at the bottom, or it has entered the frame
    if (target === lastSectionId() && nearDocumentEnd()) return true;
    // Section top in the reading band, or still filling the viewport
    if (rect.top <= window.innerHeight * 0.72 && rect.bottom > activateOffset) {
      return true;
    }
    return false;
  };

  const resolveFromScroll = (): string => {
    let current = topId;
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= activateOffset + 1) {
        current = id;
      }
    }

    // End of document / last section never reaches the activate line
    if (nearDocumentEnd()) {
      current = lastSectionId();
    } else {
      // If the last section has clearly entered the upper viewport, prefer it
      const last = lastSectionId();
      const lastEl = last !== topId ? document.getElementById(last) : null;
      if (lastEl) {
        const top = lastEl.getBoundingClientRect().top;
        if (top <= window.innerHeight * 0.45) current = last;
      }
    }

    return current;
  };

  const syncFromScroll = () => {
    if (pinnedId) {
      activeId.set(pinnedId);
      return;
    }
    activeId.set(resolveFromScroll());
  };

  const scrollTo = (id: string) => {
    const target = !id || id === "top" ? topId : id;
    // Optimistic UI — pin until smooth scroll finishes
    pinnedId = target;
    activeId.set(target);
    const gen = ++pinGen;
    if (pinTimer != null) clearTimeout(pinTimer);

    scrollToSection(id === "top" ? "top" : id, {
      offset: activateOffset,
    });

    const unlock = () => {
      if (gen !== pinGen) return;
      pinnedId = null;
      pinTimer = null;
      // Click intent wins when the target is still the sensible active section
      if (targetStillRelevant(target)) {
        activeId.set(target);
        return;
      }
      activeId.set(resolveFromScroll());
    };

    const release = () => {
      if (gen !== pinGen) return;
      // One frame after scroll settles so layout/sticky offsets are final
      pinTimer = setTimeout(unlock, 64);
    };

    const onScrollEnd = () => {
      window.removeEventListener("scrollend", onScrollEnd);
      release();
    };
    window.addEventListener("scrollend", onScrollEnd, { once: true });
    // Fallback unlock (smooth scroll duration + buffer)
    pinTimer = setTimeout(() => {
      window.removeEventListener("scrollend", onScrollEnd);
      release();
    }, prefersReducedMotion() ? 80 : 1000);
  };

  const initFromHash = () => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && (sectionIds as readonly string[]).includes(hash)) {
      requestAnimationFrame(() => {
        scrollTo(hash);
      });
    }
  };

  const bindScrollSpy = () => {
    effect(() => {
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          syncFromScroll();
        });
      };

      syncFromScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        clearPin();
      };
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
