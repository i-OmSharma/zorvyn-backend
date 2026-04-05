import { TransactionType } from "@prisma/client";
import { ApiError } from "../../utils/ApiError";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilters,
} from "./transaction.types";
import {
  createTransaction,
  findAllTransactions,
  findTransactionById,
  updateTransaction,
  softDeleteTransaction,
} from "./transaction.repository";

export const addTransaction = async (
  input: CreateTransactionInput,
  userId: string
) => {
  return createTransaction({
    amount: input.amount,
    type: input.type as TransactionType,
    category: input.category,
    date: new Date(input.date),
    notes: input.notes,
    createdById: userId,
  });
};

export const getTransactions = async (filters: TransactionFilters) => {
  return findAllTransactions(filters);
};

export const getTransactionById = async (id: string) => {
  const transaction = await findTransactionById(id);
  if (!transaction) throw new ApiError(404, "Transaction not found");
  return transaction;
};

export const editTransaction = async (
  id: string,
  input: UpdateTransactionInput
) => {
  const transaction = await findTransactionById(id);
  if (!transaction) throw new ApiError(404, "Transaction not found");

  return updateTransaction(id, {
    ...(input.amount !== undefined && { amount: input.amount }),
    ...(input.type && { type: input.type as TransactionType }),
    ...(input.category && { category: input.category }),
    ...(input.date && { date: new Date(input.date) }),
    ...(input.notes !== undefined && { notes: input.notes }),
  });
};

export const removeTransaction = async (id: string) => {
  const transaction = await findTransactionById(id);
  if (!transaction) throw new ApiError(404, "Transaction not found");
  return softDeleteTransaction(id);
};