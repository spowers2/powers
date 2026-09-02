import { createApiClient, createQuery, signal } from "@lab206/core";
import { buildSeed } from "./seed.js";
import type { Exception, KpiSnapshot, Partner, Shipment, ShipmentStatus } from "./types.js";

const seed = buildSeed(640);
const db = {
  shipments: seed.shipments.map((s) => ({ ...s })),
  exceptions: seed.exceptions.map((e) => ({ ...e })),
  partners: seed.partners.map((p) => ({ ...p })),
  kpis: { ...seed.kpis },
};

function delay(ms = 280 + Math.random() * 420) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fakeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  await delay();
  const url = new URL(String(input), "https://logistics.power.local");
  const path = url.pathname;
  const method = (init?.method ?? "GET").toUpperCase();

  if (path === "/api/kpis" && method === "GET") {
    return json(db.kpis);
  }
  if (path === "/api/shipments" && method === "GET") {
    const status = url.searchParams.get("status") as ShipmentStatus | null;
    const q = (url.searchParams.get("q") ?? "").toLowerCase();
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
    const pageSize = Math.min(50, Math.max(10, Number(url.searchParams.get("pageSize") ?? "25")));
    let rows = db.shipments;
    if (status) rows = rows.filter((s) => s.status === status);
    if (q) {
      rows = rows.filter(
        (s) =>
          s.reference.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.carrier.toLowerCase().includes(q) ||
          `${s.origin}${s.destination}`.toLowerCase().includes(q),
      );
    }
    const total = rows.length;
    const start = (page - 1) * pageSize;
    const items = rows.slice(start, start + pageSize);
    return json({ items, total, page, pageSize });
  }
  if (path.startsWith("/api/shipments/") && method === "GET") {
    const id = path.slice("/api/shipments/".length);
    const row = db.shipments.find((s) => s.id === id);
    if (!row) return json({ error: "not_found" }, 404);
    const ex = db.exceptions.filter((e) => e.shipmentId === id);
    return json({ shipment: row, exceptions: ex });
  }
  if (path.startsWith("/api/shipments/") && method === "PATCH") {
    const id = path.slice("/api/shipments/".length);
    const row = db.shipments.find((s) => s.id === id);
    if (!row) return json({ error: "not_found" }, 404);
    const body = JSON.parse(String(init?.body ?? "{}")) as Partial<Shipment>;
    Object.assign(row, body, { updatedAt: new Date().toISOString() });
    return json(row);
  }
  if (path === "/api/exceptions" && method === "GET") {
    const open = url.searchParams.get("open");
    let rows = db.exceptions;
    if (open === "1") rows = rows.filter((e) => !e.acked);
    return json(rows);
  }
  if (path.startsWith("/api/exceptions/") && path.endsWith("/ack") && method === "POST") {
    const id = path.replace("/api/exceptions/", "").replace("/ack", "");
    const row = db.exceptions.find((e) => e.id === id);
    if (!row) return json({ error: "not_found" }, 404);
    row.acked = true;
    db.kpis.exceptionsOpen = db.exceptions.filter((e) => !e.acked).length;
    return json(row);
  }
  if (path === "/api/partners" && method === "GET") {
    return json(db.partners);
  }
  return json({ error: "not_found" }, 404);
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const api = createApiClient({
  baseUrl: "/api",
  fetch: fakeFetch as typeof fetch,
});

export type ShipmentPage = {
  items: Shipment[];
  total: number;
  page: number;
  pageSize: number;
};

export type ShipmentDetail = {
  shipment: Shipment;
  exceptions: Exception[];
};

export const filterStatus = signal<ShipmentStatus | "">("");
export const filterQ = signal("");
export const page = signal(1);

export const kpisQuery = createQuery({
  queryKey: () => "kpis",
  queryFn: () => api.get<KpiSnapshot>("/kpis"),
  name: "kpis",
});

export const shipmentsQuery = createQuery({
  queryKey: () =>
    `shipments:${filterStatus()}:${filterQ()}:${page()}`,
  queryFn: () => {
    const params = new URLSearchParams();
    params.set("page", String(page()));
    params.set("pageSize", "25");
    if (filterStatus()) params.set("status", filterStatus());
    if (filterQ().trim()) params.set("q", filterQ().trim());
    return api.get<ShipmentPage>(`/shipments?${params}`);
  },
  name: "shipments",
});

export const exceptionsQuery = createQuery({
  queryKey: () => "exceptions:open",
  queryFn: () => api.get<Exception[]>("/exceptions?open=1"),
  name: "exceptions",
});

export const partnersQuery = createQuery({
  queryKey: () => "partners",
  queryFn: () => api.get<Partner[]>("/partners"),
  name: "partners",
});

export function shipmentDetailQuery(id: () => string | undefined) {
  return createQuery({
    queryKey: () => id() ?? false,
    queryFn: (key) => api.get<ShipmentDetail>(`/shipments/${key}`),
    name: "shipment-detail",
  });
}
