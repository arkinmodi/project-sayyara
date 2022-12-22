import { prisma } from "@server/db/client";
import { z } from "zod";

export const createChatMessageSchema = z.object({
  customer_id: z.string().optional(),
  shop_id: z.string().optional(),
  message: z.string(),
});

export type CreateChatMessageType = z.infer<typeof createChatMessageSchema>;

export const createChatMessage = async (
  message: CreateChatMessageType,
  quoteId: string
) => {
  if (!message.customer_id && !message.shop_id) {
    Promise.reject("Missing sender information.");
    return;
  }

  const customer = message.customer_id
    ? { customer: { connect: { id: message.customer_id } } }
    : { customer: {} };

  const shop = message.shop_id
    ? { shop: { connect: { id: message.shop_id } } }
    : { shop: {} };

  return await prisma.chatMessage.create({
    data: {
      message: message.message,
      quote: { connect: { id: quoteId } },
      ...shop,
      ...customer,
    },
  });
};

export const getChatMessagesByQuoteId = async (quote_id: string) => {
  return await prisma.chatMessage.findMany({
    where: { quote_id },
    orderBy: { create_time: "desc" },
  });
};
