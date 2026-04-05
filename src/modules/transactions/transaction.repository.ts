import { prisma } from "../../config/prisma";
import { TransactionType } from "@prisma/client";
import { TransactionFilters } from "./transaction.types";

export const createTransaction = async (data: {
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
  notes?: string;
  createdById: string;
}) => {
  const { createdById, ...rest } = data;
  return prisma.transaction.create({
    data: {
      ...rest,
      createdBy: { connect: { id: createdById } },
    },
    include: { createdBy: { select: { id: true, name: true, email: true } } },
  });
};

export const findAllTransactions = async (filters: TransactionFilters) => {
  const {
    type,
    category,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  } = filters;

  const where = {
    isDeleted: false,
    ...(type && { type: type as TransactionType }),
    ...(category && {
      category: { contains: category, mode: "insensitive" as const },
    }),
    ...(startDate || endDate
      ? {
          date: {
            ...(startDate && { gte: new Date(startDate) }),
            ...(endDate && { lte: new Date(endDate) }),
          },
        }
      : {}),
  };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const findTransactionById = async (id: string) => {
  return prisma.transaction.findFirst({
    where: { id, isDeleted: false },
    include: { createdBy: { select: { id: true, name: true, email: true } } },
  });
};

export const updateTransaction = async (
  id: string,
  data: {
    amount?: number;
    type?: TransactionType;
    category?: string;
    date?: Date;
    notes?: string;
  }
) => {
  return prisma.transaction.update({
    where: { id, isDeleted: false },
    data,
    include: { createdBy: { select: { id: true, name: true, email: true } } },
  });
};

export const softDeleteTransaction = async (id: string) => {
  return prisma.transaction.update({
    where: { id, isDeleted: false },
    data: { isDeleted: true },
  });
};