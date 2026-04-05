export interface CreateTransactionInput {
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: string;
  notes?: string;
}

export interface UpdateTransactionInput {
  amount?: number;
  type?: "INCOME" | "EXPENSE";
  category?: string;
  date?: string;
  notes?: string;
}

export interface TransactionFilters {
  type?: "INCOME" | "EXPENSE";
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}