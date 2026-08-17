/**
 * Living design-system explorer — sections for tokens, type, forms, layout.
 */
import { signal } from "@powers/core";
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
  Combobox,
  Container,
  createToaster,
  Dialog,
  Divider,
  Drawer,
  Empty,
  Field,
  Grid,
  Input,
  Kbd,
  List,
  Menu,
  NumberInput,
  Pagination,
  Popover,
  Progress,
  RadioGroup,
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
  Toaster,
  Tooltip,
  type DensityController,
  type ThemeController,
} from "@powers/ui";
import { createSectionNav, tocActiveClass } from "./scrollNav.js";
import { DemoHead, SNIPPETS } from "./sysDemo.js";

const SYS_SECTIONS = [
  "sys-play",
  "sys-controls",
  "sys-type",
  "sys-forms",
  "sys-feedback",
  "sys-overlay",
  "sys-power",
  "sys-layout",
  "sys-keys",
  "sys-color",
  "sys-space",
  "sys-code",
] as const;

const ACCENT_PRESETS = [
  { id: "navy", label: "Deep Navy", value: "#0a2744" },
  { id: "signal", label: "Signal Green", value: "#69be28" },
  { id: "holo", label: "Holo Cyan", value: "#06b6d4" },
  { id: "metal", label: "Soft Metal", value: "#9aa3b2" },
  { id: "ember", label: "Hearth Ember", value: "#c45c26" },
] as const;

function Swatch(props: { name: string; css: string }) {
  const el = document.createElement("div");
  el.className = "token-swatch";
  el.style.background = props.css;
  return (
    <div class="token-row">
      <span class="token-name">{props.name}</span>
      {el}
    </div>
  );
}

function SpaceBar(props: { name: string; token: string }) {
  const bar = document.createElement("div");
  bar.className = "space-bar";
  bar.style.width = `var(${props.token})`;
  return (
    <div class="token-row">
      <span class="token-name">
        {props.name} · {props.token}
      </span>
      {bar}
    </div>
  );
}

export function SystemPage(props: {
  theme: ThemeController;
  density: DensityController;
}) {
  const { theme, density } = props;
  const on = signal(true);
  const check = signal(false);
  const note = signal("");
  const email = signal("");
  const dialogOpen = signal(false);
  const progress = signal(42);
  const toaster = createToaster();
  const popoverOpen = signal(false);
  const menuPick = signal("—");
  const city = signal("sf");
  const cityLoading = signal(false);
  const cityOptions = signal([
    { value: "sf", label: "San Francisco" },
    { value: "nyc", label: "New York" },
    { value: "ldn", label: "London" },
    { value: "tyo", label: "Tokyo" },
    { value: "ber", label: "Berlin" },
  ]);
  const drawerOpen = signal(false);
  const radioPlan = signal("pro");
  const sliderVal = signal(48);
  const qty = signal(2);
  const page = signal(1);
  const view = signal("list");
  const listPick = signal("alpha");
  const step = signal(1);
  const emailTouched = signal(false);
  const emailError = () => {
    if (!emailTouched()) return "";
    const v = email().trim();
    if (!v) return "";
    return v.includes("@") ? "" : "Invalid email";
  };
  const accentPick = signal<string>(ACCENT_PRESETS[0]!.value);
  const radiusPick = signal("0.75rem");
  const exported = signal("");

  const applyBrand = () => {
    const root = document.documentElement;
    root.style.setProperty("--pu-color-accent", accentPick());
    root.style.setProperty(
      "--pu-color-accent-hover",
      `color-mix(in srgb, ${accentPick()} 88%, #000)`,
    );
    root.style.setProperty("--pu-radius-md", radiusPick());
    root.style.setProperty("--pu-radius-lg", `calc(${radiusPick()} + 0.25rem)`);
  };

  const exportBrandCss = () => {
    const css = `/* Powers brand export — paste after theme.css */
:root {
  --pu-color-accent: ${accentPick()};
  --pu-color-accent-hover: color-mix(in srgb, ${accentPick()} 88%, #000);
  --pu-radius-md: ${radiusPick()};
  --pu-radius-lg: calc(${radiusPick()} + 0.25rem);
}
`;
    exported.set(css);
    void navigator.clipboard?.writeText(css);
  };

  const sectionNav = createSectionNav(SYS_SECTIONS);
  sectionNav.bindScrollSpy();
  queueMicrotask(() => sectionNav.initFromHash());

  const tocBtn = (id: string, label: string) => (
    <button
      type="button"
      class={tocActiveClass(sectionNav.activeId, id)}
      onClick={() => sectionNav.scrollTo(id)}
    >
      {label}
    </button>
  );

  return (
    <Container size="xl">
      <Stack gap={6}>
        <Stack gap={2}>
          <Text as="h1" size="2xl">
            Design system
          </Text>
          <Text muted>
            Living reference for Powers primitives — modern layered surfaces,
            glass, and deep blue/green tokens. Edit{" "}
            <Code>packages/ui/src/styles/tokens.css</Code> to retheme.
          </Text>
          <Text muted size="sm">
            <strong>Lab</strong> is for editing live code recipes.{" "}
            <strong>System</strong> is this static component catalog. Use{" "}
            <strong>Copy JSX</strong> (full App+mount program) or{" "}
            <strong>Open Lab</strong> to load it. Prefer Open Lab over bare paste.
          </Text>
        </Stack>

        <nav class="sys-toc page-toc" aria-label="On this page">
          {tocBtn("sys-play", "Playground")}
          {tocBtn("sys-controls", "Controls")}
          {tocBtn("sys-type", "Type")}
          {tocBtn("sys-forms", "Forms")}
          {tocBtn("sys-feedback", "Feedback")}
          {tocBtn("sys-overlay", "Overlay")}
          {tocBtn("sys-power", "Power")}
          {tocBtn("sys-layout", "Layout")}
          {tocBtn("sys-keys", "Keys")}
          {tocBtn("sys-color", "Color")}
          {tocBtn("sys-space", "Space")}
          {tocBtn("sys-code", "Code")}
        </nav>

        <section id="sys-play">
          <Card>
            <Stack gap={4}>
              <Stack gap={1}>
                <Text weight="semibold" size="lg">
                  Brand playground
                </Text>
                <Text muted size="sm">
                  For designers: tweak accent + radius live, then export CSS.
                  Density and light/dark use the controls below / site nav.
                </Text>
              </Stack>
              <Stack gap={2}>
                <Text size="sm" weight="semibold">
                  Accent
                </Text>
                <Stack direction="row" gap={2} wrap>
                  {ACCENT_PRESETS.map((p) =>
                    Button({
                      size: "sm",
                      variant: "soft",
                      children: p.label,
                      onClick: () => {
                        accentPick.set(p.value);
                        applyBrand();
                      },
                    }),
                  )}
                </Stack>
              </Stack>
              <Stack gap={2}>
                <Text size="sm" weight="semibold">
                  Radius
                </Text>
                <Stack direction="row" gap={2} wrap>
                  {(
                    [
                      ["Sharp", "0.35rem"],
                      ["Default", "0.75rem"],
                      ["Soft", "1.1rem"],
                    ] as const
                  ).map(([label, val]) =>
                    Button({
                      size: "sm",
                      variant: "ghost",
                      children: label,
                      onClick: () => {
                        radiusPick.set(val);
                        applyBrand();
                      },
                    }),
                  )}
                </Stack>
              </Stack>
              <Stack direction="row" gap={2} wrap>
                <Button size="sm" onClick={applyBrand}>
                  Apply to page
                </Button>
                <Button size="sm" variant="soft" onClick={exportBrandCss}>
                  Copy brand CSS
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => theme.toggle()}
                >
                  {() =>
                    theme.mode() === "dark" ? "Light mode" : "Dark mode"
                  }
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => density.toggle()}
                >
                  Toggle density
                </Button>
              </Stack>
              <Stack direction="row" gap={2} wrap align="center">
                <Button>Primary sample</Button>
                <Button variant="soft">Soft</Button>
                <Badge tone="accent">Accent badge</Badge>
                <Text size="sm" muted>
                  Live preview uses current tokens
                </Text>
              </Stack>
              {() => {
                const css = exported();
                if (!css) return null;
                return (
                  <pre class="sys-export-pre" style={{ fontSize: "0.75rem" }}>
                    {css}
                  </pre>
                );
              }}
            </Stack>
          </Card>
        </section>

        <section id="sys-controls">
          <Grid cols={2} gap={4}>
            <Card>
              <Stack gap={3}>
                <Text weight="semibold">Theme & density</Text>
                <Text muted size="sm">
                  Mode: {() => theme.mode()} · Density:{" "}
                  {() => density.density()}
                </Text>
                <Stack direction="row" gap={2} wrap>
                  <Button
                    size="sm"
                    variant="soft"
                    onClick={() => theme.toggle()}
                  >
                    Toggle theme
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => density.toggle()}
                  >
                    Toggle density
                  </Button>
                </Stack>
                <Text muted size="xs">
                  Uses <Code>data-pu-theme</Code> / <Code>data-pu-density</Code>{" "}
                  on <Code>&lt;html&gt;</Code>.
                </Text>
              </Stack>
            </Card>

            <Card variant="glass">
              <Stack gap={3}>
                <DemoHead title="Badge" snippet={SNIPPETS.badge} lab="ui" />
                <Stack direction="row" gap={2} wrap align="center">
                  <Badge>Neutral</Badge>
                  <Badge tone="accent">Accent</Badge>
                  <Badge tone="success">Success</Badge>
                  <Badge tone="warning">Warning</Badge>
                  <Avatar name="Ada Lovelace" size="sm" />
                  <Avatar name="Powers" size="md" />
                  <Avatar name="SP" size="lg" />
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </section>

        <section id="sys-type">
          <Card>
            <Stack gap={3}>
              <DemoHead title="Text" snippet={SNIPPETS.text} lab="hello" />
              <Text as="h1" size="2xl">
                Display 2xl
              </Text>
              <Text as="h2" size="xl">
                Heading xl
              </Text>
              <Text size="lg">Body large — for ledes and intros.</Text>
              <Text>Body md — default reading size.</Text>
              <Text size="sm" muted>
                Small muted — secondary metadata.
              </Text>
              <Text size="xs" muted>
                Extra small — captions and legal.
              </Text>
              <Stack direction="row" gap={3} wrap>
                <Text weight="medium">Medium</Text>
                <Text weight="semibold">Semibold</Text>
                <Text weight="bold">Bold</Text>
              </Stack>
            </Stack>
          </Card>
        </section>

        <section id="sys-forms">
          <Card>
            <Stack gap={4}>
              <DemoHead
                title="Buttons"
                snippet={SNIPPETS.button}
                lab="ui"
              />
              <Stack direction="row" gap={2} wrap>
                <Button size="sm">Solid sm</Button>
                <Button>Solid md</Button>
                <Button size="lg">Solid lg</Button>
                <Button variant="soft">Soft</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button disabled>Disabled</Button>
              </Stack>

              <DemoHead
                title="Fields"
                snippet={SNIPPETS.field}
                lab="form"
                hint="Label + control + hint/error — prefer Field over raw inputs."
              />
              <Grid cols={2} gap={4}>
                <Field
                  label="Email"
                  htmlFor="sys-email"
                  required
                  hint="We'll never share it."
                  error={emailError}
                >
                  <Input
                    id="sys-email"
                    type="email"
                    placeholder="you@company.com"
                    bind={email}
                    onBlur={() => emailTouched.set(true)}
                    aria-invalid={() => !!emailError()}
                  />
                </Field>
                <Field label="Plan" htmlFor="sys-plan">
                  <Select
                    id="sys-plan"
                    value="pro"
                    options={[
                      { value: "free", label: "Free" },
                      { value: "pro", label: "Pro" },
                      { value: "team", label: "Team" },
                    ]}
                  />
                </Field>
              </Grid>
              <Field label="Notes" htmlFor="sys-notes">
                <Textarea
                  id="sys-notes"
                  rows={3}
                  bind={note}
                />
              </Field>
              <DemoHead
                title="Switch"
                snippet={SNIPPETS.switch}
                lab="form"
                hint="Prefer bind={signal} when the control owns a boolean signal."
              />
              <Stack direction="row" gap={4} wrap>
                <Switch
                  label="Notifications"
                  checked={on}
                  onChange={(v) => on.set(v)}
                />
                <Checkbox
                  label="I like tokens"
                  checked={check}
                  onChange={(v) => check.set(v)}
                />
              </Stack>
              <Divider label="more controls" />
              <Grid cols={2} gap={4}>
                <Stack gap={2}>
                  <Text size="sm" weight="semibold">
                    Radio group
                  </Text>
                  <RadioGroup
                    value={radioPlan}
                    onChange={(v) => radioPlan.set(v)}
                    options={[
                      { value: "free", label: "Free" },
                      { value: "pro", label: "Pro" },
                      { value: "team", label: "Team" },
                    ]}
                  />
                </Stack>
                <Stack gap={3}>
                  <Slider
                    label="Volume"
                    value={sliderVal}
                    onChange={(v) => sliderVal.set(v)}
                  />
                  <Stack direction="row" gap={3} align="center">
                    <Text size="sm" weight="semibold">
                      Quantity
                    </Text>
                    <NumberInput
                      value={qty}
                      min={0}
                      max={99}
                      onChange={(v) => qty.set(v)}
                      aria-label="Quantity"
                    />
                  </Stack>
                  <ToggleGroup
                    value={view}
                    onChange={(v) => view.set(v as string)}
                    options={[
                      { value: "list", label: "List" },
                      { value: "grid", label: "Grid" },
                      { value: "map", label: "Map" },
                    ]}
                  />
                </Stack>
              </Grid>
              <Stack direction="row" gap={2} wrap>
                <Chip>Neutral</Chip>
                <Chip tone="accent">Accent</Chip>
                <Chip tone="success">Success</Chip>
                <Chip tone="danger" onRemove={() => {}}>
                  Removable
                </Chip>
              </Stack>
            </Stack>
          </Card>
        </section>

        <section id="sys-feedback">
          <Card>
            <Stack gap={4}>
              <DemoHead
                title="Alert"
                snippet={SNIPPETS.alert}
                lab="feedback"
              />
              <Alert tone="info" title="Info">
                Integrated styling means tokens + components in one library.
              </Alert>
              <Alert tone="success" title="Success">
                Form saved (example message).
              </Alert>
              <Alert tone="warning" title="Warning">
                Check your density setting on small screens.
              </Alert>
              <Alert tone="danger" title="Error">
                Something failed — try again.
              </Alert>
              <Divider label="or" />
              <Stack direction="row" gap={3} align="center">
                <Spinner size="sm" />
                <Spinner />
                <Spinner size="lg" label="Loading data" />
                <Text muted size="sm">
                  Spinners respect reduced motion.
                </Text>
              </Stack>
              <Progress value={progress} label="Upload" />
              <Stack direction="row" gap={2}>
                <Button
                  size="sm"
                  variant="soft"
                  onClick={() =>
                    progress.set(Math.min(100, progress() + 12))
                  }
                >
                  +12%
                </Button>
                <Button size="sm" variant="ghost" onClick={() => progress.set(0)}>
                  Reset
                </Button>
              </Stack>
              <Stack gap={2}>
                <Text size="sm" weight="semibold">
                  Skeleton
                </Text>
                <Skeleton lines={3} />
                <Stack direction="row" gap={3} align="center">
                  <Skeleton variant="circle" width="2.5rem" height="2.5rem" />
                  <Skeleton variant="rect" height="3rem" />
                </Stack>
              </Stack>
            </Stack>
          </Card>
        </section>

        <section id="sys-overlay">
          <Grid cols={2} gap={4}>
            <Card variant="elevated">
              <Stack gap={3}>
                <DemoHead title="Card" snippet={SNIPPETS.card} lab="ui" />
                <DemoHead
                  title="Tabs"
                  snippet={SNIPPETS.tabs}
                  lab="overlays"
                  hint="Arrow keys move focus and activate (roving tabindex)."
                />
                <Tabs
                  defaultValue="overview"
                  items={[
                    {
                      id: "overview",
                      label: "Overview",
                      content: (
                        <Text muted size="sm">
                          Fine-grained updates. No VDOM by default.
                        </Text>
                      ),
                    },
                    {
                      id: "tokens",
                      label: "Tokens",
                      content: (
                        <Text muted size="sm">
                          One file rethemes brand, surfaces, and elevation.
                        </Text>
                      ),
                    },
                    {
                      id: "motion",
                      label: "Motion",
                      content: (
                        <Text muted size="sm">
                          Springs and tweens on signals — optional animate/gsap.
                        </Text>
                      ),
                    },
                  ]}
                />
              </Stack>
            </Card>
            <Card>
              <Stack gap={3}>
                <DemoHead
                  title="Dialog"
                  snippet={SNIPPETS.dialog}
                  lab="overlays"
                  hint="Glass scrim · Escape · backdrop · focus trap."
                />
                <Button onClick={() => dialogOpen.set(true)}>Open dialog</Button>
                <Dialog
                  open={dialogOpen}
                  onClose={() => dialogOpen.set(false)}
                  title="Modern dialog"
                  description="Layered surfaces with deep ink blue accents."
                >
                  <Stack gap={3}>
                    <Text size="sm">
                      Use Dialog for confirmations and focused flows. It locks
                      body scroll while open.
                    </Text>
                    <Stack direction="row" gap={2} justify="end">
                      <Button
                        variant="ghost"
                        onClick={() => dialogOpen.set(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => dialogOpen.set(false)}>
                        Confirm
                      </Button>
                    </Stack>
                  </Stack>
                </Dialog>
              </Stack>
            </Card>
            <Card variant="glass">
              <Stack gap={3}>
                <Text weight="semibold">Tooltip</Text>
                <Text muted size="sm">
                  Hover or focus — quiet, token-styled bubble.
                </Text>
                <Stack direction="row" gap={3} wrap>
                  <Tooltip content="Primary action">
                    <Button size="sm">Hover me</Button>
                  </Tooltip>
                  <Tooltip content="Soft secondary action" side="bottom">
                    <Button size="sm" variant="soft">
                      Bottom tip
                    </Button>
                  </Tooltip>
                </Stack>
              </Stack>
            </Card>
            <Card>
              <Stack gap={3}>
                <DemoHead
                  title="Toast"
                  snippet={SNIPPETS.toast}
                  hint="createToaster() + Toaster — ephemeral status."
                />
                <Stack direction="row" gap={2} wrap>
                  <Button
                    size="sm"
                    onClick={() =>
                      toaster.push({
                        title: "Saved",
                        description: "Changes are in.",
                        tone: "success",
                      })
                    }
                  >
                    Success toast
                  </Button>
                  <Button
                    size="sm"
                    variant="soft"
                    onClick={() =>
                      toaster.push({
                        title: "Heads up",
                        description: "Something needs attention.",
                        tone: "info",
                      })
                    }
                  >
                    Info toast
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() =>
                      toaster.push({
                        title: "Failed",
                        description: "Could not complete that action.",
                        tone: "danger",
                      })
                    }
                  >
                    Error toast
                  </Button>
                </Stack>
                <Toaster toaster={toaster} />
              </Stack>
            </Card>
            <Card variant="elevated">
              <Stack gap={3}>
                <Text weight="semibold">Popover</Text>
                <Text muted size="sm">
                  Anchored panel — Escape + outside click to dismiss.
                </Text>
                <Popover
                  open={popoverOpen}
                  onOpenChange={(v) => popoverOpen.set(v)}
                  trigger={
                    <Button size="sm" variant="soft">
                      {() => (popoverOpen() ? "Close panel" : "Open panel")}
                    </Button>
                  }
                >
                  <Stack gap={2}>
                    <Text weight="semibold" size="sm">
                      Quick note
                    </Text>
                    <Text muted size="sm">
                      Popovers float under their trigger and use the same
                      elevation tokens as dialogs.
                    </Text>
                    <Button
                      size="sm"
                      onClick={() => popoverOpen.set(false)}
                    >
                      Got it
                    </Button>
                  </Stack>
                </Popover>
              </Stack>
            </Card>
            <Card>
              <Stack gap={3}>
                <DemoHead
                  title="Menu"
                  snippet={SNIPPETS.menu}
                  lab="menu"
                  hint="↑/↓ · Enter · Esc — roving focus on open."
                />
                <Stack direction="row" gap={3} align="center" wrap>
                  <Menu
                    trigger={<Button size="sm">Actions</Button>}
                    items={[
                      { id: "edit", label: "Edit" },
                      { id: "duplicate", label: "Duplicate" },
                      { id: "archive", label: "Archive", disabled: true },
                      { id: "delete", label: "Delete", danger: true },
                    ]}
                    onSelect={(id) => menuPick.set(id)}
                  />
                  <Text muted size="sm">
                    Last pick: {() => menuPick()}
                  </Text>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </section>

        <section id="sys-power">
          <Grid cols={2} gap={4}>
            <Card variant="elevated">
              <Stack gap={3}>
                <DemoHead
                  title="Combobox"
                  snippet={SNIPPETS.combobox}
                  hint="Type to filter · loading / empty for async options · flips near viewport edge."
                />
                <Field label="City">
                  <Combobox
                    value={city}
                    onChange={(v) => city.set(v)}
                    placeholder="Search cities…"
                    options={cityOptions}
                    loading={cityLoading}
                    emptyText="No cities match"
                    loadingText="Searching cities…"
                  />
                </Field>
                <Stack direction="row" gap={2} wrap>
                  <Button
                    size="sm"
                    variant="soft"
                    onClick={() => {
                      cityLoading.set(true);
                      cityOptions.set([]);
                      window.setTimeout(() => {
                        cityOptions.set([
                          { value: "sf", label: "San Francisco" },
                          { value: "nyc", label: "New York" },
                          { value: "ldn", label: "London" },
                          { value: "tyo", label: "Tokyo" },
                          { value: "ber", label: "Berlin" },
                          { value: "par", label: "Paris" },
                        ]);
                        cityLoading.set(false);
                      }, 900);
                    }}
                  >
                    Simulate async load
                  </Button>
                  <Text muted size="sm">
                    Value: {() => city()}
                    {() => (cityLoading() ? " · loading…" : "")}
                  </Text>
                </Stack>
              </Stack>
            </Card>
            <Card>
              <Stack gap={3}>
                <DemoHead
                  title="Drawer"
                  snippet={SNIPPETS.drawer}
                  lab="kit"
                  hint="Offcanvas — Esc, backdrop, focus trap."
                />
                <Button variant="soft" onClick={() => drawerOpen.set(true)}>
                  Open drawer
                </Button>
                <Drawer
                  open={drawerOpen}
                  onClose={() => drawerOpen.set(false)}
                  title="Filters"
                  side="right"
                >
                  <Stack gap={3}>
                    <Text size="sm" muted>
                      Slide-over for settings, filters, and secondary flows.
                    </Text>
                    <Button onClick={() => drawerOpen.set(false)}>Done</Button>
                  </Stack>
                </Drawer>
              </Stack>
            </Card>
            <Card variant="glass">
              <Stack gap={3}>
                <DemoHead
                  title="Accordion"
                  snippet={SNIPPETS.accordion}
                  lab="kit"
                />
                <Accordion
                  single
                  defaultValue={["a"]}
                  items={[
                    {
                      id: "a",
                      title: "What is Powers?",
                      content:
                        "A fine-grained reactive UI kit with an integrated design system.",
                    },
                    {
                      id: "b",
                      title: "How do I retheme?",
                      content:
                        "Edit packages/ui/src/styles/tokens.css — one file drives brand + surfaces.",
                    },
                    {
                      id: "c",
                      title: "Create a component?",
                      content:
                        "createStyleSheet + component() — see docs/COMPONENTS.md.",
                    },
                  ]}
                />
              </Stack>
            </Card>
          </Grid>
        </section>

        <section id="sys-layout">
          <Stack gap={4}>
            <Card>
              <Stack gap={3}>
                <DemoHead
                  title="Stat"
                  snippet={SNIPPETS.stat}
                  lab="kit"
                  hint="KPI cards for dashboards."
                />
                <Grid cols={3} gap={4}>
                  <Stat label="Active users" value="12.4k" delta="+8.2%" tone="positive" hint="7d" />
                  <Stat label="Error rate" value="0.12%" delta="-0.03%" tone="positive" />
                  <Stat label="Latency p95" value="142ms" delta="+12ms" tone="negative" hint="api" />
                </Grid>
              </Stack>
            </Card>
            <Grid cols={2} gap={4}>
              <Card>
                <Stack gap={3}>
                  <Text weight="semibold">Breadcrumb · Pagination</Text>
                  <Breadcrumb
                    items={[
                      { id: "home", label: "Home" },
                      { id: "sys", label: "System" },
                      { id: "layout", label: "Layout" },
                    ]}
                  />
                  <Pagination
                    page={page}
                    pageCount={8}
                    onChange={(p) => page.set(p)}
                  />
                </Stack>
              </Card>
              <Card>
                <Stack gap={3}>
                  <Text weight="semibold">List</Text>
                  <List
                    value={listPick}
                    onSelect={(id) => listPick.set(id)}
                    items={[
                      {
                        id: "alpha",
                        label: "Alpha project",
                        description: "Design system work",
                        meta: "3d",
                      },
                      {
                        id: "beta",
                        label: "Beta launch",
                        description: "Public npm cut",
                        meta: "1w",
                      },
                      {
                        id: "gamma",
                        label: "Gamma archive",
                        description: "Legacy notes",
                        meta: "—",
                        disabled: true,
                      },
                    ]}
                  />
                </Stack>
              </Card>
              <Card>
                <Stack gap={3}>
                  <Text weight="semibold">Steps</Text>
                  <Steps
                    current={step}
                    onStepClick={(i) => step.set(i)}
                    steps={[
                      { id: "s1", label: "Account", description: "Email + password" },
                      { id: "s2", label: "Profile", description: "Name and avatar" },
                      { id: "s3", label: "Done", description: "You’re set" },
                    ]}
                  />
                </Stack>
              </Card>
              <Card>
                <Stack gap={3}>
                  <Text weight="semibold">Timeline</Text>
                  <Timeline
                    items={[
                      {
                        id: "t1",
                        title: "Shipped Accordion + Drawer",
                        description: "Focus trap and createStyleSheet authoring.",
                        time: "Today",
                        tone: "accent",
                      },
                      {
                        id: "t2",
                        title: "Combobox + Command",
                        time: "Earlier",
                        tone: "success",
                      },
                      {
                        id: "t3",
                        title: "Token refresh",
                        description: "Sage green #69BE28",
                        time: "Yesterday",
                      },
                    ]}
                  />
                </Stack>
              </Card>
            </Grid>
            <Card>
              <Stack gap={3}>
                <DemoHead title="Table" snippet={SNIPPETS.table} lab="kit" />
                <Table
                  dense
                  rowKey="id"
                  columns={[
                    { key: "name", header: "Name" },
                    { key: "role", header: "Role" },
                    { key: "status", header: "Status", align: "right" },
                  ]}
                  rows={[
                    { id: "1", name: "Ada", role: "Engineer", status: "Active" },
                    { id: "2", name: "Grace", role: "Design", status: "Away" },
                    { id: "3", name: "Lin", role: "PM", status: "Active" },
                  ]}
                />
              </Stack>
            </Card>
            <Empty
              icon="✦"
              title="Nothing here yet"
              description="Empty states keep product UI calm when lists and tables have no rows."
            >
              <Button size="sm">Create item</Button>
            </Empty>
          </Stack>
        </section>

        <section id="sys-keys">
          <Card>
            <Stack gap={3}>
              <Text weight="semibold">Keyboard</Text>
              <Text muted size="sm">
                Kbd for shortcuts in docs and toolbars.
              </Text>
              <Stack direction="row" gap={2} align="center" wrap>
                <Kbd>⌘</Kbd>
                <Text size="sm">+</Text>
                <Kbd>Enter</Kbd>
                <Text muted size="sm">
                  run Lab
                </Text>
                <Kbd>Esc</Kbd>
                <Text muted size="sm">
                  dismiss dialog / menu
                </Text>
                <Kbd>Tab</Kbd>
                <Text muted size="sm">
                  indent in Lab
                </Text>
              </Stack>
            </Stack>
          </Card>
        </section>

        <section id="sys-color">
          <Card>
            <Stack gap={3}>
              <Text weight="semibold">Semantic color tokens</Text>
              <Swatch name="--pu-color-bg" css="var(--pu-color-bg)" />
              <Swatch name="--pu-color-surface" css="var(--pu-color-surface)" />
              <Swatch
                name="--pu-color-surface-2"
                css="var(--pu-color-surface-2)"
              />
              <Swatch name="--pu-color-border" css="var(--pu-color-border)" />
              <Swatch name="--pu-color-text" css="var(--pu-color-text)" />
              <Swatch
                name="--pu-color-text-muted"
                css="var(--pu-color-text-muted)"
              />
              <Swatch name="--pu-color-accent" css="var(--pu-color-accent)" />
              <Swatch
                name="--pu-color-accent-hover"
                css="var(--pu-color-accent-hover)"
              />
              <Swatch name="--pu-color-danger" css="var(--pu-color-danger)" />
              <Swatch name="--pu-color-focus" css="var(--pu-color-focus)" />
            </Stack>
          </Card>
        </section>

        <section id="sys-space">
          <Card>
            <Stack gap={3}>
              <Text weight="semibold">Space scale</Text>
              <Text muted size="sm">
                4px grid — used by Stack gap and density-aware controls.
              </Text>
              <SpaceBar name="space-1" token="--pu-space-1" />
              <SpaceBar name="space-2" token="--pu-space-2" />
              <SpaceBar name="space-3" token="--pu-space-3" />
              <SpaceBar name="space-4" token="--pu-space-4" />
              <SpaceBar name="space-5" token="--pu-space-5" />
              <SpaceBar name="space-6" token="--pu-space-6" />
              <SpaceBar name="space-8" token="--pu-space-8" />
            </Stack>
          </Card>
        </section>

        <section id="sys-code">
          <Card>
            <Stack gap={2}>
              <Text weight="semibold">Code</Text>
              <Text muted size="sm">
                Inline <Code>createTheme()</Code> and blocks:
              </Text>
              <Code block>
{`import { Button, createTheme, createDensity } from "@powers/ui";
import "@powers/ui/theme.css";

const theme = createTheme("dark");
theme.bind();

const density = createDensity("comfortable");
density.bind();`}
              </Code>
            </Stack>
          </Card>
        </section>

        <Card>
          <Stack gap={2}>
            <Text weight="semibold">Package map</Text>
            <Text muted size="sm">
              core · animate · dom · router · ssr · ui — tree-shake and compose.
              Default motion is signal tweens; GSAP is optional via{" "}
              <code>@powers/animate/gsap</code>.
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
