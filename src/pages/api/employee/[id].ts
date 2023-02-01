import { Employee } from "@prisma/client";
import { getServerAuthSession } from "@server/common/getServerAuthSession";
import {
  updateEmployeeById,
  updateEmployeeSchema,
} from "@server/services/employeeManagementService";
import { getEmployeeById } from "@server/services/userService";
import { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";

const employeeByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid employee ID." });
    return;
  }

  const session = await getServerAuthSession({ req, res });
  if (!session) {
    res.status(403).json({ message: "Forbidden." });
    return;
  }

  let employee: Employee | null;

  switch (req.method) {
    case "GET":
      employee = await getEmployeeById(id);
      if (employee) {
        if (await isGetAuthorized(session, employee)) {
          res.status(200).json(employee);
        } else {
          res.status(403).json({ message: "Forbidden." });
        }
      } else {
        res.status(404).json({ message: "Employee not found." });
      }
      break;

    case "PATCH":
      if (!(await isPatchAuthorized(session, id))) {
        res.status(403).json({ message: "Forbidden." });
        return;
      }

      const patch = updateEmployeeSchema.safeParse(req.body);
      if (!patch.success) {
        res.status(400).json({ message: patch.error.issues });
        return;
      }

      employee = await updateEmployeeById(id, patch.data).catch((reason) => {
        if (reason === "Employee not found.") res.status(404);
        else res.status(500);
        res.json({ message: reason });
        return null;
      });

      if (employee) res.status(200).json(employee);
      break;

    default:
      res.status(405).json({ message: "Method not allowed." });
      break;
  }
};

const isGetAuthorized = async (session: Session, employee: Employee) => {
  if (session.user.type === "CUSTOMER") return false;

  const user = await getEmployeeById(session.user.id);
  if (!user) return false;

  return (
    (user.type === "SHOP_OWNER" && user.shop_id === employee.shop_id) ||
    user.id === employee.id
  );
};

const isPatchAuthorized = async (session: Session, id: string) => {
  if (session.user.type !== "SHOP_OWNER") return false;

  const user = await getEmployeeById(session.user.id);
  if (!user) return false;

  const employee = await getEmployeeById(id);
  if (!employee) return false;

  return user.shop_id === employee.shop_id;
};

export default employeeByIdHandler;
