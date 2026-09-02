import { Show } from "@lab206/dom";
import type { Router } from "@lab206/router";
import {
  Alert,
  Button,
  Empty,
  Spinner,
  type ToastController,
} from "@lab206/ui";
import { api, exceptionsQuery } from "../data/api.js";
import {
  formatWhen,
  severityChipClass,
} from "../components/status.js";

export function ExceptionsPage(props: {
  router: Router;
  toaster: ToastController;
}) {
  const { router, toaster } = props;

  return (
    <div class="stack-gap">
      <div class="page-head">
        <div>
          <h1>Exception bus</h1>
          <p>Open faults · acknowledge to clear KPI pressure</p>
        </div>
        <Button
          size="sm"
          variant="soft"
          onClick={() => void exceptionsQuery.refetch()}
        >
          Rescan
        </Button>
      </div>

      <div class="hud-panel">
        <div class="hud-panel__inner">
          <h2 class="hud-panel__title">
            <span class="led led--red" />
            Live queue
          </h2>
          <Show
            when={() =>
              exceptionsQuery.loading() && !exceptionsQuery.latest()
            }
          >
            {() => (
              <div class="row-gap mono muted">
                <Spinner /> Polling fault bus…
              </div>
            )}
          </Show>
          <Show when={() => !!exceptionsQuery.error()}>
            {() => (
              <Alert tone="danger" title="Bus offline">
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
              <Empty
                title="Queue clear"
                description="No open exceptions. Network nominal."
              />
            )}
          </Show>
          <Show when={() => (exceptionsQuery()?.length ?? 0) > 0}>
            {() => (
              <div>
                {exceptionsQuery()!.map((ex) => (
                  <div class="ex-row">
                    <span class={severityChipClass(ex.severity)}>
                      {ex.severity}
                    </span>
                    <div>
                      <div class="mono">
                        {ex.type} · {ex.shipmentId}
                      </div>
                      <div class="mono muted">{ex.note}</div>
                      <div class="mono muted">
                        {formatWhen(ex.openedAt)}
                      </div>
                    </div>
                    <div class="row-gap">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          router.navigate(`/shipments/${ex.shipmentId}`)
                        }
                      >
                        Trace
                      </Button>
                      <Button
                        size="sm"
                        variant="soft"
                        onClick={() => {
                          void (async () => {
                            try {
                              await api.post(`/exceptions/${ex.id}/ack`);
                              await exceptionsQuery.refetch();
                              toaster.push({
                                title: "ACK committed",
                                description: ex.id,
                                tone: "success",
                              });
                            } catch (e) {
                              toaster.push({
                                title: "ACK failed",
                                description: String(e),
                                tone: "danger",
                              });
                            }
                          })();
                        }}
                      >
                        ACK
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Show>
        </div>
      </div>
    </div>
  );
}
