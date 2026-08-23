/**
 * Force every UI primitive to inject its scoped CSS into the parent document,
 * so Lab can clone those sheets into the preview iframe.
 */
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Chip,
  Code,
  Container,
  Dialog,
  Divider,
  Drawer,
  Empty,
  Field,
  Grid,
  Input,
  Kbd,
  Label,
  List,
  Menu,
  NumberInput,
  Pagination,
  Popover,
  Progress,
  RadioGroup,
  ScrollArea,
  Select,
  Skeleton,
  Slider,
  Spinner,
  Stack,
  Stat,
  Steps,
  Switch,
  Table,
  Tabs,
  Text,
  Textarea,
  Timeline,
  ToggleGroup,
  Tooltip,
  Combobox,
  Command,
  Transition,
  Collapse,
  AspectRatio,
  Link,
} from "@lab206/ui";

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
    append(
      Accordion({
        items: [{ id: "a", title: "A", content: "b" }],
      }),
    );
    append(
      Drawer({
        open: false,
        title: "D",
        children: "x",
      }),
    );
    append(
      Breadcrumb({
        items: [{ id: "h", label: "Home" }],
      }),
    );
    append(Pagination({ page: 1, pageCount: 3 }));
    append(
      RadioGroup({
        options: [{ value: "a", label: "A" }],
        value: "a",
      }),
    );
    append(Slider({ value: 40 }));
    append(NumberInput({ value: 1 }));
    append(
      ToggleGroup({
        options: [{ value: "a", label: "A" }],
        value: "a",
      }),
    );
    append(
      List({
        items: [{ id: "a", label: "A" }],
      }),
    );
    append(
      Table({
        columns: [{ key: "n", header: "N" }],
        rows: [{ n: "1" }],
      }),
    );
    append(Empty({ title: "E" }));
    append(Stat({ label: "S", value: "1" }));
    append(
      Steps({
        current: 0,
        steps: [{ id: "s", label: "S" }],
      }),
    );
    append(
      Timeline({
        items: [{ id: "t", title: "T" }],
      }),
    );
    append(Chip({ children: "c" }));
    append(ScrollArea({ maxHeight: "2rem", children: "s" }));
    append(Collapse({ open: false, children: "c" }));
    append(Transition({ show: false, children: "t" }));
    append(AspectRatio({ children: "a" }));
    append(Link({ href: "#", children: "L" }));
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
