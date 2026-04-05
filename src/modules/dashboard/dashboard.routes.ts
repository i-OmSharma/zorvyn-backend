import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { summary, categoryTotals, monthlyTrends } from "./dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.use(authenticate);

// All roles
dashboardRouter.get("/summary", summary);

// Analyst and Admin only
dashboardRouter.get("/categories", authorize("ADMIN", "ANALYST"), categoryTotals);
dashboardRouter.get("/trends", authorize("ADMIN", "ANALYST"), monthlyTrends);