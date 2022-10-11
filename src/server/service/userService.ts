import { z } from "zod";

import { prisma } from "@server/db/client";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  callbackUrl: z.string().optional(),
});
type RegisterInputType = z.infer<typeof registerSchema>;

export const register = async (user: RegisterInputType) => {
  return await prisma.user.create({
    data: {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      password: user.password,
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
