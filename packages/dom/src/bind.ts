import { effect, type Dispose } from "@power-ui/core";

/** Reactive text content of an Element or Text node. */
export function bindText(
  node: Element | Text,
  get: () => string | number | boolean | null | undefined,
): Dispose {
  return effect(() => {
    const value = get();
    const text = value == null ? "" : String(value);
    if (node.nodeType === Node.TEXT_NODE) {
      (node as Text).data = text;
    } else {
      (node as Element).textContent = text;
    }
  });
}

/**
 * Reactive attribute. `false` / `null` / `undefined` removes the attribute.
 * `true` sets a boolean attribute to `""`.
 */
export function bindAttr(
  el: Element,
  name: string,
  get: () => string | number | boolean | null | undefined,
): Dispose {
  return effect(() => {
    const value = get();
    if (value === false || value == null) {
      el.removeAttribute(name);
    } else if (value === true) {
      el.setAttribute(name, "");
    } else {
      el.setAttribute(name, String(value));
    }
  });
}

/** Reactive DOM property (e.g. `value`, `checked`, `disabled`). */
export function bindProp<T>(
  el: Element,
  name: string,
  get: () => T,
): Dispose {
  return effect(() => {
    const next = get();
    const rec = el as unknown as Record<string, unknown>;
    // Skip no-ops — assigning input.value every keystroke resets the caret
    if (rec[name] !== next) {
      rec[name] = next;
    }
  });
}

/**
 * Reactive className.
 * - string → full className
 * - record → toggles keys by truthiness (merged onto base if second arg)
 */
export function bindClass(
  el: Element,
  get: () => string | Record<string, boolean | undefined | null> | null | undefined,
): Dispose {
  return effect(() => {
    const value = get();
    if (value == null || value === "") {
      el.className = "";
      return;
    }
    if (typeof value === "string") {
      el.className = value;
      return;
    }
    const parts: string[] = [];
    for (const key of Object.keys(value)) {
      if (value[key]) parts.push(key);
    }
    el.className = parts.join(" ");
  });
}

/**
 * Reactive inline styles.
 * Pass a partial style object; keys are CSS properties (camelCase or kebab-case).
 * `null` / `undefined` values clear that property.
 */
export function bindStyle(
  el: HTMLElement | SVGElement,
  get: () => Record<string, string | number | null | undefined> | null | undefined,
): Dispose {
  let prevKeys: string[] = [];
  return effect(() => {
    const styles = get() ?? {};
    const nextKeys = Object.keys(styles);

    for (const key of prevKeys) {
      if (!(key in styles)) {
        setStyleProp(el, key, "");
      }
    }

    for (const key of nextKeys) {
      const value = styles[key];
      if (value == null) {
        setStyleProp(el, key, "");
      } else if (typeof value === "number") {
        setStyleProp(el, key, toCssValue(key.includes("-")
          ? key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
          : key, value));
      } else {
        setStyleProp(el, key, String(value));
      }
    }

    prevKeys = nextKeys;
  });
}

/** CSS props that accept unitless numbers (like React). Everything else gets `px`. */
const UNITLESS = new Set([
  "animationIterationCount",
  "aspectRatio",
  "borderImageOutset",
  "borderImageSlice",
  "borderImageWidth",
  "boxFlex",
  "boxFlexGroup",
  "boxOrdinalGroup",
  "columnCount",
  "columns",
  "flex",
  "flexGrow",
  "flexPositive",
  "flexShrink",
  "flexNegative",
  "flexOrder",
  "gridArea",
  "gridRow",
  "gridRowEnd",
  "gridRowSpan",
  "gridRowStart",
  "gridColumn",
  "gridColumnEnd",
  "gridColumnSpan",
  "gridColumnStart",
  "fontWeight",
  "lineClamp",
  "lineHeight",
  "opacity",
  "order",
  "orphans",
  "tabSize",
  "widows",
  "zIndex",
  "zoom",
  "fillOpacity",
  "floodOpacity",
  "stopOpacity",
  "strokeDasharray",
  "strokeDashoffset",
  "strokeMiterlimit",
  "strokeOpacity",
  "strokeWidth",
]);

function toCssValue(key: string, value: string | number): string {
  if (typeof value === "number") {
    if (value === 0 || UNITLESS.has(key)) return String(value);
    return `${value}px`;
  }
  return value;
}

function setStyleProp(
  el: HTMLElement | SVGElement,
  key: string,
  value: string,
): void {
  // Support both camelCase and kebab-case.
  if (key.startsWith("--")) {
    el.style.setProperty(key, value);
    return;
  }
  const camel = key.includes("-")
    ? key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    : key;
  // value may already be stringified; re-apply unit rule when it's a bare number
  const asNum = Number(value);
  const final =
    value !== "" && Number.isFinite(asNum) && String(asNum) === value.trim()
      ? toCssValue(camel, asNum)
      : value;
  (el.style as unknown as Record<string, string>)[camel] = final;
}
