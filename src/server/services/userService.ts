import { Customer, Employee, prisma, UserType } from "@server/db/client";
import { createShopSchema } from "@server/services/shopService";
import { createVehicleSchema } from "@server/services/vehicleService";
import bcrypt from "bcrypt";
import { z } from "zod";

// ********************** BEGIN DEPRECATED **********************
export const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  type: z.nativeEnum(UserType),
  shop: z.string().optional(),
});

export type CreateUserInputType = z.infer<typeof registrationSchema>;

export const createUser = async (
  user: CreateUserInputType
): Promise<Customer | Employee> => {
  if (user.type === "CUSTOMER") {
    return await createCustomer({
      email: user.email,
      password: user.password,
      first_name: user.first_name,
      last_name: user.last_name,
      vehicle: {
        license_plate: "TEST_LICENSE_PLATE",
        make: "TEST_MAKE",
        model: "TEST_MODEL",
        vin: "TEST_VIN",
        year: new Date().getFullYear(),
      },
    });
  } else {
    return await createShopOwner({
      email: user.email,
      password: user.password,
      first_name: user.first_name,
      last_name: user.last_name,
      shop: {},
    });
  }
};
// *********************** END DEPRECATED ***********************

export const createCustomerSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  vehicle: createVehicleSchema,
});

export type CreateCustomerType = z.infer<typeof createCustomerSchema>;

export const createCustomer = async (customer: CreateCustomerType) => {
  return await prisma.customer.create({
    data: {
      email: customer.email,
      password: hashPassword(customer.password),
      first_name: customer.first_name,
      last_name: customer.last_name,
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
  shop_id: z.string(),
});

export type CreateEmployeeType = z.infer<typeof createEmployeeSchema>;

export const createEmployee = async (employee: CreateEmployeeType) => {
  // TODO: Check for shop
  // const shop = await getShopById(employee.shop_id);
  // if (!shop) return Promise.reject("Shop not found.");

  return await prisma.employee.create({
    data: {
      email: employee.email,
      password: hashPassword(employee.password),
      first_name: employee.first_name,
      last_name: employee.last_name,
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
  shop: createShopSchema,
});

export type CreateShopOwnerType = z.infer<typeof createShopOwnerSchema>;

export const createShopOwner = async (shopOwner: CreateShopOwnerType) => {
  return await prisma.employee.create({
    data: {
      email: shopOwner.email,
      password: hashPassword(shopOwner.password),
      first_name: shopOwner.first_name,
      last_name: shopOwner.last_name,
      type: "SHOP_OWNER",
      shop: { create: { ...shopOwner.shop } },
    },
  });
};

const hashPassword = (password: string) => bcrypt.hashSync(password, 10);

export const getUserByEmail = async (
  email: string
): Promise<Customer | Employee | null> => {
  if (!email) return null;
  const user = await prisma.customer.findUnique({ where: { email } });
  return user ?? (await prisma.employee.findUnique({ where: { email } }));
};

export const authorize = async (email: string, password: string) => {
  const userData = await getUserByEmail(email);

  if (!userData) return Promise.reject("user not found");

  if (!bcrypt.compareSync(password, userData.password)) {
    return Promise.reject("unauthorized");
  }

  return {
    id: userData.id,
    firstName: userData.first_name,
    lastName: userData.last_name,
    email: userData.email,
    type: userData.type,
  };
};
