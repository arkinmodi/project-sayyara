import { AppointmentStatus, PrismaClient, ServiceType } from "@prisma/client";
import bcrypt from "bcrypt";
var md5 = require("md5-hash");

import customerA from "./seedData/customerA.json";
import customerB from "./seedData/customerB.json";

import shopOwnerA from "./seedData/shopOwnerA.json";
import shopOwnerB from "./seedData/shopOwnerB.json";
import shopOwnerC from "./seedData/shopOwnerC.json";
import shopOwnerD from "./seedData/shopOwnerD.json";
import shopOwnerE from "./seedData/shopOwnerE.json";
import shopOwnerF from "./seedData/shopOwnerF.json";
import shopOwnerG from "./seedData/shopOwnerG.json";
import shopOwnerH from "./seedData/shopOwnerH.json";
import shopOwnerI from "./seedData/shopOwnerI.json";
import shopOwnerJ from "./seedData/shopOwnerJ.json";

import employeeA from "./seedData/employeeA.json";
import employeeB from "./seedData/employeeB.json";
import employeeC from "./seedData/employeeC.json";
import employeeD from "./seedData/employeeD.json";
import employeeE from "./seedData/employeeE.json";

import customerAppointments from "./seedData/customerAppointments.json";
import shopAppointments from "./seedData/shopAppointments.json";

const customerSeedData = [customerA, customerB];

const shopOwnerSeedData = [
  shopOwnerA,
  shopOwnerB,
  shopOwnerC,
  shopOwnerD,
  shopOwnerE,
  shopOwnerF,
  shopOwnerG,
  shopOwnerH,
  shopOwnerI,
  shopOwnerJ,
];

const employeeSeedData = [
  employeeA,
  employeeB,
  employeeC,
  employeeD,
  employeeE,
];

const prisma = new PrismaClient();

const clearDatabase = async () => {
  await prisma.$transaction([
    prisma.appointment.deleteMany(),
    prisma.chatMessage.deleteMany(),
    prisma.quote.deleteMany(),
    prisma.vehicle.deleteMany(),
    prisma.workOrder.deleteMany(),
    prisma.service.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.employee.deleteMany(),
    prisma.shop.deleteMany(),
  ]);
};

const bcryptHash = (plaintext: string) => bcrypt.hashSync(plaintext, 10);
const md5Hash = (plaintext: string) => md5.default(plaintext);

const seed = async () => {
  await clearDatabase();

  // Create Shop Owners
  const shopIds: string[] = [];
  for (const seedData of shopOwnerSeedData) {
    const data = await prisma.employee.create({
      data: {
        email: seedData.shopOwner.email,
        password: bcryptHash(md5Hash(seedData.shopOwner.password)),
        firstName: seedData.shopOwner.firstName,
        lastName: seedData.shopOwner.lastName,
        phoneNumber: seedData.shopOwner.phoneNumber,
        type: "SHOP_OWNER",
        shop: {
          create: {
            name: seedData.shop.name,
            address: seedData.shop.address,
            phoneNumber: seedData.shop.phoneNumber,
            email: seedData.shop.email,
            postalCode: seedData.shop.postalCode,
            city: seedData.shop.city,
            province: seedData.shop.province,
            latitude: seedData.shop.latitude,
            longitude: seedData.shop.longitude,
            hoursOfOperation: seedData.shop.hoursOfOperation,
          },
        },
      },
    });
    shopIds.push(data.shopId);
  }

  // Add Employees to First Shop
  for (const seedData of employeeSeedData) {
    await prisma.employee.create({
      data: {
        email: seedData.employee.email,
        password: bcryptHash(md5Hash(seedData.employee.password)),
        firstName: seedData.employee.firstName,
        lastName: seedData.employee.lastName,
        phoneNumber: seedData.employee.phoneNumber,
        type: "EMPLOYEE",
        shop: { connect: { id: shopIds[0] } },
      },
    });
  }

  // Create Customer and Vehicle
  const customerIds: { customerId: string; vehicleId: string }[] = [];
  for (const seedData of customerSeedData) {
    const data = await prisma.customer.create({
      data: {
        email: seedData.customer.email,
        password: bcryptHash(md5Hash(seedData.customer.password)),
        firstName: seedData.customer.firstName,
        lastName: seedData.customer.lastName,
        phoneNumber: seedData.customer.phoneNumber,
        type: "CUSTOMER",
        vehicles: {
          create: [
            {
              year: seedData.vehicle.year,
              make: seedData.vehicle.make,
              model: seedData.vehicle.model,
              vin: seedData.vehicle.vin,
              licensePlate: seedData.vehicle.licensePlate,
            },
          ],
        },
      },
      include: {
        vehicles: true,
      },
    });
    customerIds.push({ customerId: data.id, vehicleId: data.vehicles[0]!.id });
  }

  // Create Service
  const serviceIds: { id: string; name: string }[] = [];
  for (let i = 0; i < shopOwnerSeedData.length; i++) {
    const seedData = shopOwnerSeedData[i]!;
    const shopId = shopIds[i]!;
    for (const serviceSeedData of seedData.services) {
      const data = await prisma.service.create({
        data: {
          name: serviceSeedData.name,
          description: serviceSeedData.description,
          estimatedTime: serviceSeedData.estimatedTime,
          totalPrice: serviceSeedData.price,
          parts: serviceSeedData.parts,
          type: serviceSeedData.type as ServiceType,
          shop: { connect: { id: shopId } },
        },
      });
      serviceIds.push({ id: data.id, name: data.name });
    }
  }

  // Create Appointment and Work Order
  for (const seedData of customerAppointments) {
    await prisma.appointment.create({
      data: {
        startTime: new Date(seedData.startTime),
        endTime: new Date(seedData.endTime),
        price: seedData.price,
        status: seedData.status as AppointmentStatus,
        vehicle: { connect: { id: customerIds[0]?.vehicleId } },
        customer: { connect: { id: customerIds[0]?.customerId } },
        shop: { connect: { id: shopIds[0] } },
        service: { connect: { id: serviceIds[0]?.id } },
        workOrder: {
          create: {
            createTime: new Date(),
            updateTime: new Date(),
            title: serviceIds[0]!.name,
            body: "",
            customer: { connect: { id: customerIds[0]?.customerId } },
            vehicle: { connect: { id: customerIds[0]?.vehicleId } },
            shop: { connect: { id: shopIds[0] } },
          },
        },
      },
    });
  }

  for (const seedData of shopAppointments) {
    await prisma.appointment.create({
      data: {
        startTime: new Date(seedData.startTime),
        endTime: new Date(seedData.endTime),
        price: seedData.price,
        status: seedData.status as AppointmentStatus,
        vehicle: { connect: { id: customerIds[1]?.vehicleId } },
        customer: { connect: { id: customerIds[1]?.customerId } },
        shop: { connect: { id: shopIds[0] } },
        service: { connect: { id: serviceIds[0]?.id } },
        workOrder: {
          create: {
            createTime: new Date(),
            updateTime: new Date(),
            title: serviceIds[0]!.name,
            body: "",
            customer: { connect: { id: customerIds[1]?.customerId } },
            vehicle: { connect: { id: customerIds[1]?.vehicleId } },
            shop: { connect: { id: shopIds[0] } },
          },
        },
      },
    });
  }

  console.log(
    "\nShop Owner Credentials: \t",
    `${shopOwnerA.shopOwner.email} / ${shopOwnerA.shopOwner.password}`
  );
  console.log(
    "Customer Credentials: \t\t",
    `${customerA.customer.email} / ${customerA.customer.password}`
  );
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
