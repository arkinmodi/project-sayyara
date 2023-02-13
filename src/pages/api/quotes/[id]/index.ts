import { getServerAuthSession } from "@server/common/getServerAuthSession";
import {
  deleteQuoteAndChatById,
  getQuoteById,
  updateQuoteById,
  updateQuoteSchema,
} from "@server/services/quoteService";
import { getEmployeeById } from "@server/services/userService";
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

  let quote: Awaited<ReturnType<typeof getQuoteById>>;

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

    case "PATCH":
      const patch = updateQuoteSchema.safeParse(req.body);
      if (!patch.success) {
        res.status(400).json({ message: patch.error.issues });
        return;
      }

      quote = await getQuoteById(id);

      if (!quote) {
        res.status(404).json({ message: "Quote not found." });
        return;
      }

      if (!(await isAuthorized(session, quote.customer_id, quote.shop_id))) {
        res.status(403).json({ message: "Forbidden." });
        return;
      }

      quote = await updateQuoteById(id, patch.data).catch((reason) => {
        if (reason === "Quote not found.") res.status(404);
        else res.status(500);
        res.json({ message: reason });
        return null;
      });
      if (quote) res.status(200).json(quote);
      break;

    default:
      res.status(405).json({ message: "Method not allowed." });
      break;
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

export default quoteByIdHandler;
