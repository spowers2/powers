import { signal } from "@powers/core";
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
  emailFormat,
  firstError,
  required,
  asSelectBind,
  type ToastController,
} from "@powers/ui";
import type { Router } from "@powers/router";
import { PageHeader } from "../components/uiBits.js";
import {
  clients,
  projects,
  tasks,
  invoices,
  upsertClient,
  removeClient,
  formatMoney,
  invoiceTotal,
  effectiveInvoiceStatus,
} from "../data/store.js";
import type { Client, ClientStatus } from "../data/types.js";

const STATUS_OPTS = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "lead", label: "Lead" },
];

export function ClientsPage(props: {
  toaster: ToastController;
  router?: Router;
}) {
  const { toaster, router } = props;
  const filter = signal("");
  const drawerOpen = signal(false);
  const confirmOpen = signal(false);
  const editingId = signal<string | null>(null);

  const name = signal("");
  const company = signal("");
  const email = signal("");
  const status = signal<ClientStatus>("lead");
  const notes = signal("");
  const touched = signal(false);

  const nameErr = () =>
    !touched() ? "" : firstError(required(name(), "Name required"));
  const emailErr = () =>
    !touched()
      ? ""
      : firstError(required(email(), "Email required"), emailFormat(email()));

  const openNew = () => {
    editingId.set(null);
    name.set("");
    company.set("");
    email.set("");
    status.set("lead");
    notes.set("");
    touched.set(false);
    drawerOpen.set(true);
  };

  const openEdit = (c: Client) => {
    editingId.set(c.id);
    name.set(c.name);
    company.set(c.company);
    email.set(c.email);
    status.set(c.status);
    notes.set(c.notes);
    touched.set(false);
    drawerOpen.set(true);
  };

  const save = () => {
    touched.set(true);
    if (nameErr() || emailErr()) {
      toaster.push({ title: "Fix the form", tone: "danger" });
      return;
    }
    upsertClient({
      id: editingId() ?? undefined,
      name: name().trim(),
      company: company().trim() || name().trim(),
      email: email().trim(),
      status: status(),
      notes: notes().trim(),
    });
    drawerOpen.set(false);
    toaster.push({
      title: editingId() ? "Client updated" : "Client added",
      description: name().trim(),
      tone: "success",
    });
  };

  const confirmDelete = () => {
    const id = editingId();
    if (!id) return;
    const label = name().trim() || "Client";
    removeClient(id);
    confirmOpen.set(false);
    drawerOpen.set(false);
    toaster.push({
      title: "Client removed",
      description: `${label} and related projects, tasks, invoices`,
      tone: "info",
    });
  };

  return (
    <Stack gap={6}>
      <PageHeader
        title="Clients"
        subtitle="People & companies you work with — open a row to see linked projects, tasks, and invoices."
        actions={
          <Button size="sm" onClick={openNew}>
            Add client
          </Button>
        }
      />

      <Card>
        <Stack gap={3}>
          <Field label="Search">
            <Input
              placeholder="Name, company, email…"
              bind={filter}
            />
          </Field>

          {() => {
            const q = filter().trim().toLowerCase();
            const list = clients().filter((c) => {
              if (!q) return true;
              return (
                c.name.toLowerCase().includes(q) ||
                c.company.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q)
              );
            });
            if (list.length === 0) {
              return (
                <Empty
                  icon="◎"
                  title={q ? "No matches" : "No clients yet"}
                  description={
                    q
                      ? "Try another search."
                      : "Add your first client to start tracking work."
                  }
                >
                  {!q ? (
                    <Button size="sm" onClick={openNew}>
                      Add client
                    </Button>
                  ) : null}
                </Empty>
              );
            }
            const frag = document.createDocumentFragment();
            for (const c of list) {
              const clientProjects = projects().filter(
                (p) => p.clientId === c.id,
              );
              const pids = new Set(clientProjects.map((p) => p.id));
              const openTasks = tasks().filter(
                (t) => pids.has(t.projectId) && t.status !== "done",
              ).length;
              const openInv = invoices().filter(
                (i) =>
                  i.clientId === c.id &&
                  effectiveInvoiceStatus(i) !== "paid",
              ).length;
              const row = document.createElement("button");
              row.type = "button";
              row.className = "data-row";
              row.onclick = () => openEdit(c);
              const left = document.createElement("div");
              left.className = "data-row__main";
              const title = document.createElement("div");
              title.className = "data-row__title";
              title.textContent = c.company;
              const meta = document.createElement("div");
              meta.className = "data-row__meta";
              meta.textContent = [
                c.name,
                `${clientProjects.length} project${clientProjects.length === 1 ? "" : "s"}`,
                openTasks ? `${openTasks} open task${openTasks === 1 ? "" : "s"}` : null,
                openInv ? `${openInv} open invoice${openInv === 1 ? "" : "s"}` : null,
              ]
                .filter(Boolean)
                .join(" · ");
              left.append(title, meta);
              const right = document.createElement("div");
              right.className = "data-row__side";
              right.textContent = c.status;
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
        title="Client"
        side="right"
      >
        <Stack gap={4}>
          <Field label="Contact name" required error={nameErr}>
            <Input
              bind={name}
              onBlur={() => touched.set(true)}
              placeholder="Avery Chen"
            />
          </Field>
          <Field label="Company">
            <Input bind={company} placeholder="Northline Health" />
          </Field>
          <Field label="Email" required error={emailErr}>
            <Input
              type="email"
              bind={email}
              onBlur={() => touched.set(true)}
              placeholder="avery@company.com"
            />
          </Field>
          <Field label="Status">
            <Select bind={asSelectBind(status)} options={STATUS_OPTS} />
          </Field>
          <Field label="Notes">
            <Textarea
              rows={4}
              bind={notes}
              placeholder="Preferences, stakeholders, constraints…"
            />
          </Field>
          {() => {
            const id = editingId();
            if (!id || !router) return null;
            const clientProjects = projects().filter((p) => p.clientId === id);
            const pids = new Set(clientProjects.map((p) => p.id));
            const openTasks = tasks().filter(
              (t) => pids.has(t.projectId) && t.status !== "done",
            );
            const clientInvoices = invoices().filter((i) => i.clientId === id);
            const openInv = clientInvoices.filter(
              (i) => effectiveInvoiceStatus(i) !== "paid",
            );
            const ar = openInv.reduce((s, i) => s + invoiceTotal(i), 0);

            return (
              <Stack gap={2}>
                <Text weight="semibold" size="sm">
                  Related work
                </Text>
                <Text muted size="sm">
                  {clientProjects.length} project
                  {clientProjects.length === 1 ? "" : "s"}
                  {clientProjects.length
                    ? ` (${clientProjects.map((p) => p.name).slice(0, 3).join(", ")}${clientProjects.length > 3 ? "…" : ""})`
                    : ""}
                  {" · "}
                  {openTasks.length} open task
                  {openTasks.length === 1 ? "" : "s"}
                  {" · "}
                  {openInv.length} open invoice
                  {openInv.length === 1 ? "" : "s"}
                  {ar > 0 ? ` (${formatMoney(ar)})` : ""}
                </Text>
                <div class="related-chip-row">
                  <button
                    type="button"
                    class="related-chip"
                    onClick={() => {
                      drawerOpen.set(false);
                      router.navigate("/projects?view=pipeline");
                    }}
                  >
                    Projects
                  </button>
                  <button
                    type="button"
                    class="related-chip"
                    onClick={() => {
                      drawerOpen.set(false);
                      router.navigate("/tasks?status=open");
                    }}
                  >
                    Open tasks
                  </button>
                  <button
                    type="button"
                    class="related-chip"
                    onClick={() => {
                      drawerOpen.set(false);
                      router.navigate("/invoices?status=outstanding");
                    }}
                  >
                    Invoices
                  </button>
                  <button
                    type="button"
                    class="related-chip"
                    onClick={() => {
                      drawerOpen.set(false);
                      router.navigate("/time");
                    }}
                  >
                    Time
                  </button>
                </div>
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
        title="Delete client?"
        description="Projects, tasks, and invoices for this client will be removed too."
        size="sm"
      >
        <Stack gap={3}>
          <Text size="sm">
            This only affects local data on this browser.
          </Text>
          <Stack direction="row" gap={2} justify="end">
            <Button variant="ghost" onClick={() => confirmOpen.set(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </Stack>
  );
}
