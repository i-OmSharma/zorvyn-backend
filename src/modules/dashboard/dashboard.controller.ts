import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/ApiResponse";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { getSummary, getCategoryTotals, getMonthlyTrends } from "./dashboard.service";

export const summary = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const data = await getSummary();
  sendResponse(res, {
    statusCode: 200,
    message: "Dashboard summary fetched successfully",
    data,
  });
});

export const categoryTotals = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const data = await getCategoryTotals();
  sendResponse(res, {
    statusCode: 200,
    message: "Category totals fetched successfully",
    data,
  });
});

export const monthlyTrends = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const data = await getMonthlyTrends();
  sendResponse(res, {
    statusCode: 200,
    message: "Monthly trends fetched successfully",
    data,
  });
});