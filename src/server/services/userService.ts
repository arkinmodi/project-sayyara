import { Customer, Employee, prisma } from "@server/db/client";
import { createShopSchema, getShopById } from "@server/services/shopService";
import { createVehicleSchema } from "@server/services/vehicleService";
import bcrypt from "bcrypt";
import { Session } from "next-auth";
import { PHONE_NUMBER_REGEX } from "src/utils/formValidationUtil";
import { z } from "zod";

export const createCustomerSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().regex(PHONE_NUMBER_REGEX),
  vehicle: createVehicleSchema,
});

export type CreateCustomerType = z.infer<typeof createCustomerSchema>;

/**
 *  Create a user of type customer
 *
 *  @author Arkin Modi <16737086+arkinmodi@users.noreply.github.com>
 *  @date 01/06/2023
 *  @param {CreateCustomerType} customer - Customer data
 *  @returns Customer object
 */
export const createCustomer = async (customer: CreateCustomerType) => {
  return await prisma.customer.create({
    data: {
      email: customer.email,
      password: hash(customer.password),
      firstName: customer.firstName,
      lastName: customer.lastName,
      phoneNumber: customer.phoneNumber,
      type: "CUSTOMER",
      vehicles: { create: { ...customer.vehicle } },
    },
  });
};

export const createEmployeeSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().regex(PHONE_NUMBER_REGEX),
  shopId: z.string(),
});

export type CreateEmployeeType = z.infer<typeof createEmployeeSchema>;

/**
 *  Create a user of type employee
 *
 *  @author Arkin Modi <16737086+arkinmodi@users.noreply.github.com>
 *  @date 01/06/2023
 *  @param {CreateEmployeeType} employee - Employee data
 *  @returns Employee object
 */
export const createEmployee = async (employee: CreateEmployeeType) => {
  const shop = await getShopById(employee.shopId);
  if (!shop) return Promise.reject("Shop not found.");

  return await prisma.employee.create({
    data: {
      email: employee.email,
      password: hash(employee.password),
      firstName: employee.firstName,
      lastName: employee.lastName,
      phoneNumber: employee.phoneNumber,
      type: "EMPLOYEE",
      shop: { connect: { id: employee.shopId } },
    },
  });
};

export const createShopOwnerSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().regex(PHONE_NUMBER_REGEX),
  shop: createShopSchema,
});

export type CreateShopOwnerType = z.infer<typeof createShopOwnerSchema>;

/**
 *  Create a user of type shop owner
 *
 *  @author Arkin Modi <16737086+arkinmodi@users.noreply.github.com>
 *  @date 01/06/2023
 *  @param {CreateShopOwnerType} shopOwner - Shop owner data
 *  @returns Employee object
 */
export const createShopOwner = async (shopOwner: CreateShopOwnerType) => {
  return await prisma.employee.create({
    data: {
      email: shopOwner.email,
      password: hash(shopOwner.password),
      firstName: shopOwner.firstName,
      lastName: shopOwner.lastName,
      phoneNumber: shopOwner.phoneNumber,
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
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    type: userData.type,
  };

  if (userData.type !== "CUSTOMER") {
    session.shopId = (userData as Employee).shopId;
  }

  return session;
};
