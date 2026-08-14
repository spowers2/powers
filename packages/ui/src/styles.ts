/**
 * Inject a component stylesheet once per document.
 * Use this when writing new primitives — 3 lines of setup.
 *
 * @example
 * ```ts
 * const ensure = createStyleSheet("my-thing", `.pu-my { color: var(--pu-color-accent); }`);
 * export const MyThing = component((props) => {
 *   ensure();
 *   return <div class="pu-my" ref={(el) => ensure(el.ownerDocument)}>{props.children}</div>;
 * });
 * ```
 *
 * **Customize without forking:** override CSS variables on a wrapper
 * (`style={{ "--pu-color-accent": "#69BE28" }}`) or restyle via
 * `[data-pu-ui="my-thing"]` rules / class props.
 */
export function createStyleSheet(id: string, css: string) {
  return function ensure(doc: Document = document): void {
    if (typeof doc === "undefined") return;
    if (doc.querySelector(`style[data-pu-ui="${id}"]`)) return;
    const el = doc.createElement("style");
    el.setAttribute("data-pu-ui", id);
    el.textContent = css;
    doc.head.appendChild(el);
  };
}

/**
 * Build a style object of CSS custom properties for the `style` prop.
 * Keys may omit the leading `--` (both `"pu-color-accent"` and `"--pu-x"` work).
 *
 * @example
 * ```tsx
 * <Card style={styleVars({ "pu-color-accent": "#69BE28", "pu-radius-md": "12px" })} />
 * ```
 */
export function styleVars(
  vars: Record<string, string | number | undefined | null>,
): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(vars)) {
    if (value == null || value === "") continue;
    const name = key.startsWith("--")
      ? key
      : key.startsWith("pu-")
        ? `--${key}`
        : `--${key}`;
    out[name] = value;
  }
  return out;
}
