import { prisma } from "@server/db/client";
import { z } from "zod";

export const createChatMessageSchema = z.object({
  quote_id: z.string(),
  customer_id: z.string(),
  shop_id: z.string(),
});

export type CreateChatMessageType = z.infer<typeof createChatMessageSchema>;

export const createChatMessage = async (message: CreateChatMessageType) => {
  return await prisma.chatMessage.create({
    data: {
      quote: { connect: { id: message.quote_id } },
      shop: { connect: { id: message.shop_id } },
      customer: { connect: { id: message.customer_id } },
    },
  });
};

export const getChatMessages = async (quote_id: string) => {
  return await prisma.chatMessage.findMany({ where: { quote_id } });
};
