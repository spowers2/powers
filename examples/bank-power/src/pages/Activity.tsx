import { Alert, Button, Input, Spinner } from "@lab206/ui";
import type { Router } from "@lab206/router";
import { PageChrome } from "../components/PageChrome.js";
import {
  activityQ,
  activityStatus,
  money,
  transactionsQuery,
} from "../data/api.js";
import type { TxStatus } from "../data/types.js";

const STATUSES: Array<TxStatus | ""> = ["", "posted", "pending", "failed"];

export function ActivityPage(props: { router: Router }) {
  const { router } = props;

  return (
    <PageChrome
      router={router}
      title="Activity"
      purpose="Cross-account feed. Filter by status or search a merchant."
      crumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Activity" },
      ]}
    >
      <div class="panel">
        <div class="panel__inner stack-gap">
          <div class="row-gap">
            <Input
              placeholder="Search description or category"
              value={() => activityQ()}
              onInput={(e: Event) =>
                activityQ.set((e.target as HTMLInputElement).value)
              }
            />
            {STATUSES.map((s) => (
              <button
                type="button"
                class={() =>
                  activityStatus() === s ? "chip is-selected" : "chip chip--dim"
                }
                onClick={() => activityStatus.set(s)}
              >
                {s || "all"}
              </button>
            ))}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                activityQ.set("");
                activityStatus.set("");
              }}
            >
              Clear
            </Button>
          </div>

          {() => {
            const q = transactionsQuery;
            if (q.loading()) return <Spinner label="Loading activity…" />;
            if (q.error())
              return (
                <Alert tone="danger" title="Couldn’t load">
                  {String(q.error())}
                </Alert>
              );
            const rows = q() ?? [];
            if (!rows.length)
              return (
                <Alert tone="info" title="No matches">
                  Try clearing filters.
                </Alert>
              );
            return (
              <ul class="tx-list">
                {rows.map((t) => (
                  <li class="tx-row">
                    <div>
                      <div class="tx-row__desc">{t.description}</div>
                      <div class="muted" style={{ fontSize: "0.8rem" }}>
                        {t.category} · {t.status} ·{" "}
                        {new Date(t.postedAt).toLocaleString()}
                      </div>
                    </div>
                    <div
                      class={
                        t.amount < 0
                          ? "tx-row__amt is-debit"
                          : "tx-row__amt is-credit"
                      }
                    >
                      {money(t.amount)}
                    </div>
                  </li>
                ))}
              </ul>
            );
          }}
        </div>
      </div>
    </PageChrome>
  );
}
