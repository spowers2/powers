import type {
  Exception,
  ExceptionSeverity,
  KpiSnapshot,
  Partner,
  Shipment,
  ShipmentStatus,
} from "./types.js";

const ORIGINS = [
  "ORD",
  "LAX",
  "JFK",
  "DFW",
  "SEA",
  "ATL",
  "DEN",
  "MIA",
  "SFO",
  "BOS",
  "PHX",
  "DTW",
];
const DESTS = [
  "AMS",
  "FRA",
  "LHR",
  "NRT",
  "SIN",
  "YYZ",
  "MEX",
  "GRU",
  "SYD",
  "ICN",
  "DXB",
  "CDG",
];
const CARRIERS = [
  "Aether Freight",
  "Nova Line",
  "Pulse Cargo",
  "Orbit Haul",
  "Vector Express",
  "Ion Rail",
];
const STATUSES: ShipmentStatus[] = [
  "draft",
  "booked",
  "in_transit",
  "at_risk",
  "delivered",
  "cancelled",
];
const EX_TYPES = [
  "dwell_breach",
  "temp_alert",
  "docs_hold",
  "customs",
  "missed_conn",
  "damage_flag",
];
const SEVERITIES: ExceptionSeverity[] = ["low", "med", "high", "critical"];

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

function isoDaysFromNow(rng: () => number, min: number, max: number): string {
  const d = new Date();
  d.setHours(8 + Math.floor(rng() * 10), Math.floor(rng() * 60), 0, 0);
  d.setDate(d.getDate() + min + Math.floor(rng() * (max - min + 1)));
  return d.toISOString();
}

export function buildSeed(count = 640): {
  shipments: Shipment[];
  exceptions: Exception[];
  partners: Partner[];
  kpis: KpiSnapshot;
} {
  const rng = mulberry32(206_206);
  const shipments: Shipment[] = [];
  for (let i = 0; i < count; i++) {
    const status = pick(rng, STATUSES);
    const origin = pick(rng, ORIGINS);
    const destination = pick(rng, DESTS);
    shipments.push({
      id: `SHP-${String(10000 + i)}`,
      reference: `LP-${String(240000 + i)}`,
      origin,
      destination,
      status,
      eta: isoDaysFromNow(rng, status === "delivered" ? -5 : 0, status === "delivered" ? -1 : 12),
      carrier: pick(rng, CARRIERS),
      priority: (1 + Math.floor(rng() * 3)) as 1 | 2 | 3,
      updatedAt: isoDaysFromNow(rng, -3, 0),
      weightKg: Math.round(200 + rng() * 18000),
    });
  }

  const exceptions: Exception[] = [];
  let ex = 0;
  for (const s of shipments) {
    if (s.status !== "at_risk" && rng() > 0.12) continue;
    const n = s.status === "at_risk" ? 1 + Math.floor(rng() * 2) : 1;
    for (let j = 0; j < n; j++) {
      exceptions.push({
        id: `EX-${String(5000 + ex++)}`,
        shipmentId: s.id,
        type: pick(rng, EX_TYPES),
        severity: pick(rng, SEVERITIES),
        openedAt: isoDaysFromNow(rng, -4, 0),
        note: `${s.origin}→${s.destination} · sensor / ops flag`,
        acked: rng() > 0.65,
      });
    }
  }

  const partners: Partner[] = CARRIERS.map((name, i) => ({
    id: `P-${i + 1}`,
    name,
    type: (i % 3 === 0 ? "broker" : i % 2 === 0 ? "consignee" : "carrier") as Partner["type"],
    score: Math.round(62 + rng() * 37),
    activeShipments: shipments.filter(
      (s) => s.carrier === name && (s.status === "in_transit" || s.status === "at_risk" || s.status === "booked"),
    ).length,
  }));

  const inTransit = shipments.filter(
    (s) => s.status === "in_transit" || s.status === "at_risk",
  ).length;
  const delivered = shipments.filter((s) => s.status === "delivered").length;
  const openEx = exceptions.filter((e) => !e.acked).length;
  const kpis: KpiSnapshot = {
    onTimePct: Math.round(
      100 * (delivered / Math.max(1, delivered + shipments.filter((s) => s.status === "at_risk").length)),
    ),
    inTransit,
    exceptionsOpen: openEx,
    avgDwellHours: Math.round(4 + rng() * 18),
  };

  return { shipments, exceptions, partners, kpis };
}
