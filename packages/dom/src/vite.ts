/**
 * Vite plugin: JSX → `@lab206/dom` (Vite ignores tsconfig jsxImportSource).
 * Import from `@lab206/dom/vite`, never from the browser entry.
 */

export type PowersViteOptions = {
  /** Extra packages to prebundle besides core/dom/ui. */
  include?: string[];
};

const DEFAULT_INCLUDE = ["@lab206/core", "@lab206/dom", "@lab206/ui"];

export function powers(options: PowersViteOptions = {}) {
  const include = options.include ?? DEFAULT_INCLUDE;
  return {
    name: "lab206-powers",
    enforce: "pre" as const,
    config() {
      return {
        esbuild: {
          jsx: "automatic" as const,
          jsxImportSource: "@lab206/dom",
        },
        optimizeDeps: { include },
      };
    },
    configResolved(config: {
      command?: string;
      esbuild?: { jsxImportSource?: string };
    }) {
      const src = config.esbuild?.jsxImportSource;
      if (src && src !== "@lab206/dom") {
        const msg =
          `[powers] esbuild.jsxImportSource is "${src}". ` +
          `Powers JSX needs "@lab206/dom" or the app throws "React is not defined". ` +
          `Use plugins: [powers()] and do not override jsxImportSource.`;
        if (config.command === "build") {
          throw new Error(msg);
        }
        console.warn(msg);
      }
    },
  };
}
