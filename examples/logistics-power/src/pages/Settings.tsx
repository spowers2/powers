import {
  Button,
  Stack,
  Switch,
  type DensityController,
  type ThemeController,
  type ToastController,
} from "@lab206/ui";
import { signal } from "@lab206/core";

export function SettingsPage(props: {
  theme: ThemeController;
  density: DensityController;
  toaster: ToastController;
}) {
  const { theme, density, toaster } = props;
  const telemetry = signal(true);

  return (
    <div class="stack-gap">
      <div class="page-head">
        <div>
          <h1>Settings</h1>
          <p>Theme and density — same Powers controls, instrument-panel look</p>
        </div>
      </div>
      <div class="hud-panel">
        <div class="hud-panel__inner">
          <h2 class="hud-panel__title">
            <span class="led" />
            Display
          </h2>
          <Stack gap={3}>
            <div class="row-gap">
              <Button size="sm" variant="soft" onClick={() => theme.toggle()}>
                {() =>
                  theme.mode() === "dark" ? "Switch to light" : "Switch to dark"
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
              label="Show live activity hints"
              bind={telemetry}
              onChange={() =>
                toaster.push({
                  title: telemetry()
                    ? "Activity hints on"
                    : "Activity hints off",
                  tone: "info",
                })
              }
            />
            <p class="mono muted">
              Tip for clients: this screen shows how one Powers theme toggle
              restyles a whole product — try Light vs Dark in the header.
            </p>
          </Stack>
        </div>
      </div>
    </div>
  );
}
