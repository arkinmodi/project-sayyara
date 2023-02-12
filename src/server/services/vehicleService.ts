import { prisma } from "@server/db/client";
import { z } from "zod";

export const createVehicleSchema = z.object({
  year: z.number().int(),
  make: z.string(),
  model: z.string(),
  vin: z.string(),
  license_plate: z.string(),
});

export type CreateVehicleType = z.infer<typeof createVehicleSchema>;

export const getVehicleById = async (id: string) => {
  return prisma.vehicle.findUnique({ where: { id } });
};

export const getVehicleByCustomerId = async (customer_id: string) => {
  return prisma.vehicle.findMany({ where: { customer_id } });
};
