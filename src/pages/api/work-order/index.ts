import { getServerAuthSession } from "@server/common/getServerAuthSession";
import {
  createWorkOrder,
  createWorkOrderSchema,
} from "@server/services/workOrderService";
import { NextApiRequest, NextApiResponse } from "next";

const workOrderHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  const session = await getServerAuthSession({ req, res });
  if (!session) {
    res.status(403).json({ message: "Forbidden." });
    return;
  }

  const result = createWorkOrderSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: result.error.issues });
    return;
  }

  const newWorkOrder = await createWorkOrder(result.data);
  res.status(201).json(newWorkOrder);
};

export default workOrderHandler;
