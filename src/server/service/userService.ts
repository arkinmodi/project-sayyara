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

export const authorize = async (email: string, password: string) => {
  const userData = await getUser(email);

  if (!userData) return Promise.reject("user not found");
  if (userData.password !== password) return Promise.reject("unauthorized");

  return {
    id: userData.id,
    firstName: userData.first_name,
    lastName: userData.last_name,
    email: userData.email,
  };
};
