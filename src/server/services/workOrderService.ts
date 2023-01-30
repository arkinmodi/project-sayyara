import { prisma } from "@server/db/client";
import { z } from "zod";

export const createWorkOrderSchema = z.object({
  title: z.string(),
  body: z.string(),
  appointment_id: z.string().optional(),
  customer_id: z.string(),
  vehicle_id: z.string(),
  employee_id: z.string().optional(),
  shop_id: z.string(),
});
export type CreateWorkOrderType = z.infer<typeof createWorkOrderSchema>;

export const createWorkOrder = async (workOrder: CreateWorkOrderType) => {
  const employee = workOrder.employee_id
    ? { employee: { connect: { id: workOrder.employee_id } } }
    : { employee: {} };

  return await prisma.workOrder.create({
    data: {
      title: workOrder.title,
      body: workOrder.body,
      shop: { connect: { id: workOrder.shop_id } },
      customer: { connect: { id: workOrder.customer_id } },
      vehicle: { connect: { id: workOrder.vehicle_id } },
      ...employee,
    },
  });
};

export const getWorkOrderById = async (id: string) => {
  return await prisma.workOrder.findUnique({
    where: { id },
    include: {
      customer: true,
      vehicle: true,
      employee: true,
    },
  });
};

export const getWorkOrdersByShopId = async (shopId: string) => {
  return await prisma.workOrder.findMany({
    where: { shop_id: shopId },
    include: {
      customer: true,
      vehicle: true,
      employee: true,
    },
  });
};

export const updateWorkOrderSchema = z.object({
  title: z.string().optional(),
  body: z.string().optional(),
  appointment_id: z.string().optional(),
  employee_id: z.string().optional(),
});
export type UpdateWorkOrderType = z.infer<typeof updateWorkOrderSchema>;

export const updateWorkOrderById = async (
  id: string,
  patch: UpdateWorkOrderType
) => {
  const workOrder = await prisma.workOrder.findUnique({ where: { id } });
  if (!workOrder) return Promise.reject("Work Order not found.");

  const employee = patch.employee_id
    ? { connect: { id: patch.employee_id } }
    : undefined;

  const appointment = patch.appointment_id
    ? { connect: { id: patch.appointment_id } }
    : undefined;

  return await prisma.workOrder.update({
    where: { id },
    data: {
      title: patch.title,
      body: patch.body,
      employee: employee,
      appointment: appointment,
    },
  });
};

export const deleteWorkOrderById = async (id: string) => {
  return await prisma.workOrder.delete({ where: { id } });
};