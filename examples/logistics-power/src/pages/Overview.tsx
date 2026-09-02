import { Show } from "@lab206/dom";
import type { Router } from "@lab206/router";
import {
  Alert,
  Button,
  Spinner,
  Stack,
  type ToastController,
} from "@lab206/ui";
import { exceptionsQuery, kpisQuery } from "../data/api.js";
import { formatWhen, severityChipClass } from "../components/status.js";

export function OverviewPage(props: {
  router: Router;
  toaster: ToastController;
}) {
  const { router } = props;

  return (
    <div class="stack-gap">
      <div class="page-head">
        <div>
          <h1>Command overview</h1>
          <p>Network telemetry · live board</p>
        </div>
        <div class="row-gap">
          <Button
            size="sm"
            variant="soft"
            onClick={() => {
              void kpisQuery.refetch();
              void exceptionsQuery.refetch();
            }}
          >
            Sync feeds
          </Button>
          <Button size="sm" onClick={() => router.navigate("/shipments")}>
            Open matrix
          </Button>
        </div>
      </div>

      <Show when={() => kpisQuery.loading() && !kpisQuery.latest()}>
        {() => (
          <div class="row-gap mono muted">
            <Spinner /> Acquiring KPI lock…
          </div>
        )}
      </Show>
      <Show when={() => !!kpisQuery.error()}>
        {() => (
          <Alert tone="danger" title="Uplink fault">
            {() => String(kpisQuery.error())}
          </Alert>
        )}
      </Show>

      <Show when={() => !!kpisQuery()}>
        {() => {
          const k = kpisQuery()!;
          return (
            <div class="kpi-grid">
              <div class="hud-panel kpi">
                <div class="hud-panel__inner">
                  <p class="kpi__label">On-time index</p>
                  <p
                    class={() =>
                      k.onTimePct < 85 ? "kpi__value kpi__value--warn" : "kpi__value"
                    }
                  >
                    {k.onTimePct}%
                  </p>
                  <div class="kpi__bar">
                    <i style={{ width: `${k.onTimePct}%` }} />
                  </div>
                </div>
              </div>
              <div class="hud-panel kpi">
                <div class="hud-panel__inner">
                  <p class="kpi__label">In transit</p>
                  <p class="kpi__value">{k.inTransit}</p>
                  <div class="kpi__bar">
                    <i style={{ width: "72%" }} />
                  </div>
                </div>
              </div>
              <div class="hud-panel kpi">
                <div class="hud-panel__inner">
                  <p class="kpi__label">Open exceptions</p>
                  <p
                    class={() =>
                      k.exceptionsOpen > 40
                        ? "kpi__value kpi__value--hot"
                        : "kpi__value kpi__value--warn"
                    }
                  >
                    {k.exceptionsOpen}
                  </p>
                  <div class="kpi__bar">
                    <i
                      style={{
                        width: `${Math.min(100, k.exceptionsOpen)}%`,
                        background: "linear-gradient(90deg,#fbbf24,#fb7185)",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div class="hud-panel kpi">
                <div class="hud-panel__inner">
                  <p class="kpi__label">Avg dwell (h)</p>
                  <p class="kpi__value">{k.avgDwellHours}</p>
                  <div class="kpi__bar">
                    <i style={{ width: "48%" }} />
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Show>

      <div class="hud-panel">
        <div class="hud-panel__inner">
          <h2 class="hud-panel__title">
            <span class="led led--amber" />
            Priority exceptions
          </h2>
          <Show when={() => exceptionsQuery.loading() && !exceptionsQuery.latest()}>
            {() => (
              <div class="row-gap mono muted">
                <Spinner /> Scanning fault bus…
              </div>
            )}
          </Show>
          <Show when={() => !!exceptionsQuery.error()}>
            {() => (
              <Alert tone="danger" title="Exception feed offline">
                {() => String(exceptionsQuery.error())}
              </Alert>
            )}
          </Show>
          <Show
            when={() =>
              !!exceptionsQuery() && exceptionsQuery()!.length === 0
            }
          >
            {() => (
              <p class="mono muted">No open exceptions on the fault bus.</p>
            )}
          </Show>
          <Show when={() => (exceptionsQuery()?.length ?? 0) > 0}>
            {() => (
              <div>
                {exceptionsQuery()!
                  .slice(0, 6)
                  .map((ex) => (
                    <div class="ex-row">
                      <span class={severityChipClass(ex.severity)}>
                        {ex.severity}
                      </span>
                      <div>
                        <div class="mono">
                          {ex.type} · {ex.shipmentId}
                        </div>
                        <div class="mono muted">{ex.note}</div>
                      </div>
                      <div class="stack-gap" style={{ gap: "0.35rem" }}>
                        <span class="mono muted">{formatWhen(ex.openedAt)}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            router.navigate(`/shipments/${ex.shipmentId}`)
                          }
                        >
                          Trace
                        </Button>
                      </div>
                    </div>
                  ))}
                <div class="row-gap" style={{ marginTop: "0.75rem" }}>
                  <Button
                    size="sm"
                    variant="soft"
                    onClick={() => router.navigate("/exceptions")}
                  >
                    Full exception queue
                  </Button>
                </div>
              </div>
            )}
          </Show>
        </div>
      </div>
    </div>
  );
}
