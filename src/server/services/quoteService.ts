import exclude from "@server/common/excludeField";
import { prisma, QuoteStatus } from "@server/db/client";
import { z } from "zod";

export const createQuoteSchema = z.object({
  customerId: z.string(),
  shopId: z.string(),
  serviceId: z.string(),
});

export type CreateQuoteType = z.infer<typeof createQuoteSchema>;

export const createQuote = async (quote: CreateQuoteType) => {
  const data = await prisma.quote.create({
    data: {
      customer: { connect: { id: quote.customerId } },
      shop: { connect: { id: quote.shopId } },
      service: { connect: { id: quote.serviceId } },
    },
    include: { service: true, customer: true, shop: true },
  });

  exclude(data.customer, ["password"]);
  return data;
};

export const getQuoteById = async (id: string) => {
  const data = await prisma.quote.findUnique({
    where: { id },
    include: { service: true, customer: true, shop: true },
  });

  if (data) {
    exclude(data.customer, ["password"]);
  }
  return data;
};

export const getQuotesByCustomerId = async (customerId: string) => {
  const data = await prisma.quote.findMany({
    where: { customerId },
    include: { service: true, customer: true, shop: true },
    orderBy: { updateTime: "desc" },
  });

  data.forEach((item) => {
    exclude(item.customer, ["password"]);
  });
  return data;
};

export const getQuotesByShopId = async (shopId: string) => {
  const data = await prisma.quote.findMany({
    where: { shopId },
    include: { service: true, customer: true, shop: true },
    orderBy: { updateTime: "desc" },
  });

  data.forEach((item) => {
    exclude(item.customer, ["password"]);
  });
  return data;
};

export const deleteQuoteAndChatById = async (id: string) => {
  const deleteChatMessages = prisma.chatMessage.deleteMany({
    where: { quoteId: id },
  });
  const deleteQuote = prisma.quote.delete({ where: { id } });
  await prisma.$transaction([deleteChatMessages, deleteQuote]);
};

export const updateQuoteSchema = z.object({
  description: z.string().optional(),
  estimatedPrice: z.number().optional(), //float
  duration: z.number().optional(), // float
  status: z.nativeEnum(QuoteStatus).optional(), // enum of Quote status
});
export type UpdateQuoteType = z.infer<typeof updateQuoteSchema>;

export const updateQuoteById = async (id: string, patch: UpdateQuoteType) => {
  const quote = await getQuoteById(id);
  if (!quote) return Promise.reject("Quote not found.");

  return await prisma.quote.update({
    where: { id },
    data: {
      description: patch.description,
      estimatedPrice: patch.estimatedPrice,
      duration: patch.duration,
      status: patch.status,
    },
    include: { service: true, customer: true, shop: true },
  });
};
