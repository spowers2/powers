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
    (el as unknown as Record<string, unknown>)[name] = get();
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
      setStyleProp(el, key, value == null ? "" : String(value));
    }

    prevKeys = nextKeys;
  });
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
  (el.style as unknown as Record<string, string>)[camel] = value;
}
