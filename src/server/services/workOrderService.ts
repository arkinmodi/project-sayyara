import exclude from "@server/common/excludeField";
import { prisma } from "@server/db/client";
import { z } from "zod";

export const createWorkOrderSchema = z.object({
  title: z.string(),
  body: z.string(),
  appointmentId: z.string().optional(),
  customerId: z.string(),
  vehicleId: z.string(),
  employeeId: z.string().optional(),
  shopId: z.string(),
});

export type CreateWorkOrderType = z.infer<typeof createWorkOrderSchema>;

export const createWorkOrder = async (workOrder: CreateWorkOrderType) => {
  const employee = workOrder.employeeId
    ? { employee: { connect: { id: workOrder.employeeId } } }
    : { employee: {} };

  return await prisma.workOrder.create({
    data: {
      title: workOrder.title,
      body: workOrder.body,
      shop: { connect: { id: workOrder.shopId } },
      customer: { connect: { id: workOrder.customerId } },
      vehicle: { connect: { id: workOrder.vehicleId } },
      ...employee,
    },
  });
};

export const getWorkOrderById = async (id: string) => {
  const workOrder = await prisma.workOrder.findUnique({
    where: { id },
    include: {
      appointment: true,
      customer: true,
      vehicle: true,
      employee: true,
    },
  });
  if (workOrder && workOrder.employee) {
    exclude(workOrder.employee, ["password"]);
  }
  return workOrder;
};

export const getWorkOrdersByShopId = async (shopId: string) => {
  const workOrders = await prisma.workOrder.findMany({
    where: { shopId: shopId },
    include: {
      customer: true,
      vehicle: true,
      employee: true,
    },
  });

  for (const workOrder of workOrders) {
    if (workOrder && workOrder.employee) {
      exclude(workOrder.employee, ["password"]);
    }
  }
  return workOrders;
};

export const updateWorkOrderSchema = z.object({
  title: z.string().optional(),
  body: z.string().optional(),
  appointmentId: z.string().optional(),
  employeeId: z.string().optional(),
  employeeEmail: z.string().email().optional(),
});

export type UpdateWorkOrderType = z.infer<typeof updateWorkOrderSchema>;

export const updateWorkOrderById = async (
  id: string,
  patch: UpdateWorkOrderType
) => {
  const workOrder = await prisma.workOrder.findUnique({ where: { id } });
  if (!workOrder) return Promise.reject("Work Order not found.");

  let employee: { connect: { id?: string; email?: string } } | undefined;
  if (patch.employeeId) {
    employee = { connect: { id: patch.employeeId } };
  } else if (patch.employeeEmail) {
    employee = { connect: { email: patch.employeeEmail } };
  } else {
    employee = undefined;
  }

  const appointment = patch.appointmentId
    ? { connect: { id: patch.appointmentId } }
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
