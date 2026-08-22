import path from "node:path";
import { fileURLToPath } from "node:url";

/** Resolve @powers/* to package source for monorepo Vite HMR. */
export function powersSrcAliases(fromUrl) {
  const exampleDir = path.dirname(fileURLToPath(fromUrl));
  const root = path.resolve(exampleDir, "../..");
  const pkg = (name, sub = "src/index.ts") =>
    path.join(root, "packages", name, sub);
  return {
    "@powers/core": pkg("core"),
    "@powers/dom/jsx-runtime": pkg("dom", "src/jsx-runtime.ts"),
    "@powers/dom/jsx-dev-runtime": pkg("dom", "src/jsx-runtime.ts"),
    "@powers/dom": pkg("dom"),
    "@powers/animate/gsap": pkg("animate", "src/gsap.ts"),
    "@powers/animate": pkg("animate"),
    "@powers/router": pkg("router"),
    "@powers/ssr": pkg("ssr"),
    "@powers/ui/theme.css": pkg("ui", "src/styles/theme.css"),
    "@powers/ui/tokens.css": pkg("ui", "src/styles/tokens.css"),
    "@powers/ui/base.css": pkg("ui", "src/styles/base.css"),
    "@powers/ui/utilities.css": pkg("ui", "src/styles/utilities.css"),
    "@powers/ui": pkg("ui"),
  };
}
