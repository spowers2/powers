import { signal, computed, effect } from "@lab206/core";
import type {
  Client,
  Project,
  Task,
  Profile,
  Workspace,
  ClientStatus,
  ProjectStatus,
  TaskStatus,
  TaskPriority,
  Invoice,
  InvoiceStatus,
  InvoiceLine,
  TimeEntry,
  ProjectUpdate,
} from "./types.js";

const KEY = "designlab206-workspace-v4";
const KEY_V3 = "designlab206-workspace-v3";

function id(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function seed(): Workspace {
  const c1 = id("cli");
  const c2 = id("cli");
  const c3 = id("cli");
  const p1 = id("prj");
  const p2 = id("prj");
  const p3 = id("prj");
  const now = Date.now();

  return {
    version: 4,
    profile: {
      name: "Sam Rivera",
      email: "sam@designlab206.com",
      company: "designlab206 Studio",
      notify: true,
      hourlyRate: 150,
    },
    clients: [
      {
        id: c1,
        name: "Avery Chen",
        company: "Northline Health",
        email: "avery@northline.health",
        status: "active",
        notes: "Prefers async updates Fridays. HIPAA-aware deliverables.",
        createdAt: now - 40 * 864e5,
      },
      {
        id: c2,
        name: "Jordan Blake",
        company: "Field & Co.",
        email: "jordan@field.co",
        status: "active",
        notes: "Brand refresh + storefront. Decision maker is Jordan.",
        createdAt: now - 20 * 864e5,
      },
      {
        id: c3,
        name: "Riley Okonkwo",
        company: "Orbit Payments",
        email: "riley@orbitpay.io",
        status: "lead",
        notes: "Discovery call booked. Budget ~$18k for MVP dashboard.",
        createdAt: now - 3 * 864e5,
      },
    ],
    projects: [
      {
        id: p1,
        clientId: c1,
        name: "Patient portal redesign",
        status: "active",
        value: 24000,
        dueDate: daysFromNow(18),
        summary: "Auth, records list, messaging. Ship phase 1 without billing.",
        updatedAt: now - 2 * 3600e3,
      },
      {
        id: p2,
        clientId: c2,
        name: "E‑commerce relaunch",
        status: "blocked",
        value: 16000,
        dueDate: daysFromNow(9),
        summary: "Blocked on product photography and final SKUs.",
        updatedAt: now - 26 * 3600e3,
      },
      {
        id: p3,
        clientId: c3,
        name: "Ops dashboard proposal",
        status: "proposal",
        value: 18000,
        dueDate: daysFromNow(5),
        summary: "Scope + wireframes for investor demo.",
        updatedAt: now - 5 * 3600e3,
      },
    ],
    tasks: [
      {
        id: id("tsk"),
        projectId: p1,
        title: "Wire empty states for records list",
        status: "doing",
        priority: "high",
        dueDate: daysFromNow(2),
        updatedAt: now - 1 * 3600e3,
      },
      {
        id: id("tsk"),
        projectId: p1,
        title: "Accessibility pass on auth screens",
        status: "todo",
        priority: "med",
        dueDate: daysFromNow(6),
        updatedAt: now - 4 * 3600e3,
      },
      {
        id: id("tsk"),
        projectId: p2,
        title: "Chase client for product photos",
        status: "todo",
        priority: "high",
        dueDate: daysFromNow(1),
        updatedAt: now - 8 * 3600e3,
      },
      {
        id: id("tsk"),
        projectId: p2,
        title: "Checkout flow QA on mobile",
        status: "todo",
        priority: "med",
        dueDate: daysFromNow(12),
        updatedAt: now - 10 * 3600e3,
      },
      {
        id: id("tsk"),
        projectId: p3,
        title: "Draft proposal PDF",
        status: "doing",
        priority: "high",
        dueDate: daysFromNow(3),
        updatedAt: now - 2 * 3600e3,
      },
      {
        id: id("tsk"),
        projectId: p3,
        title: "Competitive notes for Orbit",
        status: "done",
        priority: "low",
        dueDate: daysFromNow(-2),
        updatedAt: now - 30 * 3600e3,
      },
    ],
    invoices: [
      {
        id: id("inv"),
        number: "INV-1042",
        clientId: c1,
        projectId: p1,
        status: "sent",
        issueDate: daysFromNow(-14),
        dueDate: daysFromNow(0),
        lines: [
          {
            id: id("ln"),
            description: "Phase 1 design & build (50%)",
            amount: 12000,
          },
        ],
        notes: "Net 14. Wire details in footer of PDF (demo).",
        updatedAt: now - 12 * 3600e3,
      },
      {
        id: id("inv"),
        number: "INV-1038",
        clientId: c2,
        projectId: p2,
        status: "paid",
        issueDate: daysFromNow(-45),
        dueDate: daysFromNow(-30),
        lines: [
          {
            id: id("ln"),
            description: "Discovery + IA workshop",
            amount: 4000,
          },
          {
            id: id("ln"),
            description: "Storefront prototype",
            amount: 6000,
          },
        ],
        notes: "Paid via ACH.",
        updatedAt: now - 28 * 864e5,
      },
      {
        id: id("inv"),
        number: "INV-1045",
        clientId: c1,
        projectId: p1,
        status: "draft",
        issueDate: daysFromNow(0),
        dueDate: daysFromNow(14),
        lines: [
          {
            id: id("ln"),
            description: "Phase 1 remainder (50%)",
            amount: 12000,
          },
        ],
        notes: "Hold until messaging QA sign-off.",
        updatedAt: now - 2 * 3600e3,
      },
    ],
    timeEntries: [
      {
        id: id("te"),
        projectId: p1,
        date: daysFromNow(-1),
        hours: 3.5,
        note: "Records list empty states + filter chips",
        billable: true,
        invoicedAt: null,
        createdAt: now - 20 * 3600e3,
      },
      {
        id: id("te"),
        projectId: p1,
        date: daysFromNow(-2),
        hours: 2,
        note: "Auth accessibility pass (partial)",
        billable: true,
        invoicedAt: null,
        createdAt: now - 40 * 3600e3,
      },
      {
        id: id("te"),
        projectId: p2,
        date: daysFromNow(-3),
        hours: 1.25,
        note: "Client photo chase + SKU checklist",
        billable: true,
        invoicedAt: null,
        createdAt: now - 60 * 3600e3,
      },
      {
        id: id("te"),
        projectId: p3,
        date: daysFromNow(-1),
        hours: 4,
        note: "Proposal deck structure",
        billable: false,
        invoicedAt: null,
        createdAt: now - 18 * 3600e3,
      },
      {
        id: id("te"),
        projectId: p2,
        date: daysFromNow(-20),
        hours: 6,
        note: "Discovery workshop (invoiced)",
        billable: true,
        invoicedAt: now - 28 * 864e5,
        createdAt: now - 22 * 864e5,
      },
    ],
    projectUpdates: [
      {
        id: id("upd"),
        projectId: p1,
        body: "Phase 1 auth screens are in review. Expect a walkthrough mid-week.",
        createdAt: now - 20 * 3600e3,
        clientVisible: true,
      },
      {
        id: id("upd"),
        projectId: p1,
        body: "Records list empty states shipped to staging.",
        createdAt: now - 5 * 3600e3,
        clientVisible: true,
      },
      {
        id: id("upd"),
        projectId: p2,
        body: "Still blocked on product photography — once we have SKUs we resume checkout QA.",
        createdAt: now - 26 * 3600e3,
        clientVisible: true,
      },
      {
        id: id("upd"),
        projectId: p3,
        body: "Internal: proposal draft wording — not for client yet.",
        createdAt: now - 4 * 3600e3,
        clientVisible: false,
      },
    ],
  };
}

function withRate(p: Profile | (Omit<Profile, "hourlyRate"> & { hourlyRate?: number })): Profile {
  return rebrandProfile({
    ...p,
    hourlyRate:
      typeof p.hourlyRate === "number" && p.hourlyRate > 0 ? p.hourlyRate : 150,
  });
}

/** Rewrite legacy Meridian branding in saved profiles (localStorage). */
function rebrandProfile(p: Profile): Profile {
  let company = p.company ?? "";
  let email = p.email ?? "";

  // Exact legacy defaults
  if (/^meridian(\s+studio)?$/i.test(company.trim())) {
    company = "designlab206 Studio";
  } else {
    company = company
      .replace(/Meridian Studio/gi, "designlab206 Studio")
      .replace(/Meridian/gi, "designlab206")
      .replace(/meridian studio/gi, "designlab206 Studio")
      .replace(/meridian/gi, "designlab206");
  }

  email = email
    .replace(/@meridian\.studio/gi, "@designlab206.com")
    .replace(/meridian\.studio/gi, "designlab206.com");

  if (!company.trim()) company = "designlab206 Studio";

  return { ...p, company, email };
}

function migrate(raw: unknown): Workspace | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as {
    version?: number;
    profile?: Profile;
    clients?: Client[];
    projects?: Project[];
    tasks?: Task[];
    invoices?: Invoice[];
    timeEntries?: TimeEntry[];
    projectUpdates?: ProjectUpdate[];
  };
  const updates = data.projectUpdates ?? [];
  if (
    data.version === 4 &&
    Array.isArray(data.timeEntries) &&
    data.profile &&
    data.clients
  ) {
    return {
      version: 4,
      profile: withRate(data.profile),
      clients: data.clients,
      projects: data.projects ?? [],
      tasks: data.tasks ?? [],
      invoices: data.invoices ?? [],
      timeEntries: data.timeEntries,
      projectUpdates: updates,
    };
  }
  if (
    data.version === 3 &&
    Array.isArray(data.timeEntries) &&
    data.profile &&
    data.clients
  ) {
    return {
      version: 4,
      profile: withRate(data.profile),
      clients: data.clients,
      projects: data.projects ?? [],
      tasks: data.tasks ?? [],
      invoices: data.invoices ?? [],
      timeEntries: data.timeEntries,
      projectUpdates: updates,
    };
  }
  if (data.version === 2 && data.profile && data.clients) {
    return {
      version: 4,
      profile: withRate(data.profile),
      clients: data.clients,
      projects: data.projects ?? [],
      tasks: data.tasks ?? [],
      invoices: data.invoices ?? [],
      timeEntries: [],
      projectUpdates: [],
    };
  }
  if (data.version === 1 && data.profile && data.clients) {
    return {
      version: 4,
      profile: withRate(data.profile),
      clients: data.clients,
      projects: data.projects ?? [],
      tasks: data.tasks ?? [],
      invoices: [],
      timeEntries: [],
      projectUpdates: [],
    };
  }
  return null;
}

function load(): Workspace {
  try {
    let raw = localStorage.getItem(KEY);
    if (!raw) raw = localStorage.getItem(KEY_V3);
    if (!raw) raw = localStorage.getItem("designlab206-workspace-v2");
    if (!raw) raw = localStorage.getItem("designlab206-workspace-v1");
    // legacy Meridian keys
    if (!raw) raw = localStorage.getItem("meridian-workspace-v4");
    if (!raw) raw = localStorage.getItem("meridian-workspace-v3");
    if (!raw) raw = localStorage.getItem("meridian-workspace-v2");
    if (!raw) raw = localStorage.getItem("meridian-workspace-v1");
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
    /* private mode / quota */
  }
}

const initial = load();

/** Single source of truth for the product. */
export const profile = signal<Profile>(initial.profile);
export const clients = signal<Client[]>(initial.clients);
export const projects = signal<Project[]>(initial.projects);
export const tasks = signal<Task[]>(initial.tasks);
export const invoices = signal<Invoice[]>(initial.invoices);
export const timeEntries = signal<TimeEntry[]>(initial.timeEntries);
export const projectUpdates = signal<ProjectUpdate[]>(initial.projectUpdates);

effect(() => {
  save({
    version: 4,
    profile: profile(),
    clients: clients(),
    projects: projects(),
    tasks: tasks(),
    invoices: invoices(),
    timeEntries: timeEntries(),
    projectUpdates: projectUpdates(),
  });
});

export function resetWorkspace() {
  const s = seed();
  profile.set(s.profile);
  clients.set(s.clients);
  projects.set(s.projects);
  tasks.set(s.tasks);
  invoices.set(s.invoices);
  timeEntries.set(s.timeEntries);
  projectUpdates.set(s.projectUpdates);
}

// —— Derived ——
export const activeProjects = computed(() =>
  projects().filter((p) => p.status === "active" || p.status === "blocked"),
);

export const openTaskCount = computed(
  () => tasks().filter((t) => t.status !== "done").length,
);

export const pipelineValue = computed(() =>
  projects()
    .filter((p) => p.status !== "done")
    .reduce((sum, p) => sum + p.value, 0),
);

export const dueSoonTasks = computed(() => {
  const limit = daysFromNow(7);
  return tasks()
    .filter((t) => t.status !== "done" && t.dueDate <= limit)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
});

export function clientById(id: string): Client | undefined {
  return clients().find((c) => c.id === id);
}

export function projectById(id: string): Project | undefined {
  return projects().find((p) => p.id === id);
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDate(iso: string): string {
  try {
    const [y, m, d] = iso.split("-").map(Number);
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
    }).format(new Date(y!, m! - 1, d));
  } catch {
    return iso;
  }
}

export function isOverdue(iso: string): boolean {
  return iso < new Date().toISOString().slice(0, 10);
}

// —— Mutations ——
export function upsertClient(input: {
  id?: string;
  name: string;
  company: string;
  email: string;
  status: ClientStatus;
  notes: string;
}) {
  const now = Date.now();
  if (input.id) {
    clients.update((list) =>
      list.map((c) =>
        c.id === input.id
          ? {
              ...c,
              name: input.name,
              company: input.company,
              email: input.email,
              status: input.status,
              notes: input.notes,
            }
          : c,
      ),
    );
    return input.id;
  }
  const row: Client = {
    id: id("cli"),
    name: input.name,
    company: input.company,
    email: input.email,
    status: input.status,
    notes: input.notes,
    createdAt: now,
  };
  clients.update((list) => [...list, row]);
  return row.id;
}

export function removeClient(clientId: string) {
  const projectIds = new Set(
    projects().filter((p) => p.clientId === clientId).map((p) => p.id),
  );
  clients.update((list) => list.filter((c) => c.id !== clientId));
  projects.update((list) => list.filter((p) => p.clientId !== clientId));
  tasks.update((list) => list.filter((t) => !projectIds.has(t.projectId)));
  invoices.update((list) => list.filter((i) => i.clientId !== clientId));
  timeEntries.update((list) =>
    list.filter((t) => !projectIds.has(t.projectId)),
  );
}

export function upsertProject(input: {
  id?: string;
  clientId: string;
  name: string;
  status: ProjectStatus;
  value: number;
  dueDate: string;
  summary: string;
}) {
  const now = Date.now();
  if (input.id) {
    projects.update((list) =>
      list.map((p) =>
        p.id === input.id
          ? {
              ...p,
              clientId: input.clientId,
              name: input.name,
              status: input.status,
              value: input.value,
              dueDate: input.dueDate,
              summary: input.summary,
              updatedAt: now,
            }
          : p,
      ),
    );
    return input.id;
  }
  const row: Project = {
    id: id("prj"),
    clientId: input.clientId,
    name: input.name,
    status: input.status,
    value: input.value,
    dueDate: input.dueDate,
    summary: input.summary,
    updatedAt: now,
  };
  projects.update((list) => [...list, row]);
  return row.id;
}

export function removeProject(projectId: string) {
  projects.update((list) => list.filter((p) => p.id !== projectId));
  tasks.update((list) => list.filter((t) => t.projectId !== projectId));
  timeEntries.update((list) => list.filter((t) => t.projectId !== projectId));
  invoices.update((list) =>
    list.map((i) =>
      i.projectId === projectId ? { ...i, projectId: null } : i,
    ),
  );
}

export function upsertTask(input: {
  id?: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}) {
  const now = Date.now();
  if (input.id) {
    tasks.update((list) =>
      list.map((t) =>
        t.id === input.id
          ? {
              ...t,
              projectId: input.projectId,
              title: input.title,
              status: input.status,
              priority: input.priority,
              dueDate: input.dueDate,
              updatedAt: now,
            }
          : t,
      ),
    );
    return input.id;
  }
  const row: Task = {
    id: id("tsk"),
    projectId: input.projectId,
    title: input.title,
    status: input.status,
    priority: input.priority,
    dueDate: input.dueDate,
    updatedAt: now,
  };
  tasks.update((list) => [...list, row]);
  return row.id;
}

export function setTaskStatus(taskId: string, status: TaskStatus) {
  tasks.update((list) =>
    list.map((t) =>
      t.id === taskId ? { ...t, status, updatedAt: Date.now() } : t,
    ),
  );
}

export function removeTask(taskId: string) {
  tasks.update((list) => list.filter((t) => t.id !== taskId));
}

export function saveProfile(next: Profile) {
  profile.set(next);
}

export function invoiceTotal(inv: Invoice): number {
  return inv.lines.reduce((s, l) => s + (Number(l.amount) || 0), 0);
}

export function effectiveInvoiceStatus(inv: Invoice): InvoiceStatus {
  if (inv.status === "paid" || inv.status === "draft") return inv.status;
  if (inv.status === "sent" && isOverdue(inv.dueDate)) return "overdue";
  return inv.status;
}

export const outstandingInvoices = computed(() =>
  invoices().filter((i) => {
    const s = effectiveInvoiceStatus(i);
    return s === "sent" || s === "overdue";
  }),
);

export const outstandingTotal = computed(() =>
  outstandingInvoices().reduce((s, i) => s + invoiceTotal(i), 0),
);

export const paidYtd = computed(() => {
  const year = new Date().getFullYear();
  return invoices()
    .filter((i) => i.status === "paid" && i.issueDate.startsWith(String(year)))
    .reduce((s, i) => s + invoiceTotal(i), 0);
});

function nextInvoiceNumber(): string {
  const nums = invoices()
    .map((i) => Number(i.number.replace(/\D/g, "")))
    .filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 1040;
  return `INV-${max + 1}`;
}

export function upsertInvoice(input: {
  id?: string;
  number?: string;
  clientId: string;
  projectId: string | null;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  lines: InvoiceLine[];
  notes: string;
}) {
  const now = Date.now();
  const lines = input.lines
    .filter((l) => l.description.trim() || l.amount)
    .map((l) => ({
      id: l.id || id("ln"),
      description: l.description.trim() || "Line item",
      amount: Math.max(0, Math.round(Number(l.amount) || 0)),
    }));
  if (input.id) {
    invoices.update((list) =>
      list.map((i) =>
        i.id === input.id
          ? {
              ...i,
              clientId: input.clientId,
              projectId: input.projectId,
              status: input.status,
              issueDate: input.issueDate,
              dueDate: input.dueDate,
              lines: lines.length
                ? lines
                : [{ id: id("ln"), description: "Services", amount: 0 }],
              notes: input.notes,
              updatedAt: now,
            }
          : i,
      ),
    );
    return input.id;
  }
  const row: Invoice = {
    id: id("inv"),
    number: input.number?.trim() || nextInvoiceNumber(),
    clientId: input.clientId,
    projectId: input.projectId,
    status: input.status,
    issueDate: input.issueDate,
    dueDate: input.dueDate,
    lines: lines.length
      ? lines
      : [{ id: id("ln"), description: "Services", amount: 0 }],
    notes: input.notes,
    updatedAt: now,
  };
  invoices.update((list) => [...list, row]);
  return row.id;
}

export function setInvoiceStatus(invoiceId: string, status: InvoiceStatus) {
  invoices.update((list) =>
    list.map((i) =>
      i.id === invoiceId ? { ...i, status, updatedAt: Date.now() } : i,
    ),
  );
}

export function removeInvoice(invoiceId: string) {
  invoices.update((list) => list.filter((i) => i.id !== invoiceId));
}

// —— Time entries ——
export function formatHours(h: number): string {
  const n = Math.round(h * 100) / 100;
  return n % 1 === 0 ? `${n}h` : `${n.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}h`;
}

export const hoursThisWeek = computed(() => {
  const start = new Date();
  const day = start.getDay(); // 0 Sun
  const diff = day === 0 ? 6 : day - 1; // week starts Monday
  start.setDate(start.getDate() - diff);
  const from = start.toISOString().slice(0, 10);
  return timeEntries()
    .filter((t) => t.date >= from)
    .reduce((s, t) => s + t.hours, 0);
});

export const unbilledEntries = computed(() =>
  timeEntries().filter((t) => t.billable && !t.invoicedAt),
);

export const unbilledHours = computed(() =>
  unbilledEntries().reduce((s, t) => s + t.hours, 0),
);

export const unbilledValue = computed(() => {
  const rate = profile().hourlyRate || 150;
  return Math.round(unbilledHours() * rate);
});

export function upsertTimeEntry(input: {
  id?: string;
  projectId: string;
  date: string;
  hours: number;
  note: string;
  billable: boolean;
}) {
  const hours = Math.max(0.25, Math.round((Number(input.hours) || 0) * 4) / 4);
  if (input.id) {
    timeEntries.update((list) =>
      list.map((t) =>
        t.id === input.id
          ? {
              ...t,
              projectId: input.projectId,
              date: input.date,
              hours,
              note: input.note.trim(),
              billable: input.billable,
            }
          : t,
      ),
    );
    return input.id;
  }
  const row: TimeEntry = {
    id: id("te"),
    projectId: input.projectId,
    date: input.date,
    hours,
    note: input.note.trim(),
    billable: input.billable,
    invoicedAt: null,
    createdAt: Date.now(),
  };
  timeEntries.update((list) => [...list, row]);
  return row.id;
}

export function removeTimeEntry(entryId: string) {
  timeEntries.update((list) => list.filter((t) => t.id !== entryId));
}

/** Create a draft invoice from unbilled entries (optionally one project). */
export function invoiceUnbilledTime(opts?: { projectId?: string }): string | null {
  const rate = profile().hourlyRate || 150;
  const entries = unbilledEntries().filter((t) =>
    opts?.projectId ? t.projectId === opts.projectId : true,
  );
  if (entries.length === 0) return null;

  // Group by project → client
  const byProject = new Map<string, TimeEntry[]>();
  for (const e of entries) {
    const arr = byProject.get(e.projectId) ?? [];
    arr.push(e);
    byProject.set(e.projectId, arr);
  }

  // One invoice per project (demo-friendly)
  let lastId: string | null = null;
  const now = Date.now();
  for (const [projectId, list] of byProject) {
    const prj = projectById(projectId);
    if (!prj) continue;
    const hours = list.reduce((s, t) => s + t.hours, 0);
    const amount = Math.round(hours * rate);
    const noteLines = list
      .map((t) => `${t.date}: ${formatHours(t.hours)} — ${t.note || "Work"}`)
      .join("\n");
    lastId = upsertInvoice({
      clientId: prj.clientId,
      projectId,
      status: "draft",
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: daysFromNow(14),
      lines: [
        {
          id: id("ln"),
          description: `${prj.name} · ${formatHours(hours)} @ $${rate}/hr`,
          amount,
        },
      ],
      notes: `From time log:\n${noteLines}`,
    });
    const ids = new Set(list.map((t) => t.id));
    timeEntries.update((all) =>
      all.map((t) => (ids.has(t.id) ? { ...t, invoicedAt: now } : t)),
    );
  }
  return lastId;
}



export function addProjectUpdate(input: {
  projectId: string;
  body: string;
  clientVisible?: boolean;
}) {
  const body = input.body.trim();
  if (!body) return null;
  const row: ProjectUpdate = {
    id: id("upd"),
    projectId: input.projectId,
    body,
    createdAt: Date.now(),
    clientVisible: input.clientVisible !== false,
  };
  projectUpdates.update((list) => [row, ...list]);
  // bump project updatedAt
  projects.update((list) =>
    list.map((p) =>
      p.id === input.projectId ? { ...p, updatedAt: Date.now() } : p,
    ),
  );
  return row.id;
}

export function removeProjectUpdate(updateId: string) {
  projectUpdates.update((list) => list.filter((u) => u.id !== updateId));
}

export function updatesForProject(
  projectId: string,
  opts?: { clientOnly?: boolean },
): ProjectUpdate[] {
  return projectUpdates()
    .filter((u) => u.projectId === projectId)
    .filter((u) => (opts?.clientOnly ? u.clientVisible : true))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function projectsForClient(clientId: string): Project[] {
  return projects()
    .filter((p) => p.clientId === clientId)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function tasksForProject(projectId: string): Task[] {
  return tasks().filter((t) => t.projectId === projectId);
}

export function projectProgress(projectId: string): {
  total: number;
  done: number;
  pct: number;
} {
  const list = tasksForProject(projectId);
  const total = list.length;
  const done = list.filter((t) => t.status === "done").length;
  return {
    total,
    done,
    pct: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

const PORTAL_KEY = "designlab206-portal-client";
const PORTAL_KEY_LEGACY = "meridian-portal-client";

function readPortalClientId(): string | null {
  try {
    return localStorage.getItem(PORTAL_KEY) || localStorage.getItem(PORTAL_KEY_LEGACY);
  } catch {
    return null;
  }
}

/** Currently “signed in” client for the portal (demo session). */
export const portalClientId = signal<string | null>(readPortalClientId());

export function getPortalClientId(): string | null {
  return portalClientId();
}

export function setPortalClientId(clientId: string | null) {
  portalClientId.set(clientId);
  try {
    if (clientId) localStorage.setItem(PORTAL_KEY, clientId);
    else localStorage.removeItem(PORTAL_KEY);
  } catch {
    /* ignore */
  }
}
