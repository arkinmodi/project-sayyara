import { getServerAuthSession } from "@server/common/getServerAuthSession";
import {
  createChatMessage,
  createChatMessageSchema,
  getChatMessages,
} from "@server/services/chatService";
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
      const messages = await getChatMessages(id);
      if (messages.length > 0 && messages[0]) {
        const customerId = messages[0].customer_id;
        const shopId = messages[0].shop_id;

        if (await isAuthorized(session, customerId, shopId)) {
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

      const newMessage = await createChatMessage(result.data);
      res.status(201).json(newMessage);
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

export default chatHandler;
