import { z } from "zod";

export const createVehicleSchema = z.object({
  year: z.number().int(),
  make: z.string(),
  model: z.string(),
  vin: z.string(),
  license_plate: z.string(),
});

export type CreateVehicleType = z.infer<typeof createVehicleSchema>;
