import {
  partSchema,
  prisma,
  ServiceType,
  ServiceWithPartsType,
} from "@server/db/client";
import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string(),
  description: z.string(),
  estimatedTime: z.number(),
  parts: z.array(partSchema).default([]),
  totalPrice: z.number(),
  shopId: z.string(),
  type: z.nativeEnum(ServiceType),
});
export type CreateServiceType = z.infer<typeof createServiceSchema>;

export const createService = async (service: CreateServiceType) => {
  return (await prisma.service.create({
    data: {
      name: service.name,
      description: service.description,
      estimatedTime: service.estimatedTime,
      totalPrice: service.totalPrice,
      parts: service.parts,
      type: service.type,
      shop: { connect: { id: service.shopId } },
    },
  })) as ServiceWithPartsType;
};

export const getServiceById = async (id: string) => {
  return (await prisma.service.findUnique({
    where: { id },
  })) as ServiceWithPartsType;
};

export const getServicesByShopId = async (shopId: string) => {
  return await prisma.service.findMany({ where: { shopId: shopId } });
};

export const getCannedServicesByShopId = async (shopId: string) => {
  return await prisma.service.findMany({
    where: { shopId: shopId, type: "CANNED" },
  });
};

export const getCustomServicesByShopId = async (shopId: string) => {
  return await prisma.service.findMany({
    where: { shopId: shopId, type: "CUSTOM" },
  });
};

// Since Parts are stored as a JSON array (without IDs), to update the list of parts, you need to
// send in the complete new list of parts, not just what you want to change
export const updateServiceSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  estimatedTime: z.number().optional(),
  parts: z.array(partSchema).optional(),
  totalPrice: z.number().optional(),
});
export type UpdateServiceType = z.infer<typeof updateServiceSchema>;

export const updateServiceById = async (
  id: string,
  patch: UpdateServiceType
) => {
  const service = await getServiceById(id);
  if (!service) return Promise.reject("Service not found.");
  return (await prisma.service.update({
    where: { id },
    data: patch,
  })) as ServiceWithPartsType;
};

export const deleteService = async (id: string) => {
  return await prisma.service.delete({ where: { id } });
};
