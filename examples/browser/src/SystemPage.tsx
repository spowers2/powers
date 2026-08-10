/**
 * Living design-system explorer — tokens + primitives at a glance.
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

export function SystemPage(props: {
  theme: ThemeController;
  density: DensityController;
}) {
  const { theme, density } = props;
  const on = signal(true);
  const check = signal(false);
  const note = signal("");

  return (
    <Container size="lg">
      <Stack gap={6}>
        <Stack gap={2}>
          <Text as="h2" size="xl">
            Design system
          </Text>
          <Text muted>
            Edit tokens in <Code>packages/ui/src/styles/tokens.css</Code>.
            Primitives only use semantic <Code>--pu-*</Code> variables.
          </Text>
        </Stack>

        <Grid cols={2} gap={4}>
          <Card>
            <Stack gap={3}>
              <Text weight="semibold">Theme & density</Text>
              <Text muted size="sm">
                Mode: {() => theme.mode()} · Density: {() => density.density()}
              </Text>
              <Stack direction="row" gap={2} wrap>
                <Button size="sm" variant="soft" onClick={() => theme.toggle()}>
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
          </Stack>
        </Card>

        <Card>
          <Stack gap={4}>
            <Text weight="semibold">Forms</Text>
            <Grid cols={2} gap={4}>
              <Field label="Name" htmlFor="sys-name" hint="Plain input">
                <Input id="sys-name" placeholder="Ada Lovelace" />
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
            <Swatch name="--pu-color-danger" css="var(--pu-color-danger)" />
          </Stack>
        </Card>

        <Card>
          <Stack gap={2}>
            <Text weight="semibold">Code</Text>
            <Code>inline token</Code>
            <Code block>
{`import { Button, createTheme } from "@power-ui/ui";
const theme = createTheme("dark");
theme.bind();`}
            </Code>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
