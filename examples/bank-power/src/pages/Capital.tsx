import { Alert, Button, Spinner } from "@lab206/ui";
import type { Router } from "@lab206/router";
import { PageChrome } from "../components/PageChrome.js";
import { capitalQuery, money } from "../data/api.js";

export function CapitalPage(props: { router: Router }) {
  const { router } = props;

  return (
    <PageChrome
      router={router}
      title="Capital"
      purpose="Working capital and platform financing products — demo numbers for client walkthroughs."
      crumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Capital" },
      ]}
      actions={
        <Button size="sm" variant="soft" onClick={() => router.navigate("/dashboard")}>
          ← Dashboard
        </Button>
      }
    >
      {() => {
        const q = capitalQuery;
        if (q.loading() && !q())
          return <Spinner label="Loading capital…" />;
        if (q.error())
          return (
            <Alert tone="danger" title="Couldn’t load">
              {String(q.error())}
            </Alert>
          );
        const data = q();
        if (!data) return null;
        const { snapshot: s, products } = data;

        return (
          <div class="stack-gap">
            <div class="kpi-grid kpi-grid--4">
              <div class="panel kpi">
                <p class="kpi__label">Platform partners</p>
                <p class="kpi__value">{s.partners}</p>
                <p class="kpi__help">+18% vs prior period</p>
              </div>
              <div class="panel kpi">
                <p class="kpi__label">Capital deployed</p>
                <p class="kpi__value">{s.deployed}</p>
                <p class="kpi__help">+42% year over year</p>
              </div>
              <div class="panel kpi">
                <p class="kpi__label">Avg. decision</p>
                <p class="kpi__value">{s.avgDecisionMin}m</p>
                <p class="kpi__help">−23% latency</p>
              </div>
              <div class="panel kpi">
                <p class="kpi__label">Approval rate</p>
                <p class="kpi__value">{s.approvalRate}</p>
                <p class="kpi__help">+8 pts</p>
              </div>
            </div>

            <div class="panel">
              <div class="panel__inner">
                <h2 class="panel__title">Your facility</h2>
                <div class="cap-facility">
                  <div>
                    <div class="muted" style={{ fontSize: "0.8rem" }}>
                      Available to draw
                    </div>
                    <div class="account-card__bal">{money(s.available)}</div>
                  </div>
                  <div>
                    <div class="muted" style={{ fontSize: "0.8rem" }}>
                      Approved limit
                    </div>
                    <div class="account-card__bal">{money(s.approved)}</div>
                  </div>
                </div>
                <p class="muted" style={{ margin: "0.75rem 0 0", fontSize: "0.9rem" }}>
                  Indicative 12-month facility. No payment due in this demo.
                </p>
              </div>
            </div>

            <div class="cap-products">
              {products.map((p) => (
                <div class="panel cap-product">
                  <div class="panel__inner">
                    <h3 class="cap-product__name">{p.name}</h3>
                    <div class="cap-product__meta">
                      <span>{p.range}</span>
                      <span>{p.term}</span>
                      <span>{p.rate}</span>
                    </div>
                    <ul class="cap-product__feats">
                      {p.features.map((f) => (
                        <li>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div class="panel">
              <div class="panel__inner">
                <h2 class="panel__title">Why platforms embed capital</h2>
                <div class="cap-benefits">
                  <div>
                    <b>Instant decisions</b>
                    <p class="muted">
                      Customers receive funding approvals in under 5 minutes
                      with automated underwriting.
                    </p>
                  </div>
                  <div>
                    <b>Zero platform risk</b>
                    <p class="muted">
                      Credit risk, compliance, and regulatory work sit with the
                      lender narrative.
                    </p>
                  </div>
                  <div>
                    <b>Revenue sharing</b>
                    <p class="muted">
                      Earn up to 20% of interest revenue on every loan issued
                      through your platform.
                    </p>
                  </div>
                  <div>
                    <b>Seamless integration</b>
                    <p class="muted">
                      White-labeled experience that embeds into an existing
                      product surface.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </PageChrome>
  );
}
