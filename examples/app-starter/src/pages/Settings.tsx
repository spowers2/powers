import { signal } from "@power-ui/core";
import {
  Button,
  Card,
  Checkbox,
  Field,
  Input,
  Stack,
  Text,
  Alert,
  emailFormat,
  firstError,
  minLength,
  required,
  type DensityController,
  type ThemeController,
  type ToastController,
} from "@power-ui/ui";
import { PageHeader } from "../components/uiBits.js";
import { profile, saveProfile, resetWorkspace } from "../data/store.js";

export function SettingsPage(props: {
  theme: ThemeController;
  density: DensityController;
  toaster: ToastController;
}) {
  const { theme, density, toaster } = props;
  const name = signal(profile().name);
  const email = signal(profile().email);
  const company = signal(profile().company);
  const notify = signal(profile().notify);
  // Default rate if older localStorage profiles predate hourlyRate
  const hourlyRate = signal(
    String(
      typeof profile().hourlyRate === "number" && profile().hourlyRate > 0
        ? profile().hourlyRate
        : 150,
    ),
  );
  const touched = signal(false);
  const confirmReset = signal(false);

  const nameErr = () =>
    !touched()
      ? ""
      : firstError(required(name(), "Name required"), minLength(name(), 2));
  const emailErr = () =>
    !touched()
      ? ""
      : firstError(required(email(), "Email required"), emailFormat(email()));

  const save = () => {
    touched.set(true);
    if (nameErr() || emailErr()) {
      toaster.push({ title: "Fix the form", tone: "danger" });
      return;
    }
    saveProfile({
      name: name().trim(),
      email: email().trim(),
      company: company().trim(),
      notify: notify(),
      hourlyRate: Math.max(1, Math.round(Number(hourlyRate()) || 150)),
    });
    toaster.push({
      title: "Profile saved",
      description: email().trim(),
      tone: "success",
    });
  };

  return (
    <Stack gap={6}>
      <PageHeader
        title="Settings"
        subtitle="Your practice profile and workspace preferences."
      />

      <Card>
        <Stack gap={4}>
          <Text weight="semibold">Profile</Text>
          <Field label="Name" required error={nameErr}>
            <Input
              bind={name}
              onBlur={() => touched.set(true)}
              autocomplete="name"
            />
          </Field>
          <Field label="Email" required error={emailErr}>
            <Input
              type="email"
              bind={email}
              onBlur={() => touched.set(true)}
              autocomplete="email"
            />
          </Field>
          <Field label="Studio / company">
            <Input
              bind={company}
            />
          </Field>
          <Field label="Default hourly rate (USD)">
            <Input
              type="number"
              bind={hourlyRate}
            />
          </Field>
          <Checkbox
            label="Email me about due tasks (demo flag only)"
            checked={notify}
            onChange={(v) => notify.set(v)}
          />
          <Button onClick={save}>Save profile</Button>
        </Stack>
      </Card>

      <Card>
        <Stack gap={4}>
          <Text weight="semibold">Appearance</Text>
          <Text muted size="sm">
            Mode: {() => theme.mode()} · Density: {() => density.density()}
          </Text>
          <Stack direction="row" gap={2} wrap>
            <Button
              size="sm"
              variant="soft"
              onClick={() => {
                theme.toggle();
                toaster.push({
                  title: "Theme",
                  description: theme.mode(),
                  tone: "info",
                });
              }}
            >
              Toggle theme
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                density.toggle();
                toaster.push({
                  title: "Density",
                  description: density.density(),
                  tone: "info",
                });
              }}
            >
              Toggle density
            </Button>
          </Stack>
        </Stack>
      </Card>

      <Card>
        <Stack gap={3}>
          <Text weight="semibold">Local data</Text>
          <Alert tone="info" title="This app is local-first">
            Clients, projects, tasks, invoices, and time live in this browser’s
            localStorage. No server. Reset restores the demo seed.
          </Alert>
          {!confirmReset() ? (
            <Button
              size="sm"
              variant="danger"
              onClick={() => confirmReset.set(true)}
            >
              Reset demo data…
            </Button>
          ) : (
            <Stack direction="row" gap={2} wrap>
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  resetWorkspace();
                  const p = profile();
                  name.set(p.name);
                  email.set(p.email);
                  company.set(p.company);
                  notify.set(p.notify);
                  hourlyRate.set(String(p.hourlyRate ?? 150));
                  confirmReset.set(false);
                  toaster.push({
                    title: "Workspace reset",
                    description: "Seed data restored",
                    tone: "info",
                  });
                }}
              >
                Yes, reset
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => confirmReset.set(false)}
              >
                Cancel
              </Button>
            </Stack>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
