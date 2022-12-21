import { PrismaClient, Service } from "@prisma/client";
import { z } from "zod";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export * from "@prisma/client";

export const partSchema = z.object({
  quantity: z.number().int(),
  cost: z.number(),
  name: z.string(),
  condition: z.enum(["NEW", "USED"]),
  build: z.enum(["OEM", "AFTER MARKET"]),
});

export type PartType = z.infer<typeof partSchema>;

export type ServiceWithParts = {
  parts: PartType[];
} & Service;
