/** Join class names, skipping falsy. */
export function cx(
  ...parts: Array<string | false | null | undefined | Record<string, boolean | undefined | null>>
): string {
  const out: string[] = [];
  for (const p of parts) {
    if (!p) continue;
    if (typeof p === "string") {
      out.push(p);
      continue;
    }
    for (const key of Object.keys(p)) {
      if (p[key]) out.push(key);
    }
  }
  return out.join(" ");
}
