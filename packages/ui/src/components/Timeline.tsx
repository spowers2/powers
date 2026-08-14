import { For, component, type ComponentProps } from "@power-ux/dom";
import { cx } from "../utils.js";
import { createStyleSheet } from "../styles.js";

export type TimelineItem = {
  id: string;
  title: string;
  description?: string;
  time?: string;
  tone?: "default" | "accent" | "success" | "danger";
};

export type TimelineProps = {
  items: TimelineItem[] | (() => TimelineItem[]);
  class?: string | (() => string);
};

const ensure = createStyleSheet(
  "timeline",
  `
.pu-timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.pu-timeline__item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0 0.85rem;
}
.pu-timeline__rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 0.85rem;
}
.pu-timeline__dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: var(--pu-color-border-strong, var(--pu-color-border));
  border: 2px solid var(--pu-color-surface);
  box-shadow: 0 0 0 1px var(--pu-color-border);
  z-index: 1;
  margin-top: 0.35rem;
  flex-shrink: 0;
}
.pu-timeline__dot--accent { background: var(--pu-color-accent); box-shadow: 0 0 0 1px var(--pu-color-accent); }
.pu-timeline__dot--success { background: var(--pu-color-success, #69be28); box-shadow: 0 0 0 1px var(--pu-color-success, #69be28); }
.pu-timeline__dot--danger { background: var(--pu-color-danger); box-shadow: 0 0 0 1px var(--pu-color-danger); }
.pu-timeline__line {
  flex: 1;
  width: 2px;
  background: var(--pu-color-border);
  min-height: 1.25rem;
  margin: 0.25rem 0 0;
}
.pu-timeline__item:last-child .pu-timeline__line { display: none; }
.pu-timeline__body {
  padding-bottom: 1.15rem;
  min-width: 0;
}
.pu-timeline__item:last-child .pu-timeline__body { padding-bottom: 0; }
.pu-timeline__time {
  font-size: var(--pu-text-xs);
  color: var(--pu-color-text-muted);
  font-variant-numeric: tabular-nums;
  margin-bottom: 0.15rem;
}
.pu-timeline__title {
  margin: 0;
  font-size: var(--pu-text-sm);
  font-weight: var(--pu-font-semibold);
  color: var(--pu-color-text);
}
.pu-timeline__desc {
  margin: 0.25rem 0 0;
  font-size: var(--pu-text-sm);
  color: var(--pu-color-text-muted);
  line-height: 1.5;
}
`,
);

/** Activity / event timeline. */
export const Timeline = component((raw: TimelineProps) => {
  ensure();
  const props = raw as ComponentProps<TimelineProps>;
  const getItems = () =>
    typeof props.items === "function"
      ? (props.items as () => TimelineItem[])()
      : (props.items ?? []);

  return (
    <ol
      class={() =>
        cx(
          "pu-timeline",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      ref={(el) => ensure(el.ownerDocument)}
    >
      <For each={getItems}>
        {(item) => (
          <li class="pu-timeline__item">
            <div class="pu-timeline__rail" aria-hidden="true">
              <div
                class={() =>
                  cx(
                    "pu-timeline__dot",
                    item().tone &&
                      item().tone !== "default" &&
                      `pu-timeline__dot--${item().tone}`,
                  )
                }
              />
              <div class="pu-timeline__line" />
            </div>
            <div class="pu-timeline__body">
              {() =>
                item().time
                  ? (() => {
                      const t = document.createElement("div");
                      t.className = "pu-timeline__time";
                      t.textContent = item().time!;
                      return t;
                    })()
                  : null
              }
              <h4 class="pu-timeline__title">{() => item().title}</h4>
              {() =>
                item().description
                  ? (() => {
                      const p = document.createElement("p");
                      p.className = "pu-timeline__desc";
                      p.textContent = item().description!;
                      return p;
                    })()
                  : null
              }
            </div>
          </li>
        )}
      </For>
    </ol>
  );
});
