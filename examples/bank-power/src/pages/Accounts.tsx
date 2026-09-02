import { Alert, Button, Spinner } from "@lab206/ui";
import type { Router } from "@lab206/router";
import { PageChrome } from "../components/PageChrome.js";
import { accountsQuery, money } from "../data/api.js";

export function AccountsPage(props: { router: Router }) {
  const { router } = props;

  return (
    <PageChrome
      router={router}
      title="Accounts"
      purpose="Every product on this profile. Open one for history and available balance."
      crumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Accounts" },
      ]}
      actions={
        <Button size="sm" variant="soft" onClick={() => router.navigate("/transfer")}>
          Transfer →
        </Button>
      }
    >
      {() => {
        const q = accountsQuery;
        if (q.loading()) return <Spinner label="Loading accounts…" />;
        if (q.error())
          return (
            <Alert tone="danger" title="Couldn’t load">
              {String(q.error())}
            </Alert>
          );
        const rows = q() ?? [];
        if (!rows.length)
          return <Alert tone="info" title="No accounts">Nothing seeded.</Alert>;

        return (
          <div class="account-grid">
            {rows.map((a) => (
              <button
                type="button"
                class="account-card account-card--lg"
                onClick={() => router.navigate(`/accounts/${a.id}`)}
              >
                <div class="account-card__top">
                  <span class="account-card__type">{a.type}</span>
                  <span class="mono muted">···{a.mask}</span>
                </div>
                <div class="account-card__name">{a.name}</div>
                <div class="account-card__bal">{money(a.balance)}</div>
                <div class="muted" style={{ fontSize: "0.85rem" }}>
                  Available {money(a.available)}
                </div>
              </button>
            ))}
          </div>
        );
      }}
    </PageChrome>
  );
}
