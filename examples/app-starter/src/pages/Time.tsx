import { signal } from "@lab206/core";
import {
  Button,
  Card,
  Checkbox,
  Dialog,
  Drawer,
  Empty,
  Field,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  firstError,
  required,
  type ToastController,
} from "@lab206/ui";
import { PageHeader } from "../components/uiBits.js";
import {
  timeEntries,
  projects,
  profile,
  upsertTimeEntry,
  removeTimeEntry,
  invoiceUnbilledTime,
  projectById,
  clientById,
  formatHours,
  formatDate,
  formatMoney,
  unbilledHours,
  unbilledValue,
  hoursThisWeek,
} from "../data/store.js";
import type { TimeEntry } from "../data/types.js";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function initialBillableFilter(): string {
  if (typeof window === "undefined") return "all";
  try {
    const f = new URLSearchParams(window.location.search).get("filter");
    if (f === "unbilled" || f === "billed" || f === "non" || f === "all") {
      return f;
    }
  } catch {
    /* ignore */
  }
  return "all";
}

export function TimePage(props: {
  toaster: ToastController;
  router?: import("@lab206/router").Router;
}) {
  const { toaster } = props;
  const filter = signal("");
  const billableFilter = signal(initialBillableFilter()); // all | unbilled | billed | non
  const drawerOpen = signal(false);
  const confirmOpen = signal(false);
  const editingId = signal<string | null>(null);

  const projectId = signal("");
  const date = signal(today());
  const hours = signal("1");
  const note = signal("");
  const billable = signal(true);
  const touched = signal(false);

  const projectErr = () =>
    !touched() ? "" : firstError(required(projectId(), "Pick a project"));
  const hoursErr = () => {
    if (!touched()) return "";
    const h = Number(hours());
    if (!h || h <= 0) return "Enter hours";
    return "";
  };

  const openNew = () => {
    editingId.set(null);
    projectId.set(projects()[0]?.id ?? "");
    date.set(today());
    hours.set("1");
    note.set("");
    billable.set(true);
    touched.set(false);
    drawerOpen.set(true);
  };

  const openEdit = (e: TimeEntry) => {
    editingId.set(e.id);
    projectId.set(e.projectId);
    date.set(e.date);
    hours.set(String(e.hours));
    note.set(e.note);
    billable.set(e.billable);
    touched.set(false);
    drawerOpen.set(true);
  };

  const save = () => {
    touched.set(true);
    if (projectErr() || hoursErr()) {
      toaster.push({ title: "Fix the form", tone: "danger" });
      return;
    }
    upsertTimeEntry({
      id: editingId() ?? undefined,
      projectId: projectId(),
      date: date(),
      hours: Number(hours()),
      note: note().trim(),
      billable: billable(),
    });
    drawerOpen.set(false);
    toaster.push({
      title: editingId() ? "Entry updated" : "Time logged",
      description: `${formatHours(Number(hours()) || 0)} · ${projectById(projectId())?.name ?? "Project"}`,
      tone: "success",
    });
  };

  const confirmDelete = () => {
    const id = editingId();
    if (!id) return;
    removeTimeEntry(id);
    confirmOpen.set(false);
    drawerOpen.set(false);
    toaster.push({ title: "Entry removed", tone: "info" });
  };

  const billUnbilled = () => {
    const before = unbilledHours();
    const value = unbilledValue();
    const id = invoiceUnbilledTime();
    if (!id) {
      toaster.push({
        title: "Nothing to invoice",
        description: "No unbilled billable hours",
        tone: "info",
      });
      return;
    }
    toaster.push({
      title: "Draft invoice(s) created",
      description: `${formatHours(before)} · ~${formatMoney(value)} moved to Invoices`,
      tone: "success",
    });
  };

  return (
    <Stack gap={6}>
      <PageHeader
        title="Time"
        subtitle={() =>
          `${formatHours(hoursThisWeek())} this week · ${formatHours(unbilledHours())} unbilled (~${formatMoney(unbilledValue())} @ $${profile().hourlyRate}/hr)`
        }
        actions={
          <Stack direction="row" gap={2} wrap>
            <Button
              size="sm"
              variant="soft"
              onClick={billUnbilled}
              disabled={() => unbilledHours() === 0}
            >
              Invoice unbilled
            </Button>
            <Button
              size="sm"
              onClick={openNew}
              disabled={() => projects().length === 0}
            >
              Log time
            </Button>
          </Stack>
        }
      />

      <Card>
        <Stack gap={3}>
          <Stack direction="row" gap={2} wrap>
            <div style={{ flex: "1 1 12rem" }}>
              <Field label="Search">
                <Input
                  placeholder="Note or project…"
                  bind={filter}
                />
              </Field>
            </div>
            <div style={{ flex: "0 1 10rem" }}>
              <Field label="Filter">
                <Select
                  bind={billableFilter}
                  options={[
                    { value: "all", label: "All entries" },
                    { value: "unbilled", label: "Unbilled" },
                    { value: "billed", label: "Invoiced" },
                    { value: "non", label: "Non-billable" },
                  ]}
                />
              </Field>
            </div>
          </Stack>

          {() => {
            const q = filter().trim().toLowerCase();
            const bf = billableFilter();
            const list = timeEntries()
              .slice()
              .sort(
                (a, b) =>
                  b.date.localeCompare(a.date) || b.createdAt - a.createdAt,
              )
              .filter((t) => {
                if (bf === "unbilled") return t.billable && !t.invoicedAt;
                if (bf === "billed") return !!t.invoicedAt;
                if (bf === "non") return !t.billable;
                return true;
              })
              .filter((t) => {
                if (!q) return true;
                const prj = projectById(t.projectId);
                return (
                  t.note.toLowerCase().includes(q) ||
                  (prj?.name.toLowerCase().includes(q) ?? false)
                );
              });

            if (list.length === 0) {
              return (
                <Empty
                  icon="⏱"
                  title={q || bf !== "all" ? "No matches" : "No time logged"}
                  description={
                    projects().length === 0
                      ? "Create a project first, then log hours."
                      : "Track work to invoice or report later."
                  }
                >
                  {projects().length > 0 && !q && bf === "all" ? (
                    <Button size="sm" onClick={openNew}>
                      Log time
                    </Button>
                  ) : null}
                </Empty>
              );
            }

            const frag = document.createDocumentFragment();
            for (const entry of list) {
              const prj = projectById(entry.projectId);
              const client = prj ? clientById(prj.clientId) : undefined;
              const row = document.createElement("button");
              row.type = "button";
              row.className = "data-row";
              row.onclick = () => openEdit(entry);

              const left = document.createElement("div");
              left.className = "data-row__main";
              const title = document.createElement("div");
              title.className = "data-row__title";
              title.textContent = entry.note || prj?.name || "Time entry";
              const meta = document.createElement("div");
              meta.className = "data-row__meta";
              const flags = [
                entry.billable
                  ? entry.invoicedAt
                    ? "invoiced"
                    : "unbilled"
                  : "non-billable",
                prj?.name,
                client?.company,
              ]
                .filter(Boolean)
                .join(" · ");
              meta.textContent = `${formatDate(entry.date)} · ${flags}`;
              left.append(title, meta);

              const right = document.createElement("div");
              right.className =
                "data-row__side" +
                (entry.billable && !entry.invoicedAt ? " is-accent" : "");
              right.textContent = formatHours(entry.hours);

              row.append(left, right);
              frag.appendChild(row);
            }
            return frag;
          }}
        </Stack>
      </Card>

      <Drawer
        open={drawerOpen}
        onClose={() => drawerOpen.set(false)}
        title="Time entry"
        side="right"
      >
        <Stack gap={4}>
          <Field label="Project" required error={projectErr}>
            <Select
              bind={projectId}
              options={() =>
                projects().map((p) => ({
                  value: p.id,
                  label: p.name,
                }))
              }
            />
          </Field>
          <Stack direction="row" gap={2} wrap>
            <div style={{ flex: "1 1 8rem" }}>
              <Field label="Date">
                <Input
                  type="date"
                  bind={date}
                />
              </Field>
            </div>
            <div style={{ flex: "1 1 6rem" }}>
              <Field label="Hours" required error={hoursErr}>
                <Input
                  type="number"
                  bind={hours}
                  onBlur={() => touched.set(true)}
                  placeholder="1.5"
                />
              </Field>
            </div>
          </Stack>
          <Field label="What did you work on?">
            <Textarea
              rows={3}
              bind={note}
              placeholder="Auth screens a11y pass…"
            />
          </Field>
          <Checkbox
            checked={billable}
            onChange={(v) => billable.set(v)}
            label="Billable"
          />
          <Text size="xs" muted>
            {() =>
              billable()
                ? `At $${profile().hourlyRate}/hr ≈ ${formatMoney(Math.round((Number(hours()) || 0) * (profile().hourlyRate || 150)))}`
                : "Non-billable (internal / sales)"
            }
          </Text>
          <Stack direction="row" gap={2} wrap>
            <Button onClick={save}>Save</Button>
            {() =>
              editingId()
                ? Button({
                    variant: "danger",
                    children: "Delete…",
                    onClick: () => confirmOpen.set(true),
                  })
                : null
            }
            <Button variant="ghost" onClick={() => drawerOpen.set(false)}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Drawer>

      <Dialog
        open={confirmOpen}
        onClose={() => confirmOpen.set(false)}
        title="Delete time entry?"
        description="This only removes the log from this browser."
        size="sm"
      >
        <Stack direction="row" gap={2} justify="end">
          <Button variant="ghost" onClick={() => confirmOpen.set(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Stack>
      </Dialog>
    </Stack>
  );
}
