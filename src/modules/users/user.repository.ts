import { prisma } from "../../config/prisma";
import { Role, Status } from "@prisma/client";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
};

export const findAllUsers = async () => {
  return prisma.user.findMany({
    select: userSelect,
    orderBy: { createdAt: "desc" },
  });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });
};

export const updateUserRole = async (id: string, role: Role) => {
  return prisma.user.update({
    where: { id },
    data: { role },
    select: userSelect,
  });
};

export const updateUserStatus = async (id: string, status: Status) => {
  return prisma.user.update({
    where: { id },
    data: { status },
    select: userSelect,
  });
};

export const deleteUser = async (id: string) => {
  return prisma.user.delete({
    where: { id },
  });
};