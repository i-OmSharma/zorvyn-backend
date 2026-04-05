export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  totalTransactions: number;
  recentTransactions: RecentTransaction[];
}

export interface RecentTransaction {
  id: string;
  amount: number;
  type: string;
  category: string;
  date: Date;
  notes: string | null;
}

export interface CategoryTotal {
  category: string;
  total: number;
  count: number;
  type: string;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  net: number;
}