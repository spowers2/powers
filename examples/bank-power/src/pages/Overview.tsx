import { Button, Spinner, Alert } from "@lab206/ui";
import type { Router } from "@lab206/router";
import type { ToastController } from "@lab206/ui";
import { PageChrome } from "../components/PageChrome.js";
import {
  accountsQuery,
  kpisQuery,
  money,
  transactionsQuery,
} from "../data/api.js";

export function OverviewPage(props: {
  router: Router;
  toaster: ToastController;
}) {
  const { router } = props;

  return (
    <PageChrome
      router={router}
      title="Overview"
      purpose="See balances at a glance, then jump into accounts, transfers, or cards."
      crumbs={[
        { label: "Bank Power" },
        { label: "Overview" },
      ]}
      actions={
        <>
          <Button size="sm" variant="soft" onClick={() => kpisQuery.refetch()}>
            Refresh
          </Button>
          <Button size="sm" onClick={() => router.navigate("/transfer")}>
            Transfer →
          </Button>
        </>
      }
    >
      <div class="demo-banner">
        <strong>What is this demo?</strong>
        <p>
          A sample <b>personal banking app</b> — balances, activity, transfers,
          and cards. Fake data; same Powers UI kit as Lab and System.
        </p>
      </div>

      <div class="next-steps" aria-label="Suggested path">
        <button
          type="button"
          class="next-step"
          onClick={() => router.navigate("/accounts")}
        >
          <div class="next-step__n">Step 1</div>
          <div class="next-step__t">Review accounts</div>
          <div class="next-step__d">
            Checking, savings, and credit with available balances.
          </div>
        </button>
        <button
          type="button"
          class="next-step"
          onClick={() => router.navigate("/transfer")}
        >
          <div class="next-step__n">Step 2</div>
          <div class="next-step__t">Move money</div>
          <div class="next-step__d">
            Transfer between accounts with a confirm step.
          </div>
        </button>
        <button
          type="button"
          class="next-step"
          onClick={() => router.navigate("/cards")}
        >
          <div class="next-step__n">Step 3</div>
          <div class="next-step__t">Manage cards</div>
          <div class="next-step__d">Freeze or unfreeze debit and credit.</div>
        </button>
      </div>

      {() => {
        const k = kpisQuery;
        if (k.loading()) return <Spinner label="Loading balances…" />;
        if (k.error())
          return (
            <Alert tone="danger" title="Couldn’t load">
              {String(k.error())}
            </Alert>
          );
        const kpi = k();
        if (!kpi) return null;
        return (
          <div class="kpi-grid">
            <div class="panel kpi">
              <p class="kpi__label">Total cash</p>
              <p class="kpi__value">{money(kpi.totalBalance)}</p>
              <p class="kpi__help">
                Checking + savings. Credit balance is tracked separately.
              </p>
            </div>
            <div class="panel kpi">
              <p class="kpi__label">Month spend</p>
              <p class="kpi__value">{money(kpi.monthSpend)}</p>
              <p class="kpi__help">Posted and pending debits this period.</p>
            </div>
            <div class="panel kpi">
              <p class="kpi__label">Pending</p>
              <p class="kpi__value">{String(kpi.pendingCount)}</p>
              <p class="kpi__help">
                Authorizations not yet posted. Open Activity to review.
              </p>
            </div>
            <div class="panel kpi">
              <p class="kpi__label">Accounts</p>
              <p class="kpi__value">{String(kpi.accountCount)}</p>
              <p class="kpi__help">Products on this demo profile.</p>
            </div>
          </div>
        );
      }}

      {() => {
        const q = accountsQuery;
        if (q.loading()) return <Spinner label="Loading accounts…" />;
        if (q.error()) return null;
        const rows = q() ?? [];
        return (
          <div class="panel">
            <div class="panel__inner">
              <h2 class="panel__title">Accounts</h2>
              <div class="account-grid">
                {rows.map((a) => (
                  <button
                    type="button"
                    class="account-card"
                    onClick={() => router.navigate(`/accounts/${a.id}`)}
                  >
                    <div class="account-card__top">
                      <span class="account-card__type">{a.type}</span>
                      <span class="mono muted">···{a.mask}</span>
                    </div>
                    <div class="account-card__name">{a.name}</div>
                    <div class="account-card__bal">{money(a.balance)}</div>
                    <div class="muted" style={{ fontSize: "0.8rem" }}>
                      Available {money(a.available)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      }}

      {() => {
        const q = transactionsQuery;
        if (q.loading()) return null;
        const rows = (q() ?? []).slice(0, 5);
        return (
          <div class="panel">
            <div class="panel__inner">
              <div class="row-gap" style={{ justifyContent: "space-between" }}>
                <h2 class="panel__title" style={{ margin: 0 }}>
                  Recent activity
                </h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => router.navigate("/activity")}
                >
                  See all →
                </Button>
              </div>
              <ul class="tx-list">
                {rows.map((t) => (
                  <li class="tx-row">
                    <div>
                      <div class="tx-row__desc">{t.description}</div>
                      <div class="muted" style={{ fontSize: "0.8rem" }}>
                        {t.category} · {t.status}
                      </div>
                    </div>
                    <div
                      class={
                        t.amount < 0 ? "tx-row__amt is-debit" : "tx-row__amt is-credit"
                      }
                    >
                      {money(t.amount)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      }}
    </PageChrome>
  );
}
