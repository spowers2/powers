import { effect } from "@lab206/core";
import { component, type ComponentProps } from "@lab206/dom";
import { cx } from "../utils.js";
import { createStyleSheet } from "../styles.js";

export type TransitionProps = {
  /** Show / hide the child */
  show: boolean | (() => boolean);
  /** CSS name prefix — generates name-enter, name-enter-active, name-exit, name-exit-active */
  name?: string;
  /** Fallback duration (ms) if no transitionend fires */
  duration?: number;
  class?: string | (() => string);
  children?: unknown;
};

const ensure = createStyleSheet(
  "transition",
  `
.pu-transition { display: contents; }
.pu-fade-enter { opacity: 0; }
.pu-fade-enter-active {
  opacity: 1;
  transition: opacity var(--pu-duration) var(--pu-ease-out);
}
.pu-fade-exit { opacity: 1; }
.pu-fade-exit-active {
  opacity: 0;
  transition: opacity var(--pu-duration) var(--pu-ease);
}
.pu-collapse-enter {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
}
.pu-collapse-enter-active {
  overflow: hidden;
  max-height: 40rem;
  opacity: 1;
  transition:
    max-height var(--pu-duration-slow) var(--pu-ease-out),
    opacity var(--pu-duration) var(--pu-ease-out);
}
.pu-collapse-exit {
  overflow: hidden;
  max-height: 40rem;
  opacity: 1;
}
.pu-collapse-exit-active {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition:
    max-height var(--pu-duration-slow) var(--pu-ease),
    opacity var(--pu-duration) var(--pu-ease);
}
@media (prefers-reduced-motion: reduce) {
  .pu-fade-enter-active,
  .pu-fade-exit-active,
  .pu-collapse-enter-active,
  .pu-collapse-exit-active { transition: none; }
}
`,
);

/**
 * Enter/exit CSS transitions around children.
 * Default name `"pu-fade"`; also built-in `"pu-collapse"`.
 */
export const Transition = component((raw: TransitionProps) => {
  ensure();
  const props = raw as ComponentProps<TransitionProps>;
  const name = () => props.name ?? "pu-fade";
  const duration = () => props.duration ?? 220;

  const host = document.createElement("div");
  host.className = "pu-transition";
  let childHost: HTMLElement | null = null;
  let phase: "void" | "in" | "out" = "void";

  const resolveChild = (): Node | null => {
    const c = props.children;
    if (c == null || c === false) return null;
    if (c instanceof Node) return c;
    if (typeof c === "function") {
      const r = (c as () => unknown)();
      if (r instanceof Node) return r;
      if (r == null) return null;
      return document.createTextNode(String(r));
    }
    return document.createTextNode(String(c));
  };

  const show = () => {
    const s = props.show;
    return typeof s === "function" ? !!(s as () => boolean)() : !!s;
  };

  effect(() => {
    const on = show();
    const n = name();
    const doc = host.ownerDocument;
    ensure(doc);
    const win = doc.defaultView ?? window;

    if (on) {
      if (phase === "in") return;
      phase = "in";
      host.replaceChildren();
      const wrap = doc.createElement("div");
      wrap.className = cx(
        typeof props.class === "function" ? props.class() : props.class,
      );
      const node = resolveChild();
      if (node) wrap.appendChild(node);
      childHost = wrap;
      host.appendChild(wrap);
      wrap.classList.add(`${n}-enter`);
      // force reflow
      void wrap.offsetWidth;
      wrap.classList.add(`${n}-enter-active`);
      const done = () => {
        wrap.classList.remove(`${n}-enter`, `${n}-enter-active`);
      };
      const t = win.setTimeout(done, duration());
      wrap.addEventListener("transitionend", done, { once: true });
      return () => win.clearTimeout(t);
    }

    // exit
    if (phase === "void" || !childHost) {
      host.replaceChildren();
      phase = "void";
      return;
    }
    if (phase === "out") return;
    phase = "out";
    const wrap = childHost;
    wrap.classList.remove(`${n}-enter`, `${n}-enter-active`);
    wrap.classList.add(`${n}-exit`);
    void wrap.offsetWidth;
    wrap.classList.add(`${n}-exit-active`);
    const finish = () => {
      if (phase !== "out") return;
      host.replaceChildren();
      childHost = null;
      phase = "void";
    };
    const t = win.setTimeout(finish, duration());
    wrap.addEventListener("transitionend", finish, { once: true });
    return () => win.clearTimeout(t);
  });

  return host;
});
