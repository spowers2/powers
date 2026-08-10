export type Params = Record<string, string>;

export interface MatchResult {
  params: Params;
  /** Remaining path after a splat, if any */
  splat?: string;
}

/**
 * Convert a path pattern to a matcher.
 * Supports:
 * - static: `/about`
 * - params: `/users/:id`
 * - optional trailing slash
 * - splat: `/files/*rest` or `/files/*`
 */
export function matchPath(
  pattern: string,
  path: string,
): MatchResult | null {
  const normPattern = normalizePath(pattern);
  const normPath = normalizePath(path);

  if (normPattern === normPath) {
    return { params: {} };
  }

  const patternParts = split(normPattern);
  const pathParts = split(normPath);

  const params: Params = {};
  let pi = 0;
  let ti = 0;

  while (pi < patternParts.length && ti < pathParts.length) {
    const p = patternParts[pi]!;
    const t = pathParts[ti]!;

    if (p.startsWith("*")) {
      const name = p.slice(1) || "splat";
      const rest = pathParts.slice(ti).join("/");
      params[name] = rest;
      return { params, splat: rest };
    }

    if (p.startsWith(":")) {
      params[p.slice(1)] = decodeURIComponent(t);
      pi++;
      ti++;
      continue;
    }

    if (p !== t) return null;
    pi++;
    ti++;
  }

  // Trailing splat with no remaining path
  if (pi < patternParts.length && patternParts[pi]!.startsWith("*")) {
    const name = patternParts[pi]!.slice(1) || "splat";
    params[name] = "";
    return { params, splat: "" };
  }

  if (pi === patternParts.length && ti === pathParts.length) {
    return { params };
  }

  return null;
}

export function normalizePath(path: string): string {
  if (!path) return "/";
  let p = path.startsWith("/") ? path : `/${path}`;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
}

function split(path: string): string[] {
  const n = normalizePath(path);
  if (n === "/") return [];
  return n.slice(1).split("/");
}

/** Join base + path safely. */
export function joinPaths(base: string, path: string): string {
  if (path.startsWith("/")) return normalizePath(path);
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  return normalizePath(`${b}/${path}`);
}
