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
      title="Dashboard"
      purpose="Liquidity, workflows, and pending approvals for the business."
      crumbs={[
        { label: "Bank Power" },
        { label: "Dashboard" },
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
          A sample <b>business banking console</b> — operating accounts,
          automated workflows, capital products, and cards. Fake data; same
          Powers UI kit as Lab and System.
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
            Operating, payroll, and reserve with available balances.
          </div>
        </button>
        <button
          type="button"
          class="next-step"
          onClick={() => router.navigate("/workflows")}
        >
          <div class="next-step__n">Step 2</div>
          <div class="next-step__t">Check workflows</div>
          <div class="next-step__d">
            Pause, resume, or clear automation errors.
          </div>
        </button>
        <button
          type="button"
          class="next-step"
          onClick={() => router.navigate("/capital")}
        >
          <div class="next-step__n">Step 3</div>
          <div class="next-step__t">Explore capital</div>
          <div class="next-step__d">Facility and loan products for growth.</div>
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
              <p class="kpi__label">Total liquidity</p>
              <p class="kpi__value">{money(kpi.totalBalance)}</p>
              <p class="kpi__help">
                Sum of operating, payroll, and reserve balances.
              </p>
            </div>
            <div class="panel kpi">
              <p class="kpi__label">Monthly revenue</p>
              <p class="kpi__value">{money(kpi.monthRevenue)}</p>
              <p class="kpi__help">Indicative inflow for the walkthrough.</p>
            </div>
            <div class="panel kpi">
              <p class="kpi__label">Pending approvals</p>
              <p class="kpi__value">{String(kpi.pendingApprovals)}</p>
              <p class="kpi__help">
                Payments and workflow exceptions that need attention.
              </p>
            </div>
            <div class="panel kpi">
              <p class="kpi__label">Active workflows</p>
              <p class="kpi__value">{String(kpi.activeWorkflows)}</p>
              <p class="kpi__help">Automations currently running.</p>
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
