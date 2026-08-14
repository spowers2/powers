import { signal } from "@power-ui/core";
import {
  Button,
  Card,
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
  asSelectBind,
} from "@power-ui/ui";
import type { Router } from "@power-ui/router";
import { PageHeader } from "../components/uiBits.js";
import {
  clients,
  projects,
  tasks,
  upsertProject,
  removeProject,
  clientById,
  formatMoney,
  formatDate,
  addProjectUpdate,
  updatesForProject,
  removeProjectUpdate,
  projectProgress,
} from "../data/store.js";
import type { Project, ProjectStatus } from "../data/types.js";

const STATUS_OPTS = [
  { value: "proposal", label: "Proposal" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
  { value: "done", label: "Done" },
];

const FILTER_OPTS = [
  { value: "all", label: "All" },
  { value: "pipeline", label: "Pipeline (open)" },
  ...STATUS_OPTS,
];

function initialProjectFilter(): string {
  if (typeof window === "undefined") return "all";
  try {
    const q = new URLSearchParams(window.location.search);
    const status = q.get("status");
    if (status === "proposal" || status === "active" || status === "blocked" || status === "done") {
      return status;
    }
    // pipeline = open book of work (not done)
    if (q.get("view") === "pipeline") return "pipeline";
  } catch {
    /* ignore */
  }
  return "all";
}

export function ProjectsPage(props: {
  toaster: ToastController;
  router?: Router;
}) {
  const { toaster, router } = props;
  const filter = signal("");
  const statusFilter = signal(initialProjectFilter());
  const drawerOpen = signal(false);
  const confirmOpen = signal(false);
  const editingId = signal<string | null>(null);

  const clientId = signal("");
  const name = signal("");
  const status = signal<ProjectStatus>("proposal");
  const value = signal("0");
  const dueDate = signal(new Date().toISOString().slice(0, 10));
  const summary = signal("");
  const updateBody = signal("");
  const updateClientVisible = signal("yes");
  const touched = signal(false);

  const nameErr = () =>
    !touched() ? "" : firstError(required(name(), "Name required"));
  const clientErr = () =>
    !touched() ? "" : firstError(required(clientId(), "Pick a client"));

  const openNew = () => {
    editingId.set(null);
    clientId.set(clients()[0]?.id ?? "");
    name.set("");
    status.set("proposal");
    value.set("12000");
    dueDate.set(new Date().toISOString().slice(0, 10));
    summary.set("");
    updateBody.set("");
    updateClientVisible.set("yes");
    touched.set(false);
    drawerOpen.set(true);
  };

  const openEdit = (p: Project) => {
    editingId.set(p.id);
    clientId.set(p.clientId);
    name.set(p.name);
    status.set(p.status);
    value.set(String(p.value));
    dueDate.set(p.dueDate);
    summary.set(p.summary);
    updateBody.set("");
    updateClientVisible.set("yes");
    touched.set(false);
    drawerOpen.set(true);
  };

  const save = () => {
    touched.set(true);
    if (nameErr() || clientErr()) {
      toaster.push({ title: "Fix the form", tone: "danger" });
      return;
    }
    const dollars = Math.max(0, Math.round(Number(value()) || 0));
    upsertProject({
      id: editingId() ?? undefined,
      clientId: clientId(),
      name: name().trim(),
      status: status(),
      value: dollars,
      dueDate: dueDate(),
      summary: summary().trim(),
    });
    drawerOpen.set(false);
    toaster.push({
      title: editingId() ? "Project updated" : "Project created",
      description: name().trim(),
      tone: "success",
    });
  };

  const confirmDelete = () => {
    const id = editingId();
    if (!id) return;
    const label = name().trim();
    removeProject(id);
    confirmOpen.set(false);
    drawerOpen.set(false);
    toaster.push({
      title: "Project removed",
      description: label,
      tone: "info",
    });
  };

  return (
    <Stack gap={6}>
      <PageHeader
        title="Projects"
        subtitle="Engagements linked to a client. Pipeline = proposal + active + blocked (not done)."
        actions={
          <Stack direction="row" gap={2} wrap>
            {router
              ? Button({
                  size: "sm",
                  variant: "soft",
                  children: "Clients",
                  onClick: () => router.navigate("/clients"),
                })
              : null}
            <Button
              size="sm"
              onClick={openNew}
              disabled={() => clients().length === 0}
            >
              New project
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
                  placeholder="Project or client…"
                  bind={filter}
                />
              </Field>
            </div>
            <div style={{ flex: "0 1 10rem" }}>
              <Field label="Status">
                <Select
                  bind={statusFilter}
                  options={FILTER_OPTS}
                />
              </Field>
            </div>
          </Stack>

          {() => {
            const q = filter().trim().toLowerCase();
            const sf = statusFilter();
            const list = projects()
              .filter((p) => {
                if (sf === "all") return true;
                if (sf === "pipeline") return p.status !== "done";
                return p.status === sf;
              })
              .filter((p) => {
                if (!q) return true;
                const client = clientById(p.clientId);
                return (
                  p.name.toLowerCase().includes(q) ||
                  (client?.company.toLowerCase().includes(q) ?? false) ||
                  (client?.name.toLowerCase().includes(q) ?? false)
                );
              })
              .sort((a, b) => b.updatedAt - a.updatedAt);

            if (list.length === 0) {
              return (
                <Empty
                  icon="▦"
                  title={q || sf !== "all" ? "No matches" : "No projects"}
                  description={
                    clients().length === 0
                      ? "Add a client first, then create a project."
                      : "Create a project to track delivery and value."
                  }
                >
                  {clients().length > 0 ? (
                    <Button size="sm" onClick={openNew}>
                      New project
                    </Button>
                  ) : null}
                </Empty>
              );
            }

            const frag = document.createDocumentFragment();
            for (const p of list) {
              const client = clientById(p.clientId);
              const openTaskN = tasks().filter(
                (t) => t.projectId === p.id && t.status !== "done",
              ).length;
              const row = document.createElement("button");
              row.type = "button";
              row.className = "data-row";
              row.onclick = () => openEdit(p);
              const left = document.createElement("div");
              left.className = "data-row__main";
              const title = document.createElement("div");
              title.className = "data-row__title";
              title.textContent = p.name;
              const meta = document.createElement("div");
              meta.className = "data-row__meta";
              meta.textContent = [
                client?.company ?? "—",
                p.status,
                openTaskN
                  ? `${openTaskN} open task${openTaskN === 1 ? "" : "s"}`
                  : "no open tasks",
                `due ${formatDate(p.dueDate)}`,
              ].join(" · ");
              left.append(title, meta);
              const right = document.createElement("div");
              right.className = "data-row__side";
              right.textContent = formatMoney(p.value);
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
        title="Project"
        side="right"
      >
        <Stack gap={4}>
          <Field label="Client" required error={clientErr}>
            <Select
              bind={clientId}
              options={() =>
                clients().map((c) => ({
                  value: c.id,
                  label: c.company,
                }))
              }
            />
          </Field>
          <Field label="Name" required error={nameErr}>
            <Input
              bind={name}
              onBlur={() => touched.set(true)}
              placeholder="Patient portal redesign"
            />
          </Field>
          <Stack direction="row" gap={2} wrap>
            <div style={{ flex: "1 1 8rem" }}>
              <Field label="Status">
                <Select
                  bind={asSelectBind(status)}
                  options={STATUS_OPTS}
                />
              </Field>
            </div>
            <div style={{ flex: "1 1 8rem" }}>
              <Field label="Value (USD)">
                <Input
                  type="number"
                  bind={value}
                />
              </Field>
            </div>
          </Stack>
          <Field label="Due date">
            <Input
              type="date"
              bind={dueDate}
            />
          </Field>
          <Field label="Summary">
            <Textarea
              rows={4}
              bind={summary}
              placeholder="Scope, constraints, success criteria…"
            />
          </Field>
          {() => {
            const id = editingId();
            if (!id) return null;
            const prog = projectProgress(id);
            const list = updatesForProject(id);
            return (
              <Stack gap={3}>
                <Text weight="semibold" size="sm">
                  Client portal updates
                </Text>
                <Text muted size="sm">
                  Progress {prog.done}/{prog.total} tasks ({prog.pct}%). Posts
                  marked visible appear under Client portal for this client.
                </Text>
                {() => {
                  if (list.length === 0) {
                    return Text({
                      muted: true,
                      size: "sm",
                      children: "No updates yet.",
                    });
                  }
                  const frag = document.createDocumentFragment();
                  for (const u of list.slice(0, 8)) {
                    const row = document.createElement("div");
                    row.className = "portal-update portal-update--staff";
                    const when = document.createElement("div");
                    when.className = "portal-update__when";
                    when.textContent =
                      new Date(u.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      }) + (u.clientVisible ? " · client-visible" : " · staff only");
                    const body = document.createElement("div");
                    body.className = "portal-update__body";
                    body.textContent = u.body;
                    const del = document.createElement("button");
                    del.type = "button";
                    del.className = "row-action";
                    del.textContent = "Remove";
                    del.onclick = () => {
                      removeProjectUpdate(u.id);
                      toaster.push({ title: "Update removed", tone: "info" });
                    };
                    row.append(when, body, del);
                    frag.appendChild(row);
                  }
                  return frag;
                }}
                <Field label="New update">
                  <Textarea
                    rows={2}
                    bind={updateBody}
                    placeholder="What should the client know?"
                  />
                </Field>
                <Field label="Visibility">
                  <Select
                    bind={updateClientVisible}
                    options={[
                      { value: "yes", label: "Visible in client portal" },
                      { value: "no", label: "Staff only" },
                    ]}
                  />
                </Field>
                <Button
                  size="sm"
                  variant="soft"
                  onClick={() => {
                    const body = updateBody().trim();
                    if (!body) {
                      toaster.push({
                        title: "Write an update first",
                        tone: "danger",
                      });
                      return;
                    }
                    addProjectUpdate({
                      projectId: id,
                      body,
                      clientVisible: updateClientVisible() === "yes",
                    });
                    updateBody.set("");
                    toaster.push({
                      title: "Update posted",
                      description:
                        updateClientVisible() === "yes"
                          ? "Visible in client portal"
                          : "Staff only",
                      tone: "success",
                    });
                  }}
                >
                  Post update
                </Button>
              </Stack>
            );
          }}
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
        title="Delete project?"
        description="Tasks on this project will be removed."
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
