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
          <h1>Console settings</h1>
          <p>Bezel · density · telemetry</p>
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
                  theme.mode() === "dark" ? "Force light bezel" : "Force dark bezel"
                }
              </Button>
              <Button size="sm" variant="ghost" onClick={() => density.toggle()}>
                {() =>
                  density.density() === "compact"
                    ? "Comfort density"
                    : "Compact density"
                }
              </Button>
            </div>
            <Switch
              label="HUD telemetry ticks"
              bind={telemetry}
              onChange={() =>
                toaster.push({
                  title: telemetry() ? "Telemetry armed" : "Telemetry muted",
                  tone: "info",
                })
              }
            />
            <p class="mono muted">
              Logistics Power dogfoods the same theme/density controls as any
              Powers app — restyled as an instrument panel.
            </p>
          </Stack>
        </div>
      </div>
    </div>
  );
}
