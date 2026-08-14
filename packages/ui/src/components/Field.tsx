import { effect } from "@power-ux/core";
import { component, mergeProps, type ComponentProps } from "@power-ux/dom";
import { cx, puId } from "../utils.js";
import { Label } from "./Label.js";

export type FieldProps = {
  label?: string;
  /** Explicit control id. When omitted, Field generates one and wires the first control. */
  htmlFor?: string;
  hint?: string | (() => string);
  error?: string | (() => string | undefined | null | false);
  required?: boolean;
  class?: string | (() => string);
  children?: unknown;
};

const styles = `
.pu-field {
  display: flex;
  flex-direction: column;
  gap: var(--pu-field-gap);
  min-width: 0;
}
/* Stable footer slot — prevents layout shift (and scroll jumps) when errors appear */
.pu-field__footer {
  min-height: 1.25em;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.pu-field__hint,
.pu-field__error {
  margin: 0;
  font-size: var(--pu-text-xs);
  line-height: 1.35;
  min-height: 1.25em;
}
.pu-field__hint {
  color: var(--pu-color-text-muted);
}
.pu-field__error {
  color: var(--pu-color-danger);
  font-weight: var(--pu-font-medium);
}
.pu-field__error:empty,
.pu-field__hint:empty {
  /* keep box for layout; empty text has zero width but min-height holds space when one is shown */
}
.pu-field--invalid :is(.pu-input, .pu-textarea, .pu-select) {
  border-color: var(--pu-color-danger);
}
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "field");
  el.textContent = styles;
  document.head.appendChild(el);
}

const CONTROL_SEL =
  "input:not([type='hidden']):not([type='checkbox']):not([type='radio']), textarea, select, [role='combobox'], .pu-select";

function findControl(root: HTMLElement): HTMLElement | null {
  return root.querySelector(CONTROL_SEL) as HTMLElement | null;
}

/**
 * Form field layout: label + control + hint/error.
 *
 * - Auto-wires `htmlFor` / control `id` when you pass a `label` (unless `htmlFor` set)
 * - Mirrors error/hint onto `aria-invalid` / `aria-describedby` on the control
 * - Error region never uses role="alert" (avoids scroll/steal focus while typing)
 */
export const Field = component((raw: FieldProps) => {
  ensureStyles();
  const props = mergeProps({}, raw) as ComponentProps<FieldProps>;

  const controlId = props.htmlFor ?? puId("pu-field");
  const msgId = puId("pu-field-msg");
  let rootEl: HTMLElement | null = null;

  const errorText = () => {
    const e = props.error as string | undefined | null | false;
    return e ? String(e) : "";
  };
  const hintText = () => {
    const h = props.hint as string | undefined | null | false;
    return h ? String(h) : "";
  };

  effect(() => {
    const err = errorText();
    const hint = hintText();
    // Re-run when messages change; also after microtask so children exist
    const apply = () => {
      const root = rootEl;
      if (!root) return;
      const control = findControl(root);
      if (!control) return;
      // Prefer explicit control id; else apply field id for label association
      if (!control.id) control.id = controlId;

      if (err) {
        control.setAttribute("aria-invalid", "true");
        control.setAttribute("aria-describedby", msgId);
      } else if (hint) {
        control.removeAttribute("aria-invalid");
        control.setAttribute("aria-describedby", msgId);
      } else {
        control.removeAttribute("aria-invalid");
        // Only clear if we own the describedby
        if (control.getAttribute("aria-describedby") === msgId) {
          control.removeAttribute("aria-describedby");
        }
      }
    };
    queueMicrotask(apply);
    // Children may mount after first microtask (effects order)
    const t =
      typeof window !== "undefined"
        ? window.setTimeout(apply, 0)
        : (null as unknown as number);
    return () => {
      if (t != null && typeof window !== "undefined") window.clearTimeout(t);
    };
  });

  return (
    <div
      class={() =>
        cx(
          "pu-field",
          errorText() && "pu-field--invalid",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      ref={(el) => {
        rootEl = el;
      }}
    >
      {props.label
        ? Label({
            htmlFor: controlId,
            ...(props.required !== undefined
              ? { required: props.required }
              : {}),
            children: props.label,
          })
        : null}
      {props.children as never}
      <div class="pu-field__footer">
        {() => {
          const err = errorText();
          const hint = hintText();
          if (err) {
            const p = document.createElement("p");
            p.className = "pu-field__error";
            p.id = msgId;
            p.setAttribute("role", "status");
            p.setAttribute("aria-live", "polite");
            p.textContent = err;
            return p;
          }
          if (hint) {
            const p = document.createElement("p");
            p.className = "pu-field__hint";
            p.id = msgId;
            p.textContent = hint;
            return p;
          }
          const spacer = document.createElement("p");
          spacer.className = "pu-field__hint";
          spacer.setAttribute("aria-hidden", "true");
          spacer.innerHTML = "&nbsp;";
          return spacer;
        }}
      </div>
    </div>
  );
});
