import { signal } from "@lab206/core";
import { Show } from "@lab206/dom";
import type { Router } from "@lab206/router";
import {
  Alert,
  Button,
  Dialog,
  Field,
  Input,
  Spinner,
  Stack,
  type ToastController,
} from "@lab206/ui";
import { api, shipmentDetailQuery } from "../data/api.js";
import {
  formatLane,
  formatWhen,
  severityChipClass,
  statusChipClass,
} from "../components/status.js";

export function ShipmentDetailPage(props: {
  router: Router;
  toaster: ToastController;
  id: string;
}) {
  const { router, toaster, id } = props;
  const detail = shipmentDetailQuery(() => id);
  const etaOpen = signal(false);
  const etaDraft = signal("");
  const saving = signal(false);

  return (
    <div class="stack-gap">
      <div class="page-head">
        <div>
          <h1>Shipment trace</h1>
          <p class="mono">{id}</p>
        </div>
        <div class="row-gap">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.navigate("/shipments")}
          >
            Back to matrix
          </Button>
          <Button
            size="sm"
            variant="soft"
            onClick={() => void detail.refetch()}
          >
            Re-acquire
          </Button>
        </div>
      </div>

      <Show when={() => detail.loading() && !detail.latest()}>
        {() => (
          <div class="row-gap mono muted">
            <Spinner /> Resolving shipment packet…
          </div>
        )}
      </Show>
      <Show when={() => !!detail.error()}>
        {() => (
          <Alert tone="danger" title="Trace failed">
            {() => String(detail.error())}
          </Alert>
        )}
      </Show>

      <Show when={() => !!detail()}>
        {() => {
          const s = detail()!.shipment;
          const ex = detail()!.exceptions;
          return (
            <div class="stack-gap">
              <div class="hud-panel">
                <div class="hud-panel__inner">
                  <h2 class="hud-panel__title">
                    <span class="led led--cyan" />
                    {s.reference}
                  </h2>
                  <Stack gap={3}>
                    <div class="row-gap">
                      {formatLane(s.origin, s.destination)}
                      <span class={statusChipClass(s.status)}>{s.status}</span>
                      <span class="chip">P{s.priority}</span>
                    </div>
                    <div class="mono muted">
                      Carrier {s.carrier} · {s.weightKg.toLocaleString()} kg ·
                      ETA {formatWhen(s.eta)} · Updated {formatWhen(s.updatedAt)}
                    </div>
                    <div class="row-gap">
                      <Button
                        size="sm"
                        onClick={() => {
                          etaDraft.set(s.eta.slice(0, 16));
                          etaOpen.set(true);
                        }}
                      >
                        Update ETA
                      </Button>
                      <Button
                        size="sm"
                        variant="soft"
                        onClick={() => router.navigate("/exceptions")}
                      >
                        Exception bus
                      </Button>
                    </div>
                  </Stack>
                </div>
              </div>

              <div class="hud-panel">
                <div class="hud-panel__inner">
                  <h2 class="hud-panel__title">
                    <span class="led" />
                    Event timeline
                  </h2>
                  <ul class="timeline">
                    <li>Packet opened · {formatWhen(s.updatedAt)}</li>
                    <li>
                      Status lock · {s.status} · {s.carrier}
                    </li>
                    <li>
                      Lane vector · {s.origin} → {s.destination}
                    </li>
                    {ex.map((e) => (
                      <li>
                        Fault {e.type} ({e.severity}) · {formatWhen(e.openedAt)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Show when={() => ex.length > 0}>
                {() => (
                  <div class="hud-panel">
                    <div class="hud-panel__inner">
                      <h2 class="hud-panel__title">
                        <span class="led led--amber" />
                        Linked exceptions
                      </h2>
                      {ex.map((e) => (
                        <div class="ex-row">
                          <span class={severityChipClass(e.severity)}>
                            {e.severity}
                          </span>
                          <div class="mono">
                            {e.type} · {e.note}
                          </div>
                          <span class="mono muted">
                            {e.acked ? "ACK" : "OPEN"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Show>
            </div>
          );
        }}
      </Show>

      <Dialog
        open={etaOpen}
        onClose={() => etaOpen.set(false)}
        title="Recalibrate ETA"
        description="Writes through the fake API — same pattern as your backend."
      >
        <Stack gap={3}>
          <Field label="ETA (ISO local)">
            <Input bind={etaDraft} placeholder="2026-09-02T14:00" />
          </Field>
          <div class="row-gap">
            <Button
              disabled={() => saving()}
              onClick={() => {
                void (async () => {
                  saving.set(true);
                  try {
                    const iso = new Date(etaDraft()).toISOString();
                    await api.patch(`/shipments/${id}`, { eta: iso });
                    etaOpen.set(false);
                    await detail.refetch();
                    toaster.push({
                      title: "ETA locked",
                      description: id,
                      tone: "success",
                    });
                  } catch (e) {
                    toaster.push({
                      title: "Write failed",
                      description: String(e),
                      tone: "danger",
                    });
                  } finally {
                    saving.set(false);
                  }
                })();
              }}
            >
              {() => (saving() ? "Writing…" : "Commit")}
            </Button>
            <Button variant="ghost" onClick={() => etaOpen.set(false)}>
              Cancel
            </Button>
          </div>
        </Stack>
      </Dialog>
    </div>
  );
}
