/**
 * System page authoring helpers — title row + Copy JSX + Open Lab with snippet.
 *
 * Snippets are **Lab-runnable**: import + App + mount (same shape as recipes).
 * Lab strips imports and injects the live API — bare JSX fragments will not run.
 */
import { signal } from "@powers/core";
import { Button, Stack, Text } from "@powers/ui";
import { encodeShare } from "./lab/runner.js";

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;left:-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/** Wrap a demo body as a full Lab / app entry (imports kept for copy into real apps). */
function labProgram(
  imports: string,
  body: string,
  setup = "",
): string {
  const setupBlock = setup ? `${setup.trim()}\n\n` : "";
  return `${imports.trim()}

${setupBlock}export function App() {
  return (
${body
  .trim()
  .split("\n")
  .map((l) => `    ${l}`)
  .join("\n")}
  );
}

mount(document.getElementById("root")!, () => <App />);
`;
}

/** Canonical snippets for System demos — paste into Lab or an app. */
export const SNIPPETS = {
  button: labProgram(
    `import { mount } from "@powers/dom";
import { Button, Stack } from "@powers/ui";`,
    `<Stack direction="row" gap={2} wrap>
      <Button>Solid</Button>
      <Button variant="soft">Soft</Button>
      <Button variant="ghost">Ghost</Button>
    </Stack>`,
  ),

  field: labProgram(
    `import { signal } from "@powers/core";
import { mount } from "@powers/dom";
import {
  Field,
  Input,
  Stack,
  Text,
  required,
  emailFormat,
  firstError,
} from "@powers/ui";`,
    `<Stack gap={3}>
      <Text weight="semibold">Email field</Text>
      <Field label="Email" htmlFor="email" error={error} required>
        <Input
          id="email"
          type="email"
          bind={email}
        />
      </Field>
    </Stack>`,
    `const email = signal("");
const error = () =>
  firstError(required(email()), emailFormat(email()));`,
  ),

  dialog: labProgram(
    `import { signal } from "@powers/core";
import { mount } from "@powers/dom";
import { Button, Dialog, Stack, Text } from "@powers/ui";`,
    `<Stack gap={3}>
      <Button onClick={() => open.set(true)}>Open dialog</Button>
      <Dialog open={open} onClose={() => open.set(false)} title="Confirm">
        <Stack gap={3}>
          <Text size="sm">Are you sure?</Text>
          <Button onClick={() => open.set(false)}>Done</Button>
        </Stack>
      </Dialog>
    </Stack>`,
    `const open = signal(false);`,
  ),

  tabs: labProgram(
    `import { mount } from "@powers/dom";
import { Tabs, Text } from "@powers/ui";`,
    `<Tabs
      defaultValue="a"
      items={[
        { id: "a", label: "Overview", content: <Text size="sm">Panel A</Text> },
        { id: "b", label: "Tokens", content: <Text size="sm">Panel B</Text> },
      ]}
    />`,
  ),

  menu: labProgram(
    `import { signal } from "@powers/core";
import { mount } from "@powers/dom";
import { Menu, Button, Stack, Text } from "@powers/ui";`,
    `<Stack gap={3}>
      <Menu
        trigger={<Button size="sm">Actions</Button>}
        items={[
          { id: "edit", label: "Edit" },
          { id: "delete", label: "Delete", danger: true },
        ]}
        onSelect={(id) => pick.set(id)}
      />
      <Text muted size="sm">Last: {() => pick()}</Text>
    </Stack>`,
    `const pick = signal("—");`,
  ),

  accordion: labProgram(
    `import { mount } from "@powers/dom";
import { Accordion, Card } from "@powers/ui";`,
    `<Card>
      <Accordion
        single
        defaultValue={["a"]}
        items={[
          { id: "a", title: "What is Powers?", content: "Fine-grained UI kit." },
          { id: "b", title: "How do I retheme?", content: "Edit tokens.css." },
        ]}
      />
    </Card>`,
  ),

  drawer: labProgram(
    `import { signal } from "@powers/core";
import { mount } from "@powers/dom";
import { Button, Drawer, Stack, Text } from "@powers/ui";`,
    `<Stack gap={3}>
      <Button onClick={() => open.set(true)}>Open drawer</Button>
      <Drawer open={open} onClose={() => open.set(false)} title="Filters">
        <Text size="sm">Drawer body — Esc or backdrop to close.</Text>
      </Drawer>
    </Stack>`,
    `const open = signal(false);`,
  ),

  combobox: labProgram(
    `import { signal } from "@powers/core";
import { mount } from "@powers/dom";
import { Combobox, Field, Stack, Text } from "@powers/ui";`,
    `<Stack gap={3}>
      <Field label="City">
        <Combobox
          value={city}
          onChange={(v) => city.set(v)}
          options={cities}
          loading={loading}
          emptyText="No cities match"
          loadingText="Searching…"
        />
      </Field>
      <Text muted size="sm">Value: {() => city()}</Text>
    </Stack>`,
    `const city = signal("sf");
const loading = signal(false);
const cities = signal([
  { value: "sf", label: "San Francisco" },
  { value: "nyc", label: "New York" },
]);`,
  ),

  table: labProgram(
    `import { mount } from "@powers/dom";
import { Table } from "@powers/ui";`,
    `<Table
      dense
      columns={[
        { key: "name", header: "Name" },
        { key: "role", header: "Role" },
      ]}
      rows={[
        { name: "Ada", role: "Eng" },
        { name: "Grace", role: "Design" },
      ]}
    />`,
  ),

  stat: labProgram(
    `import { mount } from "@powers/dom";
import { Grid, Stat } from "@powers/ui";`,
    `<Grid cols={3} gap={4}>
      <Stat label="Users" value="12.4k" delta="+8%" tone="positive" />
      <Stat label="Errors" value="0.1%" delta="-0.02%" tone="positive" />
      <Stat label="p95" value="142ms" delta="+12ms" tone="negative" />
    </Grid>`,
  ),

  toast: labProgram(
    `import { mount } from "@powers/dom";
import { Button, createToaster, Toaster, Stack } from "@powers/ui";`,
    `<Stack gap={3}>
      <Button
        onClick={() =>
          toaster.push({ title: "Saved", tone: "success" })
        }
      >
        Toast
      </Button>
      <Toaster toaster={toaster} />
    </Stack>`,
    `const toaster = createToaster();`,
  ),

  switch: labProgram(
    `import { signal } from "@powers/core";
import { mount } from "@powers/dom";
import { Switch, Stack, Text } from "@powers/ui";`,
    `<Stack gap={3}>
      <Switch label="Notifications" bind={on} />
      <Text muted size="sm">{() => (on() ? "On" : "Off")}</Text>
    </Stack>`,
    `const on = signal(true);`,
  ),

  badge: labProgram(
    `import { mount } from "@powers/dom";
import { Badge, Stack } from "@powers/ui";`,
    `<Stack direction="row" gap={2} wrap>
      <Badge>Neutral</Badge>
      <Badge tone="accent">Accent</Badge>
      <Badge tone="success">Success</Badge>
      <Badge tone="warning">Warning</Badge>
    </Stack>`,
  ),

  card: labProgram(
    `import { mount } from "@powers/dom";
import { Button, Card, Stack, Text } from "@powers/ui";`,
    `<Stack gap={3}>
      <Card>
        <Stack gap={2}>
          <Text weight="semibold">Default card</Text>
          <Text muted size="sm">Border + surface tokens.</Text>
        </Stack>
      </Card>
      <Card variant="soft">
        <Text size="sm">Soft variant</Text>
      </Card>
      <Card variant="elevated" interactive>
        <Stack gap={2}>
          <Text weight="semibold">Elevated</Text>
          <Button size="sm" variant="soft">Action</Button>
        </Stack>
      </Card>
    </Stack>`,
  ),

  alert: labProgram(
    `import { mount } from "@powers/dom";
import { Alert, Stack } from "@powers/ui";`,
    `<Stack gap={3}>
      <Alert tone="info" title="Info">Something to know.</Alert>
      <Alert tone="success" title="Saved">Your changes are live.</Alert>
      <Alert tone="danger" title="Error">Check the fields above.</Alert>
    </Stack>`,
  ),

  text: labProgram(
    `import { mount } from "@powers/dom";
import { Stack, Text } from "@powers/ui";`,
    `<Stack gap={2}>
      <Text as="h2" size="xl">Heading</Text>
      <Text>Body copy uses color/text.</Text>
      <Text muted size="sm">Muted helper text.</Text>
    </Stack>`,
  ),
} as const;

export type SnippetKey = keyof typeof SNIPPETS;

/** Lab URL that opens with this snippet already in the editor. */
export function labUrlForSnippet(snippet: string, recipeId = "ui"): string {
  const hash = "lab/" + encodeShare(snippet, recipeId);
  return `/lab#${hash}`;
}

/**
 * Card header: title + Copy JSX + optional Lab link (loads snippet when possible).
 */
export function DemoHead(props: {
  title: string;
  snippet: string;
  /** Recipe id used when opening Lab with this snippet */
  lab?: string;
  hint?: string;
}) {
  const copied = signal(false);
  const labHref = labUrlForSnippet(props.snippet, props.lab ?? "ui");

  return (
    <div class="sys-demo-head">
      <div class="sys-demo-head__text">
        <Text weight="semibold">{props.title}</Text>
        {props.hint ? (
          <Text muted size="sm">
            {props.hint}
          </Text>
        ) : null}
      </div>
      <Stack direction="row" gap={2} class="sys-demo-head__actions">
        <a class="sys-demo-link" href={labHref}>
          Open Lab
        </a>
        <Button
          size="sm"
          variant="ghost"
          class="sys-copy-btn"
          onClick={() => {
            void copyText(props.snippet).then((ok) => {
              if (!ok) return;
              copied.set(true);
              window.setTimeout(() => copied.set(false), 1600);
            });
          }}
        >
          {() => (copied() ? "Copied!" : "Copy JSX")}
        </Button>
      </Stack>
    </div>
  );
}
