/**
 * Turn `import { createQuery, Show } from "…"` into `const createQuery = __lab.createQuery`
 * so Lab does NOT inject every API as a Function parameter (that collided with
 * recipe locals like `const api` / `const list`).
 */
export function rewriteImportsToLab(code: string): string {
  let out = code
    .replace(/^\s*import\s+type\s+[\s\S]*?;?\s*$/gm, "")
    .replace(/^\s*import\s+["'][^"']+["']\s*;?\s*$/gm, "");

  out = out.replace(
    /^\s*import\s+\{([\s\S]*?)\}\s+from\s+["'][^"']+["']\s*;?\s*$/gm,
    (_m, specs: string) => {
      const lines: string[] = [];
      for (const part of specs.split(",")) {
        let s = part.trim();
        if (!s) continue;
        if (/^type\s+/.test(s)) continue;
        const asMatch = s.match(
          /^([A-Za-z_$][\w$]*)\s+as\s+([A-Za-z_$][\w$]*)$/,
        );
        if (asMatch) {
          lines.push(`const ${asMatch[2]} = __lab.${asMatch[1]};`);
          continue;
        }
        if (/^[A-Za-z_$][\w$]*$/.test(s)) {
          lines.push(`const ${s} = __lab.${s};`);
        }
      }
      return lines.join("\n");
    },
  );

  out = out.replace(
    /^\s*import\s+\*\s+as\s+([A-Za-z_$][\w$]*)\s+from\s+["'][^"']+["']\s*;?\s*$/gm,
    (_m, name: string) => `const ${name} = __lab;`,
  );

  out = out.replace(
    /^\s*import\s+([A-Za-z_$][\w$]*)\s+from\s+["'][^"']+["']\s*;?\s*$/gm,
    (_m, name: string) => `const ${name} = __lab.${name};`,
  );

  out = out.replace(/^\s*export\s+\{[^}]*\}\s*;?\s*$/gm, "");
  return out;
}

export function rewriteExports(code: string): string {
  return code
    .replace(/export\s+default\s+function\s+/g, "function ")
    .replace(/export\s+default\s+/g, "")
    .replace(/export\s+async\s+function\s+/g, "async function ")
    .replace(/export\s+function\s+/g, "function ")
    .replace(/export\s+const\s+/g, "const ")
    .replace(/export\s+let\s+/g, "let ")
    .replace(/export\s+class\s+/g, "class ");
}
