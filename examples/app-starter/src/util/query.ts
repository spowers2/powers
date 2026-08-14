/** Parse `?a=1&b=2` (or full search string) into a plain map. */
export function parseQuery(search: string): Record<string, string> {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  const out: Record<string, string> = {};
  if (!raw) return out;
  for (const part of raw.split("&")) {
    if (!part) continue;
    const eq = part.indexOf("=");
    const k = eq >= 0 ? part.slice(0, eq) : part;
    const v = eq >= 0 ? part.slice(eq + 1) : "";
    try {
      out[decodeURIComponent(k)] = decodeURIComponent(v);
    } catch {
      out[k] = v;
    }
  }
  return out;
}

export function queryParam(
  search: string,
  key: string,
  fallback = "",
): string {
  return parseQuery(search)[key] ?? fallback;
}
