import { prisma } from "@server/db/client";
import { z } from "zod";

export const createQuoteSchema = z.object({
  customer_id: z.string(),
  shop_id: z.string(),
});

export type CreateQuoteType = z.infer<typeof createQuoteSchema>;

export const createQuote = async (quote: CreateQuoteType) => {
  return await prisma.quote.create({
    data: {
      customer: { connect: { id: quote.customer_id } },
      shop: { connect: { id: quote.shop_id } },
    },
  });
};

export const getQuoteById = async (id: string) => {
  return await prisma.quote.findUnique({ where: { id } });
};

export const getQuotesByCustomerId = async (customer_id: string) => {
  return await prisma.quote.findMany({ where: { customer_id } });
};

export const getQuotesByShopId = async (shop_id: string) => {
  return await prisma.quote.findMany({ where: { shop_id } });
};

export const deleteQuoteAndChatById = async (id: string) => {
  const deleteChatMessages = prisma.chatMessage.deleteMany({
    where: { quote_id: id },
  });
  const deleteQuote = prisma.quote.delete({ where: { id } });
  await prisma.$transaction([deleteChatMessages, deleteQuote]);
};
