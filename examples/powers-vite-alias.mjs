import path from "node:path";
import { fileURLToPath } from "node:url";

/** Resolve @lab206/* to package source for monorepo Vite HMR. */
export function powersSrcAliases(fromUrl) {
  const exampleDir = path.dirname(fileURLToPath(fromUrl));
  const root = path.resolve(exampleDir, "../..");
  const pkg = (name, sub = "src/index.ts") =>
    path.join(root, "packages", name, sub);

  // Use exact matches for package roots so subpath imports (e.g.
  // @lab206/ui/theme.css?inline) are not rewritten as index.ts/theme.css.
  return [
    {
      find: "@lab206/ui/theme.css",
      replacement: pkg("ui", "src/styles/theme.css"),
    },
    {
      find: "@lab206/ui/tokens.css",
      replacement: pkg("ui", "src/styles/tokens.css"),
    },
    {
      find: "@lab206/ui/base.css",
      replacement: pkg("ui", "src/styles/base.css"),
    },
    {
      find: "@lab206/ui/utilities.css",
      replacement: pkg("ui", "src/styles/utilities.css"),
    },
    {
      find: "@lab206/dom/jsx-runtime",
      replacement: pkg("dom", "src/jsx-runtime.ts"),
    },
    {
      find: "@lab206/dom/jsx-dev-runtime",
      replacement: pkg("dom", "src/jsx-runtime.ts"),
    },
    {
      find: "@lab206/animate/gsap",
      replacement: pkg("animate", "src/gsap.ts"),
    },
    { find: /^@lab206\/core$/, replacement: pkg("core") },
    { find: /^@lab206\/dom$/, replacement: pkg("dom") },
    { find: /^@lab206\/animate$/, replacement: pkg("animate") },
    { find: /^@lab206\/router$/, replacement: pkg("router") },
    { find: /^@lab206\/ssr$/, replacement: pkg("ssr") },
    { find: /^@lab206\/ui$/, replacement: pkg("ui") },
  ];
}
