import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import {
  createTransaction,
  getTransactionList,
  getTransaction,
  updateTransaction,
  deleteTransaction,
} from "./transaction.controller";

export const transactionRouter = Router();

// All routes require authentication
transactionRouter.use(authenticate);

// All roles can view
transactionRouter.get("/", getTransactionList);
transactionRouter.get("/:id", getTransaction);

// Analyst and Admin can create and update
transactionRouter.post("/", authorize("ADMIN", "ANALYST"), createTransaction);
transactionRouter.patch("/:id", authorize("ADMIN", "ANALYST"), updateTransaction);

// Only Admin can delete
transactionRouter.delete("/:id", authorize("ADMIN"), deleteTransaction);