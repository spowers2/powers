export type ShipmentStatus =
  | "draft"
  | "booked"
  | "in_transit"
  | "at_risk"
  | "delivered"
  | "cancelled";

export type ExceptionSeverity = "low" | "med" | "high" | "critical";

export type PartnerType = "carrier" | "consignee" | "broker";

export type Shipment = {
  id: string;
  reference: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  eta: string;
  carrier: string;
  priority: 1 | 2 | 3;
  updatedAt: string;
  weightKg: number;
};

export type Exception = {
  id: string;
  shipmentId: string;
  type: string;
  severity: ExceptionSeverity;
  openedAt: string;
  note: string;
  acked: boolean;
};

export type Partner = {
  id: string;
  name: string;
  type: PartnerType;
  score: number;
  activeShipments: number;
};

export type KpiSnapshot = {
  onTimePct: number;
  inTransit: number;
  exceptionsOpen: number;
  avgDwellHours: number;
};
