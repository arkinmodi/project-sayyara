import {
  Customer,
  Employee,
  PrismaClient,
  Service,
  Shop,
  Vehicle,
} from "@prisma/client";
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
  quantity: z.number().int().optional(),
  cost: z.number().optional(),
  name: z.string().optional(),
  condition: z.enum(["NEW", "USED", "NEW OR USED"]),
  build: z.enum(["OEM", "AFTERMARKET", "OEM OR AFTERMARKET"]),
});

const operatingDaySchema = z.object({
  isOpen: z.boolean(),
  openTime: z.string().datetime({ precision: 3 }),
  closeTime: z.string().datetime({ precision: 3 }),
});

export const hoursOfOperationSchema = z.object({
  monday: operatingDaySchema,
  tuesday: operatingDaySchema,
  wednesday: operatingDaySchema,
  thursday: operatingDaySchema,
  friday: operatingDaySchema,
  saturday: operatingDaySchema,
  sunday: operatingDaySchema,
});

export type PartType = z.infer<typeof partSchema>;

export type ServiceWithPartsType = {
  parts: PartType[];
} & Service;

export type CustomerWithVehiclesType = {
  vehicles: Vehicle[];
} & Customer;

export type EmployeeWithShopType = {
  shop: Shop;
} & Employee;
