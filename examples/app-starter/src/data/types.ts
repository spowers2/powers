/** designlab206 — freelance / small-practice workspace (local-first demo product). */

export type ClientStatus = "active" | "paused" | "lead";
export type ProjectStatus = "proposal" | "active" | "blocked" | "done";
export type TaskPriority = "low" | "med" | "high";
export type TaskStatus = "todo" | "doing" | "done";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export type Client = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: ClientStatus;
  notes: string;
  createdAt: number;
};

export type Project = {
  id: string;
  clientId: string;
  name: string;
  status: ProjectStatus;
  /** Retainer / fixed fee in USD (whole dollars for simplicity) */
  value: number;
  dueDate: string; // YYYY-MM-DD
  summary: string;
  updatedAt: number;
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  updatedAt: number;
};

export type InvoiceLine = {
  id: string;
  description: string;
  amount: number;
};

export type Invoice = {
  id: string;
  number: string;
  clientId: string;
  projectId: string | null;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  lines: InvoiceLine[];
  notes: string;
  updatedAt: number;
};

/** Logged work against a project (hours → optional invoice line). */
export type TimeEntry = {
  id: string;
  projectId: string;
  date: string; // YYYY-MM-DD
  /** Decimal hours, e.g. 1.5 */
  hours: number;
  note: string;
  billable: boolean;
  /** When set, entry was rolled into an invoice */
  invoicedAt: number | null;
  createdAt: number;
};

export type Profile = {
  name: string;
  email: string;
  company: string;
  notify: boolean;
  /** Default billable rate (USD / hour) for unbilled time */
  hourlyRate: number;
};

/** Status note staff publish for the client portal. */
export type ProjectUpdate = {
  id: string;
  projectId: string;
  body: string;
  createdAt: number;
  /** When false, staff-only (not shown in portal). */
  clientVisible: boolean;
};

export type Workspace = {
  version: 4;
  profile: Profile;
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  invoices: Invoice[];
  timeEntries: TimeEntry[];
  projectUpdates: ProjectUpdate[];
};
