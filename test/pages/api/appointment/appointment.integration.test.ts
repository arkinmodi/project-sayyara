/**
 *
 * Appointment Flow Integration Tests
 *
 * @group integration
 */
import appointmentHandler from "@pages/api/appointment";
import appointmentByIdHandler from "@pages/api/appointment/[id]";
import registerCustomerHandler from "@pages/api/user/register/customer";
import { Customer, prisma, Shop, Vehicle } from "@server/db/client";
import { createMockRequestResponse } from "@test/mocks/mockRequestResponse";
import { Session } from "next-auth";

const testCustomerUser: Customer = {
  id: "test_customer_id",
  create_time: new Date(),
  update_time: new Date(),
  first_name: "first_name",
  last_name: "last_name",
  phone_number: "1234567890",
  email: "customer@test.com",
  password: "test_password",
  image: null,
  type: "CUSTOMER",
};

const testShop: Shop = {
  id: "test_shop_id",
  create_time: new Date(),
  update_time: new Date(),
};

const testVehicle: Vehicle = {
  id: "",
  create_time: new Date(),
  update_time: new Date(),
  year: 0,
  make: "",
  model: "",
  vin: "",
  license_plate: "",
  customer_id: testCustomerUser.id,
};

//
// SCHEDULE
//
// Appointment:
//  2:00 to 4:00
//
// Conflicting:
//  1:30 to 2:30
//  2:45 to 3:15
//  3:30 to 4:30
//  1:30 to 4:30
//  2:00 to 4:00
//
// Not Conflicting:
//  4:30 to 5:30
//  1:00 to 2:00
//  4:00 to 5:00
//  1:00 to 1:30
//

const appointment = {
  id: "",
  service_type: "CANNED",
  start_time: new Date("2023-11-09T02:00:00.000Z"),
  end_time: new Date("2023-11-09T04:00:00.000Z"),
};

const conflictingAppointments = [
  {
    id: "",
    service_type: "CANNED",
    start_time: new Date("2023-11-09T01:30:00.000Z"),
    end_time: new Date("2023-11-09T02:30:00.000Z"),
  },
  {
    id: "",
    service_type: "CANNED",
    start_time: new Date("2023-11-09T02:45:00.000Z"),
    end_time: new Date("2023-11-09T03:15:00.000Z"),
  },
  {
    id: "",
    service_type: "CANNED",
    start_time: new Date("2023-11-09T03:30:00.000Z"),
    end_time: new Date("2023-11-09T04:30:00.000Z"),
  },
  {
    id: "",
    service_type: "CANNED",
    start_time: new Date("2023-11-09T01:30:00.000Z"),
    end_time: new Date("2023-11-09T04:30:00.000Z"),
  },
  {
    id: "",
    service_type: "CANNED",
    start_time: new Date("2023-11-09T02:00:00.000Z"),
    end_time: new Date("2023-11-09T04:00:00.000Z"),
  },
];

const notConflictingAppointments = [
  {
    id: "",
    service_type: "CANNED",
    start_time: new Date("2023-11-09T04:30:00.000Z"),
    end_time: new Date("2023-11-09T05:30:00.000Z"),
  },
  {
    id: "",
    service_type: "CANNED",
    start_time: new Date("2023-11-09T01:00:00.000Z"),
    end_time: new Date("2023-11-09T02:00:00.000Z"),
  },
  {
    id: "",
    service_type: "CANNED",
    start_time: new Date("2023-11-09T04:00:00.000Z"),
    end_time: new Date("2023-11-09T05:00:00.000Z"),
  },
  {
    id: "",
    service_type: "CANNED",
    start_time: new Date("2023-11-09T01:00:00.000Z"),
    end_time: new Date("2023-11-09T01:30:00.000Z"),
  },
];

jest.mock("@server/common/getServerAuthSession", () => ({
  getServerAuthSession: jest.fn<Promise<Session>, []>(async () => {
    const customer = await prisma.customer.findUniqueOrThrow({
      where: { email: testCustomerUser.email },
    });
    return {
      expires: "1",
      user: {
        id: customer.id,
        email: customer.email,
        type: customer.type,
        firstName: customer.first_name,
        lastName: customer.last_name,
      },
    };
  }),
}));

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

afterEach(async () => {
  await prisma.$transaction([
    prisma.customer.deleteMany(),
    prisma.shop.deleteMany(),
    prisma.vehicle.deleteMany(),
    prisma.appointment.deleteMany(),
    prisma.workOrder.deleteMany(),
  ]);
});

describe("update appointment", () => {
  describe("given appointment has been accepted", () => {
    it("should accept appointment and only reject conflicting appointments", async () => {
      // Create Customer, vehicle, and Shop
      const customer = await createCustomerAndVehicle();
      const shop = await createShop();

      // Create Appointments
      for (const ap of [
        appointment,
        ...conflictingAppointments,
        ...notConflictingAppointments,
      ]) {
        const { req, res } = createMockRequestResponse({ method: "POST" });
        req.body = {
          ...ap,
          vehicle_id: customer?.vehicles[0]?.id,
          customer_id: customer?.id,
          shop_id: shop.id,
        };
        await appointmentHandler(req, res);

        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toMatchObject({
          status: "PENDING_APPROVAL",
        });

        ap.id = res._getJSONData()["id"];
      }

      // Accept Appointment
      const { req, res } = createMockRequestResponse({ method: "PATCH" });
      req.query = { id: appointment.id };
      req.body = { status: "ACCEPTED" };
      await appointmentByIdHandler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toMatchObject({ status: "ACCEPTED" });

      // Check Conflict Appointments Have Been REJECTED
      for (const ap of conflictingAppointments) {
        const { req, res } = createMockRequestResponse({ method: "GET" });
        req.query = { id: ap.id };
        await appointmentByIdHandler(req, res);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toMatchObject({ status: "REJECTED" });
      }

      // Check Not Conflict Appointments Have Not Been Changed
      for (const ap of notConflictingAppointments) {
        const { req, res } = createMockRequestResponse({ method: "GET" });
        req.query = { id: ap.id };
        await appointmentByIdHandler(req, res);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toMatchObject({
          status: "PENDING_APPROVAL",
        });
      }
    });
  });
});

const createShop = async () => {
  return await prisma.shop.create({ data: testShop });
};

const createCustomerAndVehicle = async () => {
  const { req, res } = createMockRequestResponse({ method: "POST" });
  req.body = {
    email: testCustomerUser.email,
    password: testCustomerUser.password,
    first_name: testCustomerUser.first_name,
    last_name: testCustomerUser.last_name,
    phone_number: testCustomerUser.phone_number,
    vehicle: {
      year: testVehicle.year,
      make: testVehicle.make,
      model: testVehicle.model,
      vin: testVehicle.vin,
      license_plate: testVehicle.license_plate,
    },
  };
  await registerCustomerHandler(req, res);

  return await prisma.customer.findUniqueOrThrow({
    where: { email: testCustomerUser.email },
    include: { vehicles: true },
  });
};
