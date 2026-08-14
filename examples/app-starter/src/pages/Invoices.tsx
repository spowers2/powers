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
  firstError,
  required,
  type ToastController,
  asSelectBind,
} from "@powers/ui";
import { PageHeader } from "../components/uiBits.js";
import {
  clients,
  projects,
  invoices,
  upsertInvoice,
  removeInvoice,
  setInvoiceStatus,
  clientById,
  projectById,
  invoiceTotal,
  effectiveInvoiceStatus,
  formatMoney,
  formatDate,
} from "../data/store.js";
import type { Invoice, InvoiceLine, InvoiceStatus } from "../data/types.js";

const STATUS_OPTS = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

const FILTER_OPTS = [
  { value: "all", label: "All statuses" },
  { value: "outstanding", label: "Outstanding (sent + overdue)" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

function blankLine(): InvoiceLine {
  return { id: "", description: "", amount: 0 };
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function plusDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function initialStatus(): string {
  if (typeof window === "undefined") return "all";
  try {
    const q = new URLSearchParams(window.location.search);
    const s = q.get("status") || "all";
    // outstanding = open AR (sent + overdue) — synthetic filter
    if (
      s === "outstanding" ||
      s === "draft" ||
      s === "sent" ||
      s === "paid" ||
      s === "overdue" ||
      s === "all"
    ) {
      return s;
    }
  } catch {
    /* ignore */
  }
  return "all";
}

export function InvoicesPage(props: {
  toaster: ToastController;
  router?: import("@powers/router").Router;
}) {
  const { toaster } = props;
  const filter = signal("");
  const statusFilter = signal(initialStatus());
  const drawerOpen = signal(false);
  const confirmOpen = signal(false);
  const editingId = signal<string | null>(null);

  const clientId = signal("");
  const projectId = signal("");
  const status = signal<InvoiceStatus>("draft");
  const issueDate = signal(today());
  const dueDate = signal(plusDays(14));
  const notes = signal("");
  const lineDesc = signal("");
  const lineAmount = signal("0");
  const line2Desc = signal("");
  const line2Amount = signal("");
  const touched = signal(false);

  const clientErr = () =>
    !touched() ? "" : firstError(required(clientId(), "Pick a client"));
  const lineErr = () =>
    !touched()
      ? ""
      : firstError(required(lineDesc(), "Add at least one line item"));

  const openNew = () => {
    editingId.set(null);
    clientId.set(clients()[0]?.id ?? "");
    projectId.set("");
    status.set("draft");
    issueDate.set(today());
    dueDate.set(plusDays(14));
    notes.set("");
    lineDesc.set("Professional services");
    lineAmount.set("5000");
    line2Desc.set("");
    line2Amount.set("");
    touched.set(false);
    drawerOpen.set(true);
  };

  const openEdit = (inv: Invoice) => {
    editingId.set(inv.id);
    clientId.set(inv.clientId);
    projectId.set(inv.projectId ?? "");
    status.set(inv.status);
    issueDate.set(inv.issueDate);
    dueDate.set(inv.dueDate);
    notes.set(inv.notes);
    const a = inv.lines[0] ?? blankLine();
    const b = inv.lines[1];
    lineDesc.set(a.description);
    lineAmount.set(String(a.amount));
    line2Desc.set(b?.description ?? "");
    line2Amount.set(b ? String(b.amount) : "");
    touched.set(false);
    drawerOpen.set(true);
  };

  const buildLines = (): InvoiceLine[] => {
    const lines: InvoiceLine[] = [
      {
        id: "",
        description: lineDesc().trim(),
        amount: Math.max(0, Math.round(Number(lineAmount()) || 0)),
      },
    ];
    if (line2Desc().trim() || line2Amount().trim()) {
      lines.push({
        id: "",
        description: line2Desc().trim() || "Additional",
        amount: Math.max(0, Math.round(Number(line2Amount()) || 0)),
      });
    }
    return lines;
  };

  const save = () => {
    touched.set(true);
    if (clientErr() || lineErr()) {
      toaster.push({ title: "Fix the form", tone: "danger" });
      return;
    }
    const id = upsertInvoice({
      id: editingId() ?? undefined,
      clientId: clientId(),
      projectId: projectId() || null,
      status: status(),
      issueDate: issueDate(),
      dueDate: dueDate(),
      lines: buildLines(),
      notes: notes().trim(),
    });
    drawerOpen.set(false);
    const inv = invoices().find((i) => i.id === id);
    toaster.push({
      title: editingId() ? "Invoice updated" : "Invoice created",
      description: inv
        ? `${inv.number} · ${formatMoney(invoiceTotal(inv))}`
        : undefined,
      tone: "success",
    });
  };

  const confirmDelete = () => {
    const id = editingId();
    if (!id) return;
    const inv = invoices().find((i) => i.id === id);
    removeInvoice(id);
    confirmOpen.set(false);
    drawerOpen.set(false);
    toaster.push({
      title: "Invoice removed",
      description: inv?.number,
      tone: "info",
    });
  };

  const quickStatus = (inv: Invoice, next: InvoiceStatus) => {
    setInvoiceStatus(inv.id, next);
    toaster.push({
      title: next === "paid" ? "Marked paid" : `Status → ${next}`,
      description: inv.number,
      tone: "success",
    });
  };

  return (
    <Stack gap={6}>
      <PageHeader
        title="Invoices"
        subtitle="Cash collection — each invoice belongs to a client (and often a project). Outstanding = sent + overdue."
        actions={
          <Button
            size="sm"
            onClick={openNew}
            disabled={() => clients().length === 0}
          >
            New invoice
          </Button>
        }
      />

      <Card>
        <Stack gap={3}>
          <Stack direction="row" gap={2} wrap>
            <div style={{ flex: "1 1 12rem" }}>
              <Field label="Search">
                <Input
                  placeholder="Number, client, notes…"
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
            const list = invoices()
              .slice()
              .sort((a, b) => b.issueDate.localeCompare(a.issueDate))
              .filter((inv) => {
                const eff = effectiveInvoiceStatus(inv);
                if (sf === "outstanding") {
                  if (eff !== "sent" && eff !== "overdue") return false;
                } else if (sf !== "all" && eff !== sf) {
                  return false;
                }
                if (!q) return true;
                const client = clientById(inv.clientId);
                const hay = [
                  inv.number,
                  inv.notes,
                  client?.company,
                  client?.name,
                  ...inv.lines.map((l) => l.description),
                ]
                  .join(" ")
                  .toLowerCase();
                return hay.includes(q);
              });

            if (list.length === 0) {
              return (
                <Empty
                  icon="◈"
                  title={q || sf !== "all" ? "No matches" : "No invoices yet"}
                  description={
                    clients().length === 0
                      ? "Add a client first, then invoice their work."
                      : q || sf !== "all"
                        ? "Try another search or status."
                        : "Create an invoice from a client engagement."
                  }
                >
                  {!q && sf === "all" && clients().length > 0 ? (
                    <Button size="sm" onClick={openNew}>
                      New invoice
                    </Button>
                  ) : null}
                </Empty>
              );
            }

            const frag = document.createDocumentFragment();
            for (const inv of list) {
              const eff = effectiveInvoiceStatus(inv);
              const client = clientById(inv.clientId);
              const prj = inv.projectId ? projectById(inv.projectId) : null;
              const total = invoiceTotal(inv);

              const row = document.createElement("div");
              row.className = "data-row data-row--invoice";

              const main = document.createElement("button");
              main.type = "button";
              main.className = "data-row__hit";
              main.onclick = () => openEdit(inv);

              const left = document.createElement("div");
              left.className = "data-row__main";
              const title = document.createElement("div");
              title.className = "data-row__title";
              title.textContent = inv.number;
              const meta = document.createElement("div");
              meta.className = "data-row__meta";
              meta.textContent = [
                client?.company ?? "—",
                prj?.name,
                `Due ${formatDate(inv.dueDate)}`,
              ]
                .filter(Boolean)
                .join(" · ");
              left.append(title, meta);

              const amount = document.createElement("div");
              amount.className =
                "data-row__side" + (eff === "overdue" ? " is-danger" : "");
              amount.textContent = formatMoney(total);

              const badge = document.createElement("span");
              badge.className = `inv-badge inv-badge--${eff}`;
              badge.textContent = eff;

              main.append(left, amount, badge);
              row.appendChild(main);

              if (eff === "draft" || eff === "sent" || eff === "overdue") {
                const actions = document.createElement("div");
                actions.className = "data-row__actions";
                if (eff === "draft") {
                  const send = document.createElement("button");
                  send.type = "button";
                  send.className = "row-action";
                  send.textContent = "Send";
                  send.onclick = (e) => {
                    e.stopPropagation();
                    quickStatus(inv, "sent");
                  };
                  actions.appendChild(send);
                }
                if (eff === "sent" || eff === "overdue") {
                  const paid = document.createElement("button");
                  paid.type = "button";
                  paid.className = "row-action";
                  paid.textContent = "Mark paid";
                  paid.onclick = (e) => {
                    e.stopPropagation();
                    quickStatus(inv, "paid");
                  };
                  actions.appendChild(paid);
                }
                row.appendChild(actions);
              }

              frag.appendChild(row);
            }
            return frag;
          }}
        </Stack>
      </Card>

      <Drawer
        open={drawerOpen}
        onClose={() => drawerOpen.set(false)}
        title="Invoice"
        side="right"
      >
        <Stack gap={4}>
          <Text size="sm" muted>
            {() => {
              if (!editingId()) return "Number assigned on save (INV-…).";
              const inv = invoices().find((i) => i.id === editingId());
              return inv ? inv.number : "";
            }}
          </Text>

          <Field label="Client" required error={clientErr}>
            <Select
              bind={clientId}
              options={() =>
                clients().map((c) => ({
                  value: c.id,
                  label: c.company,
                }))
              }
              onChange={() => {
                const next = clientId();
                const prj = projectId();
                if (
                  prj &&
                  !projects().some((p) => p.id === prj && p.clientId === next)
                ) {
                  projectId.set("");
                }
              }}
            />
          </Field>

          <Field label="Project">
            <Select
              bind={projectId}
              options={() => {
                const cid = clientId();
                const list = projects().filter((p) => !cid || p.clientId === cid);
                return [
                  { value: "", label: "No project" },
                  ...list.map((p) => ({ value: p.id, label: p.name })),
                ];
              }}
            />
          </Field>

          <Field label="Status">
            <Select
              bind={asSelectBind(status)}
              options={STATUS_OPTS}
            />
          </Field>

          <Stack direction="row" gap={2} wrap>
            <div style={{ flex: "1 1 8rem" }}>
              <Field label="Issue date">
                <Input
                  type="date"
                  bind={issueDate}
                />
              </Field>
            </div>
            <div style={{ flex: "1 1 8rem" }}>
              <Field label="Due date">
                <Input
                  type="date"
                  bind={dueDate}
                />
              </Field>
            </div>
          </Stack>

          <Text weight="semibold" size="sm">
            Line items
          </Text>
          <Field label="Description" required error={lineErr}>
            <Input
              bind={lineDesc}
              onBlur={() => touched.set(true)}
              placeholder="Phase 1 design & build"
            />
          </Field>
          <Field label="Amount (USD)">
            <Input
              type="number"
              bind={lineAmount}
            />
          </Field>
          <Field label="Second line (optional)">
            <Input
              bind={line2Desc}
              placeholder="Workshop, retainers…"
            />
          </Field>
          <Field label="Second amount">
            <Input
              type="number"
              bind={line2Amount}
            />
          </Field>

          {() => {
            const total = buildLines().reduce(
              (s, l) => s + (Number(l.amount) || 0),
              0,
            );
            return (
              <Text size="sm" weight="semibold">
                Total · {formatMoney(total)}
              </Text>
            );
          }}

          <Field label="Notes">
            <Textarea
              rows={3}
              bind={notes}
              placeholder="Payment terms, PO number…"
            />
          </Field>

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
        title="Delete invoice?"
        description="This only removes the record from this browser."
        size="sm"
      >
        <Stack gap={3}>
          <Text size="sm">You can recreate it anytime from seed or new.</Text>
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
