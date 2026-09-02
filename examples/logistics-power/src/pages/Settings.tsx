import {
  Button,
  Stack,
  Switch,
  type DensityController,
  type ThemeController,
  type ToastController,
} from "@lab206/ui";
import { signal } from "@lab206/core";
import { PageChrome } from "../components/PageChrome.js";
import { circuitMotion } from "../prefs.js";
import type { Router } from "@lab206/router";

export function SettingsPage(props: {
  router: Router;
  theme: ThemeController;
  density: DensityController;
  toaster: ToastController;
}) {
  const { router, theme, density, toaster } = props;
  const hints = signal(true);

  return (
    <PageChrome
      router={router}
      title="Settings"
      purpose="Toggle light/dark and spacing. Same Powers theme controls you’d use in a client app."
      crumbs={[
        { label: "Overview", href: "/" },
        { label: "Settings" },
      ]}
    >
      <div class="panel">
        <div class="panel__inner">
          <h2 class="panel__title">Display</h2>
          <Stack gap={3}>
            <div class="row-gap">
              <Button size="sm" variant="soft" onClick={() => theme.toggle()}>
                {() =>
                  theme.mode() === "dark" ? "Use light theme" : "Use dark theme"
                }
              </Button>
              <Button size="sm" variant="ghost" onClick={() => density.toggle()}>
                {() =>
                  density.density() === "compact"
                    ? "Comfortable spacing"
                    : "Compact spacing"
                }
              </Button>
            </div>
            <Switch
              label="Circuit pulse animation"
              bind={circuitMotion}
              onChange={() => {
                if (!hints()) return;
                toaster.push({
                  title: circuitMotion()
                    ? "Circuit pulses on"
                    : "Circuit pulses off",
                  description: circuitMotion()
                    ? "Soft lights travel the background traces."
                    : "Background stays still. Traces remain.",
                  tone: "info",
                });
              }}
            />
            <Switch
              label="Show tip toasts when toggling options"
              bind={hints}
              onChange={() => {
                if (!hints()) return;
                toaster.push({
                  title: "Tips on",
                  description: "You’ll see a short confirmation on changes.",
                  tone: "info",
                });
              }}
            />
            <p class="muted" style={{ margin: 0, fontSize: "0.9rem" }}>
              Circuit animation defaults off when your OS has reduced motion
              enabled. Prefer the header <b>Light / Dark</b> control while
              walking a client through the demo — one design system, two skins.
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => router.navigate("/")}
            >
              ← Back to overview
            </Button>
          </Stack>
        </div>
      </div>
    </PageChrome>
  );
}
