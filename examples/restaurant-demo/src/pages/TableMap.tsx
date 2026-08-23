import { signal, type Signal } from "@lab206/core";
import {
  Button,
  Card,
  Drawer,
  Field,
  Input,
  Select,
  Stack,
  Text,
  type ToastController,
} from "@lab206/ui";
import type { Router } from "@lab206/router";
import { PageHeader } from "../components/uiBits.js";
import {
  tables,
  tonightReservations,
  openTableCount,
  seatedTableCount,
  ordersForTable,
  tableById,
  seatReservationAtTable,
  seatAnyAvailable,
  seatWalkIn,
  clearTable,
  markTableOpen,
  reserveTable,
  createOrder,
  availableMenu,
  orderTotal,
  formatMoney,
  ZONE_LABELS,
  preferenceLabel,
  tableFitsParty,
  findBestTableForReservation,
  reservations,
  reservationById,
  seatedParties,
  waitingBookings,
  setOrderStatus,
  menuById,
  guestNameForTable,
  serverForTable,
  setTableServer,
  servers,
  zoneServers,
  serverById,
} from "../data/store.js";
import type {
  FloorTable,
  Order,
  OrderStatus,
  Reservation,
  TableStatus,
  TableZone,
} from "../data/types.js";

function parseQuery(search: string): { seat: string | null; table: string | null } {
  const q = search.startsWith("?") ? search.slice(1) : search;
  const params = new URLSearchParams(q);
  return { seat: params.get("seat"), table: params.get("table") };
}

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

const STATUS_HELP: Record<TableStatus, string> = {
  open: "Available for seating",
  reserved: "Held for a booking",
  seated: "Guests dining",
  dirty: "Needs turn before next party",
};

function seatControls(
  t: FloorTable,
  ctx: {
    seatRsvId: Signal<string>;
    walkInName: Signal<string>;
    toaster: ToastController;
    drawerOpen: Signal<boolean>;
  },
) {
  const { seatRsvId, walkInName, toaster, drawerOpen } = ctx;
  return (
    <Stack gap={3}>
      <Text weight="semibold" size="sm">
        Seat a party
      </Text>
      <Field label="From tonight’s book">
        <Select
          bind={seatRsvId}
          options={() => {
            const booked = tonightReservations().filter(
              (r) => r.status === "booked",
            );
            const ranked = booked.slice().sort((a, b) => {
              const score = (r: Reservation) => {
                if (r.preferredTableId === t.id) return 0;
                if (r.preferredZone === t.zone) return 1;
                if (!r.preferredZone && !r.preferredTableId) return 2;
                return 3;
              };
              return score(a) - score(b) || a.time.localeCompare(b.time);
            });
            return [
              { value: "", label: "Choose guest…" },
              ...ranked.map((r) => {
                const pref = preferenceLabel(r);
                const match =
                  r.preferredTableId === t.id
                    ? " · their table"
                    : r.preferredZone === t.zone
                      ? " · their zone"
                      : pref !== "Any"
                        ? ` · wants ${pref}`
                        : "";
                return {
                  value: r.id,
                  label: `${r.time} · ${r.guestName} (${r.partySize})${match}`,
                };
              }),
            ];
          }}
        />
      </Field>
      {() => {
        const rid = seatRsvId();
        if (!rid) return null;
        const r = reservations().find((x) => x.id === rid);
        if (!r) return null;
        const pref = preferenceLabel(r);
        const matchTable = r.preferredTableId === t.id;
        const matchZone = r.preferredZone === t.zone;
        const fits = tableFitsParty(t, r.partySize);
        return Text({
          size: "sm",
          muted: true,
          children: [
            pref !== "Any" ? `Prefers ${pref}. ` : "No seating preference. ",
            matchTable
              ? "This is their requested table."
              : matchZone
                ? "In their preferred area."
                : pref !== "Any"
                  ? "Different area than requested."
                  : "",
            !fits ? " Party may be tight here." : "",
          ]
            .filter(Boolean)
            .join(""),
        });
      }}
      <Button
        size="sm"
        onClick={() => {
          const rid = seatRsvId();
          if (!rid) {
            toaster.push({ title: "Pick a reservation", tone: "info" });
            return;
          }
          const r = reservations().find((x) => x.id === rid);
          const ok = seatReservationAtTable(rid, t.id);
          if (!ok) {
            toaster.push({
              title: "Could not seat",
              description: "Table busy or party too large",
              tone: "danger",
            });
            return;
          }
          const honored =
            r &&
            ((r.preferredTableId && r.preferredTableId === t.id) ||
              (r.preferredZone === t.zone && !r.preferredTableId));
          toaster.push({
            title: `Seated at ${t.label}`,
            description: honored
              ? `${r?.guestName ?? "Guest"} · preference matched`
              : (r?.guestName ?? t.label),
            tone: "success",
          });
          drawerOpen.set(false);
        }}
      >
        Seat at {t.label}
      </Button>
      <Field label="Or walk-in name">
        <Input
          bind={walkInName}
          placeholder="Walk-in"
        />
      </Field>
      <Button
        size="sm"
        variant="soft"
        onClick={() => {
          seatWalkIn(t.id, walkInName());
          toaster.push({
            title: "Walk-in seated",
            description: `${t.label} · ${walkInName() || "Walk-in"}`,
            tone: "success",
          });
          drawerOpen.set(false);
        }}
      >
        Seat walk-in here
      </Button>
      {t.status === "open"
        ? Button({
            size: "sm",
            variant: "ghost",
            children: "Hold as reserved",
            onClick: () => {
              reserveTable(t.id);
              toaster.push({
                title: "Reserved",
                description: t.label,
                tone: "info",
              });
            },
          })
        : null}
    </Stack>
  );
}

function ticketCard(
  o: Order,
  toaster: ToastController,
) {
  const card = document.createElement("div");
  card.className = `ticket ticket--compact ticket--${o.status}`;

  const head = document.createElement("div");
  head.className = "ticket__head";
  const status = document.createElement("strong");
  status.textContent = o.status;
  const total = document.createElement("span");
  total.textContent = formatMoney(orderTotal(o));
  head.append(status, total);

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
  const next = NEXT[o.status];
  if (next) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "row-action";
    btn.textContent = NEXT_LABEL[o.status] ?? "Advance";
    btn.onclick = () => {
      setOrderStatus(o.id, next);
      toaster.push({
        title: NEXT_LABEL[o.status] ?? "Updated",
        description: o.table,
        tone: "success",
      });
    };
    actions.appendChild(btn);
  }
  card.appendChild(actions);
  return card;
}

export function TableMapPage(props: {
  router: Router;
  toaster: ToastController;
}) {
  const { router, toaster } = props;
  const q = parseQuery(router.search());
  const seatFromUrl = q.seat;
  const tableFromUrl = q.table;

  const selectedId = signal<string | null>(tableFromUrl);
  const drawerOpen = signal(!!tableFromUrl || false);
  const walkInName = signal("Walk-in");
  const seatRsvId = signal(seatFromUrl ?? "");
  const focusRsvId = signal<string | null>(seatFromUrl);

  if (seatFromUrl && !tableFromUrl) {
    const best = findBestTableForReservation(seatFromUrl);
    if (best && (best.status === "open" || best.status === "reserved")) {
      selectedId.set(best.id);
      drawerOpen.set(true);
    }
  }

  if (tableFromUrl) {
    const t = tableById(tableFromUrl);
    if (t) {
      walkInName.set(t.guestLabel || "Walk-in");
    }
  }

  const openTable = (t: FloorTable) => {
    selectedId.set(t.id);
    walkInName.set(t.guestLabel || "Walk-in");
    const focus = focusRsvId();
    const focusRsv = focus
      ? tonightReservations().find(
          (r) => r.id === focus && r.status === "booked",
        )
      : undefined;
    if (focusRsv && tableFitsParty(t, focusRsv.partySize)) {
      seatRsvId.set(focusRsv.id);
    } else {
      const waiting =
        tonightReservations().find(
          (r) =>
            r.status === "booked" &&
            r.preferredTableId === t.id &&
            tableFitsParty(t, r.partySize),
        ) ??
        tonightReservations().find(
          (r) =>
            r.status === "booked" &&
            r.preferredZone === t.zone &&
            tableFitsParty(t, r.partySize),
        ) ??
        tonightReservations().find(
          (r) => r.status === "booked" && tableFitsParty(t, r.partySize),
        );
      seatRsvId.set(waiting?.id ?? "");
    }
    drawerOpen.set(true);
  };

  const seatAnyFocused = () => {
    const rid = focusRsvId() || seatRsvId();
    if (!rid) {
      toaster.push({
        title: "No guest selected",
        description: "Pick a waiting guest from the roster or book",
        tone: "info",
      });
      return;
    }
    const r = reservations().find((x) => x.id === rid);
    const fit = seatAnyAvailable(rid);
    if (!fit) {
      toaster.push({
        title: "No open table",
        description: "Free a table or pick one on the map",
        tone: "danger",
      });
      return;
    }
    const honored =
      r &&
      ((r.preferredTableId && fit.id === r.preferredTableId) ||
        (r.preferredZone === fit.zone && !r.preferredTableId));
    toaster.push({
      title: `Seated at ${fit.label}`,
      description: honored
        ? `${r?.guestName ?? "Guest"} · preference matched`
        : `${r?.guestName ?? "Guest"} · best available`,
      tone: "success",
    });
    focusRsvId.set(null);
    seatRsvId.set("");
    selectedId.set(fit.id);
    drawerOpen.set(true);
    if (router.search().includes("seat=")) {
      router.navigate(`/tables?table=${encodeURIComponent(fit.id)}`, {
        replace: true,
      });
    }
  };

  return (
    <Stack gap={5}>
      <PageHeader
        title="Floor map"
        subtitle={() =>
          `${openTableCount()} open · ${seatedTableCount()} seated · ${waitingBookings().length} waiting · click a table or roster row`
        }
        actions={
          <Stack direction="row" gap={2} wrap>
            <Button
              size="sm"
              variant="soft"
              onClick={() => router.navigate("/reservations")}
            >
              Book
            </Button>
            <Button size="sm" onClick={() => router.navigate("/service")}>
              Kitchen
            </Button>
          </Stack>
        }
      />

      {() => {
        const rid = focusRsvId();
        if (!rid) return null;
        const r = reservations().find((x) => x.id === rid);
        if (!r || r.status !== "booked") return null;
        const pref = preferenceLabel(r);
        const best = findBestTableForReservation(r.id);
        const banner = document.createElement("div");
        banner.className = "seat-focus-banner";
        const text = document.createElement("div");
        text.className = "seat-focus-banner__text";
        const strong = document.createElement("strong");
        strong.textContent = `Seating ${r.guestName}`;
        text.append(
          strong,
          document.createTextNode(
            ` · party of ${r.partySize} · ${r.time}${pref !== "Any" ? ` · prefers ${pref}` : ""}${best ? ` · suggested ${best.label}` : " · no open fit"}`,
          ),
        );
        const actions = document.createElement("div");
        actions.className = "seat-focus-banner__actions";
        const anyBtn = document.createElement("button");
        anyBtn.type = "button";
        anyBtn.className = "row-action";
        anyBtn.textContent = "Seat any available";
        anyBtn.onclick = () => seatAnyFocused();
        const clearBtn = document.createElement("button");
        clearBtn.type = "button";
        clearBtn.className = "row-action row-action--soft";
        clearBtn.textContent = "Clear focus";
        clearBtn.onclick = () => {
          focusRsvId.set(null);
          seatRsvId.set("");
          if (router.search().includes("seat=")) {
            router.navigate("/tables", { replace: true });
          }
        };
        actions.append(anyBtn, clearBtn);
        banner.append(text, actions);
        return banner;
      }}

      <div class="map-legend" aria-label="Status legend">
        <span class="map-legend__item map-legend__item--open">
          <i />
          Open
        </span>
        <span class="map-legend__item map-legend__item--reserved">
          <i />
          Reserved
        </span>
        <span class="map-legend__item map-legend__item--seated">
          <i />
          Seated
        </span>
        <span class="map-legend__item map-legend__item--dirty">
          <i />
          Dirty
        </span>
        <span class="map-legend__item map-legend__item--ticket">
          <i />
          Ticket badge = open kitchen tickets
        </span>
      </div>

      <div class="floor-layout">
        <Card class="floor-card">
          <div
            class="floor-plan"
            role="group"
            aria-label="Restaurant floor plan"
          >
            <div class="floor-plan__zone floor-plan__zone--window">Window</div>
            <div class="floor-plan__zone floor-plan__zone--bar">Bar</div>
            <div class="floor-plan__zone floor-plan__zone--patio">Patio</div>
            <div class="floor-plan__zone floor-plan__zone--kitchen">Kitchen</div>
            {() => {
              const focus = focusRsvId()
                ? reservations().find((r) => r.id === focusRsvId())
                : undefined;
              const suggested = focus
                ? findBestTableForReservation(focus.id)?.id
                : undefined;
              const frag = document.createDocumentFragment();
              for (const t of tables()) {
                const btn = document.createElement("button");
                btn.type = "button";
                const matchesPref =
                  !!focus &&
                  focus.status === "booked" &&
                  (focus.preferredTableId === t.id ||
                    (!focus.preferredTableId &&
                      focus.preferredZone === t.zone));
                const isSuggested = suggested === t.id;
                const isSelected = selectedId() === t.id;
                btn.className = [
                  "floor-table",
                  `floor-table--${t.status}`,
                  matchesPref ? "floor-table--pref" : "",
                  isSuggested ? "floor-table--suggested" : "",
                  isSelected ? "floor-table--selected" : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                btn.style.left = `${t.x}%`;
                btn.style.top = `${t.y}%`;
                const guest = guestNameForTable(t.id);
                const tickets = ordersForTable(t.id);
                btn.setAttribute(
                  "aria-label",
                  `${t.label}, ${t.seats} seats, ${STATUS_HELP[t.status]}${guest ? `, ${guest}` : ""}${tickets.length ? `, ${tickets.length} tickets` : ""}`,
                );
                btn.onclick = () => openTable(t);

                const label = document.createElement("span");
                label.className = "floor-table__label";
                label.textContent = t.label;

                const seats = document.createElement("span");
                seats.className = "floor-table__seats";
                seats.textContent = `${t.seats}p`;
                btn.append(label, seats);

                const srv = serverForTable(t);
                if (srv) {
                  const sb = document.createElement("span");
                  sb.className = "floor-table__server";
                  sb.textContent = srv.initials;
                  sb.title = srv.name;
                  btn.appendChild(sb);
                }

                if (t.status === "seated" && guest) {
                  const gEl = document.createElement("span");
                  gEl.className = "floor-table__guest";
                  gEl.textContent =
                    guest.length > 12 ? guest.slice(0, 11) + "…" : guest;
                  btn.appendChild(gEl);
                }

                if (tickets.length > 0) {
                  const badge = document.createElement("span");
                  badge.className = "floor-table__ticket";
                  badge.textContent = String(tickets.length);
                  badge.title = tickets
                    .map((o) => o.status)
                    .join(", ");
                  btn.appendChild(badge);

                  const dots = document.createElement("span");
                  dots.className = "floor-table__dots";
                  for (const o of tickets) {
                    const d = document.createElement("i");
                    d.className = `ticket-dot ticket-dot--${o.status}`;
                    dots.appendChild(d);
                  }
                  btn.appendChild(dots);
                }

                frag.appendChild(btn);
              }
              return frag;
            }}
          </div>
        </Card>

        <Card class="floor-roster">
          <Stack gap={4}>
            <Stack gap={2}>
              <Text weight="semibold">Section servers</Text>
              <Text muted size="xs">
                Who covers each area tonight (edit in Settings).
              </Text>
              {() => {
                const frag = document.createDocumentFragment();
                const byZone: TableZone[] = ["window", "main", "patio", "bar"];
                const zs = zoneServers();
                for (const zone of byZone) {
                  const row = document.createElement("div");
                  row.className = "section-server-row";
                  const z = document.createElement("span");
                  z.className = "section-server-row__zone";
                  z.textContent = ZONE_LABELS[zone];
                  const who = document.createElement("span");
                  who.className = "section-server-row__who";
                  const srv = serverById(zs[zone]);
                  who.textContent = srv
                    ? `${srv.initials} · ${srv.name}`
                    : "Unassigned";
                  row.append(z, who);
                  frag.appendChild(row);
                }
                return frag;
              }}
            </Stack>

            <Stack gap={2}>
              <Text weight="semibold">Seated now</Text>
              <Text muted size="xs">
                Guest · table · server · tickets. Click to manage.
              </Text>
              {() => {
                const list = seatedParties();
                if (list.length === 0) {
                  return (
                    <Text muted size="sm">
                      Floor empty — seat from Waiting or click an open table.
                    </Text>
                  );
                }
                const frag = document.createDocumentFragment();
                for (const p of list) {
                  const row = document.createElement("button");
                  row.type = "button";
                  row.className =
                    "roster-row" +
                    (selectedId() === p.table.id ? " is-selected" : "");
                  row.onclick = () => openTable(p.table);

                  const top = document.createElement("div");
                  top.className = "roster-row__top";
                  const tbl = document.createElement("span");
                  tbl.className = "roster-row__table";
                  tbl.textContent = p.table.label;
                  const name = document.createElement("span");
                  name.className = "roster-row__name";
                  name.textContent = p.guestName;
                  top.append(tbl, name);

                  const meta = document.createElement("div");
                  meta.className = "roster-row__meta";
                  const srv = serverForTable(p.table);
                  meta.textContent = [
                    p.partySize != null ? `${p.partySize}p` : null,
                    ZONE_LABELS[p.table.zone],
                    srv ? srv.name : "no server",
                    p.tickets.length
                      ? `${p.tickets.length} ticket${p.tickets.length === 1 ? "" : "s"}`
                      : "no tickets",
                    p.pulse || null,
                  ]
                    .filter(Boolean)
                    .join(" · ");

                  row.append(top, meta);
                  if (p.tickets.length) {
                    const dots = document.createElement("div");
                    dots.className = "ticket-dots";
                    for (const o of p.tickets) {
                      const d = document.createElement("span");
                      d.className = `ticket-dot ticket-dot--${o.status}`;
                      d.title = o.status;
                      dots.appendChild(d);
                    }
                    row.appendChild(dots);
                  }
                  frag.appendChild(row);
                }
                return frag;
              }}
            </Stack>

            <Stack gap={2}>
              <Text weight="semibold">Waiting</Text>
              <Text muted size="xs">
                Not seated yet — seat any or focus on map.
              </Text>
              {() => {
                const list = waitingBookings();
                if (list.length === 0) {
                  return (
                    <Text muted size="sm">
                      No one waiting.
                    </Text>
                  );
                }
                const frag = document.createDocumentFragment();
                for (const r of list) {
                  const row = document.createElement("div");
                  row.className =
                    "roster-row roster-row--wait" +
                    (focusRsvId() === r.id ? " is-selected" : "");

                  const top = document.createElement("div");
                  top.className = "roster-row__top";
                  const time = document.createElement("span");
                  time.className = "roster-row__table";
                  time.textContent = r.time;
                  const name = document.createElement("span");
                  name.className = "roster-row__name";
                  name.textContent = r.guestName;
                  top.append(time, name);

                  const meta = document.createElement("div");
                  meta.className = "roster-row__meta";
                  const pref = preferenceLabel(r);
                  meta.textContent = [
                    `${r.partySize}p`,
                    pref !== "Any" ? `wants ${pref}` : "any",
                  ].join(" · ");

                  const btns = document.createElement("div");
                  btns.className = "roster-row__btns";
                  const any = document.createElement("button");
                  any.type = "button";
                  any.className = "row-action";
                  any.textContent = "Seat any";
                  any.onclick = () => {
                    const fit = seatAnyAvailable(r.id);
                    if (!fit) {
                      toaster.push({
                        title: "No open table",
                        tone: "danger",
                      });
                      return;
                    }
                    toaster.push({
                      title: `Seated at ${fit.label}`,
                      description: r.guestName,
                      tone: "success",
                    });
                    selectedId.set(fit.id);
                    drawerOpen.set(true);
                  };
                  const focus = document.createElement("button");
                  focus.type = "button";
                  focus.className = "row-action row-action--soft";
                  focus.textContent = "Focus";
                  focus.onclick = () => {
                    focusRsvId.set(r.id);
                    seatRsvId.set(r.id);
                    const best = findBestTableForReservation(r.id);
                    if (best) {
                      selectedId.set(best.id);
                      drawerOpen.set(true);
                    }
                  };
                  btns.append(any, focus);
                  row.append(top, meta, btns);
                  frag.appendChild(row);
                }
                return frag;
              }}
            </Stack>
          </Stack>
        </Card>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => drawerOpen.set(false)}
        title="Table detail"
        side="right"
      >
        <Stack gap={4}>
          {() => {
            const t = selectedId() ? tableById(selectedId()!) : undefined;
            if (!t) {
              return (
                <Text muted size="sm">
                  Select a table on the map or roster.
                </Text>
              );
            }

            const open = ordersForTable(t.id);
            const ticketSum = open.reduce((s, o) => s + orderTotal(o), 0);
            const rsv = t.reservationId
              ? reservationById(t.reservationId)
              : undefined;
            const guest = t.guestLabel || rsv?.guestName || "";

            const ticketList = document.createElement("div");
            ticketList.className = "table-ticket-list";
            if (open.length === 0) {
              const empty = document.createElement("p");
              empty.className = "table-ticket-list__empty";
              empty.textContent =
                t.status === "seated"
                  ? "No open tickets for this party yet."
                  : "Seat guests before opening tickets.";
              ticketList.appendChild(empty);
            } else {
              for (const o of open) {
                ticketList.appendChild(ticketCard(o, toaster));
              }
            }

            return (
              <Stack gap={3}>
                <div class="table-detail-hero">
                  <div class="table-detail-hero__label">{t.label}</div>
                  <div class="table-detail-hero__meta">
                    {t.seats} seats · {ZONE_LABELS[t.zone]} ·{" "}
                    {STATUS_HELP[t.status]}
                  </div>
                  {guest
                    ? (() => {
                        const el = document.createElement("div");
                        el.className = "table-detail-hero__guest";
                        el.textContent = guest;
                        if (rsv?.partySize) {
                          el.textContent += ` · party of ${rsv.partySize}`;
                        }
                        return el;
                      })()
                    : null}
                  {(() => {
                    const srv = serverForTable(t);
                    const el = document.createElement("div");
                    el.className = "table-detail-hero__server";
                    el.textContent = srv
                      ? `Server: ${srv.name}${t.serverId ? " (table override)" : " (section)"}`
                      : "Server: unassigned — set section in Settings or override below";
                    return el;
                  })()}
                  {rsv && rsv.status === "booked"
                    ? Text({
                        size: "sm",
                        muted: true,
                        children: `Linked booking ${rsv.time}${preferenceLabel(rsv) !== "Any" ? ` · prefers ${preferenceLabel(rsv)}` : ""}`,
                      })
                    : null}
                </div>

                <Field
                  label="Server for this table"
                  hint="Blank = use section default from Settings."
                >
                  <Select
                    value={t.serverId ?? ""}
                    options={() => [
                      {
                        value: "",
                        label: `Section default${serverById(zoneServers()[t.zone]) ? ` (${serverById(zoneServers()[t.zone])!.name})` : ""}`,
                      },
                      ...servers().map((s) => ({
                        value: s.id,
                        label: s.active ? s.name : `${s.name} (off)`,
                      })),
                    ]}
                    onChange={(e) => {
                      const el = e.currentTarget ?? e.target;
                      const v =
                        el && typeof el === "object" && "value" in el
                          ? String((el as { value: string }).value) || null
                          : null;
                      setTableServer(t.id, v);
                      toaster.push({
                        title: "Table server updated",
                        description: v
                          ? serverById(v)?.name
                          : "Using section default",
                        tone: "success",
                        duration: 1600,
                      });
                    }}
                  />
                </Field>

                <Stack gap={2}>
                  <Stack
                    direction="row"
                    gap={2}
                    justify="between"
                    align="center"
                  >
                    <Text weight="semibold" size="sm">
                      Kitchen tickets
                    </Text>
                    {open.length > 0
                      ? Text({
                          size: "xs",
                          muted: true,
                          children: `${open.length} open · ${formatMoney(ticketSum)}`,
                        })
                      : null}
                  </Stack>
                  {ticketList}
                </Stack>

                {t.status === "open" || t.status === "reserved"
                  ? seatControls(t, {
                      seatRsvId,
                      walkInName,
                      toaster,
                      drawerOpen,
                    })
                  : null}

                {t.status === "seated" ? (
                  <Stack gap={2}>
                    <Text weight="semibold" size="sm">
                      Party actions
                    </Text>
                    <Stack direction="row" gap={2} wrap>
                      <Button
                        size="sm"
                        onClick={() => {
                          const item = availableMenu()[0];
                          if (!item) {
                            toaster.push({
                              title: "Menu empty",
                              tone: "danger",
                            });
                            return;
                          }
                          createOrder({
                            table: t.label,
                            tableId: t.id,
                            lines: [{ menuItemId: item.id, qty: 1 }],
                            notes: "",
                          });
                          toaster.push({
                            title: "Ticket opened",
                            description: `${t.label}${guest ? ` · ${guest}` : ""}`,
                            tone: "success",
                          });
                        }}
                      >
                        Open ticket
                      </Button>
                      <Button
                        size="sm"
                        variant="soft"
                        onClick={() => router.navigate("/service")}
                      >
                        Kitchen board
                      </Button>
                      <Button
                        size="sm"
                        variant="soft"
                        onClick={() => {
                          clearTable(t.id);
                          toaster.push({
                            title: "Table cleared",
                            description: "Marked dirty for turn",
                            tone: "info",
                          });
                          drawerOpen.set(false);
                        }}
                      >
                        Clear → dirty
                      </Button>
                    </Stack>
                  </Stack>
                ) : null}

                {t.status === "dirty"
                  ? Button({
                      size: "sm",
                      children: "Mark open (ready for guests)",
                      onClick: () => {
                        markTableOpen(t.id);
                        toaster.push({
                          title: "Ready for guests",
                          description: t.label,
                          tone: "success",
                        });
                        drawerOpen.set(false);
                      },
                    })
                  : null}

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => drawerOpen.set(false)}
                >
                  Close
                </Button>
              </Stack>
            );
          }}
        </Stack>
      </Drawer>
    </Stack>
  );
}
