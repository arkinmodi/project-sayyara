import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
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
    prisma.appointment.deleteMany(),
    prisma.quote.deleteMany(),
    prisma.vehicle.deleteMany(),
    prisma.workOrder.deleteMany(),
    prisma.service.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.employee.deleteMany(),
    prisma.shop.deleteMany(),
  ]);
};

const hash = (plaintext: string) => bcrypt.hashSync(plaintext, 10);

const seed = async () => {
  await clearDatabase();

  // Create Shop Owner
  const shopOwnerData = await prisma.employee.create({
    data: {
      email: shopOwnerCredentials.email,
      password: hash(shopOwnerCredentials.password),
      first_name: "John",
      last_name: "Stone",
      phone_number: "9055259140",
      type: "SHOP_OWNER",
      shop: {
        create: {
          name: "Sayyara",
          address: "1280 Main Street West",
          phone_number: "9055259140",
          email: "example@sayyara.com",
          postal_code: "L8S 4L8",
          city: "Hamilton",
          province: "Ontario",
        },
      },
    },
  });

  // Create Customer and Vehicle
  const customerData = await prisma.customer.create({
    data: {
      email: customerCredentials.email,
      password: hash(customerCredentials.password),
      first_name: "Mia",
      last_name: "Wong",
      phone_number: "9055259140",
      type: "CUSTOMER",
      vehicles: {
        create: [
          {
            year: 2013,
            make: "Toyota",
            model: "4Runner",
            vin: "JF2SHADC3DG417185",
            license_plate: "BPNW958",
          },
        ],
      },
    },
    include: {
      vehicles: true,
    },
  });

  // Create Service
  const serviceData = await prisma.service.create({
    data: {
      name: "Oil Change",
      description: "Change the engine oil",
      estimated_time: 2,
      total_price: 30.55,
      parts: [
        {
          quantity: 1,
          condition: "NEW",
          build: "OEM",
          cost: 10.0,
          name: "Engine Oil",
        },
      ],
      type: "CANNED",
      shop: { connect: { id: shopOwnerData.shop_id } },
    },
  });

  // Create Appointment and Work Order
  const appointmentData = await prisma.appointment.create({
    data: {
      start_time: new Date("2023-11-09T02:00:00.000Z"),
      end_time: new Date("2023-11-09T04:00:00.000Z"),
      price: 30.55,
      vehicle: { connect: { id: customerData.vehicles[0]?.id } },
      customer: { connect: { id: customerData.id } },
      shop: { connect: { id: shopOwnerData.shop_id } },
      service: { connect: { id: serviceData.id } },
      work_order: {
        create: {
          create_time: new Date(),
          update_time: new Date(),
          title: "Oil Change",
          body: "",
          customer: { connect: { id: customerData.id } },
          vehicle: { connect: { id: customerData.vehicles[0]?.id } },
          shop: { connect: { id: shopOwnerData.shop_id } },
        },
      },
    },
  });

  // Log all IDs
  console.log("Shop Owner ID: \t", shopOwnerData.id);
  console.log("Shop ID: \t", shopOwnerData.shop_id);
  console.log("Customer ID: \t", customerData.id);
  console.log("Vehicle ID: \t", customerData.vehicles[0]?.id);
  console.log("Service ID: \t", serviceData.id);
  console.log("Appointment ID: ", appointmentData.id);
  console.log("Work Order ID: \t", appointmentData.work_order_id);
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
