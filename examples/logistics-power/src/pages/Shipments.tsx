import { signal } from "@lab206/core";
import { Show } from "@lab206/dom";
import type { Router } from "@lab206/router";
import {
  Alert,
  Button,
  Empty,
  Field,
  Input,
  Spinner,
  Table,
  type ToastController,
} from "@lab206/ui";
import {
  filterQ,
  filterStatus,
  page,
  shipmentsQuery,
} from "../data/api.js";
import type { Shipment, ShipmentStatus } from "../data/types.js";
import {
  formatLane,
  formatWhen,
  statusChipClass,
} from "../components/status.js";

const STATUS_FILTERS: Array<ShipmentStatus | ""> = [
  "",
  "in_transit",
  "at_risk",
  "booked",
  "delivered",
  "draft",
  "cancelled",
];

export function ShipmentsPage(props: {
  router: Router;
  toaster: ToastController;
}) {
  const { router } = props;
  const draftQ = signal(filterQ());

  return (
    <div class="stack-gap">
      <div class="page-head">
        <div>
          <h1>Shipments</h1>
          <p>Search and filter 640 sample shipments — click a row for detail</p>
        </div>
        <Button
          size="sm"
          variant="soft"
          onClick={() => void shipmentsQuery.refetch()}
        >
          Refresh
        </Button>
      </div>

      <div class="hud-panel">
        <div class="hud-panel__inner">
          <h2 class="hud-panel__title">
            <span class="led led--cyan" />
            Filters
          </h2>
          <div class="row-gap">
            {STATUS_FILTERS.map((s) => (
              <button
                type="button"
                class={() =>
                  filterStatus() === s ? "chip" : "chip chip--dim"
                }
                onClick={() => {
                  filterStatus.set(s);
                  page.set(1);
                }}
              >
                {s === "" ? "all" : s}
              </button>
            ))}
          </div>
          <div class="row-gap" style={{ marginTop: "0.75rem" }}>
            <Field label="Search by reference, carrier, or airport code">
              <Input
                bind={draftQ}
                placeholder="e.g. LP-240 or ORD"
                onKeyDown={(e: KeyboardEvent) => {
                  if (e.key === "Enter") {
                    filterQ.set(draftQ());
                    page.set(1);
                  }
                }}
              />
            </Field>
            <Button
              size="sm"
              onClick={() => {
                filterQ.set(draftQ());
                page.set(1);
              }}
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      <Show when={() => shipmentsQuery.loading() && !shipmentsQuery.latest()}>
        {() => (
          <div class="row-gap mono muted">
            <Spinner /> Loading shipments…
          </div>
        )}
      </Show>
      <Show when={() => !!shipmentsQuery.error()}>
        {() => (
          <Alert tone="danger" title="Couldn’t load shipments">
            {() => String(shipmentsQuery.error())}
          </Alert>
        )}
      </Show>
      <Show
        when={() =>
          !!shipmentsQuery() && shipmentsQuery()!.items.length === 0
        }
      >
        {() => (
          <Empty
            title="No shipments match"
            description="Try another status filter or clear the search."
          />
        )}
      </Show>

      <Show when={() => (shipmentsQuery()?.items.length ?? 0) > 0}>
        {() => (
          <div class="hud-panel lp-table-wrap">
            <div class="hud-panel__inner">
              <h2 class="hud-panel__title">
                <span class="led" />
                Results · {() => shipmentsQuery()!.total} shipments
              </h2>
              <Table
                columns={[
                  { key: "reference", header: "Ref" },
                  {
                    key: "lane",
                    header: "Lane",
                    cell: (row) =>
                      formatLane(
                        (row as Shipment).origin,
                        (row as Shipment).destination,
                      ),
                  },
                  {
                    key: "status",
                    header: "Status",
                    cell: (row) => (
                      <span
                        class={statusChipClass((row as Shipment).status)}
                      >
                        {(row as Shipment).status}
                      </span>
                    ),
                  },
                  { key: "carrier", header: "Carrier" },
                  {
                    key: "eta",
                    header: "ETA",
                    cell: (row) => formatWhen((row as Shipment).eta),
                  },
                  {
                    key: "priority",
                    header: "Pri",
                    cell: (row) => `P${(row as Shipment).priority}`,
                  },
                ]}
                rows={() => shipmentsQuery()!.items}
                rowKey="id"
                onRowClick={(row) =>
                  router.navigate(`/shipments/${(row as Shipment).id}`)
                }
              />
              <div class="row-gap" style={{ marginTop: "0.85rem" }}>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={() => page() <= 1}
                  onClick={() => page.update((p) => Math.max(1, p - 1))}
                >
                  Prev
                </Button>
                <span class="mono muted">
                  Page {() => page()} /{" "}
                  {() =>
                    Math.max(
                      1,
                      Math.ceil(
                        shipmentsQuery()!.total /
                          shipmentsQuery()!.pageSize,
                      ),
                    )
                  }
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={() => {
                    const d = shipmentsQuery();
                    if (!d) return true;
                    return page() * d.pageSize >= d.total;
                  }}
                  onClick={() => page.update((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Show>
    </div>
  );
}
