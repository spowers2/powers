import { signal } from "@power-ui/core";
import {
  Button,
  Card,
  Drawer,
  Empty,
  Field,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  type ToastController,
} from "@power-ui/ui";
import type { Router } from "@power-ui/router";
import { PageHeader } from "../components/uiBits.js";
import {
  orders,
  availableMenu,
  openOrders,
  createOrder,
  setOrderStatus,
  removeOrder,
  menuById,
  orderTotal,
  formatMoney,
  tables,
  tableById,
  guestNameForOrder,
  seatedParties,
} from "../data/store.js";
import type { Order, OrderStatus } from "../data/types.js";

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  queued: "prep",
  prep: "ready",
  ready: "served",
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  queued: "Start prep",
  prep: "Mark ready",
  ready: "Serve",
};

const COL_LABEL: Record<"queued" | "prep" | "ready", string> = {
  queued: "Queued",
  prep: "In prep",
  ready: "Ready to run",
};

export function ServicePage(props: {
  toaster: ToastController;
  router?: Router;
}) {
  const { toaster, router } = props;
  const showAll = signal(false);
  const drawerOpen = signal(false);
  const tableId = signal("");
  const notes = signal("");
  const itemId = signal("");
  const qty = signal("1");

  const openNew = () => {
    const preferred =
      tables().find((t) => t.status === "seated") ?? tables()[0];
    tableId.set(preferred?.id ?? "");
    notes.set("");
    itemId.set(availableMenu()[0]?.id ?? "");
    qty.set("1");
    drawerOpen.set(true);
  };

  const save = () => {
    const mid = itemId() || availableMenu()[0]?.id;
    if (!mid) {
      toaster.push({ title: "Add menu items first", tone: "danger" });
      return;
    }
    const tbl = tableById(tableId());
    createOrder({
      table: tbl?.label ?? "Walk-in",
      tableId: tbl?.id ?? null,
      lines: [
        {
          menuItemId: mid,
          qty: Math.max(1, Math.round(Number(qty()) || 1)),
        },
      ],
      notes: notes().trim(),
    });
    drawerOpen.set(false);
    toaster.push({
      title: "Ticket opened",
      description: tbl
        ? `${tbl.label}${tbl.guestLabel ? ` · ${tbl.guestLabel}` : ""}`
        : "Walk-in",
      tone: "success",
    });
  };

  const advance = (o: Order) => {
    const next = NEXT[o.status];
    if (!next) return;
    setOrderStatus(o.id, next);
    const guest = guestNameForOrder(o);
    toaster.push({
      title: NEXT_LABEL[o.status] ?? "Updated",
      description: guest ? `${o.table} · ${guest}` : o.table,
      tone: "success",
    });
  };

  return (
    <Stack gap={6}>
      <PageHeader
        title="Kitchen & service"
        subtitle="Tickets by stage — each card shows table + guest so runners know where food goes."
        actions={
          <Stack direction="row" gap={2} wrap>
            {router
              ? Button({
                  size: "sm",
                  variant: "soft",
                  children: "Table map",
                  onClick: () => router.navigate("/tables"),
                })
              : null}
            <Button
              size="sm"
              variant="soft"
              onClick={() => showAll.set(!showAll())}
            >
              {() => (showAll() ? "Hide served" : "Show served")}
            </Button>
            <Button size="sm" onClick={openNew}>
              New ticket
            </Button>
          </Stack>
        }
      />

      {() => {
        const parties = seatedParties().filter((p) => p.tickets.length > 0);
        if (parties.length === 0) return null;
        const bar = document.createElement("div");
        bar.className = "service-floor-strip";
        const title = document.createElement("div");
        title.className = "service-floor-strip__label";
        title.textContent = "Seated with open tickets";
        bar.appendChild(title);
        const chips = document.createElement("div");
        chips.className = "service-floor-strip__chips";
        for (const p of parties) {
          const chip = document.createElement("button");
          chip.type = "button";
          chip.className = "service-chip";
          chip.textContent = `${p.table.label} · ${p.guestName} · ${p.pulse || `${p.tickets.length} open`}`;
          chip.onclick = () => {
            if (router) {
              router.navigate(
                `/tables?table=${encodeURIComponent(p.table.id)}`,
              );
            }
          };
          chips.appendChild(chip);
        }
        bar.appendChild(chips);
        return bar;
      }}

      <div class="service-cols">
        {(["queued", "prep", "ready"] as const).map((col) => (
          <Card class="service-col">
            <Stack gap={3}>
              <Stack direction="row" gap={2} justify="between" align="center">
                <Text weight="semibold" size="sm">
                  {COL_LABEL[col]}
                </Text>
                {() => {
                  const n = orders().filter((o) => o.status === col).length;
                  return Text({
                    size: "xs",
                    muted: true,
                    children: String(n),
                  });
                }}
              </Stack>
              {() => {
                const list = orders().filter((o) => o.status === col);
                if (list.length === 0) {
                  return (
                    <Text muted size="sm">
                      Empty
                    </Text>
                  );
                }
                const frag = document.createDocumentFragment();
                for (const o of list) {
                  frag.appendChild(
                    ticketEl(o, toaster, advance, false, router),
                  );
                }
                return frag;
              }}
            </Stack>
          </Card>
        ))}
      </div>

      {() => {
        if (!showAll()) {
          const open = openOrders().length;
          return (
            <Text muted size="sm">
              {open} open ticket{open === 1 ? "" : "s"} · advance Ready → Serve
              when food hits the table.
            </Text>
          );
        }
        const served = orders().filter((o) => o.status === "served");
        if (served.length === 0) {
          return (
            <Empty
              icon="✓"
              title="No served tickets yet"
              description="Advance ready tickets to served."
            />
          );
        }
        return (
          <Card>
            <Stack gap={3}>
              <Text weight="semibold">Served</Text>
              {() => {
                const frag = document.createDocumentFragment();
                for (const o of served) {
                  frag.appendChild(
                    ticketEl(o, toaster, advance, true, router),
                  );
                }
                return frag;
              }}
            </Stack>
          </Card>
        );
      }}

      <Drawer
        open={drawerOpen}
        onClose={() => drawerOpen.set(false)}
        title="New ticket"
        side="right"
      >
        <Stack gap={4}>
          <Field
            label="Table"
            hint="Prefer seated tables — guest name appears on the ticket."
          >
            <Select
              bind={tableId}
              options={() => {
                const seated = tables().filter((t) => t.status === "seated");
                const rest = tables().filter((t) => t.status !== "seated");
                const opts = [...seated, ...rest].map((t) => ({
                  value: t.id,
                  label: `${t.label} · ${t.guestLabel || t.status}${t.status === "seated" ? " (seated)" : ""}`,
                }));
                return opts.length
                  ? opts
                  : [{ value: "", label: "No tables" }];
              }}
            />
          </Field>
          <Field label="Dish">
            <Select
              bind={itemId}
              options={() =>
                availableMenu().map((m) => ({
                  value: m.id,
                  label: `${m.name} · ${formatMoney(m.price)}`,
                }))
              }
            />
          </Field>
          <Field label="Qty">
            <Input
              type="number"
              bind={qty}
            />
          </Field>
          <Field label="Notes">
            <Textarea
              rows={3}
              bind={notes}
              placeholder="Allergies, mods…"
            />
          </Field>
          <Stack direction="row" gap={2}>
            <Button onClick={save}>Open ticket</Button>
            <Button variant="ghost" onClick={() => drawerOpen.set(false)}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </Stack>
  );
}

function ticketEl(
  o: Order,
  toaster: ToastController,
  advance: (o: Order) => void,
  served = false,
  router?: Router,
) {
  const card = document.createElement("div");
  card.className = `ticket ticket--${o.status}`;

  const head = document.createElement("div");
  head.className = "ticket__head";
  const left = document.createElement("div");
  left.className = "ticket__who";
  const table = document.createElement("strong");
  table.textContent = o.table;
  const guest = guestNameForOrder(o);
  left.appendChild(table);
  if (guest) {
    const g = document.createElement("span");
    g.className = "ticket__guest";
    g.textContent = guest;
    left.appendChild(g);
  }
  const total = document.createElement("span");
  total.className = "ticket__total";
  total.textContent = formatMoney(orderTotal(o));
  head.append(left, total);

  const lines = document.createElement("ul");
  lines.className = "ticket__lines";
  for (const line of o.lines) {
    const li = document.createElement("li");
    const item = menuById(line.menuItemId);
    li.textContent = `${line.qty}× ${item?.name ?? "Item"}`;
    lines.appendChild(li);
  }

  card.append(head, lines);

  if (o.notes) {
    const note = document.createElement("div");
    note.className = "ticket__notes";
    note.textContent = o.notes;
    card.appendChild(note);
  }

  const actions = document.createElement("div");
  actions.className = "ticket__actions";
  if (!served && NEXT[o.status]) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "row-action";
    btn.textContent = NEXT_LABEL[o.status] ?? "Advance";
    btn.onclick = () => advance(o);
    actions.appendChild(btn);
  }
  if (router && o.tableId && !served) {
    const map = document.createElement("button");
    map.type = "button";
    map.className = "row-action row-action--soft";
    map.textContent = "Table";
    map.title = "Open on table map";
    map.onclick = () =>
      router.navigate(`/tables?table=${encodeURIComponent(o.tableId!)}`);
    actions.appendChild(map);
  }
  const del = document.createElement("button");
  del.type = "button";
  del.className = "row-action";
  del.textContent = "Dismiss";
  del.onclick = () => {
    removeOrder(o.id);
    toaster.push({
      title: "Ticket dismissed",
      description: guest ? `${o.table} · ${guest}` : o.table,
      tone: "info",
    });
  };
  actions.appendChild(del);
  card.appendChild(actions);

  return card;
}
