import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    status: string;
  };
}

export const authenticate = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Access token missing");
    }

    const token = authHeader.split(" ")[1];

    let decoded: { userId: string };

    try {
      decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string };
    } catch {
      throw new ApiError(401, "Invalid or expired access token");
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, status: true },
    });

    if (!user) throw new ApiError(401, "User no longer exists");
    if (user.status === "INACTIVE") throw new ApiError(403, "Account is inactive");

    req.user = user;
    next();
  }
);