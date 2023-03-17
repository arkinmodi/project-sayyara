import { EmployeeStatus, prisma } from "@server/db/client";
import { getEmployeeById } from "@server/services/userService";
import { z } from "zod";

export const getEmployeesByShopId = async (shopId: string) => {
  return await prisma.employee.findMany({ where: { shopId } });
};

export const updateEmployeeSchema = z.object({
  status: z.nativeEnum(EmployeeStatus).optional(),
});

export type UpdateEmployeeType = z.infer<typeof updateEmployeeSchema>;

export const updateEmployeeById = async (
  id: string,
  patch: UpdateEmployeeType
) => {
  const employee = await getEmployeeById(id);
  if (!employee) return Promise.reject("Employee not found.");

  return await prisma.employee.update({
    where: { id },
    data: {
      status: patch.status,
    },
  });
};
