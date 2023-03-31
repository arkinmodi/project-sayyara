import { prisma } from "@server/db/client";
import { z } from "zod";

export const createVehicleSchema = z.object({
  year: z.number().int(),
  make: z.string(),
  model: z.string(),
  vin: z.string(),
  licensePlate: z.string(),
});

export type CreateVehicleType = z.infer<typeof createVehicleSchema>;

/**
 * Get vehicle by ID
 *
 * @author Arkin Modi <16737086+arkinmodi@users.noreply.github.com>
 * @date 01/28/2023
 * @param {string} id - Vehicle ID
 * @returns Vehicle object
 */
export const getVehicleById = async (id: string) => {
  return prisma.vehicle.findUnique({ where: { id } });
};

/**
 * Get list of vehicle by customer ID
 *
 * @author Arkin Modi <16737086+arkinmodi@users.noreply.github.com>
 * @date 03/17/2023
 * @param {string} customerId - Customer ID
 * @returns Vehicle object
 */
export const getVehicleByCustomerId = async (customerId: string) => {
  return prisma.vehicle.findMany({ where: { customerId } });
};
