import { signal } from "@power-ui/core";
import {
  Button,
  Card,
  Field,
  Input,
  Stack,
  Text,
  Alert,
  required,
  firstError,
  type DensityController,
  type ThemeController,
  type ToastController,
} from "@power-ui/ui";
import { PageHeader } from "../components/uiBits.js";
import { PHOTO_CREDIT } from "../data/images.js";
import {
  profile,
  saveProfile,
  resetWorkspace,
  servers,
  zoneServers,
  upsertServer,
  removeServer,
  setZoneServer,
  tablesForServer,
  ZONE_LABELS,
} from "../data/store.js";
import type { TableZone } from "../data/types.js";

const ZONES: TableZone[] = ["window", "main", "patio", "bar"];

export function SettingsPage(props: {
  theme: ThemeController;
  density: DensityController;
  toaster: ToastController;
}) {
  const { theme, density, toaster } = props;
  const name = signal(profile().name);
  const tagline = signal(profile().tagline);
  const address = signal(profile().address);
  const hours = signal(profile().hours);
  const phone = signal(profile().phone);
  const touched = signal(false);
  const confirmReset = signal(false);
  const newServerName = signal("");
  const newServerInit = signal("");

  const nameErr = () =>
    !touched() ? "" : firstError(required(name(), "Name required"));

  const save = () => {
    touched.set(true);
    if (nameErr()) {
      toaster.push({ title: "Fix the form", tone: "danger" });
      return;
    }
    saveProfile({
      name: name().trim(),
      tagline: tagline().trim(),
      address: address().trim(),
      hours: hours().trim(),
      phone: phone().trim(),
    });
    toaster.push({
      title: "Restaurant profile saved",
      tone: "success",
    });
  };

  return (
    <Stack gap={6}>
      <PageHeader
        title="Settings"
        subtitle="Restaurant profile, floor team (servers & sections), theme, and demo data."
      />

      <Card>
        <Stack gap={4}>
          <Text weight="semibold">Floor team</Text>
          <Text muted size="sm">
            Assign servers to sections (window, main, patio, bar). Tables inherit
            the section server unless you override one on the map.
          </Text>
          {() => {
            const list = servers();
            if (list.length === 0) {
              return (
                <Text muted size="sm">
                  No servers yet — add someone below.
                </Text>
              );
            }
            const frag = document.createDocumentFragment();
            for (const s of list) {
              const row = document.createElement("div");
              row.className = "server-row";
              const badge = document.createElement("span");
              badge.className = "server-badge";
              badge.textContent = s.initials;
              const body = document.createElement("div");
              body.className = "server-row__body";
              const name = document.createElement("div");
              name.className = "server-row__name";
              name.textContent = s.name;
              const meta = document.createElement("div");
              meta.className = "server-row__meta";
              const zones = ZONES.filter((z) => zoneServers()[z] === s.id).map(
                (z) => ZONE_LABELS[z],
              );
              const n = tablesForServer(s.id).length;
              meta.textContent = [
                s.active ? "On floor" : "Off",
                zones.length ? `sections: ${zones.join(", ")}` : "no sections",
                `${n} table${n === 1 ? "" : "s"}`,
              ].join(" · ");
              body.append(name, meta);
              const del = document.createElement("button");
              del.type = "button";
              del.className = "row-action";
              del.textContent = "Remove";
              del.onclick = () => {
                removeServer(s.id);
                toaster.push({
                  title: "Server removed",
                  description: s.name,
                  tone: "info",
                });
              };
              row.append(badge, body, del);
              frag.appendChild(row);
            }
            return frag;
          }}
          <Stack direction="row" gap={2} wrap>
            <div style={{ flex: "1 1 10rem" }}>
              <Field label="Name">
                <Input
                  bind={newServerName}
                  placeholder="Casey Nguyen"
                />
              </Field>
            </div>
            <div style={{ flex: "0 1 5rem" }}>
              <Field label="Initials">
                <Input
                  bind={newServerInit}
                  onInput={() =>
                    newServerInit.set(newServerInit().toUpperCase().slice(0, 2))
                  }
                  placeholder="CN"
                />
              </Field>
            </div>
            <div style={{ alignSelf: "flex-end" }}>
              <Button
                size="sm"
                onClick={() => {
                  const n = newServerName().trim();
                  if (!n) {
                    toaster.push({ title: "Add a name", tone: "danger" });
                    return;
                  }
                  upsertServer({
                    name: n,
                    initials: newServerInit().trim() || n.slice(0, 2),
                    active: true,
                  });
                  newServerName.set("");
                  newServerInit.set("");
                  toaster.push({ title: "Server added", description: n, tone: "success" });
                }}
              >
                Add server
              </Button>
            </div>
          </Stack>

          <Text weight="semibold" size="sm">
            Section coverage
          </Text>
          {() => {
            const grid = document.createElement("div");
            grid.className = "zone-assign-grid";
            for (const zone of ZONES) {
              const wrap = document.createElement("label");
              wrap.className = "zone-assign";
              const lab = document.createElement("span");
              lab.className = "zone-assign__label";
              lab.textContent = ZONE_LABELS[zone];
              const sel = document.createElement("select");
              sel.className = "zone-assign__select";
              const none = document.createElement("option");
              none.value = "";
              none.textContent = "Unassigned";
              sel.appendChild(none);
              for (const s of servers()) {
                const opt = document.createElement("option");
                opt.value = s.id;
                opt.textContent = s.active ? s.name : `${s.name} (off)`;
                sel.appendChild(opt);
              }
              sel.value = zoneServers()[zone] ?? "";
              sel.onchange = () => {
                const v = sel.value || null;
                setZoneServer(zone, v);
                toaster.push({
                  title: `${ZONE_LABELS[zone]} section`,
                  description: v
                    ? servers().find((x) => x.id === v)?.name
                    : "Unassigned",
                  tone: "success",
                  duration: 1600,
                });
              };
              wrap.append(lab, sel);
              grid.appendChild(wrap);
            }
            return grid;
          }}
        </Stack>
      </Card>

      <Card>
        <Stack gap={4}>
          <Text weight="semibold">Restaurant</Text>
          <Field label="Name" required error={nameErr}>
            <Input
              bind={name}
              onBlur={() => touched.set(true)}
            />
          </Field>
          <Field label="Tagline">
            <Input
              bind={tagline}
            />
          </Field>
          <Field label="Address">
            <Input
              bind={address}
            />
          </Field>
          <Field label="Hours">
            <Input
              bind={hours}
            />
          </Field>
          <Field label="Phone">
            <Input
              bind={phone}
            />
          </Field>
          <Button onClick={save}>Save profile</Button>
        </Stack>
      </Card>

      <Card>
        <Stack gap={3}>
          <Text weight="semibold">Appearance</Text>
          <Text muted size="sm">
            Mode: {() => theme.mode()} · Density: {() => density.density()}
          </Text>
          <Stack direction="row" gap={2} wrap>
            <Button size="sm" variant="soft" onClick={() => theme.toggle()}>
              Toggle theme
            </Button>
            <Button size="sm" variant="ghost" onClick={() => density.toggle()}>
              Toggle density
            </Button>
          </Stack>
        </Stack>
      </Card>

      <Card>
        <Stack gap={3}>
          <Text weight="semibold">Demo data</Text>
          <Text muted size="sm">
            Reset restores seed menu, reservations, and tickets. Photos reload
            from Unsplash CDN.
          </Text>
          <Text size="xs" muted>
            {PHOTO_CREDIT}
          </Text>
          {() =>
            confirmReset() ? (
              <Alert tone="warning" title="Reset everything?">
                <Stack gap={2}>
                  <Text size="sm">This overwrites local restaurant data.</Text>
                  <Stack direction="row" gap={2}>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        resetWorkspace();
                        const p = profile();
                        name.set(p.name);
                        tagline.set(p.tagline);
                        address.set(p.address);
                        hours.set(p.hours);
                        phone.set(p.phone);
                        confirmReset.set(false);
                        toaster.push({
                          title: "Demo data restored",
                          tone: "info",
                        });
                      }}
                    >
                      Yes, reset
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => confirmReset.set(false)}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              </Alert>
            ) : (
              Button({
                size: "sm",
                variant: "danger",
                children: "Reset demo data",
                onClick: () => confirmReset.set(true),
              })
            )
          }
        </Stack>
      </Card>
    </Stack>
  );
}
