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
import { PageChrome } from "../components/PageChrome.js";

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
    <PageChrome
      router={router}
      title="Shipment detail"
      purpose="Inspect one load: route, status, timeline, and related issues. Update the ETA if plans change."
      crumbs={[
        { label: "Overview", href: "/" },
        { label: "Shipments", href: "/shipments" },
        { label: id || "Detail" },
      ]}
      actions={
        <>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.navigate("/shipments")}
          >
            ← Back to list
          </Button>
          <Button
            size="sm"
            variant="soft"
            onClick={() => void detail.refetch()}
          >
            Refresh
          </Button>
        </>
      }
    >
      <Show when={() => detail.loading() && !detail.latest()}>
        {() => (
          <div class="row-gap muted">
            <Spinner /> Loading shipment…
          </div>
        )}
      </Show>
      <Show when={() => !!detail.error()}>
        {() => (
          <Alert tone="danger" title="Couldn’t load shipment">
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
              <div class="panel">
                <div class="panel__inner">
                  <h2 class="panel__title">{s.reference}</h2>
                  <Stack gap={3}>
                    <div class="row-gap">
                      {formatLane(s.origin, s.destination)}
                      <span class={statusChipClass(s.status)}>{s.status}</span>
                      <span class="chip">priority P{s.priority}</span>
                    </div>
                    <div class="muted">
                      Carrier <b>{s.carrier}</b> ·{" "}
                      {s.weightKg.toLocaleString()} kg · ETA{" "}
                      <b>{formatWhen(s.eta)}</b> · Updated{" "}
                      {formatWhen(s.updatedAt)}
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
                        Go to issues
                      </Button>
                    </div>
                  </Stack>
                </div>
              </div>

              <div class="panel">
                <div class="panel__inner">
                  <h2 class="panel__title">What happened so far</h2>
                  <ul class="timeline">
                    <li>Last update · {formatWhen(s.updatedAt)}</li>
                    <li>
                      Status is <b>{s.status}</b> with {s.carrier}
                    </li>
                    <li>
                      Route {s.origin} → {s.destination}
                    </li>
                    {ex.map((e) => (
                      <li>
                        Issue logged: {e.type.replaceAll("_", " ")} (
                        {e.severity}) · {formatWhen(e.openedAt)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Show when={() => ex.length > 0}>
                {() => (
                  <div class="panel">
                    <div class="panel__inner">
                      <h2 class="panel__title">Related issues</h2>
                      {ex.map((e) => (
                        <div class="ex-row">
                          <span class={severityChipClass(e.severity)}>
                            {e.severity}
                          </span>
                          <div>
                            <div class="mono">
                              {e.type.replaceAll("_", " ")}
                            </div>
                            <div class="muted">{e.note}</div>
                          </div>
                          <span class="muted">
                            {e.acked ? "Acknowledged" : "Still open"}
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
        title="Update ETA"
        description="Saves through the demo API — same pattern you’d use with your real backend."
      >
        <Stack gap={3}>
          <Field label="New arrival time">
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
                      title: "ETA updated",
                      description: id,
                      tone: "success",
                    });
                  } catch (e) {
                    toaster.push({
                      title: "Couldn’t save",
                      description: String(e),
                      tone: "danger",
                    });
                  } finally {
                    saving.set(false);
                  }
                })();
              }}
            >
              {() => (saving() ? "Saving…" : "Save")}
            </Button>
            <Button variant="ghost" onClick={() => etaOpen.set(false)}>
              Cancel
            </Button>
          </div>
        </Stack>
      </Dialog>
    </PageChrome>
  );
}
