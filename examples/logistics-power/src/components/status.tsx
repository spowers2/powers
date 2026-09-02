import type { ExceptionSeverity, ShipmentStatus } from "../data/types.js";

export function statusChipClass(status: ShipmentStatus): string {
  switch (status) {
    case "delivered":
      return "chip chip--ok";
    case "at_risk":
      return "chip chip--hot";
    case "in_transit":
      return "chip";
    case "cancelled":
      return "chip chip--dim";
    case "booked":
      return "chip chip--warn";
    default:
      return "chip chip--dim";
  }
}

export function severityChipClass(sev: ExceptionSeverity): string {
  switch (sev) {
    case "critical":
    case "high":
      return "chip chip--hot";
    case "med":
      return "chip chip--warn";
    default:
      return "chip";
  }
}

export function formatLane(origin: string, destination: string) {
  return (
    <span class="lane">
      {origin}
      <span>→</span>
      {destination}
    </span>
  );
}

export function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
