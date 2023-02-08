import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { WorkOrder } from "@server/db/client";
import { getEmployeeById } from "@server/services/userService";
import {
  deleteWorkOrderById,
  getWorkOrderById,
  updateWorkOrderById,
  updateWorkOrderSchema,
} from "@server/services/workOrderService";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

const workOrderByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid Work Order ID." });
    return;
  }

  const session = await getServerAuthSession({ req, res });
  if (!session) {
    res.status(403).json({ message: "Forbidden." });
    return;
  }

  let workOrder: WorkOrder | null;

  switch (req.method) {
    case "GET":
      workOrder = await getWorkOrderById(id);
      if (workOrder) {
        res.status(200).json(workOrder);
      } else {
        res.status(404).json({ message: "Work Order not found." });
      }
      break;

    case "PATCH":
      const patch = updateWorkOrderSchema.safeParse(req.body);
      if (!patch.success) {
        res.status(400).json({ message: patch.error.issues });
        return;
      }

      workOrder = await updateWorkOrderById(id, patch.data).catch((reason) => {
        if (reason === "Work Order not found.") res.status(404);
        else res.status(500);
        res.json({ message: reason });
        return null;
      });
      if (workOrder) res.status(200).json(workOrder);
      break;

    case "DELETE":
      workOrder = await getWorkOrderById(id);
      if (workOrder && !(await isAuthorized(session, workOrder))) {
        res.status(403).json({ message: "Forbidden." });
        return;
      }

      await deleteWorkOrderById(id);
      res.status(204).end();
      break;

    default:
      res.status(405).json({ message: "Method not allowed." });
  }
};

const isAuthorized = async (session: Session, workOrder: WorkOrder) => {
  const employee = await getEmployeeById(session.user.id);
  return employee && employee.shop_id === workOrder.shop_id;
};

export default workOrderByIdHandler;
