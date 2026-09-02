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
import { PageChrome } from "../components/PageChrome.js";
import { StatusLegend } from "../components/StatusLegend.js";

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
    <PageChrome
      router={router}
      title="Shipments"
      purpose="Find a load, then click the row to see detail, ETA, and related issues."
      crumbs={[
        { label: "Overview", href: "/" },
        { label: "Shipments" },
      ]}
      actions={
        <Button
          size="sm"
          variant="soft"
          onClick={() => void shipmentsQuery.refetch()}
        >
          Refresh list
        </Button>
      }
    >
      <StatusLegend />

      <div class="panel">
        <div class="panel__inner">
          <h2 class="panel__title">Filter the list</h2>
          <p class="muted" style={{ margin: "0 0 0.65rem", fontSize: "0.88rem" }}>
            Pick a status chip, type a search, then press Search (or Enter).
          </p>
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
            <Field label="Search reference, carrier, or airport (e.g. ORD)">
              <Input
                bind={draftQ}
                placeholder="LP-240… or ORD"
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
          <div class="row-gap muted">
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
            description="Try “all” status or clear the search box."
          />
        )}
      </Show>

      <Show when={() => (shipmentsQuery()?.items.length ?? 0) > 0}>
        {() => (
          <div class="panel lp-table-wrap">
            <div class="panel__inner">
              <h2 class="panel__title">
                Results · {() => shipmentsQuery()!.total} shipments · click a
                row
              </h2>
              <Table
                columns={[
                  { key: "reference", header: "Reference" },
                  {
                    key: "lane",
                    header: "From → To",
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
                    header: "Priority",
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
                  Previous page
                </Button>
                <span class="muted">
                  Page {() => page()} of{" "}
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
                  Next page
                </Button>
              </div>
            </div>
          </div>
        )}
      </Show>
    </PageChrome>
  );
}
