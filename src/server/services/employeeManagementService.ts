import { prisma } from "@server/db/client";

export const getAllEmployees = async (shopId: string) => {
  return await prisma.shop.findMany({
    where: { id: shopId },
    select: {
      employees: true,
    },
  });
};

export const getEmployeeById = async (employeeId: string) => {
  return await prisma.employee.findUnique({
    where: { id: employeeId },
  });
};

export const suspendEmployee = async (employeeId: string) => {
  const employee = await getEmployeeById(employeeId);
  if (!employee) return Promise.reject("Employee not found.");

  return await prisma.employee.update({
    where: { id: employeeId },
    data: {
      status: "SUSPENDED",
    },
  });
};
