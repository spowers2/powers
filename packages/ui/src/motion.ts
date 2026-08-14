/**
 * Motion language — named enter/exit class presets for Transition / CSS.
 *
 * Use with `<Transition name="pu-fade" show={…}>` or apply classes yourself.
 * All presets respect `prefers-reduced-motion` via Transition's built-in CSS
 * and global base.css rules.
 */

export type MotionPreset = {
  /** Class prefix for Transition `name` prop */
  name: string;
  /** Human label */
  label: string;
  /** When to use */
  use: string;
  /** Suggested duration ms */
  duration: number;
};

/** Built-in Transition names shipped in Transition.tsx styles. */
export const MOTION_PRESETS: readonly MotionPreset[] = [
  {
    name: "pu-fade",
    label: "Fade",
    use: "Default enter/exit for overlays, panels, soft content swaps",
    duration: 220,
  },
  {
    name: "pu-collapse",
    label: "Collapse",
    use: "Accordion-like height expand/collapse (max-height)",
    duration: 360,
  },
] as const;

export type MotionPresetName = (typeof MOTION_PRESETS)[number]["name"];

/**
 * CSS custom-property recipe for one-off motion on a node
 * (pair with your own transition: rules).
 */
export function motionVars(opts: {
  duration?: string | number;
  ease?: "out" | "spring" | "default";
}): Record<string, string> {
  const duration =
    opts.duration == null
      ? "var(--pu-duration)"
      : typeof opts.duration === "number"
        ? `${opts.duration}ms`
        : opts.duration;
  const ease =
    opts.ease === "spring"
      ? "var(--pu-ease-spring)"
      : opts.ease === "out"
        ? "var(--pu-ease-out)"
        : "var(--pu-ease)";
  return {
    "--pu-motion-duration": duration,
    "--pu-motion-ease": ease,
  };
}
