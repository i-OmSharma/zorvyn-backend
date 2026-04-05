import { z } from "zod";

export const updateRoleSchema = z.object({
  body: z.object({
    role: z.enum(["VIEWER", "ANALYST", "ADMIN"], {
      errorMap: () => ({ message: "Role must be VIEWER, ANALYST or ADMIN" }),
    }),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(["ACTIVE", "INACTIVE"], {
      errorMap: () => ({ message: "Status must be ACTIVE or INACTIVE" }),
    }),
  }),
});