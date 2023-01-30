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
      phone_number: "9055259140",
      type: "SHOP_OWNER",
      shop: {
        create: {
          name: "Big Boss Mechanics",
          address: "1280 Main Street West",
          phone_number: "905-525-9140",
          email: "example@sayyara.com",
          postal_code: "L8S 4L8",
          city: "Hamilton",
          province: "Ontario",
        },
      },
    },
  });

  // Create Customer and Vehicle
  await prisma.customer.create({
    data: {
      email: customerCredentials.email,
      password: customerCredentials.password,
      first_name: "Mia",
      last_name: "Wong",
      phone_number: "9055259140",
      type: "CUSTOMER",
      vehicles: {
        create: [
          {
            year: 2013,
            make: "Subaru",
            model: "Forester",
            vin: "JF2SHADC3DG417185",
            license_plate: "BPNW958",
          },
        ],
      },
    },
  });
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
