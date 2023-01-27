import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { getEmployeesByShopId } from "@server/services/employeeManagementService";
import { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";

const employeeByShopIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid Shop ID." });
    return;
  }

  const session = await getServerAuthSession({ req, res });
  if (!session) {
    res.status(403).json({ message: "Forbidden." });
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  const employees = await getEmployeesByShopId(id);
  if (employees.length > 0 && employees[0]) {
    if (await isAuthorized(session, id)) {
      res.status(200).json(employees);
    } else {
      res.status(403).json({ message: "Forbidden." });
    }
  } else {
    res.status(200).json([]);
  }
};

// TODO: enable this when shop profiles can be fetched
const isAuthorized = async (session: Session, shopId: string) => {
  return true;

  // if (session.user.type === "CUSTOMER") return false;

  // const shop = await getShopByEmployeeId(session.user.id);
  // OR
  // const shop = await getShopByEmployeeEmail(session.user.email);

  // return shop.id === shopId;
};

export default employeeByShopIdHandler;
