import { prisma } from "@server/db/client";
import { z } from "zod";

export const createShopSchema = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  postal_code: z.string(),
  phone_number: z.string(),
});

export type CreateShopType = z.infer<typeof createShopSchema>;

export const createShop = async (shop: CreateShopType) => {
  return await prisma.shop.create({
    data: {
      name: shop.name,
      address: shop.address,
      city: shop.city,
      province: shop.province,
      postal_code: shop.postal_code,
      phone_number: shop.phone_number,
    },
  });
};

export const getShopById = async (id: string) => {
  return await prisma.shop.findUnique({ where: { id } });
};

export const updateShopSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  postal_code: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  phone_number: z.string().optional(),
  hours_of_operation: z
    .object({
      monday: z.object({
        isOpen: z.boolean(),
        openTime: z.date(),
        closeTime: z.date(),
      }),
      tuesday: z.object({
        isOpen: z.boolean(),
        openTime: z.date(),
        closeTime: z.date(),
      }),
      wednesday: z.object({
        isOpen: z.boolean(),
        openTime: z.date(),
        closeTime: z.date(),
      }),
      thursday: z.object({
        isOpen: z.boolean(),
        openTime: z.date(),
        closeTime: z.date(),
      }),
      friday: z.object({
        isOpen: z.boolean(),
        openTime: z.date(),
        closeTime: z.date(),
      }),
      saturday: z.object({
        isOpen: z.boolean(),
        openTime: z.date(),
        closeTime: z.date(),
      }),
      sunday: z.object({
        isOpen: z.boolean(),
        openTime: z.date(),
        closeTime: z.date(),
      }),
    })
    .optional(),
});
export type UpdateShopType = z.infer<typeof updateShopSchema>;

export const updateShopById = async (id: string, patch: UpdateShopType) => {
  const shop = await getShopById(id);
  if (!shop) return Promise.reject("Shop not found.");

  //   const now = new Date();
  //   if (
  //     (patch.start_time && patch.start_time < now) ||
  //     (patch.end_time && patch.end_time < now) ||
  //     (patch.start_time && patch.end_time && patch.start_time > patch.end_time)
  //   ) {
  //     return Promise.reject("Invalid start time and/or end time.");
  //   }

  //   if (
  //     appointment.status === "PENDING_APPROVAL" &&
  //     patch.status === "ACCEPTED"
  //   ) {
  //     await acceptAppointment(appointment);
  //   }

  //   const workOrderUpdate = patch.work_order_id
  //     ? { work_order: { connect: { id: patch.work_order_id } } }
  //     : {};

  //   const vehicleUpdate = patch.vehicle_id
  //     ? { vehicle: { connect: { id: patch.vehicle_id } } }
  //     : {};

  //   const employeeUpdate = patch.employee_id
  //     ? { employee: { connect: { id: patch.employee_id } } }
  //     : {};

  return await prisma.shop.update({
    where: { id },
    data: {
      name: patch.name,
      address: patch.address,
      postal_code: patch.postal_code,
      city: patch.city,
      province: patch.province,
      phone_number: patch.phone_number,
      hours_of_operation: patch.hours_of_operation,
    },
  });
};
