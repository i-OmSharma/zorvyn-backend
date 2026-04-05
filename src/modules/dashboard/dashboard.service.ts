import { prisma } from "../../config/prisma";
import { DashboardSummary, CategoryTotal, MonthlyTrend } from "./dashboard.types";

export const getSummary = async (): Promise<DashboardSummary> => {
  const [incomeResult, expenseResult, totalTransactions, recentTransactions] =
    await Promise.all([
      prisma.transaction.aggregate({
        where: { type: "INCOME", isDeleted: false },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { type: "EXPENSE", isDeleted: false },
        _sum: { amount: true },
      }),
      prisma.transaction.count({
        where: { isDeleted: false },
      }),
      prisma.transaction.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          amount: true,
          type: true,
          category: true,
          date: true,
          notes: true,
        },
      }),
    ]);

  const totalIncome = Number(incomeResult._sum.amount ?? 0);
  const totalExpenses = Number(expenseResult._sum.amount ?? 0);

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    totalTransactions,
    recentTransactions: recentTransactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
    })),
  };
};

export const getCategoryTotals = async (): Promise<CategoryTotal[]> => {
  const results = await prisma.transaction.groupBy({
    by: ["category", "type"],
    where: { isDeleted: false },
    _sum: { amount: true },
    _count: { id: true },
    orderBy: { _sum: { amount: "desc" } },
  });

  return results.map((r) => ({
    category: r.category,
    type: r.type,
    total: Number(r._sum.amount ?? 0),
    count: r._count.id,
  }));
};

export const getMonthlyTrends = async (): Promise<MonthlyTrend[]> => {
  // Get last 6 months of data
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const transactions = await prisma.transaction.findMany({
    where: {
      isDeleted: false,
      date: { gte: sixMonthsAgo },
    },
    select: {
      amount: true,
      type: true,
      date: true,
    },
    orderBy: { date: "asc" },
  });

  // Group by month
  const monthMap = new Map<string, { income: number; expenses: number }>();

  transactions.forEach((t) => {
    const month = t.date.toISOString().slice(0, 7); // "2026-04"
    const existing = monthMap.get(month) ?? { income: 0, expenses: 0 };

    if (t.type === "INCOME") {
      existing.income += Number(t.amount);
    } else {
      existing.expenses += Number(t.amount);
    }

    monthMap.set(month, existing);
  });

  return Array.from(monthMap.entries()).map(([month, data]) => ({
    month,
    income: data.income,
    expenses: data.expenses,
    net: data.income - data.expenses,
  }));
};