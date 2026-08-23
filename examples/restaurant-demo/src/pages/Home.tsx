import {
  Button,
  Card,
  Grid,
  Stack,
  Stat,
  Text,
  type ToastController,
} from "@lab206/ui";
import type { Router } from "@lab206/router";
import {
  profile,
  tonightReservations,
  openOrders,
  coversTonight,
  openTableCount,
  seatedTableCount,
  seatedParties,
  waitingBookings,
  preferenceLabel,
  seatAnyAvailable,
  formatMoney,
  menuById,
  guestNameForOrder,
  orderTotal,
  servers,
  zoneServers,
  serverById,
  tablesForServer,
  ZONE_LABELS,
  serverForTable,
  tables,
} from "../data/store.js";
import type { TableZone } from "../data/types.js";

/**
 * Staff floor overview — who is seated, who is waiting, kitchen pulse.
 * (Guest marketing lives under /visit.)
 */
export function HomePage(props: {
  router: Router;
  toaster: ToastController;
}) {
  const { router, toaster } = props;
  const go = (to: string) => () => router.navigate(to);

  return (
    <Stack gap={6}>
      <Stack gap={2}>
        <Text as="h1" size="2xl" weight="semibold">
          Floor overview
        </Text>
        <Text muted size="sm">
          {() =>
            `${profile().name} · who is seated, who’s waiting, and what the kitchen is working on`
          }
        </Text>
        <Stack direction="row" gap={2} wrap>
          <Button size="sm" onClick={go("/tables")}>
            Table map
          </Button>
          <Button size="sm" variant="soft" onClick={go("/reservations")}>
            Tonight’s book
          </Button>
          <Button size="sm" variant="soft" onClick={go("/service")}>
            Kitchen tickets
          </Button>
          <Button size="sm" variant="ghost" onClick={go("/visit")}>
            Guest site →
          </Button>
        </Stack>
      </Stack>

      <div class="ops-rail" aria-label="How staff flow works">
        <span class="ops-rail__step">
          <strong>1 Book</strong>
          <span>Guest reserves (+ optional area)</span>
        </span>
        <span class="ops-rail__arrow" aria-hidden="true">
          →
        </span>
        <span class="ops-rail__step">
          <strong>2 Seat</strong>
          <span>Any available or pick on map</span>
        </span>
        <span class="ops-rail__arrow" aria-hidden="true">
          →
        </span>
        <span class="ops-rail__step">
          <strong>3 Tickets</strong>
          <span>Open & advance from table or kitchen</span>
        </span>
        <span class="ops-rail__arrow" aria-hidden="true">
          →
        </span>
        <span class="ops-rail__step">
          <strong>4 Clear</strong>
          <span>Dirty → open for next party</span>
        </span>
      </div>

      <Grid cols={4} gap={4}>
        <Stat
          label="Waiting to seat"
          value={() => String(waitingBookings().length)}
          delta={() => `${coversTonight()} covers booked`}
          tone="neutral"
          onClick={go("/reservations")}
        />
        <Stat
          label="Seated now"
          value={() => String(seatedTableCount())}
          delta={() => `${openTableCount()} tables free`}
          tone="positive"
          onClick={go("/tables")}
        />
        <Stat
          label="Open tickets"
          value={() => String(openOrders().length)}
          hint="kitchen + floor"
          tone={openOrders().length > 0 ? "negative" : "neutral"}
          onClick={go("/service")}
        />
        <Stat
          label="Tonight’s book"
          value={() => String(tonightReservations().length)}
          delta={() => `${coversTonight()} covers`}
          tone="positive"
          onClick={go("/reservations")}
        />
      </Grid>

      <Grid cols={2} gap={4}>
        <Card>
          <Stack gap={3}>
            <Stack direction="row" gap={2} justify="between" align="center" wrap>
              <Text weight="semibold">On the floor now</Text>
              <Button size="sm" variant="ghost" onClick={go("/tables")}>
                Open map
              </Button>
            </Stack>
            <Text muted size="sm">
              Seated parties, their table, and open kitchen tickets.
            </Text>
            {() => {
              const list = seatedParties();
              if (list.length === 0) {
                return (
                  <Text muted size="sm">
                    No one seated yet — seat a booking or walk-in on the map.
                  </Text>
                );
              }
              const frag = document.createDocumentFragment();
              for (const p of list) {
                const row = document.createElement("button");
                row.type = "button";
                row.className = "party-row";
                row.onclick = () =>
                  router.navigate(
                    `/tables?table=${encodeURIComponent(p.table.id)}`,
                  );

                const head = document.createElement("div");
                head.className = "party-row__head";
                const where = document.createElement("span");
                where.className = "party-row__table";
                where.textContent = p.table.label;
                const name = document.createElement("span");
                name.className = "party-row__name";
                name.textContent = p.guestName;
                head.append(where, name);

                const meta = document.createElement("div");
                meta.className = "party-row__meta";
                const bits = [
                  p.partySize != null ? `party of ${p.partySize}` : null,
                  p.tickets.length
                    ? `${p.tickets.length} ticket${p.tickets.length === 1 ? "" : "s"}`
                    : "no tickets",
                  p.pulse || null,
                  p.ticketTotal > 0 ? formatMoney(p.ticketTotal) : null,
                ].filter(Boolean);
                meta.textContent = bits.join(" · ");

                if (p.tickets.length > 0) {
                  const dots = document.createElement("div");
                  dots.className = "ticket-dots";
                  for (const o of p.tickets) {
                    const d = document.createElement("span");
                    d.className = `ticket-dot ticket-dot--${o.status}`;
                    d.title = o.status;
                    dots.appendChild(d);
                  }
                  row.append(head, meta, dots);
                } else {
                  row.append(head, meta);
                }
                frag.appendChild(row);
              }
              return frag;
            }}
          </Stack>
        </Card>

        <Card>
          <Stack gap={3}>
            <Stack direction="row" gap={2} justify="between" align="center" wrap>
              <Text weight="semibold">Waiting to seat</Text>
              <Button size="sm" variant="ghost" onClick={go("/reservations")}>
                Full book
              </Button>
            </Stack>
            <Text muted size="sm">
              Booked guests not yet seated — seat any or open the map.
            </Text>
            {() => {
              const list = waitingBookings();
              if (list.length === 0) {
                return (
                  <Text muted size="sm">
                    No one waiting — walk-ins can be seated on the map.
                  </Text>
                );
              }
              const frag = document.createDocumentFragment();
              for (const r of list) {
                const row = document.createElement("div");
                row.className = "party-row party-row--actions";

                const main = document.createElement("button");
                main.type = "button";
                main.className = "party-row__hit";
                main.onclick = () => router.navigate("/reservations");
                const head = document.createElement("div");
                head.className = "party-row__head";
                const time = document.createElement("span");
                time.className = "party-row__table";
                time.textContent = r.time;
                const name = document.createElement("span");
                name.className = "party-row__name";
                name.textContent = r.guestName;
                head.append(time, name);
                const meta = document.createElement("div");
                meta.className = "party-row__meta";
                const pref = preferenceLabel(r);
                meta.textContent = [
                  `party of ${r.partySize}`,
                  pref !== "Any" ? `wants ${pref}` : "any table",
                  r.notes || null,
                ]
                  .filter(Boolean)
                  .join(" · ");
                main.append(head, meta);

                const actions = document.createElement("div");
                actions.className = "party-row__btns";
                const seatAny = document.createElement("button");
                seatAny.type = "button";
                seatAny.className = "row-action";
                seatAny.textContent = "Seat any";
                seatAny.onclick = (e) => {
                  e.stopPropagation();
                  const fit = seatAnyAvailable(r.id);
                  if (!fit) {
                    toaster.push({
                      title: "No open table",
                      description: "Free a table or use the map",
                      tone: "danger",
                    });
                    return;
                  }
                  toaster.push({
                    title: `Seated at ${fit.label}`,
                    description: r.guestName,
                    tone: "success",
                  });
                };
                const mapBtn = document.createElement("button");
                mapBtn.type = "button";
                mapBtn.className = "row-action row-action--soft";
                mapBtn.textContent = "Map";
                mapBtn.onclick = (e) => {
                  e.stopPropagation();
                  router.navigate(
                    `/tables?seat=${encodeURIComponent(r.id)}`,
                  );
                };
                actions.append(seatAny, mapBtn);
                row.append(main, actions);
                frag.appendChild(row);
              }
              return frag;
            }}
          </Stack>
        </Card>
      </Grid>

      <Card>
        <Stack gap={3}>
          <Stack direction="row" gap={2} justify="between" align="center" wrap>
            <Text weight="semibold">Server sections</Text>
            <Button size="sm" variant="ghost" onClick={go("/settings")}>
              Assign
            </Button>
          </Stack>
          <Text muted size="sm">
            Who covers each section tonight — tables inherit unless overridden on
            the map.
          </Text>
          {() => {
            const zones: TableZone[] = ["window", "main", "patio", "bar"];
            const zs = zoneServers();
            const frag = document.createDocumentFragment();
            for (const zone of zones) {
              const srv = serverById(zs[zone]);
              const n = tables().filter((t) => {
                const s = serverForTable(t);
                return s?.id === zs[zone] && t.zone === zone;
              }).length;
              // count seated under this section's server
              const seated = tables().filter(
                (t) =>
                  t.zone === zone &&
                  t.status === "seated" &&
                  serverForTable(t)?.id === (zs[zone] ?? ""),
              ).length;
              const row = document.createElement("div");
              row.className = "section-server-row";
              const z = document.createElement("span");
              z.className = "section-server-row__zone";
              z.textContent = ZONE_LABELS[zone];
              const who = document.createElement("span");
              who.className = "section-server-row__who";
              who.textContent = srv
                ? `${srv.initials} · ${srv.name} · ${seated} seated`
                : "Unassigned";
              row.append(z, who);
              frag.appendChild(row);
            }
            // also list servers with total tables
            for (const s of servers().filter((x) => x.active)) {
              void tablesForServer(s.id);
            }
            return frag;
          }}
        </Stack>
      </Card>

      <Card>
        <Stack gap={3}>
          <Stack direction="row" gap={2} justify="between" align="center" wrap>
            <Text weight="semibold">Kitchen pulse</Text>
            <Button size="sm" variant="ghost" onClick={go("/service")}>
              Service board
            </Button>
          </Stack>
          <Text muted size="sm">
            Open tickets linked to tables and guests.
          </Text>
          {() => {
            const list = openOrders();
            if (list.length === 0) {
              return (
                <Text muted size="sm">
                  All clear — no open tickets. Open one from a seated table.
                </Text>
              );
            }
            const frag = document.createDocumentFragment();
            for (const o of list) {
              const row = document.createElement("button");
              row.type = "button";
              row.className = "party-row";
              row.onclick = () => router.navigate("/service");

              const head = document.createElement("div");
              head.className = "party-row__head";
              const tbl = document.createElement("span");
              tbl.className = "party-row__table";
              tbl.textContent = o.table;
              const guest = guestNameForOrder(o);
              const name = document.createElement("span");
              name.className = "party-row__name";
              name.textContent = guest || "—";
              head.append(tbl, name);

              const lines = o.lines
                .map((l) => {
                  const item = menuById(l.menuItemId);
                  return `${l.qty}× ${item?.name ?? "Item"}`;
                })
                .join(", ");

              const meta = document.createElement("div");
              meta.className = "party-row__meta";
              meta.textContent = `${lines} · ${formatMoney(orderTotal(o))}`;

              const status = document.createElement("span");
              status.className = `status-pill status-pill--ticket-${o.status}`;
              status.textContent = o.status;

              const wrap = document.createElement("div");
              wrap.className = "party-row__with-status";
              wrap.append(head, meta);

              row.append(wrap, status);
              frag.appendChild(row);
            }
            return frag;
          }}
        </Stack>
      </Card>
    </Stack>
  );
}
