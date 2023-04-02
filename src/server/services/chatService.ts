import { prisma } from "@server/db/client";
import { z } from "zod";

export const createChatMessageSchema = z.object({
  customerId: z.string().optional().nullable(),
  shopId: z.string().optional().nullable(),
  message: z.string(),
});

export type CreateChatMessageType = z.infer<typeof createChatMessageSchema>;

/**
 * Create a chat message
 *
 * @author Arkin Modi <16737086+arkinmodi@users.noreply.github.com>
 * @date 01/11/2023
 * @param {CreateChatMessageType} message - Chat message data
 * @param {string} quoteId - Quote ID
 * @returns Chat message object
 */
export const createChatMessage = async (
  message: CreateChatMessageType,
  quoteId: string
) => {
  if (!message.customerId && !message.shopId) {
    return Promise.reject("Missing sender information.");
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

/**
 * Get list of chat messages by quote ID
 *
 * @author Arkin Modi <16737086+arkinmodi@users.noreply.github.com>
 * @date 03/17/2023
 * @param {string} quoteId - Quote ID
 * @returns List of chat message objects
 */
export const getChatMessagesByQuoteId = async (quoteId: string) => {
  return await prisma.chatMessage.findMany({
    where: { quoteId },
    orderBy: { createTime: "desc" },
  });
};
