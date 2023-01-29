import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { getQuotesByShopId } from "@server/services/quoteService";
import { getEmployeeById } from "@server/services/userService";
import { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";

const quoteByShopIdHandler = async (
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

  let quotes = await getQuotesByShopId(id);
  if (quotes.length > 0 && quotes[0]) {
    if (await isAuthorized(session, quotes[0].customer_id, quotes[0].shop_id)) {
      res.status(200).json(quotes);
    } else {
      res.status(403).json({ message: "Forbidden." });
    }
  } else {
    res.status(200).json([]);
  }
};

const isAuthorized = async (
  session: Session,
  customerId: string,
  shopId: string
) => {
  if (session.user.type === "CUSTOMER") return session.user.id === customerId;

  const user = await getEmployeeById(session.user.id);
  if (!user) return false;

  return user.shop_id === shopId;
};

export default quoteByShopIdHandler;
