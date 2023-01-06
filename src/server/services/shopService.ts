import { z } from "zod";

export const createShopSchema = z.object({});

export type CreateShopType = z.infer<typeof createShopSchema>;
