import { Alert, Button, Spinner, Table } from "@lab206/ui";
import type { Router } from "@lab206/router";
import { PageChrome } from "../components/PageChrome.js";
import { accountDetailQuery, money } from "../data/api.js";

export function AccountDetailPage(props: { router: Router; id: string }) {
  const { router, id } = props;
  const q = accountDetailQuery(() => id);

  return (
    <PageChrome
      router={router}
      title="Account"
      purpose="Balance, availability, and recent transactions for this product."
      crumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Accounts", href: "/accounts" },
        { label: id },
      ]}
      actions={
        <Button size="sm" onClick={() => router.navigate("/transfer")}>
          Transfer →
        </Button>
      }
    >
      {() => {
        if (q.loading()) return <Spinner label="Loading account…" />;
        if (q.error())
          return (
            <Alert tone="danger" title="Not found">
              {String(q.error())}
            </Alert>
          );
        const data = q();
        if (!data) return null;
        const { account: a, transactions } = data;

        return (
          <div class="stack-gap">
            <div class="panel">
              <div class="panel__inner">
                <div class="account-card__top">
                  <span class="account-card__type">{a.type}</span>
                  <span class="mono muted">···{a.mask}</span>
                </div>
                <h2 style={{ margin: "0.35rem 0 0.5rem", fontSize: "1.35rem" }}>
                  {a.name}
                </h2>
                <div class="account-card__bal">{money(a.balance)}</div>
                <p class="muted" style={{ margin: "0.35rem 0 0" }}>
                  Available {money(a.available)} · {a.currency}
                </p>
              </div>
            </div>

            <div class="panel">
              <div class="panel__inner">
                <h2 class="panel__title">Transactions</h2>
                <Table
                  rowKey="id"
                  columns={[
                    {
                      key: "postedAt",
                      header: "When",
                      cell: (row) =>
                        new Date(String(row.postedAt)).toLocaleString(),
                    },
                    {
                      key: "description",
                      header: "Description",
                      cell: (row) => (
                        <div>
                          <div>{String(row.description)}</div>
                          <div class="muted" style={{ fontSize: "0.78rem" }}>
                            {String(row.category)}
                          </div>
                        </div>
                      ),
                    },
                    {
                      key: "status",
                      header: "Status",
                      cell: (row) => (
                        <span class={`chip chip--${String(row.status)}`}>
                          {String(row.status)}
                        </span>
                      ),
                    },
                    {
                      key: "amount",
                      header: "Amount",
                      align: "right",
                      cell: (row) => {
                        const n = Number(row.amount);
                        return (
                          <span class={n < 0 ? "is-debit" : "is-credit"}>
                            {money(n)}
                          </span>
                        );
                      },
                    },
                  ]}
                  rows={transactions as unknown as Record<string, unknown>[]}
                />
              </div>
            </div>
          </div>
        );
      }}
    </PageChrome>
  );
}
