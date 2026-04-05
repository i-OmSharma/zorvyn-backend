import { z } from "zod";

export const createTransactionSchema = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be positive"),
    type: z.enum(["INCOME", "EXPENSE"]),
    category: z.string().min(1, "Category is required"),
    date: z.string().min(1, "Date is required"),
    notes: z.string().optional(),
  }),
});

export const updateTransactionSchema = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be positive").optional(),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    category: z.string().min(1, "Category is required").optional(),
    date: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const transactionFiltersSchema = z.object({
  query: z.object({
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    category: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});