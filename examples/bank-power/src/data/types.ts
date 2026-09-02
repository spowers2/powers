export type AccountType = "checking" | "savings" | "credit";

export type TxStatus = "posted" | "pending" | "failed";

export type CardStatus = "active" | "frozen";

export type Account = {
  id: string;
  name: string;
  type: AccountType;
  mask: string;
  balance: number;
  available: number;
  currency: "USD";
};

export type Transaction = {
  id: string;
  accountId: string;
  description: string;
  amount: number;
  postedAt: string;
  status: TxStatus;
  category: string;
};

export type Card = {
  id: string;
  label: string;
  last4: string;
  network: "visa" | "mastercard";
  status: CardStatus;
  spendLimit: number;
  accountId: string;
};

export type TransferRecord = {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  memo: string;
  status: "completed" | "pending";
  createdAt: string;
};

export type KpiSnapshot = {
  totalBalance: number;
  monthSpend: number;
  pendingCount: number;
  accountCount: number;
};
