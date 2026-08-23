import { component, type ComponentProps } from "@lab206/dom";
import { cx } from "../utils.js";
import { createStyleSheet } from "../styles.js";

export type PaginationProps = {
  page: number | (() => number);
  pageCount: number | (() => number);
  onChange?: (page: number) => void;
  class?: string | (() => string);
};

const ensure = createStyleSheet(
  "pagination",
  `
.pu-pagination {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}
.pu-pagination__btn {
  appearance: none;
  border: 1px solid var(--pu-color-border);
  background: var(--pu-color-surface);
  color: var(--pu-color-text);
  font: inherit;
  font-size: var(--pu-text-sm);
  font-weight: var(--pu-font-medium);
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.5rem;
  border-radius: var(--pu-radius-md);
  cursor: pointer;
}
.pu-pagination__btn:hover:not(:disabled) {
  background: var(--pu-color-surface-2);
}
.pu-pagination__btn:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--pu-color-surface),
    0 0 0 4px color-mix(in srgb, var(--pu-color-focus) 55%, transparent);
}
.pu-pagination__btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.pu-pagination__btn.is-active {
  background: var(--pu-color-accent);
  color: var(--pu-color-accent-fg);
  border-color: transparent;
}
.pu-pagination__btn {
  transition:
    background var(--pu-duration-fast) var(--pu-ease),
    color var(--pu-duration-fast) var(--pu-ease),
    border-color var(--pu-duration-fast) var(--pu-ease),
    box-shadow var(--pu-duration-fast) var(--pu-ease);
}
.pu-pagination__meta {
  font-size: var(--pu-text-xs);
  color: var(--pu-color-text-muted);
  margin-left: 0.35rem;
}
`,
);

export const Pagination = component((raw: PaginationProps) => {
  ensure();
  const props = raw as ComponentProps<PaginationProps>;
  const page = () =>
    typeof props.page === "function"
      ? (props.page as () => number)()
      : props.page;
  const count = () =>
    typeof props.pageCount === "function"
      ? (props.pageCount as () => number)()
      : props.pageCount;

  const go = (p: number) => {
    const c = Math.max(1, count());
    const next = Math.min(c, Math.max(1, p));
    props.onChange?.(next);
  };

  // Build a compact page list: 1 … n around current
  const pages = () => {
    const c = Math.max(1, count());
    const p = page();
    const set = new Set<number>([1, c, p - 1, p, p + 1]);
    return [...set].filter((n) => n >= 1 && n <= c).sort((a, b) => a - b);
  };

  return (
    <div
      class={() =>
        cx(
          "pu-pagination",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      role="navigation"
      aria-label="Pagination"
      ref={(el) => ensure(el.ownerDocument)}
    >
      <button
        type="button"
        class="pu-pagination__btn"
        disabled={() => page() <= 1}
        onClick={() => go(page() - 1)}
        aria-label="Previous page"
      >
        ‹
      </button>
      {() => {
        const list = pages();
        const frag = document.createDocumentFragment();
        let prev = 0;
        for (const n of list) {
          if (prev && n - prev > 1) {
            const dots = document.createElement("span");
            dots.className = "pu-pagination__meta";
            dots.textContent = "…";
            frag.appendChild(dots);
          }
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className =
            "pu-pagination__btn" + (n === page() ? " is-active" : "");
          btn.textContent = String(n);
          btn.setAttribute("aria-label", `Page ${n}`);
          if (n === page()) btn.setAttribute("aria-current", "page");
          btn.onclick = () => go(n);
          frag.appendChild(btn);
          prev = n;
        }
        return frag;
      }}
      <button
        type="button"
        class="pu-pagination__btn"
        disabled={() => page() >= count()}
        onClick={() => go(page() + 1)}
        aria-label="Next page"
      >
        ›
      </button>
      <span class="pu-pagination__meta">
        {() => `Page ${page()} / ${count()}`}
      </span>
    </div>
  );
});
