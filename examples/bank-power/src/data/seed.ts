import type {
  Account,
  Card,
  KpiSnapshot,
  Transaction,
  TransferRecord,
} from "./types.js";

const now = Date.now();
const day = 86_400_000;

function iso(daysAgo: number, hour = 12) {
  const d = new Date(now - daysAgo * day);
  d.setHours(hour, (daysAgo * 17) % 60, 0, 0);
  return d.toISOString();
}

export function buildSeed() {
  const accounts: Account[] = [
    {
      id: "acc-checking",
      name: "Everyday Checking",
      type: "checking",
      mask: "4521",
      balance: 4280.42,
      available: 4120.42,
      currency: "USD",
    },
    {
      id: "acc-savings",
      name: "Rainy Day Savings",
      type: "savings",
      mask: "9104",
      balance: 12850.0,
      available: 12850.0,
      currency: "USD",
    },
    {
      id: "acc-credit",
      name: "Rewards Credit",
      type: "credit",
      mask: "7832",
      balance: -640.18,
      available: 4359.82,
      currency: "USD",
    },
  ];

  const transactions: Transaction[] = [
    {
      id: "tx-1",
      accountId: "acc-checking",
      description: "Payroll · Northwind",
      amount: 3200,
      postedAt: iso(0, 9),
      status: "posted",
      category: "Income",
    },
    {
      id: "tx-2",
      accountId: "acc-checking",
      description: "Whole Foods Market",
      amount: -86.42,
      postedAt: iso(0, 18),
      status: "posted",
      category: "Groceries",
    },
    {
      id: "tx-3",
      accountId: "acc-checking",
      description: "Transfer to Savings",
      amount: -250,
      postedAt: iso(1, 10),
      status: "posted",
      category: "Transfer",
    },
    {
      id: "tx-4",
      accountId: "acc-savings",
      description: "Transfer from Checking",
      amount: 250,
      postedAt: iso(1, 10),
      status: "posted",
      category: "Transfer",
    },
    {
      id: "tx-5",
      accountId: "acc-credit",
      description: "City Transit",
      amount: -32.5,
      postedAt: iso(1, 8),
      status: "posted",
      category: "Transit",
    },
    {
      id: "tx-6",
      accountId: "acc-checking",
      description: "Electric Co.",
      amount: -118.2,
      postedAt: iso(2, 7),
      status: "posted",
      category: "Utilities",
    },
    {
      id: "tx-7",
      accountId: "acc-checking",
      description: "Pending · Coffee Lab",
      amount: -6.75,
      postedAt: iso(0, 15),
      status: "pending",
      category: "Dining",
    },
    {
      id: "tx-8",
      accountId: "acc-credit",
      description: "Bookstore",
      amount: -42.0,
      postedAt: iso(3, 16),
      status: "posted",
      category: "Shopping",
    },
    {
      id: "tx-9",
      accountId: "acc-checking",
      description: "Rent · Oak Street",
      amount: -1850,
      postedAt: iso(5, 8),
      status: "posted",
      category: "Housing",
    },
    {
      id: "tx-10",
      accountId: "acc-savings",
      description: "Interest credit",
      amount: 4.12,
      postedAt: iso(6, 0),
      status: "posted",
      category: "Income",
    },
    {
      id: "tx-11",
      accountId: "acc-checking",
      description: "Venmo · Alex",
      amount: -40,
      postedAt: iso(4, 20),
      status: "posted",
      category: "Friends",
    },
    {
      id: "tx-12",
      accountId: "acc-credit",
      description: "Failed · Overseas merchant",
      amount: -19.99,
      postedAt: iso(7, 14),
      status: "failed",
      category: "Shopping",
    },
  ];

  const cards: Card[] = [
    {
      id: "card-debit",
      label: "Everyday Debit",
      last4: "4521",
      network: "visa",
      status: "active",
      spendLimit: 2500,
      accountId: "acc-checking",
    },
    {
      id: "card-credit",
      label: "Rewards Credit",
      last4: "7832",
      network: "mastercard",
      status: "active",
      spendLimit: 5000,
      accountId: "acc-credit",
    },
  ];

  const transfers: TransferRecord[] = [];

  const kpis: KpiSnapshot = {
    totalBalance: accounts
      .filter((a) => a.type !== "credit")
      .reduce((s, a) => s + a.balance, 0),
    monthSpend: Math.abs(
      transactions
        .filter((t) => t.amount < 0 && t.status !== "failed")
        .reduce((s, t) => s + t.amount, 0),
    ),
    pendingCount: transactions.filter((t) => t.status === "pending").length,
    accountCount: accounts.length,
  };

  return { accounts, transactions, cards, transfers, kpis };
}
