import { getServerAuthSession } from "@server/common/getServerAuthSession";
import {
  getAllEmployees,
  getEmployeeById,
  suspendEmployee,
} from "@server/services/employeeManagementService";
import { NextApiRequest, NextApiResponse } from "next";

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

  switch (req.method) {
    case "GET":
      let employees = await getAllEmployees(id);
      if (employees) {
        res.status(200).json(employees);
      } else {
        res.status(404).json({ message: "employees for shop not found." });
      }
      break;

    case "PATCH":
      let employee = await getEmployeeById(id);

      if (!employee) {
        res.status(404).json({ message: "employee not found." });
        return;
      }

      if (session.user.type !== "SHOP_OWNER") {
        res.status(403).json({ message: "Forbidden." });
        return;
      }

      employee = await suspendEmployee(id).catch((reason) => {
        if (reason === "employee not found.") res.status(404);
        else res.status(500);
        res.json({ message: reason });
        return null;
      });
      if (employee) res.status(200).json(employee);
      break;

    default:
      res.status(405).json({ message: "Method not allowed." });
  }
};

export default employeeByIdHandler;
