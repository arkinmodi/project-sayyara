import exclude from "@server/common/excludeField";
import { prisma } from "@server/db/client";
import { z } from "zod";

/**
 * Get work order by ID
 *
 * @author Arkin Modi <16737086+arkinmodi@users.noreply.github.com>
 * @date 02/08/2023
 * @param {string} id - Work order ID
 * @returns Work order object
 */
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
  if (workOrder) {
    exclude(workOrder.customer, ["password"]);
    if (workOrder.employee) {
      exclude(workOrder.employee, ["password"]);
    }
  }
  return workOrder;
};

/**
 * Get list of work orders by shop ID
 *
 * @author Arkin Modi <16737086+arkinmodi@users.noreply.github.com>
 * @date 02/08/2023
 * @param {string} shopId - Shop ID
 * @returns List of work order objects
 */
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
    exclude(workOrder.customer, ["password"]);
    if (workOrder.employee) {
      exclude(workOrder.employee, ["password"]);
    }
  }
  return workOrders;
};

export const updateWorkOrderSchema = z.object({
  title: z.string().optional(),
  body: z.string().optional(),
  employeeId: z.string().optional(),
  employeeEmail: z.string().email().optional(),
});

export type UpdateWorkOrderType = z.infer<typeof updateWorkOrderSchema>;

/**
 * Update work order by ID
 *
 * @author Arkin Modi <16737086+arkinmodi@users.noreply.github.com>
 * @date 02/08/2023
 * @param {string} id - Work order ID
 * @param {UpdateWorkOrderType} patch - Update data
 * @returns Work order object
 */
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

  return await prisma.workOrder.update({
    where: { id },
    data: {
      title: patch.title,
      body: patch.body,
      employee: employee,
    },
  });
};

/**
 * Delete work order by ID
 *
 * @author Arkin Modi <16737086+arkinmodi@users.noreply.github.com>
 * @date 02/08/2023
 * @param {string} id - Work order ID
 * @returns Work order object
 */
export const deleteWorkOrderById = async (id: string) => {
  return await prisma.workOrder.delete({ where: { id } });
};
