/** Hearth — neighborhood restaurant demo (local-first). */

export type MenuCategory =
  | "starters"
  | "mains"
  | "sides"
  | "desserts"
  | "drinks";

export type ReservationStatus = "booked" | "seated" | "cancelled" | "no_show";
export type OrderStatus = "queued" | "prep" | "ready" | "served";
export type TableZone = "main" | "window" | "bar" | "patio";
/** Explicit floor status (open = free for walk-ins). */
export type TableStatus = "open" | "reserved" | "seated" | "dirty";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl: string;
  available: boolean;
  popular: boolean;
};

export type Reservation = {
  id: string;
  guestName: string;
  partySize: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: ReservationStatus;
  notes: string;
  /** Assigned table when seated (or pre-assigned). */
  tableId: string | null;
  /**
   * Guest seating preference (optional). Staff may honor via seat-any or map.
   * `null` / omitted = no preference.
   */
  preferredZone: TableZone | null;
  /** Specific table the guest asked for (optional; usually null if only zone). */
  preferredTableId: string | null;
  createdAt: number;
};

export type OrderLine = {
  menuItemId: string;
  qty: number;
};

export type Order = {
  id: string;
  /** Human label or table id — prefer matching FloorTable.label */
  table: string;
  tableId: string | null;
  lines: OrderLine[];
  status: OrderStatus;
  notes: string;
  createdAt: number;
};

/** Floor staff member who covers sections / tables. */
export type Server = {
  id: string;
  name: string;
  /** 1–2 letter badge on the map */
  initials: string;
  /** On the floor tonight */
  active: boolean;
};

export type FloorTable = {
  id: string;
  label: string;
  seats: number;
  zone: TableZone;
  /** Percent coords on the floor canvas (0–100) */
  x: number;
  y: number;
  status: TableStatus;
  reservationId: string | null;
  /** Walk-in guest name when seated without reservation */
  guestLabel: string;
  /**
   * Server override for this table. `null` = inherit section (zone) assignment.
   */
  serverId: string | null;
};

/** Default server covering a zone (section). */
export type ZoneServerMap = Record<TableZone, string | null>;

export type RestaurantProfile = {
  name: string;
  tagline: string;
  address: string;
  hours: string;
  phone: string;
};

export type Workspace = {
  version: 3;
  profile: RestaurantProfile;
  menu: MenuItem[];
  reservations: Reservation[];
  orders: Order[];
  tables: FloorTable[];
  servers: Server[];
  zoneServers: ZoneServerMap;
};
