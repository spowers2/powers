import { signal, computed } from "@lab206/core";
import {
  Button,
  Card,
  Dialog,
  Drawer,
  Empty,
  Field,
  Input,
  Select,
  Stack,
  Text,
  firstError,
  required,
  type ToastController,
  asSelectBind,
} from "@lab206/ui";
import type { Router } from "@lab206/router";
import { PageHeader } from "../components/uiBits.js";
import {
  tasks,
  projects,
  upsertTask,
  removeTask,
  setTaskStatus,
  projectById,
  clientById,
  formatDate,
  isOverdue,
} from "../data/store.js";
import type { Task, TaskPriority, TaskStatus } from "../data/types.js";

const STATUS_OPTS = [
  { value: "todo", label: "To do" },
  { value: "doing", label: "Doing" },
  { value: "done", label: "Done" },
];

const PRIORITY_OPTS = [
  { value: "low", label: "Low" },
  { value: "med", label: "Med" },
  { value: "high", label: "High" },
];

function initialTaskStatus(): string {
  if (typeof window === "undefined") return "open";
  try {
    const s = new URLSearchParams(window.location.search).get("status");
    if (s === "open" || s === "all" || s === "todo" || s === "doing" || s === "done") {
      return s;
    }
  } catch {
    /* ignore */
  }
  return "open";
}

export function TasksPage(props: {
  toaster: ToastController;
  router?: Router;
}) {
  const { toaster, router } = props;
  const filter = signal("");
  const statusFilter = signal(initialTaskStatus());
  const drawerOpen = signal(false);
  const confirmOpen = signal(false);
  const editingId = signal<string | null>(null);

  const projectId = signal("");
  const title = signal("");
  const status = signal<TaskStatus>("todo");
  const priority = signal<TaskPriority>("med");
  const dueDate = signal(new Date().toISOString().slice(0, 10));
  const touched = signal(false);

  const titleErr = () =>
    !touched() ? "" : firstError(required(title(), "Title required"));
  const projectErr = () =>
    !touched() ? "" : firstError(required(projectId(), "Pick a project"));

  const visible = computed(() => {
    const q = filter().trim().toLowerCase();
    const sf = statusFilter();
    return tasks()
      .filter((t) => {
        if (sf === "open") return t.status !== "done";
        if (sf === "all") return true;
        return t.status === sf;
      })
      .filter((t) => {
        if (!q) return true;
        const prj = projectById(t.projectId);
        return (
          t.title.toLowerCase().includes(q) ||
          (prj?.name.toLowerCase().includes(q) ?? false)
        );
      })
      .sort((a, b) => {
        if (a.status === "done" && b.status !== "done") return 1;
        if (b.status === "done" && a.status !== "done") return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
  });

  const openNew = () => {
    editingId.set(null);
    projectId.set(projects()[0]?.id ?? "");
    title.set("");
    status.set("todo");
    priority.set("med");
    dueDate.set(new Date().toISOString().slice(0, 10));
    touched.set(false);
    drawerOpen.set(true);
  };

  const openEdit = (t: Task) => {
    editingId.set(t.id);
    projectId.set(t.projectId);
    title.set(t.title);
    status.set(t.status);
    priority.set(t.priority);
    dueDate.set(t.dueDate);
    touched.set(false);
    drawerOpen.set(true);
  };

  const save = () => {
    touched.set(true);
    if (titleErr() || projectErr()) {
      toaster.push({ title: "Fix the form", tone: "danger" });
      return;
    }
    upsertTask({
      id: editingId() ?? undefined,
      projectId: projectId(),
      title: title().trim(),
      status: status(),
      priority: priority(),
      dueDate: dueDate(),
    });
    drawerOpen.set(false);
    toaster.push({
      title: editingId() ? "Task updated" : "Task added",
      tone: "success",
    });
  };

  const confirmDelete = () => {
    const id = editingId();
    if (!id) return;
    removeTask(id);
    confirmOpen.set(false);
    drawerOpen.set(false);
    toaster.push({ title: "Task deleted", tone: "info" });
  };

  return (
    <Stack gap={6}>
      <PageHeader
        title="Tasks"
        subtitle="Work items on a project — each row shows client · project so you know who it’s for."
        actions={
          <Stack direction="row" gap={2} wrap>
            {router
              ? Button({
                  size: "sm",
                  variant: "soft",
                  children: "Projects",
                  onClick: () => router.navigate("/projects?view=pipeline"),
                })
              : null}
            <Button
              size="sm"
              onClick={openNew}
              disabled={() => projects().length === 0}
            >
              Add task
            </Button>
          </Stack>
        }
      />

      <Card>
        <Stack gap={3}>
          <Stack direction="row" gap={2} wrap>
            <div style={{ flex: "1 1 12rem" }}>
              <Field label="Search">
                <Input
                  placeholder="Task or project…"
                  bind={filter}
                />
              </Field>
            </div>
            <div style={{ flex: "0 1 10rem" }}>
              <Field label="Show">
                <Select
                  bind={statusFilter}
                  options={[
                    { value: "open", label: "Open" },
                    { value: "all", label: "All" },
                    ...STATUS_OPTS,
                  ]}
                />
              </Field>
            </div>
          </Stack>

          {() => {
            const list = visible();
            if (list.length === 0) {
              return (
                <Empty
                  icon="✓"
                  title="Inbox clear"
                  description={
                    projects().length === 0
                      ? "Create a project first, then add tasks."
                      : "No tasks match this filter."
                  }
                >
                  {projects().length > 0 ? (
                    <Button size="sm" onClick={openNew}>
                      Add task
                    </Button>
                  ) : null}
                </Empty>
              );
            }

            const frag = document.createDocumentFragment();
            for (const t of list) {
              const prj = projectById(t.projectId);
              const client = prj ? clientById(prj.clientId) : undefined;
              const row = document.createElement("div");
              row.className = "task-row";

              const check = document.createElement("button");
              check.type = "button";
              check.className =
                "task-check" + (t.status === "done" ? " is-done" : "");
              check.setAttribute(
                "aria-label",
                t.status === "done" ? "Mark to do" : "Mark done",
              );
              check.textContent = t.status === "done" ? "✓" : "";
              check.onclick = (e) => {
                e.stopPropagation();
                setTaskStatus(
                  t.id,
                  t.status === "done" ? "todo" : "done",
                );
                toaster.push({
                  title: t.status === "done" ? "Reopened" : "Completed",
                  description: t.title,
                  tone: "success",
                  duration: 1800,
                });
              };

              const body = document.createElement("button");
              body.type = "button";
              body.className = "task-row__body";
              body.onclick = () => openEdit(t);
              const titleEl = document.createElement("div");
              titleEl.className =
                "data-row__title" + (t.status === "done" ? " is-done" : "");
              titleEl.textContent = t.title;
              const meta = document.createElement("div");
              meta.className = "data-row__meta";
              meta.textContent = [
                client?.company || null,
                prj?.name ?? "—",
                t.priority,
                t.status,
              ]
                .filter(Boolean)
                .join(" · ");
              body.append(titleEl, meta);

              const due = document.createElement("div");
              due.className =
                "data-row__side" +
                (t.status !== "done" && isOverdue(t.dueDate)
                  ? " is-danger"
                  : "");
              due.textContent = formatDate(t.dueDate);

              row.append(check, body, due);
              frag.appendChild(row);
            }
            return frag;
          }}
        </Stack>
      </Card>

      <Drawer
        open={drawerOpen}
        onClose={() => drawerOpen.set(false)}
        title="Task"
        side="right"
      >
        <Stack gap={4}>
          <Field label="Project" required error={projectErr}>
            <Select
              bind={projectId}
              options={() =>
                projects().map((p) => ({
                  value: p.id,
                  label: p.name,
                }))
              }
            />
          </Field>
          <Field label="Title" required error={titleErr}>
            <Input
              bind={title}
              onBlur={() => touched.set(true)}
              placeholder="Ship empty states"
            />
          </Field>
          <Stack direction="row" gap={2} wrap>
            <div style={{ flex: "1 1 8rem" }}>
              <Field label="Status">
                <Select
                  bind={asSelectBind(status)}
                  options={STATUS_OPTS}
                />
              </Field>
            </div>
            <div style={{ flex: "1 1 8rem" }}>
              <Field label="Priority">
                <Select
                  bind={asSelectBind(priority)}
                  options={PRIORITY_OPTS}
                />
              </Field>
            </div>
          </Stack>
          <Field label="Due">
            <Input
              type="date"
              bind={dueDate}
            />
          </Field>
          <Stack direction="row" gap={2} wrap>
            <Button onClick={save}>Save</Button>
            {() =>
              editingId()
                ? Button({
                    variant: "danger",
                    children: "Delete…",
                    onClick: () => confirmOpen.set(true),
                  })
                : null
            }
            <Button variant="ghost" onClick={() => drawerOpen.set(false)}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Drawer>

      <Dialog
        open={confirmOpen}
        onClose={() => confirmOpen.set(false)}
        title="Delete task?"
        size="sm"
      >
        <Stack direction="row" gap={2} justify="end">
          <Button variant="ghost" onClick={() => confirmOpen.set(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Stack>
      </Dialog>
    </Stack>
  );
}
