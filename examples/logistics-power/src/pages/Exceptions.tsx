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
import { PageChrome } from "../components/PageChrome.js";

export function ExceptionsPage(props: {
  router: Router;
  toaster: ToastController;
}) {
  const { router, toaster } = props;

  return (
    <PageChrome
      router={router}
      title="Issues"
      purpose="Work the problem queue. Acknowledge an issue when it’s handled, or open the related shipment."
      crumbs={[
        { label: "Overview", href: "/" },
        { label: "Issues" },
      ]}
      actions={
        <Button
          size="sm"
          variant="soft"
          onClick={() => void exceptionsQuery.refetch()}
        >
          Refresh
        </Button>
      }
    >
      <div class="panel">
        <div class="panel__inner">
          <h2 class="panel__title">Open queue</h2>
          <p class="muted" style={{ margin: "0 0 0.75rem", fontSize: "0.88rem" }}>
            <b>critical / high</b> = act first · <b>Acknowledge</b> removes it
            from this list and updates the Overview KPI.
          </p>
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
              <Empty
                title="No open issues"
                description="You’re caught up. Check Shipments if you want to browse the network."
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
                        {ex.type.replaceAll("_", " ")} · {ex.shipmentId}
                      </div>
                      <div class="muted" style={{ fontSize: "0.85rem" }}>
                        {ex.note}
                      </div>
                      <div class="muted" style={{ fontSize: "0.8rem" }}>
                        Opened {formatWhen(ex.openedAt)}
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
                        Open shipment
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
                                title: "Issue acknowledged",
                                description: ex.id,
                                tone: "success",
                              });
                            } catch (e) {
                              toaster.push({
                                title: "Couldn’t acknowledge",
                                description: String(e),
                                tone: "danger",
                              });
                            }
                          })();
                        }}
                      >
                        Acknowledge
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Show>
        </div>
      </div>
    </PageChrome>
  );
}
