import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const shopOwnerCredentials = {
  email: "shopOwner@sayyara.com",
  password: "password",
};

const customerCredentials = {
  email: "customer@sayyara.com",
  password: "password",
};

const clearDatabase = async () => {
  await prisma.$transaction([
    prisma.employee.deleteMany({}),
    prisma.customer.deleteMany({}),
    prisma.appointment.deleteMany({}),
    prisma.quote.deleteMany({}),
    prisma.vehicle.deleteMany({}),
    prisma.workOrder.deleteMany({}),
    prisma.shop.deleteMany({}),
    prisma.service.deleteMany({}),
  ]);
};

const seed = async () => {
  await clearDatabase();

  // Create Shop Owner
  await prisma.employee.create({
    data: {
      email: shopOwnerCredentials.email,
      password: shopOwnerCredentials.password,
      first_name: "John",
      last_name: "Stone",
      type: "SHOP_OWNER",
      shop: { create: {} },
    },
  });

  // Create Customer
  await prisma.customer.create({
    data: {
      email: customerCredentials.email,
      password: customerCredentials.password,
      first_name: "Mia",
      last_name: "Wong",
      type: "CUSTOMER",
    },
  });
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
