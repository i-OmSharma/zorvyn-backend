import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/ApiResponse";
import { registerSchema, loginSchema, refreshSchema } from "./auth.schema";
import { registerUser, loginUser, refreshTokens, logoutUser } from "./auth.service";
import { ApiError } from "../../utils/ApiError";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.errors[0].message);
  }

  const result = await registerUser(parsed.data.body);

  sendResponse(res, {
    statusCode: 201,
    message: "User registered successfully",
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.errors[0].message);
  }

  const result = await loginUser(parsed.data.body);

  sendResponse(res, {
    statusCode: 200,
    message: "Login successful",
    data: result,
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const parsed = refreshSchema.safeParse(req);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.errors[0].message);
  }

  const tokens = await refreshTokens(parsed.data.body.refreshToken);

  sendResponse(res, {
    statusCode: 200,
    message: "Tokens refreshed",
    data: tokens,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken: string };

  if (!refreshToken) throw new ApiError(400, "Refresh token is required");

  await logoutUser(refreshToken);

  sendResponse(res, {
    statusCode: 200,
    message: "Logged out successfully",
    data: null,
  });
});