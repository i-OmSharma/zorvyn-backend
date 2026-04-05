import { Role, Status } from "@prisma/client";
import { ApiError } from "../../utils/ApiError";
import {
  findAllUsers,
  findUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
} from "./user.repository";

export const getAllUsers = async () => {
  return findAllUsers();
};

export const getUserById = async (id: string) => {
  const user = await findUserById(id);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

export const changeUserRole = async (id: string, role: Role) => {
  const user = await findUserById(id);
  if (!user) throw new ApiError(404, "User not found");
  return updateUserRole(id, role);
};

export const changeUserStatus = async (id: string, status: Status) => {
  const user = await findUserById(id);
  if (!user) throw new ApiError(404, "User not found");
  return updateUserStatus(id, status);
};

export const removeUser = async (id: string, requestingUserId: string) => {
  const user = await findUserById(id);
  if (!user) throw new ApiError(404, "User not found");
  if (id === requestingUserId)
    throw new ApiError(400, "You cannot delete your own account");
  return deleteUser(id);
};