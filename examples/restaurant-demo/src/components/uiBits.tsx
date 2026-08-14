import { Badge, Text } from "@power-ux/ui";
import type {
  MenuCategory,
  OrderStatus,
  ReservationStatus,
} from "../data/types.js";
import { CATEGORY_LABELS } from "../data/store.js";

export function PageHeader(props: {
  title: string | (() => string);
  subtitle?: string | (() => string);
  actions?: unknown;
}) {
  return (
    <div class="page-header">
      <div class="page-header__text">
        <Text as="h1" size="2xl">
          {typeof props.title === "function"
            ? () => (props.title as () => string)()
            : props.title}
        </Text>
        {props.subtitle ? (
          <Text muted size="sm">
            {typeof props.subtitle === "function"
              ? () => (props.subtitle as () => string)()
              : props.subtitle}
          </Text>
        ) : null}
      </div>
      {props.actions ? (
        <div class="page-header__actions">{props.actions as never}</div>
      ) : null}
    </div>
  );
}

export function CategoryBadge(props: { category: MenuCategory }) {
  return <Badge tone="neutral">{CATEGORY_LABELS[props.category]}</Badge>;
}

export function ReservationStatusBadge(props: { status: ReservationStatus }) {
  const map: Record<
    ReservationStatus,
    { tone: "success" | "warning" | "accent" | "neutral"; label: string }
  > = {
    booked: { tone: "accent", label: "Booked" },
    seated: { tone: "success", label: "Seated" },
    cancelled: { tone: "neutral", label: "Cancelled" },
    no_show: { tone: "warning", label: "No-show" },
  };
  const m = map[props.status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function OrderStatusBadge(props: { status: OrderStatus }) {
  const map: Record<
    OrderStatus,
    { tone: "success" | "warning" | "accent" | "neutral"; label: string }
  > = {
    queued: { tone: "neutral", label: "Queued" },
    prep: { tone: "accent", label: "In prep" },
    ready: { tone: "warning", label: "Ready" },
    served: { tone: "success", label: "Served" },
  };
  const m = map[props.status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}
