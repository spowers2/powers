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
import "./lab.css";

export function LabPage(): HTMLElement {
  const initial =
    typeof location !== "undefined" ? decodeShare(location.hash) : null;

  let current: Recipe =
    (initial?.recipeId && recipeById(initial.recipeId)) || recipes[0]!;
  let source = initial?.code ?? current.code;
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
  const h2 = document.createElement("h2");
  h2.textContent = "Power Lab";
  const blurb = document.createElement("p");
  blurb.className = "lab-sidebar-blurb";
  blurb.textContent =
    "Click a recipe — the Code panel switches to that sample, then the preview re-runs.";
  head.append(h2, blurb);

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

  const autoLabel = document.createElement("label");
  autoLabel.className = "lab-auto";
  const autoInput = document.createElement("input");
  autoInput.type = "checkbox";
  autoInput.checked = true;
  autoLabel.append(autoInput, document.createTextNode(" Auto-run"));

  const runBtn = makeBtn("Run", "lab-btn lab-btn--primary");
  const resetBtn = makeBtn("Reset", "lab-btn");
  const shareBtn = makeBtn("Copy share link", "lab-btn lab-btn--soft");
  const statusEl = document.createElement("span");
  statusEl.className = "lab-status";
  statusEl.textContent = "Ready — pick a recipe or edit the code";

  toolbar.append(titleEl, autoLabel, runBtn, resetBtn, shareBtn, statusEl);

  const tip = document.createElement("p");
  tip.className = "lab-tip";
  const tipStrong = document.createElement("strong");
  tipStrong.textContent = "Tip · ";
  const tipBody = document.createElement("span");
  tipBody.textContent = current.tip;
  tip.append(tipStrong, tipBody);

  const workspace = document.createElement("div");
  workspace.className = "lab-workspace";

  const editorPane = document.createElement("div");
  editorPane.className = "lab-editor-pane";
  const codeLabel = document.createElement("div");
  codeLabel.className = "lab-pane-label";
  codeLabel.textContent = `Code · ${current.title}`;
  const editor = document.createElement("textarea");
  editor.className = "lab-editor";
  editor.spellcheck = false;
  editor.setAttribute("aria-label", "Power Lab code editor");
  editor.value = source;
  editorPane.append(codeLabel, editor);

  const previewPane = document.createElement("div");
  previewPane.className = "lab-preview-pane";
  const previewLabel = document.createElement("div");
  previewLabel.className = "lab-pane-label";
  previewLabel.textContent = "Live preview";
  const iframe = document.createElement("iframe");
  iframe.className = "lab-preview";
  iframe.title = "Power Lab preview";
  iframe.setAttribute(
    "sandbox",
    "allow-scripts allow-same-origin allow-modals",
  );
  previewPane.append(previewLabel, iframe);

  workspace.append(editorPane, previewPane);

  const consoleEl = document.createElement("div");
  consoleEl.className = "lab-console";
  consoleEl.setAttribute("aria-label", "Lab console");

  main.append(toolbar, tip, workspace, consoleEl);
  sidebar.append(head, badge, recipeList);
  root.append(sidebar, main);

  // —— helpers ——
  function setStatus(
    kind: "idle" | "running" | "ok" | "error",
    msg: string,
  ) {
    statusEl.textContent = msg;
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
  }

  function applyChrome(r: Recipe) {
    titleEl.textContent = r.title;
    tipBody.textContent = r.tip;
    codeLabel.textContent = `Code · ${r.title}`;
    syncSidebar();
    editorPane.classList.remove("lab-editor-pane--flash");
    // restart CSS animation
    void editorPane.offsetWidth;
    editorPane.classList.add("lab-editor-pane--flash");
  }

  async function run() {
    if (running) {
      // A run is in flight — cancel it by bumping the token; the in-flight
      // call will exit, then we start a new one below.
    }
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
          // Append one line without rebuilding entire console each log
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
        setStatus("ok", "Running · edit code or pick another recipe");
      } else if (result.error !== "Cancelled") {
        setStatus("error", result.error ?? "Error — see console below");
      }
    } catch (e) {
      if (token !== runToken) return;
      const msg = e instanceof Error ? e.message : String(e);
      setStatus("error", msg);
      paintConsole([{ level: "error", args: [msg] }]);
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
    // Cancel anything in flight
    runToken += 1;
    running = false;
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }

    current = r;
    writeEditor(r.code);
    applyChrome(r);
    setStatus("ok", `Loaded “${r.title}” — code updated`);
    paintConsole([]);
    void run();
  }

  // —— Recipe buttons (direct onclick — most reliable) ——
  for (const r of recipes) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lab-recipe" + (r.id === current.id ? " is-active" : "");
    btn.dataset.recipeId = r.id;
    btn.setAttribute("role", "option");
    btn.setAttribute("aria-label", `Load recipe: ${r.title}`);
    if (r.id === current.id) btn.setAttribute("aria-current", "true");

    const strong = document.createElement("strong");
    strong.textContent = r.title;
    const span = document.createElement("span");
    span.textContent = r.blurb;
    btn.append(strong, span);

    btn.onclick = (ev) => {
      ev.preventDefault();
      loadRecipe(r);
    };

    recipeList.appendChild(btn);
  }

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
    setStatus("ok", `Reset “${current.title}”`);
    void run();
  };

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
    scheduleAutoRun();
  };

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

  // First preview after paint (not during construction)
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
