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
import type { Router } from "@powers/router";
import { PageHeader } from "../components/uiBits.js";
import {
  reservations,
  upsertReservation,
  removeReservation,
  seatAnyAvailable,
  preferenceLabel,
  tableById,
  tables,
  tonightReservations,
  coversTonight,
  ZONE_LABELS,
} from "../data/store.js";
import type {
  Reservation,
  ReservationStatus,
  TableZone,
} from "../data/types.js";

const STATUS_OPTS = [
  { value: "booked", label: "Booked" },
  { value: "seated", label: "Seated" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No-show" },
];

const ZONE_OPTS: { value: string; label: string }[] = [
  { value: "", label: "No preference" },
  { value: "window", label: "Window" },
  { value: "main", label: "Main room" },
  { value: "patio", label: "Patio" },
  { value: "bar", label: "Bar" },
];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ReservationsPage(props: {
  toaster: ToastController;
  router?: Router;
}) {
  const { toaster, router } = props;
  const filter = signal("");
  const drawerOpen = signal(false);
  const confirmOpen = signal(false);
  const editingId = signal<string | null>(null);

  const guestName = signal("");
  const partySize = signal("2");
  const date = signal(today());
  const time = signal("19:00");
  const status = signal<ReservationStatus>("booked");
  const notes = signal("");
  const preferredZone = signal("");
  const preferredTableId = signal("");
  const touched = signal(false);

  const nameErr = () =>
    !touched() ? "" : firstError(required(guestName(), "Guest name required"));

  const tableOptions = () => {
    const zone = preferredZone() as TableZone | "";
    const list = tables()
      .filter((t) => !zone || t.zone === zone)
      .slice()
      .sort((a, b) => a.label.localeCompare(b.label));
    return [
      { value: "", label: "Any table" },
      ...list.map((t) => ({
        value: t.id,
        label: `${t.label} · ${t.seats}p · ${ZONE_LABELS[t.zone]}`,
      })),
    ];
  };

  const openNew = () => {
    editingId.set(null);
    guestName.set("");
    partySize.set("2");
    date.set(today());
    time.set("19:00");
    status.set("booked");
    notes.set("");
    preferredZone.set("");
    preferredTableId.set("");
    touched.set(false);
    drawerOpen.set(true);
  };

  const openEdit = (r: Reservation) => {
    editingId.set(r.id);
    guestName.set(r.guestName);
    partySize.set(String(r.partySize));
    date.set(r.date);
    time.set(r.time);
    status.set(r.status);
    notes.set(r.notes);
    preferredZone.set(r.preferredZone ?? "");
    preferredTableId.set(r.preferredTableId ?? "");
    touched.set(false);
    drawerOpen.set(true);
  };

  const save = () => {
    touched.set(true);
    if (nameErr()) {
      toaster.push({ title: "Fix the form", tone: "danger" });
      return;
    }
    const zone = (preferredZone() || null) as TableZone | null;
    const prefTbl = preferredTableId() || null;
    const tbl = prefTbl ? tableById(prefTbl) : undefined;
    upsertReservation({
      id: editingId() ?? undefined,
      guestName: guestName().trim(),
      partySize: Math.max(1, Math.round(Number(partySize()) || 1)),
      date: date(),
      time: time(),
      status: status(),
      notes: notes().trim(),
      preferredZone: tbl?.zone ?? zone,
      preferredTableId: prefTbl,
    });
    drawerOpen.set(false);
    toaster.push({
      title: editingId() ? "Reservation updated" : "Table booked",
      description: guestName().trim(),
      tone: "success",
    });
  };

  const confirmDelete = () => {
    const id = editingId();
    if (!id) return;
    const label = guestName().trim();
    removeReservation(id);
    confirmOpen.set(false);
    drawerOpen.set(false);
    toaster.push({
      title: "Reservation removed",
      description: label,
      tone: "info",
    });
  };

  const seatAny = (r: Reservation) => {
    const fit = seatAnyAvailable(r.id);
    if (!fit) {
      toaster.push({
        title: "No open table",
        description: "Check the table map or free a spot",
        tone: "danger",
      });
      return;
    }
    const honored =
      (r.preferredTableId && fit.id === r.preferredTableId) ||
      (r.preferredZone && fit.zone === r.preferredZone && !r.preferredTableId);
    toaster.push({
      title: `Seated at ${fit.label}`,
      description: honored
        ? `${r.guestName} · matched preference`
        : `${r.guestName} · best available${r.preferredZone || r.preferredTableId ? ` (wanted ${preferenceLabel(r)})` : ""}`,
      tone: "success",
    });
  };

  const openMapFor = (r: Reservation) => {
    if (router) {
      router.navigate(`/tables?seat=${encodeURIComponent(r.id)}`);
      return;
    }
    toaster.push({
      title: "Open table map",
      description: "Use Tables to seat this guest",
      tone: "info",
    });
  };

  return (
    <Stack gap={6}>
      <PageHeader
        title="Reservations"
        subtitle={() =>
          `Tonight: ${coversTonight()} covers across ${tonightReservations().length} bookings.`
        }
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
            <Button size="sm" onClick={openNew}>
              New reservation
            </Button>
          </Stack>
        }
      />

      <Card>
        <Stack gap={3}>
          <Field label="Search">
            <Input
              placeholder="Guest name, notes, or preference…"
              bind={filter}
            />
          </Field>

          {() => {
            const q = filter().trim().toLowerCase();
            const list = reservations()
              .slice()
              .sort(
                (a, b) =>
                  a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
              )
              .filter((r) => {
                if (!q) return true;
                const pref = preferenceLabel(r).toLowerCase();
                return (
                  r.guestName.toLowerCase().includes(q) ||
                  r.notes.toLowerCase().includes(q) ||
                  pref.includes(q)
                );
              });

            if (list.length === 0) {
              return (
                <Empty
                  icon="◷"
                  title={q ? "No matches" : "No reservations"}
                  description="Book a table for walk-ins or planned covers."
                >
                  {!q ? (
                    <Button size="sm" onClick={openNew}>
                      New reservation
                    </Button>
                  ) : null}
                </Empty>
              );
            }

            const frag = document.createDocumentFragment();
            for (const r of list) {
              const row = document.createElement("div");
              row.className = "data-row data-row--invoice";

              const main = document.createElement("button");
              main.type = "button";
              main.className = "data-row__hit";
              main.onclick = () => openEdit(r);

              const left = document.createElement("div");
              left.className = "data-row__main";
              const title = document.createElement("div");
              title.className = "data-row__title";
              title.textContent = r.guestName;
              const meta = document.createElement("div");
              meta.className = "data-row__meta";
              const tbl = r.tableId ? tableById(r.tableId) : undefined;
              const pref = preferenceLabel(r);
              const bits = [
                r.date,
                r.time,
                `party of ${r.partySize}`,
                tbl ? tbl.label : null,
                pref !== "Any" ? `prefers ${pref}` : null,
                r.notes || null,
              ].filter(Boolean);
              meta.textContent = bits.join(" · ");
              left.append(title, meta);

              const badge = document.createElement("span");
              badge.className = `status-pill status-pill--${r.status}`;
              badge.textContent = r.status.replace("_", " ");

              main.append(left, badge);
              row.appendChild(main);

              if (r.status === "booked") {
                const actions = document.createElement("div");
                actions.className = "data-row__actions";

                const seatAnyBtn = document.createElement("button");
                seatAnyBtn.type = "button";
                seatAnyBtn.className = "row-action";
                seatAnyBtn.textContent = "Seat any";
                seatAnyBtn.title =
                  pref !== "Any"
                    ? `Seat best available (prefer ${pref})`
                    : "Seat best available table";
                seatAnyBtn.onclick = (e) => {
                  e.stopPropagation();
                  seatAny(r);
                };

                const mapBtn = document.createElement("button");
                mapBtn.type = "button";
                mapBtn.className = "row-action row-action--soft";
                mapBtn.textContent = "Map…";
                mapBtn.title = "Pick a table on the floor plan";
                mapBtn.onclick = (e) => {
                  e.stopPropagation();
                  openMapFor(r);
                };

                actions.append(seatAnyBtn, mapBtn);
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
        title="Reservation"
        side="right"
      >
        <Stack gap={4}>
          <Field label="Guest name" required error={nameErr}>
            <Input
              bind={guestName}
              onBlur={() => touched.set(true)}
              placeholder="Maya Ortiz"
            />
          </Field>
          <Stack direction="row" gap={2} wrap>
            <div style={{ flex: "1 1 6rem" }}>
              <Field label="Party size">
                <Input
                  type="number"
                  bind={partySize}
                />
              </Field>
            </div>
            <div style={{ flex: "1 1 8rem" }}>
              <Field label="Status">
                <Select
                  bind={asSelectBind(status)}
                  options={STATUS_OPTS}
                />
              </Field>
            </div>
          </Stack>
          <Stack direction="row" gap={2} wrap>
            <div style={{ flex: "1 1 8rem" }}>
              <Field label="Date">
                <Input
                  type="date"
                  bind={date}
                />
              </Field>
            </div>
            <div style={{ flex: "1 1 8rem" }}>
              <Field label="Time">
                <Input
                  type="time"
                  bind={time}
                />
              </Field>
            </div>
          </Stack>
          <Field label="Preferred area">
            <Select
              bind={preferredZone}
              options={ZONE_OPTS}
              onChange={() => preferredTableId.set("")}
            />
          </Field>
          <Field label="Preferred table">
            <Select
              bind={preferredTableId}
              options={tableOptions}
            />
          </Field>
          <Field label="Notes">
            <Textarea
              rows={3}
              bind={notes}
              placeholder="Window seat, high chair…"
            />
          </Field>
          {() => {
            const id = editingId();
            if (!id) return null;
            const r = reservations().find((x) => x.id === id);
            if (!r || r.status !== "booked") return null;
            return (
              <Stack gap={2}>
                <Text size="sm" muted>
                  Seating — honor preference or choose on the map
                </Text>
                <Stack direction="row" gap={2} wrap>
                  <Button
                    size="sm"
                    variant="soft"
                    onClick={() => {
                      seatAny(r);
                      drawerOpen.set(false);
                    }}
                  >
                    Seat any available
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      drawerOpen.set(false);
                      openMapFor(r);
                    }}
                  >
                    Pick on map…
                  </Button>
                </Stack>
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
        title="Cancel reservation?"
        description="Removes it from the book on this browser."
        size="sm"
      >
        <Stack direction="row" gap={2} justify="end">
          <Button variant="ghost" onClick={() => confirmOpen.set(false)}>
            Keep
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Remove
          </Button>
        </Stack>
      </Dialog>
    </Stack>
  );
}
