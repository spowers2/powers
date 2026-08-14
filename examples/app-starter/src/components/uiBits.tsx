import { Badge, Text } from "@power-ux/ui";
import type {
  ClientStatus,
  InvoiceStatus,
  ProjectStatus,
  TaskPriority,
  TaskStatus,
} from "../data/types.js";

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

export function ClientStatusBadge(props: { status: ClientStatus }) {
  const map: Record<ClientStatus, { tone: "success" | "warning" | "accent" | "neutral"; label: string }> =
    {
      active: { tone: "success", label: "Active" },
      paused: { tone: "warning", label: "Paused" },
      lead: { tone: "accent", label: "Lead" },
    };
  const m = map[props.status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function ProjectStatusBadge(props: { status: ProjectStatus }) {
  const map: Record<
    ProjectStatus,
    { tone: "success" | "warning" | "accent" | "neutral"; label: string }
  > = {
    proposal: { tone: "accent", label: "Proposal" },
    active: { tone: "success", label: "Active" },
    blocked: { tone: "warning", label: "Blocked" },
    done: { tone: "neutral", label: "Done" },
  };
  const m = map[props.status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function TaskStatusBadge(props: { status: TaskStatus }) {
  const map: Record<
    TaskStatus,
    { tone: "success" | "warning" | "accent" | "neutral"; label: string }
  > = {
    todo: { tone: "neutral", label: "To do" },
    doing: { tone: "accent", label: "Doing" },
    done: { tone: "success", label: "Done" },
  };
  const m = map[props.status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function PriorityBadge(props: { priority: TaskPriority }) {
  const map: Record<
    TaskPriority,
    { tone: "success" | "warning" | "accent" | "neutral"; label: string }
  > = {
    low: { tone: "neutral", label: "Low" },
    med: { tone: "accent", label: "Med" },
    high: { tone: "warning", label: "High" },
  };
  const m = map[props.priority];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function InvoiceStatusBadge(props: { status: InvoiceStatus }) {
  const map: Record<
    InvoiceStatus,
    { tone: "success" | "warning" | "accent" | "neutral"; label: string }
  > = {
    draft: { tone: "neutral", label: "Draft" },
    sent: { tone: "accent", label: "Sent" },
    paid: { tone: "success", label: "Paid" },
    overdue: { tone: "warning", label: "Overdue" },
  };
  const m = map[props.status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}
