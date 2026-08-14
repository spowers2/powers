import { signal } from "@powers/core";
import {
  Button,
  Card,
  Empty,
  Field,
  Select,
  Stack,
  Text,
  type ToastController,
} from "@powers/ui";
import type { Router } from "@powers/router";
import {
  clients,
  clientById,
  profile,
  projectsForClient,
  projectProgress,
  updatesForProject,
  tasksForProject,
  formatDate,
  formatMoney,
  portalClientId,
  setPortalClientId,
  outstandingInvoices,
  invoiceTotal,
} from "../data/store.js";
import type { Project, ProjectStatus } from "../data/types.js";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  proposal: "Proposal",
  active: "In progress",
  blocked: "On hold",
  done: "Complete",
};

const STATUS_HINT: Record<ProjectStatus, string> = {
  proposal: "We’re scoping this engagement.",
  active: "Work is underway.",
  blocked: "Waiting on an external dependency.",
  done: "Delivered.",
};

/**
 * Client-facing portal — pick a client (demo “sign in”), then see project
 * status, progress, and staff-published updates. Read-only.
 */
export function PortalPage(props: {
  router: Router;
  toaster: ToastController;
}) {
  const { router, toaster } = props;
  const pickId = signal(portalClientId() ?? "");

  const signIn = () => {
    const id = pickId();
    if (!id) return;
    setPortalClientId(id);
    const c = clientById(id);
    toaster.push({
      title: "Portal open",
      description: c ? `${c.company} · ${c.name}` : "Client",
      tone: "success",
    });
  };

  const signOut = () => {
    setPortalClientId(null);
    pickId.set("");
    toaster.push({ title: "Signed out of portal", tone: "info" });
  };

  return (
    <Stack gap={6}>
      <Stack gap={2}>
        <Text as="h1" size="2xl" weight="semibold">
          Client portal
        </Text>
        <Text muted size="sm">
          {() =>
            `Status and updates from ${profile().company || "your studio"} — demo sign-in, local only.`
          }
        </Text>
      </Stack>

      {() => {
        const sessionId = portalClientId();
        const client = sessionId ? clientById(sessionId) : undefined;

        if (!sessionId || !client) {
          return (
            <Card>
              <Stack gap={4}>
                <Text weight="semibold">Who are you?</Text>
                <Text muted size="sm">
                  In production this would be a secure login. Here, choose a
                  client record to preview their portal.
                </Text>
                <Field label="Client">
                  <Select
                    bind={pickId}
                    placeholder="Select company…"
                    options={() =>
                      clients().map((c) => ({
                        value: c.id,
                        label: `${c.company} · ${c.name}`,
                      }))
                    }
                  />
                </Field>
                <Stack direction="row" gap={2} wrap>
                  <Button onClick={signIn} disabled={() => !pickId()}>
                    Open my projects
                  </Button>
                  <Button variant="ghost" onClick={() => router.navigate("/")}>
                    Staff workspace
                  </Button>
                </Stack>
              </Stack>
            </Card>
          );
        }

        const list = projectsForClient(client.id);
        const openInv = outstandingInvoices().filter(
          (i) => i.clientId === client.id,
        );

        return (
          <Stack gap={5}>
            <Card variant="soft">
              <Stack gap={2}>
                <Stack
                  direction="row"
                  gap={2}
                  justify="between"
                  align="center"
                  wrap
                >
                  <div>
                    <Text weight="semibold" size="lg">
                      {client.company}
                    </Text>
                    <Text muted size="sm">
                      Signed in as {client.name} · {client.email}
                    </Text>
                  </div>
                  <Stack direction="row" gap={2} wrap>
                    <Button size="sm" variant="soft" onClick={signOut}>
                      Switch client
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => router.navigate("/")}
                    >
                      Staff →
                    </Button>
                  </Stack>
                </Stack>
                {openInv.length > 0
                  ? Text({
                      size: "sm",
                      children: `You have ${openInv.length} open invoice${openInv.length === 1 ? "" : "s"} totaling ${formatMoney(openInv.reduce((s, i) => s + invoiceTotal(i), 0))}. Contact ${profile().email} with questions.`,
                    })
                  : Text({
                      size: "sm",
                      muted: true,
                      children: "No outstanding invoices on file.",
                    })}
              </Stack>
            </Card>

            <Stack gap={2}>
              <Text weight="semibold" size="lg">
                Your projects
              </Text>
              <Text muted size="sm">
                Live status, task progress, and updates shared by the studio.
              </Text>
            </Stack>

            {list.length === 0 ? (
              <Empty
                icon="◎"
                title="No projects yet"
                description="When work is kicked off, it will appear here."
              />
            ) : (
              (() => {
                const frag = document.createDocumentFragment();
                for (const p of list) {
                  frag.appendChild(buildProjectCard(p));
                }
                return frag;
              })()
            )}
          </Stack>
        );
      }}
    </Stack>
  );
}

function buildProjectCard(p: Project): HTMLElement {
  const prog = projectProgress(p.id);
  const updates = updatesForProject(p.id, { clientOnly: true });
  const openTasks = tasksForProject(p.id).filter((t) => t.status !== "done");

  const card = document.createElement("div");
  card.className = "pu-card portal-project";
  // Match Card surface roughly
  card.style.padding = "1rem 1.1rem";
  card.style.borderRadius = "var(--pu-radius-md)";
  card.style.border = "1px solid var(--pu-color-border)";
  card.style.background = "var(--pu-color-surface)";
  card.style.marginBottom = "0.75rem";

  const head = document.createElement("div");
  head.className = "portal-project__head";
  const titles = document.createElement("div");
  const name = document.createElement("div");
  name.className = "data-row__title";
  name.style.fontSize = "1.05rem";
  name.textContent = p.name;
  const meta = document.createElement("div");
  meta.className = "data-row__meta";
  meta.textContent = `${STATUS_HINT[p.status]} · due ${formatDate(p.dueDate)}`;
  titles.append(name, meta);
  const status = document.createElement("span");
  status.className = `portal-status portal-status--${p.status}`;
  status.textContent = STATUS_LABEL[p.status];
  head.append(titles, status);
  card.appendChild(head);

  if (p.summary) {
    const sum = document.createElement("p");
    sum.className = "portal-project__summary";
    sum.textContent = p.summary;
    card.appendChild(sum);
  }

  const progWrap = document.createElement("div");
  progWrap.className = "portal-progress";
  const bar = document.createElement("div");
  bar.className = "portal-progress__bar";
  const fill = document.createElement("div");
  fill.className = "portal-progress__fill";
  fill.style.width = `${prog.pct}%`;
  bar.appendChild(fill);
  const progLabel = document.createElement("div");
  progLabel.className = "data-row__meta";
  progLabel.textContent =
    prog.total === 0
      ? "No tasks tracked yet"
      : `${prog.done} of ${prog.total} tasks complete · ${prog.pct}%`;
  progWrap.append(bar, progLabel);
  card.appendChild(progWrap);

  if (openTasks.length > 0) {
    const block = document.createElement("div");
    block.className = "portal-block";
    const h = document.createElement("div");
    h.className = "portal-block__title";
    h.textContent = "In flight";
    block.appendChild(h);
    for (const t of openTasks.slice(0, 5)) {
      const row = document.createElement("div");
      row.className = "portal-task";
      row.textContent = `${t.status === "doing" ? "→" : "·"} ${t.title} · due ${formatDate(t.dueDate)}`;
      block.appendChild(row);
    }
    if (openTasks.length > 5) {
      const more = document.createElement("div");
      more.className = "portal-task portal-task--more";
      more.textContent = `+${openTasks.length - 5} more open`;
      block.appendChild(more);
    }
    card.appendChild(block);
  }

  const updBlock = document.createElement("div");
  updBlock.className = "portal-block";
  const uh = document.createElement("div");
  uh.className = "portal-block__title";
  uh.textContent = "Updates from the studio";
  updBlock.appendChild(uh);
  if (updates.length === 0) {
    const empty = document.createElement("div");
    empty.className = "portal-task";
    empty.textContent = "No client-facing updates yet.";
    updBlock.appendChild(empty);
  } else {
    for (const u of updates) {
      const item = document.createElement("div");
      item.className = "portal-update";
      const when = document.createElement("div");
      when.className = "portal-update__when";
      when.textContent = new Date(u.createdAt).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
      const body = document.createElement("div");
      body.className = "portal-update__body";
      body.textContent = u.body;
      item.append(when, body);
      updBlock.appendChild(item);
    }
  }
  card.appendChild(updBlock);

  const foot = document.createElement("div");
  foot.className = "data-row__meta";
  foot.style.marginTop = "0.5rem";
  foot.textContent = `Engagement value ${formatMoney(p.value)} · last activity ${new Date(p.updatedAt).toLocaleDateString()}`;
  card.appendChild(foot);

  return card;
}
