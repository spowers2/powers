/**
 * Force every UI primitive to inject its scoped CSS into the parent document,
 * so Lab can clone those sheets into the preview iframe.
 */
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Code,
  Container,
  Dialog,
  Divider,
  Field,
  Grid,
  Input,
  Label,
  Progress,
  Select,
  Skeleton,
  Spinner,
  Stack,
  Switch,
  Tabs,
  Text,
  Textarea,
  Tooltip,
  Popover,
  Menu,
  Kbd,
  Combobox,
  Command,
} from "@power-ui/ui";

let warmed = false;

export function warmUiStyles(): void {
  if (warmed || typeof document === "undefined") return;
  warmed = true;

  const host = document.createElement("div");
  host.hidden = true;
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = "position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;";
  document.body.appendChild(host);

  const append = (node: unknown) => {
    if (node instanceof Node) host.appendChild(node);
  };

  try {
    append(Button({ children: "w" }));
    append(Button({ variant: "soft", children: "w" }));
    append(Button({ variant: "ghost", children: "w" }));
    append(Input({}));
    append(Textarea({}));
    append(
      Select({
        options: [{ value: "a", label: "A" }],
      }),
    );
    append(Label({ children: "L" }));
    append(
      Field({
        label: "F",
        children: Input({}),
      }),
    );
    append(Text({ children: "T" }));
    append(Text({ muted: true, size: "sm", children: "m" }));
    append(Card({ children: "C" }));
    append(Card({ variant: "glass", children: "G" }));
    append(Badge({ children: "B" }));
    append(Alert({ title: "A", children: "body" }));
    append(Divider({}));
    append(Spinner({}));
    append(Progress({ value: 40, label: "P" }));
    append(Skeleton({ lines: 2 }));
    append(Avatar({ name: "PU" }));
    append(
      Switch({
        label: "S",
        checked: false,
        onChange: () => {},
      }),
    );
    append(
      Checkbox({
        label: "C",
        checked: false,
        onChange: () => {},
      }),
    );
    append(
      Stack({
        gap: 2,
        children: Text({ children: "s" }),
      }),
    );
    append(Container({ children: "c" }));
    append(Grid({ children: "g" }));
    append(Code({ children: "code" }));
    append(
      Tabs({
        items: [{ id: "a", label: "A", content: "panel" }],
      }),
    );
    append(
      Dialog({
        open: false,
        title: "D",
        children: "x",
      }),
    );
    append(
      Tooltip({
        content: "tip",
        children: Button({ children: "?" }),
      }),
    );
    append(
      Popover({
        open: false,
        trigger: Button({ children: "P" }),
        children: "panel",
      }),
    );
    append(
      Menu({
        trigger: Button({ children: "M" }),
        items: [{ id: "a", label: "A" }],
      }),
    );
    append(Kbd({ children: "⌘" }));
    append(
      Combobox({
        options: [{ value: "a", label: "A" }],
        value: "a",
      }),
    );
    append(
      Command({
        open: false,
        items: [{ id: "x", label: "X" }],
      }),
    );
  } catch {
    // Warm is best-effort — missing a sheet is non-fatal
  } finally {
    host.remove();
  }
}

/** Copy theme tokens + every pu-* component sheet into the Lab iframe document. */
export function injectDesignSystemInto(
  iframeDoc: Document,
  themeCss: string,
): void {
  warmUiStyles();

  // Theme (tokens + base + utilities)
  let themeEl = iframeDoc.getElementById("pu-lab-theme") as HTMLStyleElement | null;
  if (!themeEl) {
    themeEl = iframeDoc.createElement("style");
    themeEl.id = "pu-lab-theme";
    iframeDoc.head.appendChild(themeEl);
  }
  themeEl.textContent = themeCss;

  // Component-injected sheets
  for (const style of document.querySelectorAll<HTMLStyleElement>(
    "style[data-pu-ui]",
  )) {
    const key = style.getAttribute("data-pu-ui");
    if (!key) continue;
    if (iframeDoc.querySelector(`style[data-pu-ui="${key}"]`)) continue;
    const clone = iframeDoc.createElement("style");
    clone.setAttribute("data-pu-ui", key);
    clone.textContent = style.textContent ?? "";
    iframeDoc.head.appendChild(clone);
  }

  // Match host theme / density
  const theme =
    document.documentElement.getAttribute("data-pu-theme") || "light";
  iframeDoc.documentElement.setAttribute("data-pu-theme", theme);
  const density = document.documentElement.getAttribute("data-pu-density");
  if (density) {
    iframeDoc.documentElement.setAttribute("data-pu-density", density);
  } else {
    iframeDoc.documentElement.removeAttribute("data-pu-density");
  }
}
