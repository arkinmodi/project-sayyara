import { prisma } from "@server/db/client";
import { z } from "zod";

export const createChatMessageSchema = z.object({
  customerId: z.string().optional().nullable(),
  shopId: z.string().optional().nullable(),
  message: z.string(),
});

export type CreateChatMessageType = z.infer<typeof createChatMessageSchema>;

export const createChatMessage = async (
  message: CreateChatMessageType,
  quoteId: string
) => {
  if (!message.customerId && !message.shopId) {
    Promise.reject("Missing sender information.");
    return;
  }

  const customer = message.customerId
    ? { customer: { connect: { id: message.customerId } } }
    : { customer: {} };

  const shop = message.shopId
    ? { shop: { connect: { id: message.shopId } } }
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

export const getChatMessagesByQuoteId = async (quoteId: string) => {
  return await prisma.chatMessage.findMany({
    where: { quoteId },
    orderBy: { createTime: "desc" },
  });
};
