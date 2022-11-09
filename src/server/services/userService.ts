import { prisma, UserType } from "@server/db/client";
import { z } from "zod";

export const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  type: z.nativeEnum(UserType),
  shop: z.string().optional(),
});
export type CreateUserInputType = z.infer<typeof registrationSchema>;

export const createUser = async (user: CreateUserInputType) => {
  if (user.type === "CUSTOMER") {
    return await prisma.customer.create({
      data: {
        ...user,
      },
    });
  } else {
    const shop = user.shop
      ? { shop: { connect: { id: user.shop } } }
      : { shop: {} };

    return await prisma.employee.create({
      data: {
        ...user,
        ...shop,
      },
    });
  }
};

export const getUser = async (email: string) => {
  if (!email) return null;
  const user = await prisma.customer.findUnique({ where: { email } });
  return user ?? (await prisma.employee.findUnique({ where: { email } }));
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
    type: userData.type,
  };
};
