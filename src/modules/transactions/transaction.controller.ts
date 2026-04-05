import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionFiltersSchema,
} from "./transaction.schema";
import {
  addTransaction,
  getTransactions,
  getTransactionById,
  editTransaction,
  removeTransaction,
} from "./transaction.service";

export const createTransaction = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const parsed = createTransactionSchema.safeParse(req);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.errors[0].message);
    }

    const transaction = await addTransaction(parsed.data.body, req.user.id);

    sendResponse(res, {
      statusCode: 201,
      message: "Transaction created successfully",
      data: transaction,
    });
  }
);

export const getTransactionList = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const parsed = transactionFiltersSchema.safeParse(req);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.errors[0].message);
    }

    const { type, category, startDate, endDate, page, limit } =
      parsed.data.query;

    const result = await getTransactions({
      type: type as "INCOME" | "EXPENSE" | undefined,
      category,
      startDate,
      endDate,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    });

    sendResponse(res, {
      statusCode: 200,
      message: "Transactions fetched successfully",
      data: result,
    });
  }
);

export const getTransaction = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const transaction = await getTransactionById(req.params.id as string);
    sendResponse(res, {
      statusCode: 200,
      message: "Transaction fetched successfully",
      data: transaction,
    });
  }
);

export const updateTransaction = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const parsed = updateTransactionSchema.safeParse(req);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.errors[0].message);
    }

    const transaction = await editTransaction(
      req.params.id as string,
      parsed.data.body
    );

    sendResponse(res, {
      statusCode: 200,
      message: "Transaction updated successfully",
      data: transaction,
    });
  }
);

export const deleteTransaction = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await removeTransaction(req.params.id as string);
    sendResponse(res, {
      statusCode: 200,
      message: "Transaction deleted successfully",
      data: null,
    });
  }
);