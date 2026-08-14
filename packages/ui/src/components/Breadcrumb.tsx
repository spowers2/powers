import { For, component, type ComponentProps } from "@power-ux/dom";
import { cx } from "../utils.js";
import { createStyleSheet } from "../styles.js";

export type BreadcrumbItem = {
  id: string;
  label: string;
  href?: string;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[] | (() => BreadcrumbItem[]);
  onNavigate?: (id: string) => void;
  class?: string | (() => string);
};

const ensure = createStyleSheet(
  "breadcrumb",
  `
.pu-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--pu-text-sm);
  color: var(--pu-color-text-muted);
  list-style: none;
  margin: 0;
  padding: 0;
}
.pu-breadcrumb__sep {
  opacity: 0.5;
  user-select: none;
}
.pu-breadcrumb__link {
  appearance: none;
  border: 0;
  background: transparent;
  font: inherit;
  color: var(--pu-color-accent);
  cursor: pointer;
  padding: 0;
  text-decoration: none;
}
.pu-breadcrumb__link:hover { text-decoration: underline; }
.pu-breadcrumb__link:focus-visible {
  outline: none;
  border-radius: 2px;
  box-shadow:
    0 0 0 2px var(--pu-color-surface),
    0 0 0 4px color-mix(in srgb, var(--pu-color-focus) 55%, transparent);
}
.pu-breadcrumb__current {
  color: var(--pu-color-text);
  font-weight: var(--pu-font-medium);
}
`,
);

export const Breadcrumb = component((raw: BreadcrumbProps) => {
  ensure();
  const props = raw as ComponentProps<BreadcrumbProps>;
  const getItems = () =>
    typeof props.items === "function"
      ? (props.items as () => BreadcrumbItem[])()
      : (props.items ?? []);

  return (
    <nav
      aria-label="Breadcrumb"
      class={() =>
        cx(
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      ref={(el) => ensure(el.ownerDocument)}
    >
      <ol class="pu-breadcrumb">
        <For each={getItems}>
          {(item, index) => (
            <li style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
              {() =>
                index() > 0
                  ? (() => {
                      const s = document.createElement("span");
                      s.className = "pu-breadcrumb__sep";
                      s.setAttribute("aria-hidden", "true");
                      s.textContent = "/";
                      return s;
                    })()
                  : null
              }
              {() => {
                const it = item();
                const last = index() === getItems().length - 1;
                if (last) {
                  const span = document.createElement("span");
                  span.className = "pu-breadcrumb__current";
                  span.setAttribute("aria-current", "page");
                  span.textContent = it.label;
                  return span;
                }
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "pu-breadcrumb__link";
                btn.textContent = it.label;
                btn.onclick = () => props.onNavigate?.(it.id);
                return btn;
              }}
            </li>
          )}
        </For>
      </ol>
    </nav>
  );
});
