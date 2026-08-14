import { For, component, type ComponentProps } from "@powers/dom";
import { cx } from "../utils.js";
import { createStyleSheet } from "../styles.js";

export type StepItem = {
  id: string;
  label: string;
  description?: string;
};

export type StepsProps = {
  steps: StepItem[] | (() => StepItem[]);
  /** 0-based current step index */
  current: number | (() => number);
  class?: string | (() => string);
  onStepClick?: (index: number) => void;
};

const ensure = createStyleSheet(
  "steps",
  `
.pu-steps {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}
.pu-steps__item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0 0.75rem;
  position: relative;
}
.pu-steps__marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1.75rem;
}
.pu-steps__dot {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  border: 2px solid var(--pu-color-border);
  background: var(--pu-color-surface);
  color: var(--pu-color-text-muted);
  font-size: var(--pu-text-xs);
  font-weight: var(--pu-font-bold);
  display: grid;
  place-items: center;
  z-index: 1;
  transition:
    background var(--pu-duration) var(--pu-ease),
    border-color var(--pu-duration) var(--pu-ease),
    color var(--pu-duration) var(--pu-ease);
}
.pu-steps__item.is-done .pu-steps__dot,
.pu-steps__item.is-current .pu-steps__dot {
  border-color: var(--pu-color-accent);
  background: var(--pu-color-accent);
  color: var(--pu-color-accent-fg);
}
.pu-steps__item.is-current .pu-steps__dot {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--pu-color-accent) 22%, transparent);
}
.pu-steps__line {
  flex: 1;
  width: 2px;
  min-height: 1.25rem;
  background: var(--pu-color-border);
  margin: 0.2rem 0;
}
.pu-steps__item.is-done .pu-steps__line {
  background: var(--pu-color-accent);
}
.pu-steps__item:last-child .pu-steps__line { display: none; }
.pu-steps__body {
  padding-bottom: 1.1rem;
  min-width: 0;
}
.pu-steps__item:last-child .pu-steps__body { padding-bottom: 0; }
.pu-steps__label {
  font-size: var(--pu-text-sm);
  font-weight: var(--pu-font-semibold);
  color: var(--pu-color-text);
  margin: 0.2rem 0 0;
}
.pu-steps__item.is-todo .pu-steps__label {
  color: var(--pu-color-text-muted);
}
.pu-steps__desc {
  margin: 0.2rem 0 0;
  font-size: var(--pu-text-xs);
  color: var(--pu-color-text-muted);
  line-height: 1.45;
}
.pu-steps__btn {
  appearance: none;
  border: 0;
  background: transparent;
  padding: 0;
  font: inherit;
  text-align: left;
  cursor: pointer;
  color: inherit;
  border-radius: var(--pu-radius-sm);
}
.pu-steps__btn:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--pu-color-surface),
    0 0 0 4px color-mix(in srgb, var(--pu-color-focus) 55%, transparent);
}
.pu-steps__btn:disabled { cursor: default; }
`,
);

/** Vertical step / wizard indicator. */
export const Steps = component((raw: StepsProps) => {
  ensure();
  const props = raw as ComponentProps<StepsProps>;
  const getSteps = () =>
    typeof props.steps === "function"
      ? (props.steps as () => StepItem[])()
      : (props.steps ?? []);
  const current = () =>
    typeof props.current === "function"
      ? (props.current as () => number)()
      : props.current;

  return (
    <ol
      class={() =>
        cx(
          "pu-steps",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      ref={(el) => ensure(el.ownerDocument)}
    >
      <For each={getSteps}>
        {(step, index) => (
          <li
            class={() => {
              const i = index();
              const c = current();
              return cx(
                "pu-steps__item",
                i < c && "is-done",
                i === c && "is-current",
                i > c && "is-todo",
              );
            }}
          >
            <div class="pu-steps__marker" aria-hidden="true">
              <div class="pu-steps__dot">
                {() =>
                  index() < current() ? "✓" : String(index() + 1)
                }
              </div>
              <div class="pu-steps__line" />
            </div>
            <div class="pu-steps__body">
              <button
                type="button"
                class="pu-steps__btn"
                disabled={() => !props.onStepClick}
                onClick={() => props.onStepClick?.(index())}
              >
                <div class="pu-steps__label">{() => step().label}</div>
                {() =>
                  step().description
                    ? (() => {
                        const p = document.createElement("p");
                        p.className = "pu-steps__desc";
                        p.textContent = step().description!;
                        return p;
                      })()
                    : null
                }
              </button>
            </div>
          </li>
        )}
      </For>
    </ol>
  );
});
