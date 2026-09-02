import { createApiClient, createQuery, signal } from "@lab206/core";
import { buildSeed } from "./seed.js";
import type {
  Account,
  AccountType,
  Card,
  KpiSnapshot,
  Transaction,
  TransferRecord,
  TxStatus,
} from "./types.js";

const seed = buildSeed();
const db = {
  accounts: seed.accounts.map((a) => ({ ...a })),
  transactions: seed.transactions.map((t) => ({ ...t })),
  cards: seed.cards.map((c) => ({ ...c })),
  transfers: seed.transfers.map((t) => ({ ...t })),
  kpis: { ...seed.kpis },
};

function recomputeKpis() {
  db.kpis.totalBalance = db.accounts
    .filter((a) => a.type !== "credit")
    .reduce((s, a) => s + a.balance, 0);
  db.kpis.pendingCount = db.transactions.filter(
    (t) => t.status === "pending",
  ).length;
  db.kpis.accountCount = db.accounts.length;
  db.kpis.monthSpend = Math.abs(
    db.transactions
      .filter((t) => t.amount < 0 && t.status !== "failed")
      .reduce((s, t) => s + t.amount, 0),
  );
}

function delay(ms = 220 + Math.random() * 280) {
  return new Promise((r) => setTimeout(r, ms));
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function fakeFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  await delay();
  const url = new URL(String(input), "https://bank.power.local");
  const path = url.pathname;
  const method = (init?.method ?? "GET").toUpperCase();

  if (path === "/api/kpis" && method === "GET") {
    recomputeKpis();
    return json(db.kpis);
  }

  if (path === "/api/accounts" && method === "GET") {
    const type = url.searchParams.get("type") as AccountType | null;
    let rows = db.accounts;
    if (type) rows = rows.filter((a) => a.type === type);
    return json(rows);
  }

  if (path.startsWith("/api/accounts/") && method === "GET") {
    const id = path.slice("/api/accounts/".length);
    const account = db.accounts.find((a) => a.id === id);
    if (!account) return json({ error: "not_found" }, 404);
    const txs = db.transactions
      .filter((t) => t.accountId === id)
      .sort((a, b) => b.postedAt.localeCompare(a.postedAt));
    return json({ account, transactions: txs });
  }

  if (path === "/api/transactions" && method === "GET") {
    const q = (url.searchParams.get("q") ?? "").toLowerCase();
    const status = url.searchParams.get("status") as TxStatus | null;
    const accountId = url.searchParams.get("accountId");
    let rows = [...db.transactions].sort((a, b) =>
      b.postedAt.localeCompare(a.postedAt),
    );
    if (accountId) rows = rows.filter((t) => t.accountId === accountId);
    if (status) rows = rows.filter((t) => t.status === status);
    if (q) {
      rows = rows.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      );
    }
    return json(rows);
  }

  if (path === "/api/cards" && method === "GET") {
    return json(db.cards);
  }

  if (path.startsWith("/api/cards/") && path.endsWith("/toggle") && method === "POST") {
    const id = path.replace("/api/cards/", "").replace("/toggle", "");
    const card = db.cards.find((c) => c.id === id);
    if (!card) return json({ error: "not_found" }, 404);
    card.status = card.status === "active" ? "frozen" : "active";
    return json(card);
  }

  if (path === "/api/transfers" && method === "POST") {
    const body = JSON.parse(String(init?.body ?? "{}")) as {
      fromAccountId: string;
      toAccountId: string;
      amount: number;
      memo?: string;
    };
    const from = db.accounts.find((a) => a.id === body.fromAccountId);
    const to = db.accounts.find((a) => a.id === body.toAccountId);
    if (!from || !to) return json({ error: "bad_accounts" }, 400);
    const amount = Number(body.amount);
    if (!(amount > 0)) return json({ error: "bad_amount" }, 400);
    if (from.available < amount && from.type !== "credit") {
      return json({ error: "insufficient" }, 400);
    }

    from.balance -= amount;
    from.available -= amount;
    if (to.type === "credit") {
      to.balance += amount; // pay down credit (less negative / toward zero)
      to.available += amount;
    } else {
      to.balance += amount;
      to.available += amount;
    }

    const id = `tr-${Date.now()}`;
    const createdAt = new Date().toISOString();
    const record: TransferRecord = {
      id,
      fromAccountId: from.id,
      toAccountId: to.id,
      amount,
      memo: body.memo?.trim() || "Transfer",
      status: "completed",
      createdAt,
    };
    db.transfers.unshift(record);

    db.transactions.unshift(
      {
        id: `tx-out-${id}`,
        accountId: from.id,
        description: `Transfer to ${to.name}`,
        amount: -amount,
        postedAt: createdAt,
        status: "posted",
        category: "Transfer",
      },
      {
        id: `tx-in-${id}`,
        accountId: to.id,
        description: `Transfer from ${from.name}`,
        amount,
        postedAt: createdAt,
        status: "posted",
        category: "Transfer",
      },
    );
    recomputeKpis();
    return json(record);
  }

  return json({ error: "not_found" }, 404);
}

export const api = createApiClient({
  baseUrl: "/api",
  fetch: fakeFetch as typeof fetch,
});

export type AccountDetail = {
  account: Account;
  transactions: Transaction[];
};

export const activityQ = signal("");
export const activityStatus = signal<TxStatus | "">("");

export const kpisQuery = createQuery({
  queryKey: () => "kpis",
  queryFn: () => api.get<KpiSnapshot>("/kpis"),
  name: "kpis",
});

export const accountsQuery = createQuery({
  queryKey: () => "accounts",
  queryFn: () => api.get<Account[]>("/accounts"),
  name: "accounts",
});

export const accountDetailQuery = (id: () => string) =>
  createQuery({
    queryKey: () => `account:${id()}`,
    queryFn: () => api.get<AccountDetail>(`/accounts/${id()}`),
    name: "account-detail",
  });

export const transactionsQuery = createQuery({
  queryKey: () => `tx:${activityQ()}:${activityStatus()}`,
  queryFn: () => {
    const params = new URLSearchParams();
    if (activityQ()) params.set("q", activityQ());
    if (activityStatus()) params.set("status", activityStatus());
    const qs = params.toString();
    return api.get<Transaction[]>(`/transactions${qs ? `?${qs}` : ""}`);
  },
  name: "transactions",
});

export const cardsQuery = createQuery({
  queryKey: () => "cards",
  queryFn: () => api.get<Card[]>("/cards"),
  name: "cards",
});

export async function submitTransfer(input: {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  memo: string;
}) {
  const res = await api.post<TransferRecord>("/transfers", input);
  await Promise.all([
    kpisQuery.refetch(),
    accountsQuery.refetch(),
    transactionsQuery.refetch(),
  ]);
  return res;
}

export async function toggleCard(id: string) {
  const res = await api.post<Card>(`/cards/${id}/toggle`, {});
  await cardsQuery.refetch();
  return res;
}

export function money(n: number) {
  const abs = Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (n < 0) return `−$${abs}`;
  return `$${abs}`;
}

export function accountLabel(a: Account) {
  return `${a.name} ···${a.mask}`;
}
