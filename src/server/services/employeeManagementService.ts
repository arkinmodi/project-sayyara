import exclude from "@server/common/excludeField";
import { EmployeeStatus, prisma } from "@server/db/client";
import { getEmployeeById } from "@server/services/userService";
import { z } from "zod";

/**
 * Get list of employees by shop ID
 *
 * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
 * @date 03/17/2023
 * @param {string} shopId - Shop ID
 * @returns List of employee objects
 */
export const getEmployeesByShopId = async (shopId: string) => {
  const employees = await prisma.employee.findMany({ where: { shopId } });
  employees.forEach((emp) => exclude(emp, ["password"]));
  return employees;
};

export const updateEmployeeSchema = z.object({
  status: z.nativeEnum(EmployeeStatus).optional(),
});

export type UpdateEmployeeType = z.infer<typeof updateEmployeeSchema>;

/**
 * Update employee by ID
 *
 * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
 * @date 01/27/2023
 * @param {string} id - Employee ID
 * @param {UpdateEmployeeType} patch - Update data
 * @returns Employee object
 */
export const updateEmployeeById = async (
  id: string,
  patch: UpdateEmployeeType
) => {
  const employee = await getEmployeeById(id);
  if (!employee) return Promise.reject("Employee not found.");

  const updatedEmployee = await prisma.employee.update({
    where: { id },
    data: {
      status: patch.status,
    },
  });

  exclude(updatedEmployee, ["password"]);
  return updatedEmployee;
};
