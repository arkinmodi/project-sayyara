import exclude from "@server/common/excludeField";
import { prisma, WorkOrderStatus } from "@server/db/client";
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
  const workOrder = await prisma.workOrder.findUnique({
    where: { id },
    include: {
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
    where: { shop_id: shopId },
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
  appointment_id: z.string().optional(),
  employee_id: z.string().optional(),
  employee_email: z.string().email().optional(),
  status: z.nativeEnum(WorkOrderStatus).optional(),
});

export type UpdateWorkOrderType = z.infer<typeof updateWorkOrderSchema>;

export const updateWorkOrderById = async (
  id: string,
  patch: UpdateWorkOrderType
) => {
  const workOrder = await prisma.workOrder.findUnique({ where: { id } });
  if (!workOrder) return Promise.reject("Work Order not found.");

  let employee: { connect: { id: string } } | undefined;
  if (patch.employee_id) {
    employee = { connect: { id: patch.employee_id } };
  } else if (patch.employee_email) {
    employee = { connect: { id: patch.employee_email } };
  } else {
    employee = undefined;
  }

  const appointment = patch.appointment_id
    ? { connect: { id: patch.appointment_id } }
    : undefined;

  return await prisma.workOrder.update({
    where: { id },
    data: {
      title: patch.title,
      body: patch.body,
      status: patch.status,
      employee: employee,
      appointment: appointment,
    },
  });
};

export const deleteWorkOrderById = async (id: string) => {
  return await prisma.workOrder.delete({ where: { id } });
};
