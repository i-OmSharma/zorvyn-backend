import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import { ApiError } from "../../utils/ApiError";
import { RegisterInput, LoginInput, TokenPair, AuthUser } from "./auth.types";

const generateTokens = async (userId: string): Promise<TokenPair> => {
  const accessToken = jwt.sign({ userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

  const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

  // Store refresh token in DB
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 3);

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: userId, expiresAt },
  });

  return { accessToken, refreshToken };
};

export const registerUser = async (
  input: RegisterInput
): Promise<{ user: AuthUser; tokens: TokenPair }> => {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) throw new ApiError(409, "Email already registered");

  const hashedPassword = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  const tokens = await generateTokens(user.id);

  return { user, tokens };
};

export const loginUser = async (
  input: LoginInput
): Promise<{ user: AuthUser; tokens: TokenPair }> => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) throw new ApiError(401, "Invalid email or password");
  if (user.status === "INACTIVE") throw new ApiError(403, "Account is inactive");

  const isMatch = await bcrypt.compare(input.password, user.password);
  if (!isMatch) throw new ApiError(401, "Invalid email or password");

  const tokens = await generateTokens(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    tokens,
  };
};

export const refreshTokens = async (
  token: string
): Promise<TokenPair> => {
  let decoded: { userId: string };

  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { token },
  });

  if (!stored) throw new ApiError(401, "Refresh token not recognized");
  if (stored.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { token } });
    throw new ApiError(401, "Refresh token expired");
  }

  // Rotate — delete old, issue new
  await prisma.refreshToken.delete({ where: { token } });

  return generateTokens(decoded.userId);
};

export const logoutUser = async (token: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({ where: { token } });
};