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
import { PageChrome } from "../components/PageChrome.js";

export function OverviewPage(props: {
  router: Router;
  toaster: ToastController;
}) {
  const { router } = props;

  return (
    <PageChrome
      router={router}
      title="Overview"
      purpose="Start here. See whether the network is healthy, then jump into shipments or open issues."
      crumbs={[{ label: "Logistics Power" }, { label: "Overview" }]}
      actions={
        <>
          <Button
            size="sm"
            variant="soft"
            onClick={() => {
              void kpisQuery.refetch();
              void exceptionsQuery.refetch();
            }}
          >
            Refresh numbers
          </Button>
          <Button size="sm" onClick={() => router.navigate("/shipments")}>
            Go to shipments →
          </Button>
        </>
      }
    >
      <div class="demo-banner">
        <strong>What is this demo?</strong>
        <p>
          A sample <b>freight operations console</b> — the kind of data-heavy app
          clients ask agencies to build. Use the three steps below, then explore
          the sidebar. Fake data; same Powers UI kit as Lab and System.
        </p>
      </div>

      <div class="next-steps" aria-label="Suggested path">
        <button
          type="button"
          class="next-step"
          onClick={() => router.navigate("/shipments")}
        >
          <div class="next-step__n">Step 1</div>
          <div class="next-step__t">Browse shipments</div>
          <div class="next-step__d">
            Filter by status, search a reference, click any row.
          </div>
        </button>
        <button
          type="button"
          class="next-step"
          onClick={() => router.navigate("/exceptions")}
        >
          <div class="next-step__n">Step 2</div>
          <div class="next-step__t">Clear open issues</div>
          <div class="next-step__d">
            Acknowledge problems that are blocking on-time delivery.
          </div>
        </button>
        <button
          type="button"
          class="next-step"
          onClick={() => router.navigate("/partners")}
        >
          <div class="next-step__n">Step 3</div>
          <div class="next-step__t">Check partners</div>
          <div class="next-step__d">
            See which carriers and brokers are carrying active freight.
          </div>
        </button>
      </div>

      <Show when={() => kpisQuery.loading() && !kpisQuery.latest()}>
        {() => (
          <div class="row-gap muted">
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
              <div class="panel kpi">
                <p class="kpi__label">On-time delivery</p>
                <p
                  class={() =>
                    k.onTimePct < 85
                      ? "kpi__value kpi__value--warn"
                      : "kpi__value"
                  }
                >
                  {k.onTimePct}%
                </p>
                <p class="kpi__help">
                  Share of delivered loads that arrived on schedule. Below 85%
                  usually means too many at-risk shipments.
                </p>
                <div class="kpi__bar">
                  <i style={{ width: `${k.onTimePct}%` }} />
                </div>
              </div>
              <div class="panel kpi">
                <p class="kpi__label">In transit now</p>
                <p class="kpi__value">{k.inTransit}</p>
                <p class="kpi__help">
                  Shipments currently moving or flagged at risk. Open Shipments
                  and filter to <b>in_transit</b> / <b>at_risk</b>.
                </p>
                <div class="kpi__bar">
                  <i style={{ width: "72%" }} />
                </div>
              </div>
              <div class="panel kpi">
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
                <p class="kpi__help">
                  Problems that still need an acknowledge (customs hold, dwell,
                  docs, etc.). Work these on the Issues page.
                </p>
                <div class="kpi__bar">
                  <i
                    style={{
                      width: `${Math.min(100, k.exceptionsOpen)}%`,
                      background: "linear-gradient(90deg,#b45309,#be123c)",
                    }}
                  />
                </div>
              </div>
              <div class="panel kpi">
                <p class="kpi__label">Avg dwell (hours)</p>
                <p class="kpi__value">{k.avgDwellHours}</p>
                <p class="kpi__help">
                  Average time freight sits waiting (yard, dock, handoff). Higher
                  numbers often explain at-risk ETAs.
                </p>
                <div class="kpi__bar">
                  <i style={{ width: "48%" }} />
                </div>
              </div>
            </div>
          );
        }}
      </Show>

      <div class="panel">
        <div class="panel__inner">
          <h2 class="panel__title">Issues needing attention</h2>
          <Show
            when={() =>
              exceptionsQuery.loading() && !exceptionsQuery.latest()
            }
          >
            {() => (
              <div class="row-gap muted">
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
              <p class="muted">No open issues — you’re caught up.</p>
            )}
          </Show>
          <Show when={() => (exceptionsQuery()?.length ?? 0) > 0}>
            {() => (
              <div>
                {exceptionsQuery()!
                  .slice(0, 5)
                  .map((ex) => (
                    <div class="ex-row">
                      <span class={severityChipClass(ex.severity)}>
                        {ex.severity}
                      </span>
                      <div>
                        <div class="mono">
                          {ex.type.replaceAll("_", " ")} · {ex.shipmentId}
                        </div>
                        <div class="muted" style={{ fontSize: "0.85rem" }}>
                          {ex.note}
                        </div>
                      </div>
                      <div class="stack-gap" style={{ gap: "0.35rem" }}>
                        <span class="muted" style={{ fontSize: "0.8rem" }}>
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
                    See all issues →
                  </Button>
                </div>
              </div>
            )}
          </Show>
        </div>
      </div>
    </PageChrome>
  );
}
