/**
 * Living design-system explorer — sections for tokens, type, forms, layout.
 */
import { signal } from "@power-ui/core";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Code,
  Container,
  Field,
  Grid,
  Input,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  type DensityController,
  type ThemeController,
} from "@power-ui/ui";

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
  const emailError = () => {
    const v = email().trim();
    if (!v) return "";
    return v.includes("@") ? "" : "Invalid email";
  };

  return (
    <Container size="lg">
      <Stack gap={6}>
        <Stack gap={2}>
          <Text as="h1" size="2xl">
            Design system
          </Text>
          <Text muted>
            Living reference for Power UI primitives. Edit{" "}
            <Code>packages/ui/src/styles/tokens.css</Code> to retheme.
          </Text>
        </Stack>

        <nav class="sys-toc" aria-label="On this page">
          <a href="#lab-link" id="lab-link" data-lab="1">Power Lab</a>
          <a href="#sys-controls">Controls</a>
          <a href="#sys-type">Type</a>
          <a href="#sys-forms">Forms</a>
          <a href="#sys-color">Color</a>
          <a href="#sys-space">Space</a>
          <a href="#sys-code">Code</a>
        </nav>

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

            <Card>
              <Stack gap={3}>
                <Text weight="semibold">Badges</Text>
                <Stack direction="row" gap={2} wrap>
                  <Badge>Neutral</Badge>
                  <Badge tone="accent">Accent</Badge>
                  <Badge tone="success">Success</Badge>
                  <Badge tone="warning">Warning</Badge>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </section>

        <section id="sys-type">
          <Card>
            <Stack gap={3}>
              <Text weight="semibold">Typography</Text>
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
              <Text weight="semibold">Buttons</Text>
              <Stack direction="row" gap={2} wrap>
                <Button size="sm">Solid sm</Button>
                <Button>Solid md</Button>
                <Button size="lg">Solid lg</Button>
                <Button variant="soft">Soft</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button disabled>Disabled</Button>
              </Stack>

              <Text weight="semibold">Fields</Text>
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
                    value={email}
                    onInput={(e) =>
                      email.set((e.target as HTMLInputElement).value)
                    }
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
                  value={note}
                  onInput={(e) =>
                    note.set((e.target as HTMLTextAreaElement).value)
                  }
                />
              </Field>
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
{`import { Button, createTheme, createDensity } from "@power-ui/ui";
import "@power-ui/ui/theme.css";

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
              GSAP remains an optional future adapter, not the default motion
              path.
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
