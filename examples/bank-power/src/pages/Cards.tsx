import {
  Alert,
  Button,
  Spinner,
  type ToastController,
} from "@lab206/ui";
import type { Router } from "@lab206/router";
import { PageChrome } from "../components/PageChrome.js";
import { cardsQuery, money, toggleCard } from "../data/api.js";

export function CardsPage(props: {
  router: Router;
  toaster: ToastController;
}) {
  const { router, toaster } = props;

  return (
    <PageChrome
      router={router}
      title="Cards"
      purpose="Debit and credit on this profile. Freeze instantly if something looks off."
      crumbs={[
        { label: "Overview", href: "/" },
        { label: "Cards" },
      ]}
    >
      {() => {
        const q = cardsQuery;
        if (q.loading()) return <Spinner label="Loading cards…" />;
        if (q.error())
          return (
            <Alert tone="danger" title="Couldn’t load">
              {String(q.error())}
            </Alert>
          );
        const rows = q() ?? [];

        return (
          <div class="card-grid">
            {rows.map((c) => (
              <div class={`pay-card pay-card--${c.status}`}>
                <div class="pay-card__net">{c.network}</div>
                <div class="pay-card__label">{c.label}</div>
                <div class="pay-card__num mono">···· ···· ···· {c.last4}</div>
                <div class="pay-card__meta">
                  <span class={`chip chip--${c.status}`}>{c.status}</span>
                  <span class="muted">Limit {money(c.spendLimit)}</span>
                </div>
                <Button
                  size="sm"
                  variant={c.status === "active" ? "soft" : "solid"}
                  onClick={async () => {
                    try {
                      const next = await toggleCard(c.id);
                      toaster.push({
                        title:
                          next.status === "frozen"
                            ? "Card frozen"
                            : "Card unfrozen",
                        description: `${c.label} is now ${next.status}.`,
                        tone: "info",
                      });
                    } catch (e) {
                      toaster.push({
                        title: "Couldn’t update card",
                        description: String(e),
                        tone: "danger",
                      });
                    }
                  }}
                >
                  {c.status === "active" ? "Freeze card" : "Unfreeze card"}
                </Button>
              </div>
            ))}
          </div>
        );
      }}
    </PageChrome>
  );
}
