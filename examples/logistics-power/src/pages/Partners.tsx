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
          <h1>Partner mesh</h1>
          <p>Carriers · consignees · brokers</p>
        </div>
        <Button
          size="sm"
          variant="soft"
          onClick={() => void partnersQuery.refetch()}
        >
          Sync mesh
        </Button>
      </div>

      <Show when={() => partnersQuery.loading() && !partnersQuery.latest()}>
        {() => (
          <div class="row-gap mono muted">
            <Spinner /> Mapping partner nodes…
          </div>
        )}
      </Show>
      <Show when={() => !!partnersQuery.error()}>
        {() => (
          <Alert tone="danger" title="Mesh fault">
            {() => String(partnersQuery.error())}
          </Alert>
        )}
      </Show>
      <Show
        when={() => !!partnersQuery() && partnersQuery()!.length === 0}
      >
        {() => (
          <Empty title="No partners" description="Seed uplink returned empty." />
        )}
      </Show>

      <Show when={() => (partnersQuery()?.length ?? 0) > 0}>
        {() => (
          <div class="hud-panel lp-table-wrap">
            <div class="hud-panel__inner">
              <h2 class="hud-panel__title">
                <span class="led led--cyan" />
                Active nodes
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
                Portal-style surface — simpler than the shipment matrix, same
                kit.
              </p>
            </div>
          </div>
        )}
      </Show>
    </div>
  );
}
