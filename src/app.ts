import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware";
import { authRouter } from "./modules/auth/auth.routes";
import { userRouter } from "./modules/users/user.routes";
import { transactionRouter } from "./modules/transactions/transaction.routes";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes";

export const createApp = () => {
  const app = express();

  // Security & utility middleware
  app.use(helmet());
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/health", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Finance API is running",
      timestamp: new Date().toISOString(),
    });
  });

  // Routes
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/transactions", transactionRouter);
  app.use("/api/dashboard", dashboardRouter);

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  });

  // Global error handler — must be last
  app.use(errorHandler);

  return app;
};