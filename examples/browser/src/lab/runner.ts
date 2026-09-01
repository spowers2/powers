import esbuild from "esbuild-wasm";
import wasmUrl from "esbuild-wasm/esbuild.wasm?url";
// Full design system CSS for the Lab iframe (tokens + base + utilities)
import themeCss from "@lab206/ui/theme.css?inline";
import { createLabApi, LAB_API_KEYS, type PowerLabApi } from "./api.js";
import { injectDesignSystemInto } from "./warmStyles.js";

let esbuildReady: Promise<void> | null = null;

async function ensureEsbuild() {
  if (!esbuildReady) {
    esbuildReady = esbuild.initialize({
      wasmURL: wasmUrl,
      worker: false,
    });
  }
  await esbuildReady;
}

export interface RunResult {
  ok: boolean;
  logs: LabLog[];
  error?: string;
}

export type LabLog = {
  level: "log" | "warn" | "error" | "info";
  args: string[];
};

function stripImports(code: string): string {
  return code
    .replace(/^\s*import\s+type\s+[\s\S]*?;?\s*$/gm, "")
    .replace(/^\s*import\s+[\s\S]*?from\s+["'][^"']+["']\s*;?\s*$/gm, "")
    .replace(/^\s*import\s+["'][^"']+["']\s*;?\s*$/gm, "")
    .replace(/^\s*export\s+\{[^}]*\}\s*;?\s*$/gm, "");
}

function rewriteExports(code: string): string {
  return code
    .replace(/export\s+default\s+function\s+/g, "function ")
    .replace(/export\s+default\s+/g, "")
    .replace(/export\s+async\s+function\s+/g, "async function ")
    .replace(/export\s+function\s+/g, "function ")
    .replace(/export\s+const\s+/g, "const ")
    .replace(/export\s+let\s+/g, "let ")
    .replace(/export\s+class\s+/g, "class ");
}

export async function compileLabCode(source: string): Promise<string> {
  await ensureEsbuild();
  const stripped = rewriteExports(stripImports(source));
  const result = await esbuild.transform(stripped, {
    loader: "tsx",
    jsx: "transform",
    jsxFactory: "h",
    jsxFragment: "Fragment",
    target: "es2022",
  });
  return result.code;
}

/**
 * Compile + execute user code inside a sandboxed iframe.
 * Live Powers modules are injected from the parent (same-origin srcdoc).
 *
 * `runId` + `getLatestRunId` cancel stale runs when the user switches recipes fast.
 */
export async function runInFrame(
  iframe: HTMLIFrameElement,
  source: string,
  onLog: (log: LabLog) => void,
  runId = 0,
  getLatestRunId: () => number = () => runId,
): Promise<RunResult> {
  const isStale = () => getLatestRunId() !== runId;

  const logs: LabLog[] = [];
  const push = (level: LabLog["level"], args: unknown[]) => {
    if (isStale()) return;
    const entry = {
      level,
      args: args.map((a) => {
        try {
          if (typeof a === "string") return a;
          if (a instanceof Error) return `${a.name}: ${a.message}`;
          return JSON.stringify(a);
        } catch {
          return String(a);
        }
      }),
    };
    logs.push(entry);
    onLog(entry);
  };

  let compiled: string;
  try {
    compiled = await compileLabCode(source);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    push("error", [msg]);
    return { ok: false, logs, error: msg };
  }

  if (isStale()) {
    return { ok: false, logs, error: "Cancelled" };
  }

  const api = createLabApi();
  const keys = LAB_API_KEYS.filter((k) => k in (api as Record<string, unknown>));

  const srcdoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style id="pu-lab-theme"></style>
  <style>
    /* Lab shell — tokens come from injected theme */
    html, body {
      margin: 0;
      min-height: 100%;
      background: var(--pu-color-bg, #f3f4f6);
      color: var(--pu-color-text, #13171d);
      font-family: var(--pu-font-sans, system-ui, sans-serif);
    }
    #root {
      min-height: 100%;
      box-sizing: border-box;
      padding: var(--pu-space-5, 1.25rem);
    }
    * { box-sizing: border-box; }
    button, input, select, textarea { font: inherit; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    window.__POWER_RUN__ = null;
    window.addEventListener("message", function (ev) {
      if (!ev.data || ev.data.type !== "power-lab-run") return;
      try {
        window.__POWER_RUN__(ev.data.code);
        parent.postMessage({ type: "power-lab-ok" }, "*");
      } catch (err) {
        parent.postMessage({
          type: "power-lab-error",
          message: err && err.message ? err.message : String(err),
          stack: err && err.stack ? String(err.stack) : ""
        }, "*");
      }
    });
    window.__POWER_BOOT__ = function (labApi) {
      var names = ${JSON.stringify(keys)};
      window.__POWER_RUN__ = function (code) {
        var root = document.getElementById("root");
        while (root.firstChild) root.removeChild(root.firstChild);
        // First arg must NOT be named "api" — Data recipes use const api = createApiClient(...)
        var fn = new Function(
          "__lab", "console", "document", "window",
          names.join(","),
          code + "\\n;" +
          "if (typeof App === 'function') {" +
          "  var r = document.getElementById('root');" +
          "  if (r && r.childNodes.length === 0) {" +
          "    __lab.mount(r, function () { return App(); });" +
          "  }" +
          "}"
        );
        var args = names.map(function (n) { return labApi[n]; });
        var labConsole = {
          log: function(){ parent.postMessage({ type: "power-lab-log", level: "log", args: [].slice.call(arguments).map(String) }, "*"); },
          info: function(){ parent.postMessage({ type: "power-lab-log", level: "info", args: [].slice.call(arguments).map(String) }, "*"); },
          warn: function(){ parent.postMessage({ type: "power-lab-log", level: "warn", args: [].slice.call(arguments).map(String) }, "*"); },
          error: function(){ parent.postMessage({ type: "power-lab-log", level: "error", args: [].slice.call(arguments).map(String) }, "*"); }
        };
        fn.apply(null, [labApi, labConsole, document, window].concat(args));
      };
      parent.postMessage({ type: "power-lab-ready" }, "*");
    };
  </script>
</body>
</html>`;

  return await new Promise<RunResult>((resolve) => {
    let settled = false;
    const finish = (r: RunResult) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      window.removeEventListener("message", onMessage);
      // Only clear onload if we still own this generation
      if (!isStale()) {
        iframe.onload = null;
      }
      resolve(r);
    };

    const onMessage = (ev: MessageEvent) => {
      if (isStale()) return;
      if (ev.source !== iframe.contentWindow) return;
      const data = ev.data as {
        type?: string;
        message?: string;
        level?: LabLog["level"];
        args?: string[];
      };
      if (!data || typeof data !== "object") return;

      if (data.type === "power-lab-ready") {
        if (isStale()) return;
        iframe.contentWindow?.postMessage(
          { type: "power-lab-run", code: compiled },
          "*",
        );
      } else if (data.type === "power-lab-ok") {
        finish({ ok: true, logs });
      } else if (data.type === "power-lab-error") {
        const msg = String(data.message || "Runtime error");
        push("error", [msg]);
        finish({ ok: false, logs, error: msg });
      } else if (data.type === "power-lab-log") {
        push(data.level || "log", data.args || []);
      }
    };

    window.addEventListener("message", onMessage);

    // Tag this load so a superseded onload cannot boot the wrong generation
    const bootTag = String(runId);
    iframe.dataset.labRun = bootTag;

    iframe.onload = () => {
      if (iframe.dataset.labRun !== bootTag || isStale()) {
        finish({ ok: false, logs, error: "Cancelled" });
        return;
      }
      try {
        const doc = iframe.contentDocument;
        if (doc) {
          // Design tokens + primitive CSS must live inside the iframe
          injectDesignSystemInto(doc, themeCss);
        }
        const w = iframe.contentWindow as (Window & {
          __POWER_BOOT__?: (api: PowerLabApi) => void;
        }) | null;
        if (!w?.__POWER_BOOT__) {
          finish({ ok: false, logs, error: "Preview frame failed to boot" });
          return;
        }
        w.__POWER_BOOT__(api);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        push("error", [msg]);
        finish({ ok: false, logs, error: msg });
      }
    };

    // Assigning srcdoc reloads the frame for a clean sandbox each run
    iframe.srcdoc = srcdoc;

    const timeoutId = window.setTimeout(() => {
      if (isStale()) {
        finish({ ok: false, logs, error: "Cancelled" });
        return;
      }
      finish({
        ok: false,
        logs,
        error:
          "Preview timed out — check for infinite loops or a missing mount()",
      });
    }, 10000);
  });
}

export function encodeShare(code: string, recipeId?: string): string {
  const payload = JSON.stringify({ c: code, r: recipeId ?? null });
  return btoa(unescape(encodeURIComponent(payload)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeShare(
  hash: string,
): { code: string; recipeId?: string } | null {
  try {
    let raw = hash.replace(/^#/, "");
    if (raw.startsWith("lab/")) raw = raw.slice(4);
    if (!raw) return null;
    const b64 = raw.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
    const json = decodeURIComponent(escape(atob(b64 + pad)));
    const data = JSON.parse(json) as { c?: string; r?: string | null };
    if (!data.c) return null;
    return {
      code: data.c,
      ...(data.r ? { recipeId: data.r } : {}),
    };
  } catch {
    return null;
  }
}
