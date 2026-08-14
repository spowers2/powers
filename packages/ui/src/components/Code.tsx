import { component, mergeProps, type ComponentProps } from "@powers/dom";
import { cx } from "../utils.js";

export type CodeProps = {
  /** Inline vs block panel */
  block?: boolean;
  class?: string | (() => string);
  children?: unknown;
};

const styles = `
.pu-code {
  font-family: var(--pu-font-mono);
  font-size: 0.84em;
  font-feature-settings: "liga" 0;
}
.pu-code--inline {
  padding: 0.12em 0.4em;
  border-radius: 6px;
  background: var(--pu-color-surface-2);
  border: 1px solid var(--pu-color-border);
  color: var(--pu-color-text);
}
.pu-code--block {
  display: block;
  margin: 0;
  padding: var(--pu-space-4) var(--pu-space-5);
  border-radius: var(--pu-radius-lg);
  background: var(--pu-gray-900);
  color: var(--pu-gray-100);
  border: 1px solid color-mix(in srgb, var(--pu-brand-400) 18%, transparent);
  overflow-x: auto;
  line-height: 1.65;
  white-space: pre;
  box-shadow: var(--pu-shadow-md);
}
[data-pu-theme="dark"] .pu-code--block {
  background: #080c14;
}
.pu-code--block .pu-k { color: var(--pu-brand-300); }
.pu-code--block .pu-s { color: var(--pu-sage-400); }
.pu-code--block .pu-c { color: var(--pu-gray-400); }
.pu-code--block .pu-p { color: #6e8298; }
`;

let injected = false;
function ensureStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-pu-ui", "code");
  el.textContent = styles;
  document.head.appendChild(el);
}

export const Code = component((raw: CodeProps) => {
  ensureStyles();
  const props = mergeProps({ block: false }, raw) as ComponentProps<
    CodeProps & { block: boolean }
  >;
  const cls = () =>
    cx(
      "pu-code",
      props.block ? "pu-code--block" : "pu-code--inline",
      typeof props.class === "function" ? props.class() : props.class,
    );
  if (props.block) {
    return <pre class={cls}>{props.children as never}</pre>;
  }
  return <code class={cls}>{props.children as never}</code>;
});
