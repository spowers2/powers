import { Show } from "@lab206/dom";
import type { Router } from "@lab206/router";
import {
  Alert,
  Button,
  Empty,
  Spinner,
  Table,
  type ToastController,
} from "@lab206/ui";
import { partnersQuery } from "../data/api.js";
import type { Partner } from "../data/types.js";

export function PartnersPage(props: {
  router: Router;
  toaster: ToastController;
}) {
  void props.toaster;

  return (
    <div class="stack-gap">
      <div class="page-head">
        <div>
          <h1>Partners</h1>
          <p>Carriers, consignees, and brokers on this sample network</p>
        </div>
        <Button
          size="sm"
          variant="soft"
          onClick={() => void partnersQuery.refetch()}
        >
          Refresh
        </Button>
      </div>

      <Show when={() => partnersQuery.loading() && !partnersQuery.latest()}>
        {() => (
          <div class="row-gap mono muted">
            <Spinner /> Loading partners…
          </div>
        )}
      </Show>
      <Show when={() => !!partnersQuery.error()}>
        {() => (
          <Alert tone="danger" title="Couldn’t load partners">
            {() => String(partnersQuery.error())}
          </Alert>
        )}
      </Show>
      <Show
        when={() => !!partnersQuery() && partnersQuery()!.length === 0}
      >
        {() => (
          <Empty
            title="No partners"
            description="No partner records in this demo dataset."
          />
        )}
      </Show>

      <Show when={() => (partnersQuery()?.length ?? 0) > 0}>
        {() => (
          <div class="hud-panel lp-table-wrap">
            <div class="hud-panel__inner">
              <h2 class="hud-panel__title">
                <span class="led led--cyan" />
                Partner list
              </h2>
              <Table
                columns={[
                  { key: "name", header: "Partner" },
                  { key: "type", header: "Type" },
                  {
                    key: "score",
                    header: "Score",
                    cell: (row) => `${(row as Partner).score}`,
                  },
                  {
                    key: "activeShipments",
                    header: "Active",
                    cell: (row) => `${(row as Partner).activeShipments}`,
                  },
                ]}
                rows={() => partnersQuery()!}
                rowKey="id"
              />
              <p class="mono muted" style={{ marginTop: "0.75rem" }}>
                A simpler list view — same Powers table kit as the dense
                shipment screen.
              </p>
            </div>
          </div>
        )}
      </Show>
    </div>
  );
}
