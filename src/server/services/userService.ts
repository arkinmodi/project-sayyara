import { Customer, Employee, prisma } from "@server/db/client";
import { createShopSchema, getShopById } from "@server/services/shopService";
import { createVehicleSchema } from "@server/services/vehicleService";
import bcrypt from "bcrypt";
import { Session } from "next-auth";
import { z } from "zod";

export const createCustomerSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string(),
  vehicle: createVehicleSchema,
});

export type CreateCustomerType = z.infer<typeof createCustomerSchema>;

export const createCustomer = async (customer: CreateCustomerType) => {
  return await prisma.customer.create({
    data: {
      email: customer.email,
      password: hash(customer.password),
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone_number: customer.phone_number,
      type: "CUSTOMER",
      vehicles: { create: { ...customer.vehicle } },
    },
  });
};

export const createEmployeeSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string(),
  shop_id: z.string(),
});

export type CreateEmployeeType = z.infer<typeof createEmployeeSchema>;

export const createEmployee = async (employee: CreateEmployeeType) => {
  const shop = await getShopById(employee.shop_id);
  if (!shop) return Promise.reject("Shop not found.");

  return await prisma.employee.create({
    data: {
      email: employee.email,
      password: hash(employee.password),
      first_name: employee.first_name,
      last_name: employee.last_name,
      phone_number: employee.phone_number,
      type: "EMPLOYEE",
      shop: { connect: { id: employee.shop_id } },
    },
  });
};

export const createShopOwnerSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string(),
  shop: createShopSchema,
});

export type CreateShopOwnerType = z.infer<typeof createShopOwnerSchema>;

export const createShopOwner = async (shopOwner: CreateShopOwnerType) => {
  return await prisma.employee.create({
    data: {
      email: shopOwner.email,
      password: hash(shopOwner.password),
      first_name: shopOwner.first_name,
      last_name: shopOwner.last_name,
      phone_number: shopOwner.phone_number,
      type: "SHOP_OWNER",
      shop: { create: { ...shopOwner.shop } },
    },
  });
};

const hash = (plaintext: string) => bcrypt.hashSync(plaintext, 10);

export const getUserByEmail = async (
  email: string
): Promise<Customer | Employee | null> => {
  if (!email) return null;
  const user = await prisma.customer.findUnique({ where: { email } });
  return user ?? (await prisma.employee.findUnique({ where: { email } }));
};

export const getEmployeeById = async (id: string) => {
  return await prisma.employee.findUnique({ where: { id } });
};

export const getCustomerById = async (id: string) => {
  return await prisma.customer.findUnique({ where: { id } });
};

export const authorize = async (
  email: string,
  password: string
): Promise<Session["user"]> => {
  const userData = await getUserByEmail(email);

  if (!userData) return Promise.reject("user not found");

  if (!bcrypt.compareSync(password, userData.password)) {
    return Promise.reject("unauthorized");
  }

  const session: Session["user"] = {
    id: userData.id,
    firstName: userData.first_name,
    lastName: userData.last_name,
    email: userData.email,
    type: userData.type,
  };

  if (userData.type !== "CUSTOMER") {
    session.shopId = (userData as Employee).shop_id;
  }

  return session;
};
