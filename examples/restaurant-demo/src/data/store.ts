import { signal, computed, effect } from "@power-ux/core";
import { PHOTOS } from "./images.js";
import type {
  MenuItem,
  MenuCategory,
  Reservation,
  ReservationStatus,
  Order,
  OrderStatus,
  OrderLine,
  RestaurantProfile,
  Workspace,
  FloorTable,
  TableStatus,
  TableZone,
  Server,
  ZoneServerMap,
} from "./types.js";

const KEY = "hearth-workspace-v3";
const KEY_V2 = "hearth-workspace-v2";

function id(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function seedTables(
  rsvSeatedId: string,
): FloorTable[] {
  // Layout: percent positions on a stylized floor plan
  return [
    {
      id: id("tbl"),
      label: "T1",
      seats: 2,
      zone: "window",
      x: 12,
      y: 18,
      status: "open",
      reservationId: null,
      guestLabel: "",
      serverId: null,
    },
    {
      id: id("tbl"),
      label: "T2",
      seats: 2,
      zone: "window",
      x: 28,
      y: 18,
      status: "reserved",
      reservationId: null,
      guestLabel: "",
      serverId: null,
    },
    {
      id: id("tbl"),
      label: "T3",
      seats: 4,
      zone: "main",
      x: 48,
      y: 28,
      status: "open",
      reservationId: null,
      guestLabel: "",
      serverId: null,
    },
    {
      id: id("tbl"),
      label: "T4",
      seats: 4,
      zone: "main",
      x: 68,
      y: 28,
      status: "seated",
      reservationId: rsvSeatedId,
      guestLabel: "Ben & Aria",
      serverId: null,
    },
    {
      id: id("tbl"),
      label: "T5",
      seats: 4,
      zone: "main",
      x: 48,
      y: 52,
      status: "open",
      reservationId: null,
      guestLabel: "",
      serverId: null,
    },
    {
      id: id("tbl"),
      label: "T6",
      seats: 6,
      zone: "main",
      x: 72,
      y: 55,
      status: "open",
      reservationId: null,
      guestLabel: "",
      serverId: null,
    },
    {
      id: id("tbl"),
      label: "T7",
      seats: 2,
      zone: "patio",
      x: 14,
      y: 72,
      status: "seated",
      reservationId: null,
      guestLabel: "Walk-in",
      serverId: null,
    },
    {
      id: id("tbl"),
      label: "T8",
      seats: 4,
      zone: "patio",
      x: 32,
      y: 78,
      status: "dirty",
      reservationId: null,
      guestLabel: "",
      serverId: null,
    },
    {
      id: id("tbl"),
      label: "B1",
      seats: 1,
      zone: "bar",
      x: 88,
      y: 22,
      status: "open",
      reservationId: null,
      guestLabel: "",
      serverId: null,
    },
    {
      id: id("tbl"),
      label: "B2",
      seats: 1,
      zone: "bar",
      x: 88,
      y: 40,
      status: "seated",
      reservationId: null,
      guestLabel: "Bar",
      serverId: null,
    },
    {
      id: id("tbl"),
      label: "B3",
      seats: 1,
      zone: "bar",
      x: 88,
      y: 58,
      status: "open",
      reservationId: null,
      guestLabel: "",
      serverId: null,
    },
  ];
}

function seed(): Workspace {
  const now = Date.now();
  const m1 = id("mi");
  const m2 = id("mi");
  const m3 = id("mi");
  const m4 = id("mi");
  const m5 = id("mi");
  const m6 = id("mi");
  const m7 = id("mi");
  const m8 = id("mi");
  const m9 = id("mi");
  const m10 = id("mi");
  const rsvSeated = id("rsv");
  const tables = seedTables(rsvSeated);
  const t4 = tables.find((t) => t.label === "T4")!;
  const t7 = tables.find((t) => t.label === "T7")!;
  const b2 = tables.find((t) => t.label === "B2")!;

  const s1 = id("srv");
  const s2 = id("srv");
  const s3 = id("srv");
  const servers: Server[] = [
    { id: s1, name: "Casey Nguyen", initials: "CN", active: true },
    { id: s2, name: "Morgan Lee", initials: "ML", active: true },
    { id: s3, name: "Alex Rivera", initials: "AR", active: true },
  ];
  const zoneServers: ZoneServerMap = {
    window: s1,
    main: s2,
    patio: s1,
    bar: s3,
  };

  return {
    version: 3,
    profile: {
      name: "Hearth",
      tagline: "Wood-fired plates · neighborhood wine · open kitchen",
      address: "412 Ember Lane, Portland",
      hours: "Tue–Sun · 5–10pm · Brunch Sat–Sun 10–2",
      phone: "(503) 555-0142",
    },
    menu: [
      {
        id: m1,
        name: "Charred sourdough",
        description: "Cultured butter, smoked salt, herb oil.",
        price: 9,
        category: "starters",
        imageUrl: PHOTOS.bread,
        available: true,
        popular: true,
      },
      {
        id: m2,
        name: "Market salad",
        description: "Seasonal greens, citrus, toasted seeds, soft cheese.",
        price: 14,
        category: "starters",
        imageUrl: PHOTOS.salad,
        available: true,
        popular: false,
      },
      {
        id: m3,
        name: "Roasted tomato soup",
        description: "San Marzano, basil oil, grilled cheese soldiers.",
        price: 12,
        category: "starters",
        imageUrl: PHOTOS.soup,
        available: true,
        popular: false,
      },
      {
        id: m4,
        name: "Hand-cut tagliatelle",
        description: "Brown butter, sage, aged parmesan.",
        price: 24,
        category: "mains",
        imageUrl: PHOTOS.pasta,
        available: true,
        popular: true,
      },
      {
        id: m5,
        name: "Hearth steak",
        description: "12oz ribeye, chimichurri, roasted alliums.",
        price: 42,
        category: "mains",
        imageUrl: PHOTOS.steak,
        available: true,
        popular: true,
      },
      {
        id: m6,
        name: "Cedar salmon",
        description: "Citrus glaze, farro, wilted greens.",
        price: 32,
        category: "mains",
        imageUrl: PHOTOS.fish,
        available: true,
        popular: false,
      },
      {
        id: m7,
        name: "Wood-fired pizza",
        description: "Tomato, mozzarella, chili honey, basil.",
        price: 20,
        category: "mains",
        imageUrl: PHOTOS.pizza,
        available: true,
        popular: true,
      },
      {
        id: m8,
        name: "Weekend brunch board",
        description: "Eggs, jam, fruit, pastry rotation.",
        price: 22,
        category: "mains",
        imageUrl: PHOTOS.brunch,
        available: true,
        popular: false,
      },
      {
        id: m9,
        name: "Olive oil cake",
        description: "Citrus curd, whipped cream, pistachio.",
        price: 11,
        category: "desserts",
        imageUrl: PHOTOS.dessert,
        available: true,
        popular: true,
      },
      {
        id: m10,
        name: "House negroni",
        description: "Barrel-aged, orange peel, amaro finish.",
        price: 14,
        category: "drinks",
        imageUrl: PHOTOS.cocktail,
        available: true,
        popular: true,
      },
    ],
    reservations: [
      {
        id: id("rsv"),
        guestName: "Maya Ortiz",
        partySize: 4,
        date: today(),
        time: "18:30",
        status: "booked",
        notes: "Window if possible",
        tableId: null,
        preferredZone: "window",
        preferredTableId: null,
        createdAt: now - 3 * 3600e3,
      },
      {
        id: rsvSeated,
        guestName: "Ben & Aria",
        partySize: 2,
        date: today(),
        time: "19:00",
        status: "seated",
        notes: "Anniversary",
        tableId: t4.id,
        preferredZone: "main",
        preferredTableId: t4.id,
        createdAt: now - 5 * 3600e3,
      },
      {
        id: id("rsv"),
        guestName: "Lin Collective",
        partySize: 6,
        date: today(),
        time: "20:15",
        status: "booked",
        notes: "High-top OK",
        tableId: null,
        preferredZone: "patio",
        preferredTableId: null,
        createdAt: now - 1 * 3600e3,
      },
    ],
    orders: [
      {
        id: id("ord"),
        table: t4.label,
        tableId: t4.id,
        lines: [
          { menuItemId: m1, qty: 1 },
          { menuItemId: m4, qty: 2 },
        ],
        status: "prep",
        notes: "One gluten-free pasta",
        createdAt: now - 12 * 60e3,
      },
      {
        id: id("ord"),
        table: t7.label,
        tableId: t7.id,
        lines: [
          { menuItemId: m5, qty: 1 },
          { menuItemId: m10, qty: 2 },
        ],
        status: "queued",
        notes: "",
        createdAt: now - 4 * 60e3,
      },
      {
        id: id("ord"),
        table: b2.label,
        tableId: b2.id,
        lines: [
          { menuItemId: m7, qty: 1 },
          { menuItemId: m9, qty: 1 },
        ],
        status: "ready",
        notes: "Runner called",
        createdAt: now - 22 * 60e3,
      },
    ],
    tables,
    servers,
    zoneServers,
  };
}

function emptyZoneServers(): ZoneServerMap {
  return { main: null, window: null, bar: null, patio: null };
}

function normalizeTable(t: FloorTable & { serverId?: string | null }): FloorTable {
  return {
    ...t,
    serverId: t.serverId ?? null,
  };
}

function defaultServers(): { servers: Server[]; zoneServers: ZoneServerMap } {
  const s1 = id("srv");
  const s2 = id("srv");
  const s3 = id("srv");
  return {
    servers: [
      { id: s1, name: "Casey Nguyen", initials: "CN", active: true },
      { id: s2, name: "Morgan Lee", initials: "ML", active: true },
      { id: s3, name: "Alex Rivera", initials: "AR", active: true },
    ],
    zoneServers: {
      window: s1,
      main: s2,
      patio: s1,
      bar: s3,
    },
  };
}

function migrate(raw: unknown): Workspace | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as {
    version?: number;
    profile?: RestaurantProfile;
    menu?: MenuItem[];
    reservations?: Reservation[];
    orders?: Order[];
    tables?: FloorTable[];
    servers?: Server[];
    zoneServers?: Partial<ZoneServerMap>;
  };
  const staff =
    data.servers && data.servers.length > 0
      ? {
          servers: data.servers,
          zoneServers: {
            ...emptyZoneServers(),
            ...(data.zoneServers ?? {}),
          } as ZoneServerMap,
        }
      : defaultServers();

  if (data.version === 3 && Array.isArray(data.tables) && data.profile) {
    return {
      version: 3,
      profile: data.profile,
      menu: data.menu ?? [],
      reservations: (data.reservations ?? []).map(normalizeReservation),
      orders: data.orders ?? [],
      tables: data.tables.map(normalizeTable),
      servers: staff.servers,
      zoneServers: staff.zoneServers,
    };
  }
  if (data.version === 2 && Array.isArray(data.tables) && data.profile) {
    return {
      version: 3,
      profile: data.profile,
      menu: data.menu ?? [],
      reservations: (data.reservations ?? []).map(normalizeReservation),
      orders: data.orders ?? [],
      tables: data.tables.map(normalizeTable),
      servers: staff.servers,
      zoneServers: staff.zoneServers,
    };
  }
  if (data.version === 1 && data.profile && Array.isArray(data.menu)) {
    const nextTables = seedTables("").map(normalizeTable);
    const reservations = (data.reservations ?? []).map((r) =>
      normalizeReservation({
        ...r,
        tableId: r.tableId ?? null,
      }),
    );
    const orders = (data.orders ?? []).map((o) => {
      const match = nextTables.find((t) => t.label === o.table);
      return {
        ...o,
        tableId: o.tableId ?? match?.id ?? null,
      };
    });
    return {
      version: 3,
      profile: data.profile,
      menu: data.menu,
      reservations,
      orders,
      tables: nextTables,
      servers: staff.servers,
      zoneServers: staff.zoneServers,
    };
  }
  return null;
}

function normalizeReservation(
  r: Reservation & {
    preferredZone?: TableZone | null;
    preferredTableId?: string | null;
  },
): Reservation {
  return {
    ...r,
    tableId: r.tableId ?? null,
    preferredZone: r.preferredZone ?? null,
    preferredTableId: r.preferredTableId ?? null,
  };
}

function load(): Workspace {
  try {
    let raw = localStorage.getItem(KEY);
    if (!raw) raw = localStorage.getItem(KEY_V2);
    if (!raw) raw = localStorage.getItem("hearth-workspace-v1");
    if (!raw) return seed();
    const migrated = migrate(JSON.parse(raw));
    return migrated ?? seed();
  } catch {
    return seed();
  }
}

function save(ws: Workspace) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ws));
  } catch {
    /* quota / private mode */
  }
}

const initial = load();

export const profile = signal<RestaurantProfile>(initial.profile);
export const menu = signal<MenuItem[]>(initial.menu);
export const reservations = signal<Reservation[]>(initial.reservations);
export const orders = signal<Order[]>(initial.orders);
export const tables = signal<FloorTable[]>(initial.tables);
export const servers = signal<Server[]>(initial.servers);
export const zoneServers = signal<ZoneServerMap>(initial.zoneServers);

effect(() => {
  save({
    version: 3,
    profile: profile(),
    menu: menu(),
    reservations: reservations(),
    orders: orders(),
    tables: tables(),
    servers: servers(),
    zoneServers: zoneServers(),
  });
});

export function resetWorkspace() {
  const s = seed();
  profile.set(s.profile);
  menu.set(s.menu);
  reservations.set(s.reservations);
  orders.set(s.orders);
  tables.set(s.tables);
  servers.set(s.servers);
  zoneServers.set(s.zoneServers);
}

export function menuById(itemId: string): MenuItem | undefined {
  return menu().find((m) => m.id === itemId);
}

export function tableById(tableId: string): FloorTable | undefined {
  return tables().find((t) => t.id === tableId);
}

export function tableByLabel(label: string): FloorTable | undefined {
  return tables().find((t) => t.label === label);
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function orderTotal(ord: Order): number {
  return ord.lines.reduce((sum, line) => {
    const item = menuById(line.menuItemId);
    return sum + (item?.price ?? 0) * line.qty;
  }, 0);
}

export const availableMenu = computed(() =>
  menu().filter((m) => m.available),
);

export const popularMenu = computed(() =>
  menu().filter((m) => m.popular && m.available),
);

export const tonightReservations = computed(() => {
  const d = today();
  return reservations()
    .filter((r) => r.date === d && r.status !== "cancelled")
    .sort((a, b) => a.time.localeCompare(b.time));
});

export const openOrders = computed(() =>
  orders()
    .filter((o) => o.status !== "served")
    .sort((a, b) => a.createdAt - b.createdAt),
);

export const coversTonight = computed(() =>
  tonightReservations().reduce((s, r) => s + r.partySize, 0),
);

export const openTableCount = computed(
  () => tables().filter((t) => t.status === "open").length,
);

export const seatedTableCount = computed(
  () => tables().filter((t) => t.status === "seated").length,
);

export function ordersForTable(tableId: string): Order[] {
  return orders().filter(
    (o) =>
      o.status !== "served" &&
      (o.tableId === tableId ||
        o.table === tableById(tableId)?.label),
  );
}

export function reservationById(id: string): Reservation | undefined {
  return reservations().find((r) => r.id === id);
}

/** Guest name for a table: seated label, linked reservation, or order table label. */
export function guestNameForTable(tableId: string): string {
  const t = tableById(tableId);
  if (!t) return "";
  if (t.guestLabel) return t.guestLabel;
  if (t.reservationId) {
    const r = reservationById(t.reservationId);
    if (r) return r.guestName;
  }
  return "";
}

export function guestNameForOrder(o: Order): string {
  if (o.tableId) {
    const g = guestNameForTable(o.tableId);
    if (g) return g;
  }
  const byLabel = tableByLabel(o.table);
  if (byLabel) {
    const g = guestNameForTable(byLabel.id);
    if (g) return g;
  }
  return "";
}

/** Compact ticket pulse: "1 prep · 1 ready" */
export function ticketPulse(tableId: string): string {
  const list = ordersForTable(tableId);
  if (list.length === 0) return "";
  const counts: Partial<Record<OrderStatus, number>> = {};
  for (const o of list) {
    counts[o.status] = (counts[o.status] ?? 0) + 1;
  }
  const parts: string[] = [];
  for (const s of ["queued", "prep", "ready"] as OrderStatus[]) {
    const n = counts[s];
    if (n) parts.push(`${n} ${s === "queued" ? "queue" : s}`);
  }
  return parts.join(" · ");
}

export type FloorParty = {
  table: FloorTable;
  guestName: string;
  partySize: number | null;
  reservation: Reservation | null;
  tickets: Order[];
  ticketTotal: number;
  pulse: string;
};

/** Who is seated where — for staff floor board / map roster. */
export const seatedParties = computed((): FloorParty[] => {
  return tables()
    .filter((t) => t.status === "seated")
    .map((t) => {
      const reservation = t.reservationId
        ? reservationById(t.reservationId) ?? null
        : null;
      const tickets = ordersForTable(t.id);
      return {
        table: t,
        guestName: t.guestLabel || reservation?.guestName || "Guests",
        partySize: reservation?.partySize ?? null,
        reservation,
        tickets,
        ticketTotal: tickets.reduce((s, o) => s + orderTotal(o), 0),
        pulse: ticketPulse(t.id),
      };
    })
    .sort((a, b) => a.table.label.localeCompare(b.table.label));
});

export const waitingBookings = computed(() =>
  tonightReservations().filter((r) => r.status === "booked"),
);

export const CATEGORY_LABELS: Record<MenuCategory, string> = {
  starters: "Starters",
  mains: "Mains",
  sides: "Sides",
  desserts: "Desserts",
  drinks: "Drinks",
};

export const ZONE_LABELS: Record<TableZone, string> = {
  main: "Main",
  window: "Window",
  bar: "Bar",
  patio: "Patio",
};

export function serverById(serverId: string | null | undefined): Server | undefined {
  if (!serverId) return undefined;
  return servers().find((s) => s.id === serverId);
}

/** Effective server for a table: table override, else section (zone) default. */
export function serverForTable(tableIdOrTable: string | FloorTable): Server | undefined {
  const t =
    typeof tableIdOrTable === "string"
      ? tableById(tableIdOrTable)
      : tableIdOrTable;
  if (!t) return undefined;
  if (t.serverId) return serverById(t.serverId);
  return serverById(zoneServers()[t.zone]);
}

export function setZoneServer(zone: TableZone, serverId: string | null) {
  zoneServers.update((m) => ({ ...m, [zone]: serverId }));
}

export function setTableServer(tableId: string, serverId: string | null) {
  tables.update((list) =>
    list.map((t) => (t.id === tableId ? { ...t, serverId } : t)),
  );
}

export function upsertServer(input: {
  id?: string;
  name: string;
  initials: string;
  active: boolean;
}) {
  const initials = (input.initials || input.name.slice(0, 2))
    .toUpperCase()
    .slice(0, 2);
  if (input.id) {
    servers.update((list) =>
      list.map((s) =>
        s.id === input.id
          ? {
              ...s,
              name: input.name.trim(),
              initials,
              active: input.active,
            }
          : s,
      ),
    );
    return input.id;
  }
  const row: Server = {
    id: id("srv"),
    name: input.name.trim(),
    initials,
    active: input.active,
  };
  servers.update((list) => [...list, row]);
  return row.id;
}

export function removeServer(serverId: string) {
  servers.update((list) => list.filter((s) => s.id !== serverId));
  zoneServers.update((m) => {
    const next = { ...m };
    for (const z of Object.keys(next) as TableZone[]) {
      if (next[z] === serverId) next[z] = null;
    }
    return next;
  });
  tables.update((list) =>
    list.map((t) =>
      t.serverId === serverId ? { ...t, serverId: null } : t,
    ),
  );
}

export function tablesForServer(serverId: string): FloorTable[] {
  return tables().filter((t) => serverForTable(t)?.id === serverId);
}

export const activeServers = computed(() =>
  servers().filter((s) => s.active),
);

export function upsertMenuItem(input: {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl: string;
  available: boolean;
  popular: boolean;
}) {
  if (input.id) {
    menu.update((list) =>
      list.map((m) =>
        m.id === input.id
          ? {
              ...m,
              name: input.name,
              description: input.description,
              price: input.price,
              category: input.category,
              imageUrl: input.imageUrl,
              available: input.available,
              popular: input.popular,
            }
          : m,
      ),
    );
    return input.id;
  }
  const row: MenuItem = {
    id: id("mi"),
    name: input.name,
    description: input.description,
    price: input.price,
    category: input.category,
    imageUrl: input.imageUrl,
    available: input.available,
    popular: input.popular,
  };
  menu.update((list) => [...list, row]);
  return row.id;
}

export function toggleMenuAvailable(itemId: string) {
  menu.update((list) =>
    list.map((m) =>
      m.id === itemId ? { ...m, available: !m.available } : m,
    ),
  );
}

export function removeMenuItem(itemId: string) {
  menu.update((list) => list.filter((m) => m.id !== itemId));
}

export function upsertReservation(input: {
  id?: string;
  guestName: string;
  partySize: number;
  date: string;
  time: string;
  status: ReservationStatus;
  notes: string;
  tableId?: string | null;
  preferredZone?: TableZone | null;
  preferredTableId?: string | null;
}) {
  if (input.id) {
    reservations.update((list) =>
      list.map((r) =>
        r.id === input.id
          ? {
              ...r,
              guestName: input.guestName,
              partySize: input.partySize,
              date: input.date,
              time: input.time,
              status: input.status,
              notes: input.notes,
              tableId:
                input.tableId !== undefined ? input.tableId : r.tableId,
              preferredZone:
                input.preferredZone !== undefined
                  ? input.preferredZone
                  : r.preferredZone,
              preferredTableId:
                input.preferredTableId !== undefined
                  ? input.preferredTableId
                  : r.preferredTableId,
            }
          : r,
      ),
    );
    return input.id;
  }
  const row: Reservation = {
    id: id("rsv"),
    guestName: input.guestName,
    partySize: input.partySize,
    date: input.date,
    time: input.time,
    status: input.status,
    notes: input.notes,
    tableId: input.tableId ?? null,
    preferredZone: input.preferredZone ?? null,
    preferredTableId: input.preferredTableId ?? null,
    createdAt: Date.now(),
  };
  reservations.update((list) => [...list, row]);
  return row.id;
}

export function setReservationStatus(
  reservationId: string,
  status: ReservationStatus,
) {
  reservations.update((list) =>
    list.map((r) => (r.id === reservationId ? { ...r, status } : r)),
  );
}

export function removeReservation(reservationId: string) {
  reservations.update((list) => list.filter((r) => r.id !== reservationId));
  tables.update((list) =>
    list.map((t) =>
      t.reservationId === reservationId
        ? {
            ...t,
            reservationId: null,
            status: t.status === "seated" ? "dirty" : t.status,
            guestLabel: t.status === "seated" ? "" : t.guestLabel,
            serverId: null,
          }
        : t,
    ),
  );
}

/** True if table can take this party (open/reserved, capacity with slight overage). */
export function tableFitsParty(
  t: FloorTable,
  partySize: number,
  opts?: { allowReserved?: boolean },
): boolean {
  const statusOk =
    t.status === "open" ||
    (opts?.allowReserved !== false && t.status === "reserved");
  if (!statusOk) return false;
  return partySize <= t.seats + 1;
}

/**
 * Pick best open table for a reservation, honoring preferred table → zone →
 * tightest capacity fit.
 */
export function findBestTableForReservation(
  reservationId: string,
): FloorTable | undefined {
  const rsv = reservations().find((r) => r.id === reservationId);
  if (!rsv || rsv.status === "seated" || rsv.status === "cancelled") {
    return undefined;
  }
  const candidates = tables().filter((t) => tableFitsParty(t, rsv.partySize));
  if (candidates.length === 0) return undefined;

  // Exact preferred table if free and fits
  if (rsv.preferredTableId) {
    const pref = candidates.find((t) => t.id === rsv.preferredTableId);
    if (pref) return pref;
  }

  // Preferred zone: smallest table that fits (least waste)
  const zonePool = rsv.preferredZone
    ? candidates.filter((t) => t.zone === rsv.preferredZone)
    : candidates;
  const pool = zonePool.length > 0 ? zonePool : candidates;

  return pool.slice().sort((a, b) => {
    const wasteA = a.seats - rsv.partySize;
    const wasteB = b.seats - rsv.partySize;
    if (wasteA !== wasteB) return wasteA - wasteB;
    return a.label.localeCompare(b.label);
  })[0];
}

/** Seat onto the best available table (preference-aware). Returns table or null. */
export function seatAnyAvailable(
  reservationId: string,
): FloorTable | null {
  const fit = findBestTableForReservation(reservationId);
  if (!fit) return null;
  const ok = seatReservationAtTable(reservationId, fit.id);
  return ok ? fit : null;
}

/** Human summary of guest seating preference. */
export function preferenceLabel(r: Reservation): string {
  const zone = r.preferredZone ? ZONE_LABELS[r.preferredZone] : null;
  const tbl = r.preferredTableId
    ? tableById(r.preferredTableId)?.label
    : null;
  if (tbl && zone) return `${zone} · ${tbl}`;
  if (tbl) return tbl;
  if (zone) return zone;
  return "Any";
}

/** Seat a booked reservation onto an open table. */
export function seatReservationAtTable(
  reservationId: string,
  tableId: string,
): boolean {
  const rsv = reservations().find((r) => r.id === reservationId);
  const tbl = tables().find((t) => t.id === tableId);
  if (!rsv || !tbl) return false;
  if (tbl.status === "seated") return false;
  if (rsv.partySize > tbl.seats + 1) return false; // slight overage OK

  tables.update((list) =>
    list.map((t) => {
      if (t.id === tableId) {
        return {
          ...t,
          status: "seated" as TableStatus,
          reservationId,
          guestLabel: rsv.guestName,
        };
      }
      // free previous table for this reservation
      if (t.reservationId === reservationId) {
        return {
          ...t,
          status: "open" as TableStatus,
          reservationId: null,
          guestLabel: "",
        };
      }
      return t;
    }),
  );
  reservations.update((list) =>
    list.map((r) =>
      r.id === reservationId
        ? { ...r, status: "seated", tableId }
        : r,
    ),
  );
  return true;
}

export function seatWalkIn(tableId: string, guestLabel: string) {
  tables.update((list) =>
    list.map((t) =>
      t.id === tableId
        ? {
            ...t,
            status: "seated" as TableStatus,
            reservationId: null,
            guestLabel: guestLabel.trim() || "Walk-in",
            serverId: null,
          }
        : t,
    ),
  );
}

export function setTableStatus(tableId: string, status: TableStatus) {
  tables.update((list) =>
    list.map((t) => {
      if (t.id !== tableId) return t;
      if (status === "open" || status === "dirty") {
        return {
          ...t,
          status,
          reservationId: null,
          guestLabel: "",
        };
      }
      return { ...t, status };
    }),
  );
}

export function clearTable(tableId: string) {
  setTableStatus(tableId, "dirty");
}

export function markTableOpen(tableId: string) {
  setTableStatus(tableId, "open");
}

export function reserveTable(tableId: string) {
  tables.update((list) =>
    list.map((t) =>
      t.id === tableId && t.status === "open"
        ? { ...t, status: "reserved" as TableStatus }
        : t,
    ),
  );
}

export function createOrder(input: {
  table: string;
  tableId?: string | null;
  lines: OrderLine[];
  notes: string;
}) {
  const tbl =
    (input.tableId && tableById(input.tableId)) ||
    tableByLabel(input.table.trim());
  const row: Order = {
    id: id("ord"),
    table: tbl?.label ?? (input.table.trim() || "Walk-in"),
    tableId: tbl?.id ?? input.tableId ?? null,
    lines: input.lines.filter((l) => l.qty > 0),
    status: "queued",
    notes: input.notes.trim(),
    createdAt: Date.now(),
  };
  if (row.lines.length === 0) {
    row.lines = [{ menuItemId: menu()[0]?.id ?? "", qty: 1 }];
  }
  orders.update((list) => [...list, row]);
  // If table was open/reserved, mark seated when food starts
  if (tbl && (tbl.status === "open" || tbl.status === "reserved")) {
    tables.update((list) =>
      list.map((t) =>
        t.id === tbl.id
          ? {
              ...t,
              status: "seated" as TableStatus,
              guestLabel: t.guestLabel || "Guests",
              serverId: null,
            }
          : t,
      ),
    );
  }
  return row.id;
}

export function setOrderStatus(orderId: string, status: OrderStatus) {
  orders.update((list) =>
    list.map((o) => (o.id === orderId ? { ...o, status } : o)),
  );
}

export function removeOrder(orderId: string) {
  orders.update((list) => list.filter((o) => o.id !== orderId));
}

export function saveProfile(next: RestaurantProfile) {
  profile.set(next);
}
