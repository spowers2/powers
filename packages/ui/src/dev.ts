/**
 * Lightweight development warnings for common Power UX mistakes.
 * No-ops when `NODE_ENV === "production"` or when disabled.
 *
 * Call `installDevWarnings()` once from your app bootstrap (demos do this).
 */

const g = globalThis as unknown as {
  process?: { env?: { NODE_ENV?: string } };
  __POWER_UI_DEV__?: boolean;
  __POWER_UI_WARNED__?: Set<string>;
};

function isDev(): boolean {
  if (g.__POWER_UI_DEV__ === false) return false;
  if (g.__POWER_UI_DEV__ === true) return true;
  const env = g.process?.env?.NODE_ENV;
  if (env === "production") return false;
  // Browser demos / Vite: treat as dev unless explicitly production
  return true;
}

function warnedSet(): Set<string> {
  if (!g.__POWER_UI_WARNED__) g.__POWER_UI_WARNED__ = new Set();
  return g.__POWER_UI_WARNED__;
}

/** Log a unique warning once per key (console.warn). */
export function devWarnOnce(key: string, message: string): void {
  if (!isDev()) return;
  const set = warnedSet();
  if (set.has(key)) return;
  set.add(key);
  // eslint-disable-next-line no-console
  console.warn(`[Power UX] ${message}`);
}

/**
 * After first paint, check that design tokens exist (theme.css imported).
 * Safe to call multiple times.
 */
export function warnIfThemeMissing(doc: Document = document): void {
  if (!isDev() || typeof doc === "undefined") return;
  queueMicrotask(() => {
    try {
      const cs = doc.defaultView?.getComputedStyle(doc.documentElement);
      const accent = cs?.getPropertyValue("--pu-color-accent")?.trim();
      if (!accent) {
        devWarnOnce(
          "theme-css",
          'Missing design tokens. Import once at the app root: import "@power-ux/ui/theme.css"; then createTheme().bind().',
        );
      }
    } catch {
      /* ignore */
    }
  });
}

/**
 * Heuristic: plain-string `value` on a named control often means the author
 * wrote `value={email()}` (snapshot) instead of `bind={email}` / `value={email}`.
 * Only warns when `bound` is not used.
 */
export function warnPossibleSnapshotValue(
  control: string,
  opts: { hasBind?: boolean; valueIsPlainString?: boolean },
): void {
  if (!isDev() || opts.hasBind || !opts.valueIsPlainString) return;
  devWarnOnce(
    `snapshot-${control}`,
    `${control}: value is a plain string. If you meant a live signal, pass the signal itself: bind={email} or value={email} — not value={email()}.`,
  );
}

/** Enable/disable all Power UX dev warnings. */
export function setDevWarnings(enabled: boolean): void {
  g.__POWER_UI_DEV__ = enabled;
}

/** Install theme check (call once from demo / template main). */
export function installDevWarnings(): void {
  if (!isDev()) return;
  if (typeof document !== "undefined") {
    warnIfThemeMissing(document);
  }
}
