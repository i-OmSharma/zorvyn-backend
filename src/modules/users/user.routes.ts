import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import {
  getUsers,
  getUser,
  updateRole,
  updateStatus,
  deleteUserHandler,
} from "./user.controller";

export const userRouter = Router();

// All user routes — Admin only
userRouter.use(authenticate, authorize("ADMIN"));

userRouter.get("/", getUsers);
userRouter.get("/:id", getUser);
userRouter.patch("/:id/role", updateRole);
userRouter.patch("/:id/status", updateStatus);
userRouter.delete("/:id", deleteUserHandler);