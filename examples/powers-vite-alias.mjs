import path from "node:path";
import { fileURLToPath } from "node:url";

/** Resolve @lab206/* to package source for monorepo Vite HMR. */
export function powersSrcAliases(fromUrl) {
  const exampleDir = path.dirname(fileURLToPath(fromUrl));
  const root = path.resolve(exampleDir, "../..");
  const pkg = (name, sub = "src/index.ts") =>
    path.join(root, "packages", name, sub);
  return {
    "@lab206/core": pkg("core"),
    "@lab206/dom/jsx-runtime": pkg("dom", "src/jsx-runtime.ts"),
    "@lab206/dom/jsx-dev-runtime": pkg("dom", "src/jsx-runtime.ts"),
    "@lab206/dom": pkg("dom"),
    "@lab206/animate/gsap": pkg("animate", "src/gsap.ts"),
    "@lab206/animate": pkg("animate"),
    "@lab206/router": pkg("router"),
    "@lab206/ssr": pkg("ssr"),
    "@lab206/ui/theme.css": pkg("ui", "src/styles/theme.css"),
    "@lab206/ui/tokens.css": pkg("ui", "src/styles/tokens.css"),
    "@lab206/ui/base.css": pkg("ui", "src/styles/base.css"),
    "@lab206/ui/utilities.css": pkg("ui", "src/styles/utilities.css"),
    "@lab206/ui": pkg("ui"),
  };
}
