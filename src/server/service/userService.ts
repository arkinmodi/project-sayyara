import { z } from "zod";

import { prisma } from "@server/db/client";

export const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});
export type CreateUserInputType = z.infer<typeof registrationSchema>;

export const createUser = async (user: CreateUserInputType) => {
  return await prisma.user.create({
    data: {
      ...user,
      accounts: {
        create: [
          {
            type: "Test",
          },
        ],
      },
    },
  });
};

export const getUser = async (email: string) => {
  if (!email) return null;
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};
