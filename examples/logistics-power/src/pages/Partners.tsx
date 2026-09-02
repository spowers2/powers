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
import { PageChrome } from "../components/PageChrome.js";

export function PartnersPage(props: {
  router: Router;
  toaster: ToastController;
}) {
  void props.toaster;
  const { router } = props;

  return (
    <PageChrome
      router={router}
      title="Partners"
      purpose="See who is moving freight. Score is a demo reliability rating; Active is how many loads they have open."
      crumbs={[
        { label: "Overview", href: "/" },
        { label: "Partners" },
      ]}
      actions={
        <Button
          size="sm"
          variant="soft"
          onClick={() => void partnersQuery.refetch()}
        >
          Refresh
        </Button>
      }
    >
      <Show when={() => partnersQuery.loading() && !partnersQuery.latest()}>
        {() => (
          <div class="row-gap muted">
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
          <div class="panel lp-table-wrap">
            <div class="panel__inner">
              <h2 class="panel__title">Partner directory</h2>
              <Table
                columns={[
                  { key: "name", header: "Name" },
                  { key: "type", header: "Role" },
                  {
                    key: "score",
                    header: "Reliability",
                    cell: (row) => `${(row as Partner).score}/100`,
                  },
                  {
                    key: "activeShipments",
                    header: "Active loads",
                    cell: (row) => `${(row as Partner).activeShipments}`,
                  },
                ]}
                rows={() => partnersQuery()!}
                rowKey="id"
              />
              <div class="row-gap" style={{ marginTop: "0.85rem" }}>
                <Button
                  size="sm"
                  variant="soft"
                  onClick={() => router.navigate("/shipments")}
                >
                  Browse shipments →
                </Button>
              </div>
            </div>
          </div>
        )}
      </Show>
    </PageChrome>
  );
}
