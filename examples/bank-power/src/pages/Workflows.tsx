import {
  Alert,
  Button,
  Spinner,
  type ToastController,
} from "@lab206/ui";
import type { Router } from "@lab206/router";
import { PageChrome } from "../components/PageChrome.js";
import { toggleWorkflow, workflowsQuery } from "../data/api.js";

export function WorkflowsPage(props: {
  router: Router;
  toaster: ToastController;
}) {
  const { router, toaster } = props;

  return (
    <PageChrome
      router={router}
      title="Workflows"
      purpose="Automations that move money and approvals. Pause, resume, or clear errors."
      crumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Workflows" },
      ]}
    >
      {() => {
        const q = workflowsQuery;
        if (q.loading() && !q())
          return <Spinner label="Loading workflows…" />;
        if (q.error())
          return (
            <Alert tone="danger" title="Couldn’t load">
              {String(q.error())}
            </Alert>
          );
        const rows = q() ?? [];
        const active = rows.filter((w) => w.status === "active").length;
        const triggers = rows.reduce((s, w) => s + w.triggers, 0);

        return (
          <div class="stack-gap">
            <div class="kpi-grid kpi-grid--4">
              <div class="panel kpi">
                <p class="kpi__label">Active</p>
                <p class="kpi__value">{String(active)}</p>
              </div>
              <div class="panel kpi">
                <p class="kpi__label">Total triggers</p>
                <p class="kpi__value">
                  {triggers >= 1000
                    ? `${(triggers / 1000).toFixed(1)}K`
                    : String(triggers)}
                </p>
              </div>
              <div class="panel kpi">
                <p class="kpi__label">Time saved</p>
                <p class="kpi__value">142hrs</p>
              </div>
              <div class="panel kpi">
                <p class="kpi__label">Error rate</p>
                <p class="kpi__value">0.2%</p>
              </div>
            </div>

            <div class="wf-list">
              {rows.map((w) => (
                <div class="wf-card panel">
                  <div class="panel__inner wf-card__inner">
                    <div class="wf-card__main">
                      <div class="row-gap" style={{ marginBottom: "0.35rem" }}>
                        <span class={`chip chip--${w.status}`}>{w.status}</span>
                        <span class="muted" style={{ fontSize: "0.78rem" }}>
                          {w.category}
                        </span>
                      </div>
                      <div class="wf-card__name">{w.name}</div>
                      <p class="muted" style={{ margin: "0.35rem 0 0", fontSize: "0.9rem" }}>
                        {w.description}
                      </p>
                      <div class="muted" style={{ marginTop: "0.55rem", fontSize: "0.78rem" }}>
                        {w.triggers.toLocaleString()} runs · last {w.lastRun}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={w.status === "active" ? "soft" : "solid"}
                      onClick={async () => {
                        try {
                          const next = await toggleWorkflow(w.id);
                          toaster.push({
                            title: `Workflow ${next.status}`,
                            description: w.name,
                            tone:
                              next.status === "error" ? "danger" : "info",
                          });
                        } catch (e) {
                          toaster.push({
                            title: "Update failed",
                            description: String(e),
                            tone: "danger",
                          });
                        }
                      }}
                    >
                      {w.status === "active"
                        ? "Pause"
                        : w.status === "paused"
                          ? "Resume"
                          : "Clear error"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    </PageChrome>
  );
}
