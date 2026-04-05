import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { updateRoleSchema, updateStatusSchema } from "./user.schema";
import {
  getAllUsers,
  getUserById,
  changeUserRole,
  changeUserStatus,
  removeUser,
} from "./user.service";
import { Role, Status } from "@prisma/client";

const getParam = (param: string | string[]): string => Array.isArray(param) ? param[0] : param;

export const getUsers = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const users = await getAllUsers();
  sendResponse(res, {
    statusCode: 200,
    message: "Users fetched successfully",
    data: users,
  });
});

export const getUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await getUserById(getParam(req.params.id));
  sendResponse(res, {
    statusCode: 200,
    message: "User fetched successfully",
    data: user,
  });
});

export const updateRole = asyncHandler(async (req: AuthRequest, res: Response) => {
  const parsed = updateRoleSchema.safeParse(req);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.errors[0].message);
  }
  const user = await changeUserRole(getParam(req.params.id), parsed.data.body.role as Role);
  sendResponse(res, {
    statusCode: 200,
    message: "User role updated successfully",
    data: user,
  });
});

export const updateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const parsed = updateStatusSchema.safeParse(req);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.errors[0].message);
  }
  const user = await changeUserStatus(getParam(req.params.id), parsed.data.body.status as Status);
  sendResponse(res, {
    statusCode: 200,
    message: "User status updated successfully",
    data: user,
  });
});

export const deleteUserHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Not authenticated");
  await removeUser(getParam(req.params.id), req.user.id);
  sendResponse(res, {
    statusCode: 200,
    message: "User deleted successfully",
    data: null,
  });
});