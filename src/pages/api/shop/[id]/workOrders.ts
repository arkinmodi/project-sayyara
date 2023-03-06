import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { getWorkOrdersByShopId } from "@server/services/workOrderService";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

const workOrdersByShopIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid Work Order ID." });
    return;
  }

  const session = await getServerAuthSession({ req, res });
  if (!session || !(await isAuthorized(session, id))) {
    res.status(403).json({ message: "Forbidden." });
    return;
  }

  const workOrders = await getWorkOrdersByShopId(id);
  res.status(200).json(workOrders);
};

const isAuthorized = async (session: Session, shopId: string) => {
  return session.user.shopId === shopId;
};

export default workOrdersByShopIdHandler;
