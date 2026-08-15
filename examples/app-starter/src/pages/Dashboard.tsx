import { signal, createQuery } from "@powers/core";
import { Show, For } from "@powers/dom";
import {
  Alert,
  Button,
  Card,
  Grid,
  Spinner,
  Stack,
  Stat,
  Text,
  type ToastController,
} from "@powers/ui";
import type { Router } from "@powers/router";
import { PageHeader } from "../components/uiBits.js";
import {
  clients,
  projects,
  openTaskCount,
  pipelineValue,
  dueSoonTasks,
  outstandingInvoices,
  outstandingTotal,
  paidYtd,
  hoursThisWeek,
  unbilledHours,
  unbilledValue,
  formatHours,
  projectById,
  invoiceTotal,
  effectiveInvoiceStatus,
  formatMoney,
  formatDate,
  isOverdue,
  profile,
} from "../data/store.js";
import {
  ART_TOPICS,
  fallbackImageUrl,
  searchArtworks,
} from "../data/artApi.js";

export function DashboardPage(props: {
  router: Router;
  toaster: ToastController;
}) {
  const { router } = props;
  const go = (to: string) => () => router.navigate(to);

  /** Creative API: live museum search keyed by a signal — no React Query needed. */
  const artTopic = signal<string>(ART_TOPICS[0]!.value);
  const inspiration = createQuery({
    name: "artic-inspiration",
    queryKey: () => artTopic(),
    queryFn: (key) => searchArtworks(key, 6),
  });

  return (
    <Stack gap={6}>
      <PageHeader
        title={() => {
          const first = profile().name.split(" ")[0] || "there";
          return `Good work, ${first}`;
        }}
        subtitle="Book of business at a glance — every number is a shortcut into the filtered list."
        actions={
          <Stack direction="row" gap={2} wrap>
            <Button size="sm" onClick={go("/time")}>
              Log time
            </Button>
            <Button size="sm" variant="soft" onClick={go("/invoices?status=outstanding")}>
              Collect
            </Button>
            <Button size="sm" variant="ghost" onClick={go("/tasks?status=open")}>
              Open tasks
            </Button>
            <Button size="sm" variant="ghost" onClick={go("/portal")}>
              Client portal
            </Button>
          </Stack>
        }
      />

      <div class="workflow-rail" aria-label="How designlab206 connects work">
        <button type="button" class="workflow-rail__step" onClick={go("/clients")}>
          <strong>Clients</strong>
          <span>Who you work with</span>
        </button>
        <span class="workflow-rail__arrow" aria-hidden="true">
          →
        </span>
        <button type="button" class="workflow-rail__step" onClick={go("/projects?view=pipeline")}>
          <strong>Projects</strong>
          <span>Engagements & fees</span>
        </button>
        <span class="workflow-rail__arrow" aria-hidden="true">
          →
        </span>
        <button type="button" class="workflow-rail__step" onClick={go("/tasks?status=open")}>
          <strong>Tasks</strong>
          <span>Work to finish</span>
        </button>
        <span class="workflow-rail__arrow" aria-hidden="true">
          →
        </span>
        <button type="button" class="workflow-rail__step" onClick={go("/time")}>
          <strong>Time</strong>
          <span>Hours → billable</span>
        </button>
        <span class="workflow-rail__arrow" aria-hidden="true">
          →
        </span>
        <button type="button" class="workflow-rail__step" onClick={go("/invoices?status=outstanding")}>
          <strong>Invoices</strong>
          <span>Cash collected</span>
        </button>
      </div>

      <Grid cols={3} gap={4}>
        <Stat
          label="Project pipeline"
          value={() => formatMoney(pipelineValue())}
          hint="open project fees (not done)"
          tone="positive"
          onClick={go("/projects?view=pipeline")}
        />
        <Stat
          label="Outstanding"
          value={() => formatMoney(outstandingTotal())}
          delta={() =>
            `${outstandingInvoices().length} invoice${outstandingInvoices().length === 1 ? "" : "s"} open`
          }
          tone="negative"
          onClick={go("/invoices?status=outstanding")}
        />
        <Stat
          label="Paid YTD"
          value={() => formatMoney(paidYtd())}
          hint="collected this calendar year"
          tone="positive"
          onClick={go("/invoices?status=paid")}
        />
      </Grid>

      <Grid cols={3} gap={4}>
        <Stat
          label="Hours this week"
          value={() => formatHours(hoursThisWeek())}
          delta={() =>
            `${formatHours(unbilledHours())} unbilled · ${formatMoney(unbilledValue())}`
          }
          tone="neutral"
          onClick={go("/time?filter=unbilled")}
        />
        <Stat
          label="Open tasks"
          value={() => String(openTaskCount())}
          delta={() => `${dueSoonTasks().length} due ≤7d`}
          tone="neutral"
          onClick={go("/tasks?status=open")}
        />
        <Stat
          label="Clients"
          value={() =>
            `${clients().length} · ${clients().filter((c) => c.status === "active").length} active`
          }
          hint="open client list"
          onClick={go("/clients")}
        />
      </Grid>

      <Card variant="soft">
        <Stack gap={2}>
          <Text weight="semibold" size="sm">
            Read this once
          </Text>
          <Text muted size="sm">
            <strong>Pipeline</strong> = fees on open projects (proposal + active
            + blocked) — work won or pitching, not cash.{" "}
            <strong>Outstanding</strong> = invoices sent or overdue.{" "}
            <strong>Unbilled time</strong> = hours not yet on an invoice. Click
            any stat or row to jump into the right list with filters applied.
          </Text>
        </Stack>
      </Card>

      {/* Creative API showcase — Art Institute of Chicago via createQuery */}
      <Card>
        <Stack gap={4}>
          <Stack direction="row" gap={2} justify="between" align="start" wrap>
            <Stack gap={1}>
              <Text weight="semibold">Studio inspiration</Text>
              <Text muted size="sm">
                Live museum API via{" "}
                <code class="inline-code">createQuery</code> — topic is a
                signal; only this board reloads.
              </Text>
            </Stack>
            <Button
              size="sm"
              variant="ghost"
              disabled={() => inspiration.loading()}
              onClick={() => inspiration.refetch()}
            >
              Refresh
            </Button>
          </Stack>

          <div class="art-topics" role="tablist" aria-label="Inspiration topics">
            {ART_TOPICS.map((t) => (
              <button
                type="button"
                role="tab"
                class={() =>
                  artTopic() === t.value
                    ? "art-topic is-active"
                    : "art-topic"
                }
                aria-selected={() =>
                  artTopic() === t.value ? "true" : "false"
                }
                onClick={() => artTopic.set(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Show when={() => inspiration.loading() && !inspiration.latest()}>
            {() => (
              <Stack direction="row" gap={2} align="center">
                <Spinner label="Loading art" />
                <Text muted size="sm">
                  Fetching from Art Institute of Chicago…
                </Text>
              </Stack>
            )}
          </Show>

          <Show when={() => !!inspiration.error() && !inspiration.loading()}>
            {() => (
              <Alert tone="danger" title="Couldn’t load inspiration">
                <Stack gap={2}>
                  <Text size="sm">
                    {() => String(inspiration.error())}
                  </Text>
                  <Button size="sm" variant="soft" onClick={() => inspiration.refetch()}>
                    Try again
                  </Button>
                </Stack>
              </Alert>
            )}
          </Show>

          <div
            class={() =>
              inspiration.loading() && inspiration.latest()
                ? "art-grid is-refreshing"
                : "art-grid"
            }
          >
            <For each={() => inspiration.latest() ?? inspiration() ?? []}>
              {(item) => (
                <a
                  class="art-card"
                  href={() => item().pageUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div class="art-card__img">
                    <img
                      src={() => item().imageUrl}
                      alt=""
                      loading="lazy"
                      onError={(e: Event) => {
                        const el = e.currentTarget as HTMLImageElement;
                        const fb = fallbackImageUrl(item());
                        if (el.src !== fb) el.src = fb;
                      }}
                    />
                  </div>
                  <div class="art-card__body">
                    <Text weight="semibold" size="sm">
                      {() => item().title}
                    </Text>
                    <Text muted size="xs">
                      {() =>
                        [item().artist, item().date].filter(Boolean).join(" · ")
                      }
                    </Text>
                  </div>
                </a>
              )}
            </For>
          </div>
        </Stack>
      </Card>

      {() => {
        const blocked = projects().filter((p) => p.status === "blocked");
        if (blocked.length === 0) return null;
        return (
          <Alert tone="warning" title="Blocked work">
            <Stack gap={2}>
              <Text size="sm">
                {blocked.map((p) => p.name).join(" · ")} — unblock or renegotiate
                dates before the week slips.
              </Text>
              <Button size="sm" variant="soft" onClick={go("/projects?status=blocked")}>
                View blocked projects
              </Button>
            </Stack>
          </Alert>
        );
      }}

      {() => {
        const overdue = outstandingInvoices().filter(
          (i) => effectiveInvoiceStatus(i) === "overdue",
        );
        if (overdue.length === 0) return null;
        const total = overdue.reduce((s, i) => s + invoiceTotal(i), 0);
        return (
          <Alert tone="danger" title="Overdue invoices">
            <Stack gap={2}>
              <Text size="sm">
                {overdue.map((i) => i.number).join(" · ")} — {formatMoney(total)}{" "}
                past due. Follow up or mark paid.
              </Text>
              <Button
                size="sm"
                variant="soft"
                onClick={go("/invoices?status=overdue")}
              >
                View overdue invoices
              </Button>
            </Stack>
          </Alert>
        );
      }}

      <Grid cols={2} gap={4}>
        <Card>
          <Stack gap={3}>
            <Stack direction="row" gap={2} justify="between" align="center" wrap>
              <Text weight="semibold">Due soon</Text>
              <Button size="sm" variant="ghost" onClick={go("/tasks?status=open")}>
                All open tasks
              </Button>
            </Stack>
            <Text muted size="sm">
              Tasks in the next 7 days (including overdue).
            </Text>
            {() => {
              const list = dueSoonTasks();
              if (list.length === 0) {
                return (
                  <Text muted size="sm">
                    Nothing urgent. Protect deep work.
                  </Text>
                );
              }
              const frag = document.createDocumentFragment();
              for (const t of list) {
                const row = document.createElement("button");
                row.type = "button";
                row.className = "data-row";
                row.onclick = () => router.navigate("/tasks?status=open");
                const left = document.createElement("div");
                left.className = "data-row__main";
                const title = document.createElement("div");
                title.className = "data-row__title";
                title.textContent = t.title;
                const meta = document.createElement("div");
                meta.className = "data-row__meta";
                const prj = projectById(t.projectId);
                meta.textContent = prj?.name ?? "Project";
                left.append(title, meta);
                const right = document.createElement("div");
                right.className =
                  "data-row__side" + (isOverdue(t.dueDate) ? " is-danger" : "");
                right.textContent = formatDate(t.dueDate);
                row.append(left, right);
                frag.appendChild(row);
              }
              return frag;
            }}
          </Stack>
        </Card>

        <Card>
          <Stack gap={3}>
            <Stack direction="row" gap={2} justify="between" align="center" wrap>
              <Text weight="semibold">Open invoices</Text>
              <Button
                size="sm"
                variant="ghost"
                onClick={go("/invoices?status=outstanding")}
              >
                Outstanding
              </Button>
            </Stack>
            <Text muted size="sm">
              Sent and overdue — click an invoice or the card action.
            </Text>
            {() => {
              const list = outstandingInvoices()
                .slice()
                .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
              if (list.length === 0) {
                return (
                  <Text muted size="sm">
                    Nothing outstanding. Nice cash position.
                  </Text>
                );
              }
              const frag = document.createDocumentFragment();
              for (const inv of list) {
                const row = document.createElement("button");
                row.type = "button";
                row.className = "data-row";
                const eff = effectiveInvoiceStatus(inv);
                row.onclick = () =>
                  router.navigate(
                    eff === "overdue"
                      ? "/invoices?status=overdue"
                      : "/invoices?status=outstanding",
                  );
                const left = document.createElement("div");
                left.className = "data-row__main";
                const title = document.createElement("div");
                title.className = "data-row__title";
                title.textContent = inv.number;
                const meta = document.createElement("div");
                meta.className = "data-row__meta";
                const client = clientById(inv.clientId);
                meta.textContent = `${client?.company ?? "—"} · due ${formatDate(inv.dueDate)}`;
                left.append(title, meta);
                const right = document.createElement("div");
                right.className =
                  "data-row__side" + (eff === "overdue" ? " is-danger" : "");
                right.textContent = formatMoney(invoiceTotal(inv));
                row.append(left, right);
                frag.appendChild(row);
              }
              return frag;
            }}
          </Stack>
        </Card>
      </Grid>

      <Grid cols={2} gap={4}>
        <Card>
          <Stack gap={3}>
            <Stack direction="row" gap={2} justify="between" align="center" wrap>
              <Text weight="semibold">Active projects</Text>
              <Button
                size="sm"
                variant="ghost"
                onClick={go("/projects?view=pipeline")}
              >
                Full pipeline
              </Button>
            </Stack>
            <Text muted size="sm">
              Live engagements and blockers (pipeline, not cash).
            </Text>
            {() => {
              const list = activeProjects();
              if (list.length === 0) {
                return (
                  <Text muted size="sm">
                    No active projects. Convert a lead.
                  </Text>
                );
              }
              const frag = document.createDocumentFragment();
              for (const p of list) {
                const row = document.createElement("button");
                row.type = "button";
                row.className = "data-row";
                row.onclick = () =>
                  router.navigate(
                    p.status === "blocked"
                      ? "/projects?status=blocked"
                      : "/projects?view=pipeline",
                  );
                const left = document.createElement("div");
                left.className = "data-row__main";
                const title = document.createElement("div");
                title.className = "data-row__title";
                title.textContent = p.name;
                const meta = document.createElement("div");
                meta.className = "data-row__meta";
                const client = clientById(p.clientId);
                meta.textContent = `${client?.company ?? "—"} · ${formatMoney(p.value)}`;
                left.append(title, meta);
                const right = document.createElement("div");
                right.className = "data-row__side";
                right.textContent = p.status;
                row.append(left, right);
                frag.appendChild(row);
              }
              return frag;
            }}
          </Stack>
        </Card>

        <Card variant="soft">
          <Stack gap={3}>
            <Text weight="semibold" size="sm">
              This week’s focus
            </Text>
            <Text muted size="sm">
              {() => {
                const high = tasks().filter(
                  (t) => t.status !== "done" && t.priority === "high",
                ).length;
                const open = openTaskCount();
                const drafts = invoices().filter((i) => i.status === "draft")
                  .length;
                return `${high} high-priority task${high === 1 ? "" : "s"} · ${open} open · ${formatHours(hoursThisWeek())} logged · ${formatHours(unbilledHours())} unbilled · ${drafts} draft invoice${drafts === 1 ? "" : "s"}.`;
              }}
            </Text>
            <Stack direction="row" gap={2} wrap>
              <Button size="sm" variant="soft" onClick={go("/time?filter=unbilled")}>
                Unbilled time
              </Button>
              <Button size="sm" variant="ghost" onClick={go("/invoices?status=draft")}>
                Draft invoices
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </Stack>
  );
}
