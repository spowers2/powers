import { Show } from "@lab206/dom";
import type { Router } from "@lab206/router";
import {
  Alert,
  Button,
  Spinner,
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
      <div class="demo-banner">
        <strong>Powers demo · logistics ops</strong>
        <p>
          This is a <b>sample freight control tower</b> — the kind of data-heavy
          app agencies and product teams build for clients. Click a KPI issue,
          open the shipment list, or drill into a row. Built with the same Powers
          components as Lab and System (not a real TMS).
        </p>
      </div>

      <div class="page-head">
        <div>
          <h1>Overview</h1>
          <p>Live KPIs and issues that need attention</p>
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
            Refresh
          </Button>
          <Button size="sm" onClick={() => router.navigate("/shipments")}>
            View shipments
          </Button>
        </div>
      </div>

      <Show when={() => kpisQuery.loading() && !kpisQuery.latest()}>
        {() => (
          <div class="row-gap mono muted">
            <Spinner /> Loading KPIs…
          </div>
        )}
      </Show>
      <Show when={() => !!kpisQuery.error()}>
        {() => (
          <Alert tone="danger" title="Couldn’t load KPIs">
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
                  <p class="kpi__label">On-time %</p>
                  <p
                    class={() =>
                      k.onTimePct < 85
                        ? "kpi__value kpi__value--warn"
                        : "kpi__value"
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
                  <p class="kpi__label">Open issues</p>
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
                  <p class="kpi__label">Avg dwell (hours)</p>
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
            Issues needing attention
          </h2>
          <Show
            when={() =>
              exceptionsQuery.loading() && !exceptionsQuery.latest()
            }
          >
            {() => (
              <div class="row-gap mono muted">
                <Spinner /> Loading issues…
              </div>
            )}
          </Show>
          <Show when={() => !!exceptionsQuery.error()}>
            {() => (
              <Alert tone="danger" title="Couldn’t load issues">
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
              <p class="mono muted">No open issues — network looks healthy.</p>
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
                          {ex.type.replaceAll("_", " ")} · {ex.shipmentId}
                        </div>
                        <div class="mono muted">{ex.note}</div>
                      </div>
                      <div class="stack-gap" style={{ gap: "0.35rem" }}>
                        <span class="mono muted">
                          {formatWhen(ex.openedAt)}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            router.navigate(`/shipments/${ex.shipmentId}`)
                          }
                        >
                          Open shipment
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
                    See all issues
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
