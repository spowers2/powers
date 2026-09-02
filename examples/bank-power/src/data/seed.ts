import type {
  Account,
  CapitalProduct,
  CapitalSnapshot,
  Card,
  KpiSnapshot,
  Transaction,
  TransferRecord,
  Workflow,
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
      id: "acc-operating",
      name: "Operating Account",
      type: "checking",
      mask: "4521",
      balance: 284750.42,
      available: 271200.42,
      currency: "USD",
    },
    {
      id: "acc-payroll",
      name: "Payroll Account",
      type: "checking",
      mask: "7832",
      balance: 156200.0,
      available: 156200.0,
      currency: "USD",
    },
    {
      id: "acc-reserve",
      name: "Reserve Account",
      type: "savings",
      mask: "9104",
      balance: 500000.0,
      available: 500000.0,
      currency: "USD",
    },
  ];

  const transactions: Transaction[] = [
    {
      id: "tx-1",
      accountId: "acc-operating",
      description: "Client Invoice #4521",
      amount: 24500,
      postedAt: iso(0, 9),
      status: "posted",
      category: "Revenue",
    },
    {
      id: "tx-2",
      accountId: "acc-operating",
      description: "AWS Services",
      amount: -3240.15,
      postedAt: iso(0, 14),
      status: "posted",
      category: "Infrastructure",
    },
    {
      id: "tx-3",
      accountId: "acc-payroll",
      description: "Employee Payroll",
      amount: -45600,
      postedAt: iso(1, 8),
      status: "posted",
      category: "Payroll",
    },
    {
      id: "tx-4",
      accountId: "acc-operating",
      description: "Transfer to Payroll",
      amount: -48000,
      postedAt: iso(2, 10),
      status: "posted",
      category: "Transfer",
    },
    {
      id: "tx-5",
      accountId: "acc-payroll",
      description: "Transfer from Operating",
      amount: 48000,
      postedAt: iso(2, 10),
      status: "posted",
      category: "Transfer",
    },
    {
      id: "tx-6",
      accountId: "acc-operating",
      description: "Office Rent",
      amount: -8500,
      postedAt: iso(3, 7),
      status: "posted",
      category: "Facilities",
    },
    {
      id: "tx-7",
      accountId: "acc-operating",
      description: "Pending · Vendor Wire",
      amount: -12500,
      postedAt: iso(0, 16),
      status: "pending",
      category: "Payables",
    },
    {
      id: "tx-8",
      accountId: "acc-reserve",
      description: "Interest credit",
      amount: 412.08,
      postedAt: iso(5, 0),
      status: "posted",
      category: "Income",
    },
    {
      id: "tx-9",
      accountId: "acc-operating",
      description: "Software Subscriptions",
      amount: -1450,
      postedAt: iso(4, 11),
      status: "posted",
      category: "SaaS",
    },
    {
      id: "tx-10",
      accountId: "acc-operating",
      description: "Failed · Overseas merchant",
      amount: -199.99,
      postedAt: iso(6, 14),
      status: "failed",
      category: "Fraud watch",
    },
  ];

  const cards: Card[] = [
    {
      id: "card-ops",
      label: "Operating Debit",
      last4: "4521",
      network: "visa",
      status: "active",
      spendLimit: 25000,
      accountId: "acc-operating",
    },
    {
      id: "card-corp",
      label: "Corporate Card",
      last4: "3388",
      network: "mastercard",
      status: "active",
      spendLimit: 50000,
      accountId: "acc-operating",
    },
  ];

  const workflows: Workflow[] = [
    {
      id: "wf-1",
      name: "Automated Invoice Processing",
      description: "Automatically process and approve invoices under $5,000",
      status: "active",
      triggers: 1247,
      lastRun: "2 minutes ago",
      category: "Accounts Payable",
    },
    {
      id: "wf-2",
      name: "Multi-Level Expense Approval",
      description:
        "Route expenses through department heads and CFO based on amount",
      status: "active",
      triggers: 856,
      lastRun: "15 minutes ago",
      category: "Approvals",
    },
    {
      id: "wf-3",
      name: "Payroll Auto-Transfer",
      description:
        "Automatically transfer funds to payroll account 2 days before payday",
      status: "active",
      triggers: 48,
      lastRun: "1 day ago",
      category: "Payroll",
    },
    {
      id: "wf-4",
      name: "International Payment Reconciliation",
      description: "Match and reconcile international wire transfers with invoices",
      status: "paused",
      triggers: 234,
      lastRun: "3 days ago",
      category: "Reconciliation",
    },
    {
      id: "wf-5",
      name: "Vendor Payment Scheduling",
      description: "Schedule vendor payments based on optimal cash flow timing",
      status: "active",
      triggers: 567,
      lastRun: "1 hour ago",
      category: "Cash Management",
    },
    {
      id: "wf-6",
      name: "Duplicate Payment Detection",
      description: "Flag and prevent duplicate vendor payments",
      status: "error",
      triggers: 89,
      lastRun: "5 hours ago",
      category: "Fraud Prevention",
    },
  ];

  const capitalProducts: CapitalProduct[] = [
    {
      id: "cap-wc",
      name: "Working Capital Loans",
      range: "$10K – $500K",
      term: "3–24 months",
      rate: "From 8.5% APR",
      features: ["Flexible repayment", "No prepayment penalty", "Quick approval"],
    },
    {
      id: "cap-rbf",
      name: "Revenue-Based Financing",
      range: "$25K – $1M",
      term: "6–36 months",
      rate: "Revenue share 4–12%",
      features: ["Automatic deduction", "No fixed payments", "Scales with revenue"],
    },
    {
      id: "cap-eq",
      name: "Equipment Financing",
      range: "$5K – $250K",
      term: "12–60 months",
      rate: "From 6.5% APR",
      features: ["100% financing", "Tax advantages", "Asset-backed"],
    },
  ];

  const capital: CapitalSnapshot = {
    available: 250000,
    approved: 350000,
    deployed: "$1.2B",
    approvalRate: "76%",
    avgDecisionMin: 4.2,
    partners: "2,400+",
  };

  const transfers: TransferRecord[] = [];

  const kpis: KpiSnapshot = {
    totalBalance: accounts.reduce((s, a) => s + a.balance, 0),
    monthRevenue: 156240,
    pendingApprovals: 6,
    activeWorkflows: workflows.filter((w) => w.status === "active").length,
    accountCount: accounts.length,
  };

  return {
    accounts,
    transactions,
    cards,
    transfers,
    workflows,
    capitalProducts,
    capital,
    kpis,
  };
}
