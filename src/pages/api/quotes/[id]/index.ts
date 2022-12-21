import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { Quote } from "@server/db/client";
import {
  deleteQuoteAndChatById,
  getQuoteById,
} from "@server/services/quoteService";
import { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";

const quoteByIdHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid Quote ID." });
    return;
  }

  const session = await getServerAuthSession({ req, res });
  if (!session) {
    res.status(403).json({ message: "Forbidden." });
    return;
  }

  let quote: Quote | null;

  switch (req.method) {
    case "GET":
      quote = await getQuoteById(id);
      if (quote) {
        if (await isAuthorized(session, quote.customer_id, quote.shop_id)) {
          res.status(200).json(quote);
        } else {
          res.status(403).json({ message: "Forbidden." });
        }
      } else {
        res.status(404).json({ message: "Quote not found." });
      }
      break;

    case "PATCH":
      break;

    case "DELETE":
      quote = await getQuoteById(id);
      if (!quote) {
        res.status(404).json({ message: "Quote not found." });
        return;
      }

      if (!(await isAuthorized(session, quote.customer_id, quote.shop_id))) {
        res.status(403).json({ message: "Forbidden." });
        return;
      }

      await deleteQuoteAndChatById(id);
      res.status(204).end();
      break;

    default:
      res.status(405).json({ message: "Method not allowed." });
      break;
  }
};

// TODO: enable this when shop profiles can be fetched
const isAuthorized = async (
  session: Session,
  customerId: string,
  shopId: string
) => {
  return true;

  // if (session.user.type === "CUSTOMER") return session.user.id === customerId;

  // const shop = await getShopByEmployeeId(session.user.id);
  // OR
  // const shop = await getShopByEmployeeEmail(session.user.email);

  // return shop.id === shopId;
};

export default quoteByIdHandler;
