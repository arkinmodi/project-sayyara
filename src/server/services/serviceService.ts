import { prisma } from "@server/db/client";
import { z } from "zod";

const createPartSchema = z.object({
  quantity: z.number().int(),
  cost: z.number(),
  name: z.string(),
});

export const createServiceSchema = z.object({
  name: z.string(),
  description: z.string(),
  estimated_time: z.number().int(),
  parts: z.array(createPartSchema).optional(),
  total_price: z.number(),
  // shop_id: z.string(),
});
export type CreateServiceType = z.infer<typeof createServiceSchema>;

export const createService = async (service: CreateServiceType) => {
  const parts = service.parts ? { create: [...service.parts] } : { create: [] };

  return await prisma.service.create({
    data: {
      name: service.name,
      description: service.description,
      estimated_time: service.estimated_time,
      total_price: service.total_price,
      // shop: { connect: { id: service.shop_id } },
    },
  });
};

export const getServiceById = async (id: string) => {
  return await prisma.service.findUnique({
    where: { id },
  });
};

// export const getServicesByShopId = async (shopId: string) => {
//   return await prisma.service.findMany({ where: { shop_id: shopId } });
// };

const updatePartSchema = z.object({
  id: z.string(),
  quantity: z.number().int().optional(),
  cost: z.number().optional(),
  name: z.string().optional(),
});

export const updateServiceSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  estimated_time: z.number().int().optional(),
  parts: z.array(updatePartSchema).optional(),
  total_price: z.number().optional(),
});
export type UpdateServiceType = z.infer<typeof updateServiceSchema>;

export const updateServiceById = async (
  id: string,
  patch: UpdateServiceType
) => {
  const service = await getServiceById(id);
  if (!service) return Promise.reject("Service not found.");

  return await prisma.service.update({
    where: { id },
    data: {
      name: patch.name,
      description: patch.description,
      estimated_time: patch.estimated_time,
      total_price: patch.total_price,
    },
  });
};

export const deleteService = async (id: string) => {
  return await prisma.service.delete({ where: { id } });
};
