import { getServerAuthSession } from "@server/common/getServerAuthSession";
import {
  createChatMessage,
  createChatMessageSchema,
  getChatMessagesByQuoteId,
} from "@server/services/chatService";
import { getEmployeeById } from "@server/services/employeeManagementService";
import { getQuoteById } from "@server/services/quoteService";
import { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";

const chatHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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

  switch (req.method) {
    case "GET":
      const messages = await getChatMessagesByQuoteId(id);
      if (messages.length > 0 && messages[0]) {
        if (await isAuthorized(session, id)) {
          res.status(200).json(messages);
        } else {
          res.status(403).json({ message: "Forbidden." });
        }
      } else {
        res.status(200).json([]);
      }
      break;

    case "POST":
      const result = createChatMessageSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ message: result.error.issues });
        return;
      }

      const newMessage = await createChatMessage(result.data, id).catch(
        (reason) => {
          if (reason === "Missing sender information.") res.status(400);
          else res.status(500);
          res.json({ message: reason });
          return null;
        }
      );
      if (newMessage) res.status(201).json(newMessage);
      break;

    default:
      res.status(405).json({ message: "Method not allowed." });
      break;
  }
};

const isAuthorized = async (session: Session, quoteId: string) => {
  const quote = await getQuoteById(quoteId);
  if (!quote) return false;

  if (session.user.type === "CUSTOMER") {
    return session.user.id === quote.customer_id;
  } else {
    const user = await getEmployeeById(session.user.id);
    if (!user) return false;
    return user.shop_id === quote.shop_id;
  }
};

export default chatHandler;
