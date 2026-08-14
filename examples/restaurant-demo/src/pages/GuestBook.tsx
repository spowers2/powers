import { signal } from "@power-ui/core";
import {
  Button,
  Card,
  Field,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  firstError,
  required,
  type ToastController,
} from "@power-ui/ui";
import type { Router } from "@power-ui/router";
import { PageHeader } from "../components/uiBits.js";
import {
  profile,
  tables,
  upsertReservation,
  ZONE_LABELS,
} from "../data/store.js";
import type { TableZone } from "../data/types.js";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

const ZONE_OPTS: { value: string; label: string }[] = [
  { value: "", label: "No preference" },
  { value: "window", label: "Window" },
  { value: "main", label: "Main room" },
  { value: "patio", label: "Patio" },
  { value: "bar", label: "Bar" },
];

/** Guest reservation form → same local book as ops Reservations. */
export function GuestBookPage(props: {
  router: Router;
  toaster: ToastController;
}) {
  const { router, toaster } = props;
  const guestName = signal("");
  const partySize = signal("2");
  const date = signal(today());
  const time = signal("19:00");
  const notes = signal("");
  const preferredZone = signal("");
  const preferredTableId = signal("");
  const touched = signal(false);

  const nameErr = () =>
    !touched() ? "" : firstError(required(guestName(), "Name required"));

  const tableOptions = () => {
    const zone = preferredZone() as TableZone | "";
    const party = Math.max(1, Math.round(Number(partySize()) || 2));
    const list = tables()
      .filter((t) => {
        if (zone && t.zone !== zone) return false;
        return t.seats + 1 >= party;
      })
      .slice()
      .sort((a, b) => a.label.localeCompare(b.label));
    return [
      { value: "", label: "Any table in area" },
      ...list.map((t) => ({
        value: t.id,
        label: `${t.label} · ${t.seats} seats · ${ZONE_LABELS[t.zone]}`,
      })),
    ];
  };

  const submit = () => {
    touched.set(true);
    if (nameErr()) {
      toaster.push({ title: "Add your name", tone: "danger" });
      return;
    }
    const zone = (preferredZone() || null) as TableZone | null;
    const tableId = preferredTableId() || null;
    // If a specific table is chosen, sync zone from that table
    const tbl = tableId ? tables().find((t) => t.id === tableId) : undefined;
    const finalZone = tbl?.zone ?? zone;

    upsertReservation({
      guestName: guestName().trim(),
      partySize: Math.max(1, Math.round(Number(partySize()) || 2)),
      date: date(),
      time: time(),
      status: "booked",
      notes: notes().trim(),
      tableId: null,
      preferredZone: finalZone,
      preferredTableId: tableId,
    });

    const prefBits = [
      finalZone ? ZONE_LABELS[finalZone] : null,
      tbl?.label ?? null,
    ].filter(Boolean);
    toaster.push({
      title: "Request received",
      description: `${guestName().trim()} · party of ${partySize()} · ${date()} ${time()}${prefBits.length ? ` · prefers ${prefBits.join(" · ")}` : ""}`,
      tone: "success",
    });
    guestName.set("");
    notes.set("");
    preferredZone.set("");
    preferredTableId.set("");
    touched.set(false);
    router.navigate("/visit");
  };

  return (
    <Stack gap={6}>
      <PageHeader
        title="Book a table"
        subtitle={() =>
          `Reserve at ${profile().name} — pick a preferred area if you’d like.`
        }
        actions={
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.navigate("/visit/menu")}
          >
            Menu
          </Button>
        }
      />

      <Card>
        <Stack gap={4}>
          <Text muted size="sm">
            {() => profile().address} · {() => profile().hours} ·{" "}
            {() => profile().phone}
          </Text>
          <div class="guest-steps">
            <div class="guest-step">
              <div class="guest-step__n">1</div>
              <Text size="sm">Who & when</Text>
            </div>
            <div class="guest-step">
              <div class="guest-step__n">2</div>
              <Text size="sm">Where (optional)</Text>
            </div>
            <div class="guest-step">
              <div class="guest-step__n">3</div>
              <Text size="sm">Send request</Text>
            </div>
          </div>
          <Field label="Your name" required error={nameErr}>
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
                  onInput={() => {
                    // Clear preferred table if party no longer fits
                    const tid = preferredTableId();
                    if (!tid) return;
                    const t = tables().find((x) => x.id === tid);
                    const party = Math.max(
                      1,
                      Math.round(Number(partySize()) || 2),
                    );
                    if (t && party > t.seats + 1) preferredTableId.set("");
                  }}
                />
              </Field>
            </div>
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

          <Field
            label="Preferred area"
            hint="Optional — we’ll try to honor this when you arrive."
          >
            <Select
              bind={preferredZone}
              options={ZONE_OPTS}
              onChange={() => preferredTableId.set("")}
            />
          </Field>

          <Field
            label="Preferred table"
            hint="Optional — pick a specific spot on our floor plan."
          >
            <Select
              bind={preferredTableId}
              options={tableOptions}
            />
          </Field>

          {() => {
            const list = tables()
              .slice()
              .sort((a, b) => a.label.localeCompare(b.label));
            const zone = preferredZone();
            const selected = preferredTableId();
            const party = Math.max(1, Math.round(Number(partySize()) || 2));

            const wrap = document.createElement("div");
            wrap.className = "pref-map";
            wrap.setAttribute("role", "group");
            wrap.setAttribute("aria-label", "Floor layout — pick a table");

            const zones = document.createElement("div");
            zones.className = "pref-map__zones";
            for (const z of ["window", "main", "patio", "bar"] as TableZone[]) {
              const chip = document.createElement("button");
              chip.type = "button";
              chip.className =
                "pref-map__zone-chip" +
                (zone === z ? " pref-map__zone-chip--active" : "");
              chip.textContent = ZONE_LABELS[z];
              chip.onclick = () => {
                preferredZone.set(zone === z ? "" : z);
                preferredTableId.set("");
              };
              zones.appendChild(chip);
            }
            wrap.appendChild(zones);

            const grid = document.createElement("div");
            grid.className = "pref-map__grid";
            for (const t of list) {
              const fits = party <= t.seats + 1;
              const zoneMatch = !zone || t.zone === zone;
              const btn = document.createElement("button");
              btn.type = "button";
              btn.disabled = !fits;
              btn.className =
                "pref-map__table" +
                (selected === t.id ? " pref-map__table--selected" : "") +
                (!zoneMatch ? " pref-map__table--dim" : "") +
                (!fits ? " pref-map__table--disabled" : "");
              btn.title = `${t.label} · ${t.seats} seats · ${ZONE_LABELS[t.zone]}${fits ? "" : " (too small)"}`;
              btn.onclick = () => {
                if (!fits) return;
                if (selected === t.id) {
                  preferredTableId.set("");
                  return;
                }
                preferredTableId.set(t.id);
                preferredZone.set(t.zone);
              };
              const lab = document.createElement("span");
              lab.className = "pref-map__table-label";
              lab.textContent = t.label;
              const meta = document.createElement("span");
              meta.className = "pref-map__table-meta";
              meta.textContent = `${t.seats}p · ${ZONE_LABELS[t.zone]}`;
              btn.append(lab, meta);
              grid.appendChild(btn);
            }
            wrap.appendChild(grid);

            const help = document.createElement("p");
            help.className = "pref-map__help";
            help.textContent =
              "Tap a zone to filter, or a table to request that spot. Staff can seat you anywhere if needed.";
            wrap.appendChild(help);

            return wrap;
          }}

          <Field label="Notes (allergies, occasion…)">
            <Textarea
              rows={3}
              bind={notes}
              placeholder="Anniversary, high chair, gluten-free options…"
            />
          </Field>
          <Stack direction="row" gap={2} wrap>
            <Button onClick={submit}>Request reservation</Button>
            <Button variant="ghost" onClick={() => router.navigate("/visit")}>
              Cancel
            </Button>
          </Stack>
          <Text size="xs" muted>
            Demo only — data stays in this browser. Staff see preferred seating
            under Reservations and can seat you from the table map.
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
}
