import { signal } from "@lab206/core";
import {
  Alert,
  Button,
  Dialog,
  Field,
  Input,
  Spinner,
  type ToastController,
} from "@lab206/ui";
import type { Router } from "@lab206/router";
import { PageChrome } from "../components/PageChrome.js";
import {
  accountLabel,
  accountsQuery,
  money,
  submitTransfer,
} from "../data/api.js";

export function TransferPage(props: {
  router: Router;
  toaster: ToastController;
}) {
  const { router, toaster } = props;
  const fromId = signal("");
  const toId = signal("");
  const amount = signal("100");
  const memo = signal("");
  const confirmOpen = signal(false);
  const saving = signal(false);
  const formError = signal("");

  const ensureDefaults = () => {
    const rows = accountsQuery() ?? [];
    if (!rows.length) return;
    if (!fromId()) fromId.set(rows[0]!.id);
    if (!toId()) {
      const other = rows.find((a) => a.id !== fromId()) ?? rows[0]!;
      toId.set(other.id);
    }
  };

  const runTransfer = async () => {
    formError.set("");
    saving.set(true);
    try {
      await submitTransfer({
        fromAccountId: fromId(),
        toAccountId: toId(),
        amount: Number(amount()),
        memo: memo(),
      });
      confirmOpen.set(false);
      toaster.push({
        title: "Transfer completed",
        description: `${money(Number(amount()))} moved.`,
        tone: "success",
      });
      router.navigate("/activity");
    } catch (e) {
      formError.set(String(e));
      toaster.push({
        title: "Transfer failed",
        description: String(e),
        tone: "danger",
      });
    } finally {
      saving.set(false);
    }
  };

  return (
    <PageChrome
      router={router}
      title="Transfer"
      purpose="Move money between your accounts. Confirm before it posts."
      crumbs={[
        { label: "Overview", href: "/" },
        { label: "Transfer" },
      ]}
    >
      {() => {
        const q = accountsQuery;
        if (q.loading()) return <Spinner label="Loading accounts…" />;
        if (q.error())
          return (
            <Alert tone="danger" title="Couldn’t load">
              {String(q.error())}
            </Alert>
          );
        ensureDefaults();
        const rows = q() ?? [];

        return (
          <div class="panel">
            <div class="panel__inner stack-gap">
              <Field label="From">
                <select
                  class="bp-select"
                  value={fromId()}
                  onChange={(e: Event) =>
                    fromId.set((e.target as HTMLSelectElement).value)
                  }
                >
                  {rows.map((a) => (
                    <option value={a.id}>
                      {accountLabel(a)} · {money(a.available)} avail
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="To">
                <select
                  class="bp-select"
                  value={toId()}
                  onChange={(e: Event) =>
                    toId.set((e.target as HTMLSelectElement).value)
                  }
                >
                  {rows.map((a) => (
                    <option value={a.id} disabled={a.id === fromId()}>
                      {accountLabel(a)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Amount (USD)">
                <Input
                  type="number"
                  value={() => amount()}
                  onInput={(e: Event) =>
                    amount.set((e.target as HTMLInputElement).value)
                  }
                />
              </Field>
              <Field label="Memo (optional)">
                <Input
                  value={() => memo()}
                  onInput={(e: Event) =>
                    memo.set((e.target as HTMLInputElement).value)
                  }
                />
              </Field>
              {() =>
                formError() ? (
                  <Alert tone="danger" title="Error">
                    {formError()}
                  </Alert>
                ) : null
              }
              <div class="row-gap">
                <Button
                  onClick={() => {
                    if (fromId() === toId()) {
                      formError.set("Pick two different accounts.");
                      return;
                    }
                    if (!(Number(amount()) > 0)) {
                      formError.set("Enter an amount greater than zero.");
                      return;
                    }
                    formError.set("");
                    confirmOpen.set(true);
                  }}
                >
                  Review transfer
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.navigate("/accounts")}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        );
      }}

      <Dialog
        open={confirmOpen}
        onClose={() => confirmOpen.set(false)}
        title="Confirm transfer"
      >
        <p class="muted">
          Move <b>{() => money(Number(amount()) || 0)}</b> from{" "}
          <b>{() => fromId()}</b> to <b>{() => toId()}</b>?
        </p>
        <div class="row-gap" style={{ marginTop: "1rem" }}>
          <Button
            disabled={() => saving()}
            onClick={() => {
              void runTransfer();
            }}
          >
            {() => (saving() ? "Sending…" : "Confirm")}
          </Button>
          <Button
            variant="ghost"
            onClick={() => confirmOpen.set(false)}
            disabled={() => saving()}
          >
            Back
          </Button>
        </div>
      </Dialog>
    </PageChrome>
  );
}
