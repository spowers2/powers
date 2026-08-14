/**
 * Power Lab — interactive learning playground.
 * Click a recipe → Code panel + tip + title update → preview re-runs.
 *
 * Fully imperative DOM (no JSX) so selection/handlers cannot get lost.
 */
import { recipes, recipeById, type Recipe } from "./recipes.js";
import {
  runInFrame,
  encodeShare,
  decodeShare,
  type LabLog,
} from "./runner.js";
import { highlightTsx } from "./highlight.js";
import "./lab.css";

function recipeFromUrl(): Recipe | undefined {
  if (typeof location === "undefined") return undefined;
  // /lab?recipe=ui  or  #recipe=ui
  const q = new URLSearchParams(location.search).get("recipe");
  if (q && recipeById(q)) return recipeById(q);
  const m = location.hash.match(/(?:^|#|&)recipe=([\w-]+)/);
  if (m?.[1] && recipeById(m[1])) return recipeById(m[1]);
  return undefined;
}

export function LabPage(): HTMLElement {
  const initial =
    typeof location !== "undefined" ? decodeShare(location.hash) : null;

  const fromQuery = recipeFromUrl();
  // Share hash (Copy → Open Lab) wins over ?recipe= so System snippets load intact
  let current: Recipe =
    (initial?.recipeId && recipeById(initial.recipeId)) ||
    fromQuery ||
    recipes[0]!;
  let source = initial?.code ?? fromQuery?.code ?? current.code;
  let autoRun = true;
  let runToken = 0;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let running = false;

  // —— DOM ——
  const root = document.createElement("div");
  root.className = "lab";

  const sidebar = document.createElement("aside");
  sidebar.className = "lab-sidebar";

  const head = document.createElement("div");
  head.className = "lab-sidebar-head";

  const brand = document.createElement("div");
  brand.className = "lab-sidebar-brand";
  const mark = document.createElement("span");
  mark.className = "lab-sidebar-mark";
  mark.setAttribute("aria-hidden", "true");
  const h2 = document.createElement("h2");
  h2.textContent = "Power Lab";
  brand.append(mark, h2);

  const blurb = document.createElement("p");
  blurb.className = "lab-sidebar-blurb";
  blurb.textContent =
    "Start at 01 and work down. Each card loads code + a short lesson. Edit freely — the preview re-runs as you type.";
  head.append(brand, blurb);

  const badge = document.createElement("div");
  badge.className = "lab-count-badge";
  badge.textContent = `${recipes.length} recipes`;

  const recipeList = document.createElement("div");
  recipeList.className = "lab-recipe-list";
  recipeList.setAttribute("role", "listbox");
  recipeList.setAttribute("aria-label", "Recipes");

  const main = document.createElement("div");
  main.className = "lab-main";

  const toolbar = document.createElement("div");
  toolbar.className = "lab-toolbar";

  const titleEl = document.createElement("span");
  titleEl.className = "lab-toolbar-title";
  titleEl.textContent = current.title;

  const actions = document.createElement("div");
  actions.className = "lab-toolbar-actions";

  const autoLabel = document.createElement("label");
  autoLabel.className = "lab-auto";
  const autoInput = document.createElement("input");
  autoInput.type = "checkbox";
  autoInput.checked = true;
  autoLabel.append(autoInput, document.createTextNode(" Auto-run"));

  const runBtn = makeBtn("Run", "lab-btn lab-btn--primary");
  const resetBtn = makeBtn("Reset", "lab-btn");
  const scaffoldBtn = makeBtn("Scaffold", "lab-btn");
  scaffoldBtn.title =
    "Wrap selection (or insert) a full App + mount program Lab can run";
  const shareBtn = makeBtn("Share", "lab-btn lab-btn--soft");
  const statusEl = document.createElement("span");
  statusEl.className = "lab-status";
  statusEl.textContent = "Ready — pick a recipe or edit the code";

  actions.append(autoLabel, runBtn, resetBtn, scaffoldBtn, shareBtn, statusEl);
  toolbar.append(titleEl, actions);

  // Teaching panel (goal · learn · how · try this)
  const teach = document.createElement("aside");
  teach.className = "lab-teach";
  teach.setAttribute("aria-label", "Lesson for this recipe");

  const workspace = document.createElement("div");
  workspace.className = "lab-workspace";

  const editorPane = document.createElement("div");
  editorPane.className = "lab-editor-pane";
  const codeLabel = document.createElement("div");
  codeLabel.className = "lab-pane-label";
  const codeLabelText = document.createElement("span");
  codeLabelText.textContent = `Code · ${current.title}`;
  const codeHint = document.createElement("span");
  codeHint.className = "lab-pane-hint";
  codeHint.textContent = "full App+mount · Tab · ⌘↵";
  codeLabel.append(codeLabelText, codeHint);

  // Syntax highlight: colored pre under a transparent textarea
  const editorWrap = document.createElement("div");
  editorWrap.className = "lab-editor-wrap";
  const highlight = document.createElement("pre");
  highlight.className = "lab-highlight";
  highlight.setAttribute("aria-hidden", "true");
  const highlightCode = document.createElement("code");
  highlight.appendChild(highlightCode);

  const editor = document.createElement("textarea");
  editor.className = "lab-editor";
  editor.spellcheck = false;
  editor.setAttribute("aria-label", "Power Lab code editor");
  editor.value = source;
  editorWrap.append(highlight, editor);

  const meta = document.createElement("div");
  meta.className = "lab-editor-meta";
  const lineCount = () => source.split("\n").length;
  const paintHighlight = () => {
    highlightCode.innerHTML = highlightTsx(source);
  };
  const updateMeta = () => {
    meta.textContent = `${lineCount()} lines · ${source.length} chars · highlight on`;
  };
  const syncEditorScroll = () => {
    highlight.scrollTop = editor.scrollTop;
    highlight.scrollLeft = editor.scrollLeft;
  };
  paintHighlight();
  updateMeta();
  editorPane.append(codeLabel, editorWrap, meta);

  const previewPane = document.createElement("div");
  previewPane.className = "lab-preview-pane";
  const previewLabel = document.createElement("div");
  previewLabel.className = "lab-pane-label";
  const previewLabelText = document.createElement("span");
  previewLabelText.textContent = "Live preview";
  const previewHint = document.createElement("span");
  previewHint.className = "lab-pane-hint";
  previewHint.textContent = "sandboxed";
  previewLabel.append(previewLabelText, previewHint);

  const previewStage = document.createElement("div");
  previewStage.className = "lab-preview-stage";

  const iframe = document.createElement("iframe");
  iframe.className = "lab-preview";
  iframe.title = "Power Lab preview";
  iframe.setAttribute(
    "sandbox",
    "allow-scripts allow-same-origin allow-modals",
  );

  // Full-panel error overlay (compile / runtime) — clearer than status alone
  const errOverlay = document.createElement("div");
  errOverlay.className = "lab-error-overlay";
  errOverlay.hidden = true;
  errOverlay.setAttribute("role", "alert");
  const errTitle = document.createElement("strong");
  errTitle.className = "lab-error-overlay__title";
  errTitle.textContent = "Couldn’t run this code";
  const errMsg = document.createElement("pre");
  errMsg.className = "lab-error-overlay__msg";
  const errActions = document.createElement("div");
  errActions.className = "lab-error-overlay__actions";
  const errReset = makeBtn("Reset recipe", "lab-btn lab-btn--primary");
  const errDismiss = makeBtn("Dismiss", "lab-btn");
  errActions.append(errReset, errDismiss);
  errOverlay.append(errTitle, errMsg, errActions);

  previewStage.append(iframe, errOverlay);
  previewPane.append(previewLabel, previewStage);

  function humanizeLabError(message: string): string {
    const tips: string[] = [];
    const src = source;
    const looksTransform = /Transform failed|Expected "|Expected ';'|ERROR:/i.test(
      message,
    );
    if (!/\bmount\s*\(/.test(src)) {
      tips.push(
        "Lab needs mount(document.getElementById(\"root\")!, () => <App />).",
      );
    }
    if (!/\bfunction\s+App\b|\bconst\s+App\b/.test(src) && looksTransform) {
      tips.push(
        "Prefer export function App() { return (…JSX…); } — bare JSX fragments fail to parse.",
      );
    }
    if (looksTransform && /open|show|value/.test(message)) {
      tips.push(
        "If you pasted from System: use Copy JSX (includes App+mount) or click Scaffold after pasting the middle.",
      );
    }
    if (tips.length === 0) return message;
    return `${message}\n\n——\n${tips.map((t) => `• ${t}`).join("\n")}`;
  }

  function showErrorOverlay(message: string) {
    errMsg.textContent = humanizeLabError(message);
    errOverlay.hidden = false;
    previewStage.classList.add("has-error");
  }
  function hideErrorOverlay() {
    errOverlay.hidden = true;
    errMsg.textContent = "";
    previewStage.classList.remove("has-error");
  }

  /** Wrap body JSX (or whole buffer) into a Lab-runnable program. */
  function insertScaffold() {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selected =
      start !== end ? source.slice(start, end).trim() : source.trim();

    // If already a full program, don't clobber
    if (/\bmount\s*\(/.test(selected) && /\bfunction\s+App\b/.test(selected)) {
      setStatus("ok", "Already looks like a full Lab program — press Run");
      return;
    }

    // Extract a simple JSX root if user pasted a fragment
    let body = selected;
    // Strip imports — Lab injects the API
    body = body
      .replace(/^\s*import\s+[\s\S]*?;?\s*$/gm, "")
      .trim();

    // If they only had signals/setup + fragment, try to keep setup outside App
    let setup = "";
    const setupMatch = body.match(
      /^((?:const|let|var|function)[\s\S]*?)(<[\s\S]*)$/,
    );
    if (setupMatch) {
      setup = setupMatch[1]!.trim();
      body = setupMatch[2]!.trim();
    }

    // Drop wrapping <>...</> if present
    if (body.startsWith("<>") && body.endsWith("</>")) {
      body = body.slice(2, -3).trim();
    }

    if (!body) {
      body = `<Text>Hello from scaffold</Text>`;
    }

    const indent = (s: string, n: number) =>
      s
        .split("\n")
        .map((l) => (l ? " ".repeat(n) + l : l))
        .join("\n");

    const program = `import { signal } from "@power-ux/core";
import { mount } from "@power-ux/dom";
import { Button, Card, Stack, Text } from "@power-ux/ui";

${setup ? setup + "\n\n" : ""}export function App() {
  return (
${indent(body, 4)}
  );
}

mount(document.getElementById("root")!, () => <App />);
`;
    writeEditor(program);
    hideErrorOverlay();
    setStatus("ok", "Scaffold inserted — full App + mount. Running…");
    void run();
  }

  workspace.append(editorPane, previewPane);

  const consoleWrap = document.createElement("div");
  consoleWrap.className = "lab-console-wrap";
  const consoleHead = document.createElement("div");
  consoleHead.className = "lab-console-head";
  consoleHead.innerHTML = "<span>Console</span><span>stdout · errors</span>";
  const consoleEl = document.createElement("div");
  consoleEl.className = "lab-console";
  consoleEl.setAttribute("aria-label", "Lab console");
  consoleWrap.append(consoleHead, consoleEl);

  main.append(toolbar, teach, workspace, consoleWrap);
  sidebar.append(head, badge, recipeList);
  root.append(sidebar, main);

  // —— helpers ——
  function setStatus(
    kind: "idle" | "running" | "ok" | "error",
    msg: string,
  ) {
    statusEl.textContent = msg;
    statusEl.title = msg;
    statusEl.className =
      "lab-status" +
      (kind === "ok" ? " is-ok" : "") +
      (kind === "error" ? " is-err" : "") +
      (kind === "running" ? " is-run" : "");
  }

  function paintConsole(lines: LabLog[]) {
    consoleEl.replaceChildren();
    for (const line of lines) {
      const p = document.createElement("p");
      p.className = "lab-console-line";
      if (line.level === "error") p.classList.add("is-error");
      if (line.level === "warn") p.classList.add("is-warn");
      p.textContent = `[${line.level}] ${line.args.join(" ")}`;
      consoleEl.appendChild(p);
    }
  }

  function syncSidebar() {
    for (const btn of recipeList.querySelectorAll<HTMLButtonElement>(
      ".lab-recipe",
    )) {
      const on = btn.dataset.recipeId === current.id;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-current", on ? "true" : "false");
    }
  }

  function writeEditor(next: string) {
    source = next;
    editor.value = next;
    try {
      editor.setSelectionRange(0, 0);
    } catch {
      /* ignore */
    }
    editor.scrollTop = 0;
    highlight.scrollTop = 0;
    highlight.scrollLeft = 0;
    paintHighlight();
    updateMeta();
  }

  function paintTeach(r: Recipe) {
    teach.replaceChildren();

    const goal = document.createElement("div");
    goal.className = "lab-teach__goal";
    const goalLabel = document.createElement("span");
    goalLabel.className = "lab-teach__kicker";
    goalLabel.textContent = "Goal";
    const goalText = document.createElement("p");
    goalText.textContent = r.goal;
    goal.append(goalLabel, goalText);

    const cols = document.createElement("div");
    cols.className = "lab-teach__cols";

    const col = (title: string, items: string[], mod: string) => {
      const box = document.createElement("div");
      box.className = `lab-teach__col lab-teach__col--${mod}`;
      const h = document.createElement("h3");
      h.textContent = title;
      const ul = document.createElement("ul");
      for (const item of items) {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
      }
      box.append(h, ul);
      return box;
    };

    cols.append(
      col("What you'll learn", r.learn, "learn"),
      col("How it works", r.how, "how"),
      col("Try this", r.tryThis, "try"),
    );

    teach.append(goal, cols);
  }

  function applyChrome(r: Recipe) {
    titleEl.textContent = r.title;
    codeLabelText.textContent = `Code · ${r.title}`;
    paintTeach(r);
    syncSidebar();
    editorPane.classList.remove("lab-editor-pane--flash");
    void editorPane.offsetWidth;
    editorPane.classList.add("lab-editor-pane--flash");
  }

  async function run() {
    const token = ++runToken;
    running = true;
    setStatus("running", "Compiling…");
    paintConsole([]);

    try {
      const result = await runInFrame(
        iframe,
        source,
        (log) => {
          if (token !== runToken) return;
          const p = document.createElement("p");
          p.className = "lab-console-line";
          if (log.level === "error") p.classList.add("is-error");
          if (log.level === "warn") p.classList.add("is-warn");
          p.textContent = `[${log.level}] ${log.args.join(" ")}`;
          consoleEl.appendChild(p);
        },
        token,
        () => runToken,
      );

      if (token !== runToken) return;

      if (result.ok) {
        hideErrorOverlay();
        setStatus("ok", "Running · edit code or pick another recipe");
      } else if (result.error !== "Cancelled") {
        const msg = result.error ?? "Error — see console below";
        setStatus("error", msg);
        showErrorOverlay(msg);
      }
    } catch (e) {
      if (token !== runToken) return;
      const msg = e instanceof Error ? e.message : String(e);
      setStatus("error", msg);
      paintConsole([{ level: "error", args: [msg] }]);
      showErrorOverlay(msg);
    } finally {
      if (token === runToken) running = false;
    }
  }

  function scheduleAutoRun() {
    if (!autoRun) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      void run();
    }, 500);
  }

  function loadRecipe(r: Recipe) {
    runToken += 1;
    running = false;
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }

    current = r;
    writeEditor(r.code);
    applyChrome(r);
    hideErrorOverlay();
    setStatus("ok", `Loaded “${r.title}” — code updated`);
    paintConsole([]);
    // Recipe switch clears share payload so starter code wins over old #lab/…
    try {
      const url = new URL(location.href);
      url.searchParams.set("recipe", r.id);
      url.hash = "";
      history.replaceState(null, "", url.pathname + url.search);
    } catch {
      /* ignore */
    }
    void run();
  }

  // —— Recipe buttons ——
  recipes.forEach((r, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lab-recipe" + (r.id === current.id ? " is-active" : "");
    btn.dataset.recipeId = r.id;
    btn.setAttribute("role", "option");
    btn.setAttribute("aria-label", `Load recipe: ${r.title}`);
    if (r.id === current.id) btn.setAttribute("aria-current", "true");

    const idx = document.createElement("span");
    idx.className = "lab-recipe__idx";
    idx.textContent = String(i + 1).padStart(2, "0");

    const body = document.createElement("div");
    body.className = "lab-recipe__body";
    const strong = document.createElement("strong");
    strong.textContent = r.title;
    const span = document.createElement("span");
    span.textContent = r.blurb;
    body.append(strong, span);

    btn.append(idx, body);
    btn.onclick = (ev) => {
      ev.preventDefault();
      loadRecipe(r);
    };
    recipeList.appendChild(btn);
  });

  // —— Controls ——
  autoInput.onchange = () => {
    autoRun = autoInput.checked;
    if (autoRun) scheduleAutoRun();
  };

  runBtn.onclick = () => {
    void run();
  };

  resetBtn.onclick = () => {
    writeEditor(current.code);
    hideErrorOverlay();
    setStatus("ok", `Reset “${current.title}” to recipe starter`);
    void run();
  };

  scaffoldBtn.onclick = () => insertScaffold();

  errReset.onclick = () => {
    writeEditor(current.code);
    hideErrorOverlay();
    setStatus("ok", `Reset “${current.title}”`);
    void run();
  };
  errDismiss.onclick = () => hideErrorOverlay();

  // Extra action on error overlay: scaffold current buffer
  const errScaffold = makeBtn("Scaffold + run", "lab-btn lab-btn--soft");
  errScaffold.onclick = () => insertScaffold();
  errActions.append(errScaffold);

  shareBtn.onclick = () => {
    const hash = "lab/" + encodeShare(source, current.id);
    const path = `${location.pathname}${location.search}#${hash}`;
    history.replaceState(null, "", path);
    const url = `${location.origin}${path}`;
    void navigator.clipboard?.writeText(url).then(
      () => setStatus("ok", "Share link copied"),
      () => setStatus("ok", "Copy failed — URL is in the address bar"),
    );
  };

  editor.oninput = () => {
    source = editor.value;
    paintHighlight();
    updateMeta();
    scheduleAutoRun();
  };
  editor.onscroll = () => syncEditorScroll();

  editor.onkeydown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      void run();
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const v = editor.value;
      editor.value = `${v.slice(0, start)}  ${v.slice(end)}`;
      editor.selectionStart = editor.selectionEnd = start + 2;
      source = editor.value;
    }
  };

  applyChrome(current);
  writeEditor(source);

  requestAnimationFrame(() => {
    void run();
  });

  return root;
}

function makeBtn(label: string, className: string): HTMLButtonElement {
  const b = document.createElement("button");
  b.type = "button";
  b.className = className;
  b.textContent = label;
  return b;
}
