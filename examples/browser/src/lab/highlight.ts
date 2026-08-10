/**
 * Tiny TSX highlighter for the Lab editor overlay.
 * Not a full parser — good enough for teaching demos.
 */

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const KEYWORDS =
  /\b(import|from|export|const|let|var|function|return|if|else|for|while|of|in|type|interface|as|new|typeof|async|await|true|false|null|undefined|class|extends|default)\b/g;

const BUILTINS =
  /\b(signal|computed|effect|mount|animate|spring|Show|For|component|createTheme|createDensity|createToaster|bindStyle)\b/g;

const COMPONENTS =
  /\b(Button|Card|Stack|Text|Input|Field|Badge|Alert|Dialog|Tabs|Progress|Avatar|Spinner|Switch|Checkbox|Menu|Popover|Tooltip|Skeleton|Divider|Code|Container|Grid|Select|Textarea|Label|Toaster|Kbd)\b/g;

/**
 * Return HTML with span.hl-* tokens. Plain text is escaped first, then
 * high-confidence patterns are re-wrapped.
 */
export function highlightTsx(code: string): string {
  let out = "";
  let i = 0;
  const src = code;

  while (i < src.length) {
    // line comment
    if (src[i] === "/" && src[i + 1] === "/") {
      let j = i;
      while (j < src.length && src[j] !== "\n") j++;
      out += `<span class="hl-c">${esc(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }
    // block comment
    if (src[i] === "/" && src[i + 1] === "*") {
      const end = src.indexOf("*/", i + 2);
      const j = end === -1 ? src.length : end + 2;
      out += `<span class="hl-c">${esc(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }
    // string / template
    if (src[i] === '"' || src[i] === "'" || src[i] === "`") {
      const q = src[i]!;
      let j = i + 1;
      while (j < src.length) {
        if (src[j] === "\\") {
          j += 2;
          continue;
        }
        if (src[j] === q) {
          j++;
          break;
        }
        j++;
      }
      out += `<span class="hl-s">${esc(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    // run of non-special chars
    let j = i;
    while (
      j < src.length &&
      !(
        (src[j] === "/" && (src[j + 1] === "/" || src[j + 1] === "*")) ||
        src[j] === '"' ||
        src[j] === "'" ||
        src[j] === "`"
      )
    ) {
      j++;
    }
    let chunk = esc(src.slice(i, j));
    chunk = chunk.replace(KEYWORDS, '<span class="hl-k">$1</span>');
    chunk = chunk.replace(BUILTINS, '<span class="hl-b">$1</span>');
    chunk = chunk.replace(COMPONENTS, '<span class="hl-t">$1</span>');
    chunk = chunk.replace(
      /\b(\d+(?:\.\d+)?)\b/g,
      '<span class="hl-n">$1</span>',
    );
    // JSX tags (after escape, so &lt;Name)
    chunk = chunk.replace(
      /&lt;(\/?)([A-Za-z][\w.]*)/g,
      '&lt;$1<span class="hl-t">$2</span>',
    );
    out += chunk;
    i = j;
  }

  // Keep trailing newline so overlay height matches textarea
  if (out.endsWith("\n") || code.endsWith("\n")) {
    /* ok */
  } else {
    out += "\n";
  }

  return out || "\n";
}
