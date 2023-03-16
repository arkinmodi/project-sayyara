/**
 *
 * Appointment Flow Integration Tests
 *
 * @group integration
 */
import appointmentHandler from "@pages/api/appointment";
import appointmentByIdHandler from "@pages/api/appointment/[id]";
import appointmentByShopIdHandler from "@pages/api/shop/[id]/appointments";
import {
  Appointment,
  Customer,
  Employee,
  prisma,
  ServiceWithPartsType,
  Shop,
  Vehicle,
} from "@server/db/client";
import { createMockRequestResponse } from "@test/mocks/mockRequestResponse";
import { Session } from "next-auth";

const testShop: Shop = {
  id: "testShopId",
  createTime: new Date(),
  updateTime: new Date(),
  name: "testShopName",
  address: "testAddress",
  phoneNumber: "testPhoneNumber",
  email: "test@email.com",
  postalCode: "testPostalCode",
  city: "testCity",
  province: "testProvince",
  hoursOfOperation: null,
};

const testEmployeeUser: Employee = {
  id: "testId",
  firstName: "firstName",
  lastName: "lastName",
  phoneNumber: "1234567890",
  email: "employee@test.com",
  password: "testPassword",
  image: null,
  createTime: new Date(),
  updateTime: new Date(),
  type: "SHOP_OWNER",
  shopId: testShop.id,
  status: "ACTIVE",
};

const testVehicle: Vehicle = {
  id: "testCustomerVehicleId",
  createTime: new Date(),
  updateTime: new Date(),
  customerId: "testCustomerId",
  licensePlate: "testLicensePlate",
  make: "testMake",
  model: "testModel",
  vin: "testVin",
  year: 2017,
};

const testCustomerUser: Customer = {
  id: "testCustomerId",
  createTime: new Date(),
  updateTime: new Date(),
  firstName: "firstName",
  lastName: "lastName",
  phoneNumber: "1234567890",
  email: "customer@test.com",
  password: "testPassword",
  image: null,
  type: "CUSTOMER",
};

const testService: ServiceWithPartsType = {
  id: "testServiceId",
  createTime: new Date(),
  updateTime: new Date(),
  name: "testName",
  description: "testDescription",
  estimatedTime: 2,
  totalPrice: 100,
  parts: [],
  type: "CANNED",
  shopId: testShop.id,
};

const testAppointment: Appointment = {
  id: "testAppointmentId",
  createTime: new Date(),
  updateTime: new Date(),
  quoteId: null,
  workOrderId: "testWorkOrderId",
  vehicleId: testVehicle.id,
  price: 100,
  employeeId: null,
  customerId: testCustomerUser.id,
  status: "PENDING_APPROVAL",
  startTime: new Date("2023-11-09T02:00:00.000Z"),
  endTime: new Date("2023-11-09T04:00:00.000Z"),
  shopId: testShop.id,
  serviceId: testService.id,
  cancellationReason: null,
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
  price: 200,
  startTime: new Date("2023-11-09T02:00:00.000Z"),
  endTime: new Date("2023-11-09T04:00:00.000Z"),
};

const conflictingAppointments = [
  {
    id: "",
    price: 200,
    startTime: new Date("2023-11-09T01:30:00.000Z"),
    endTime: new Date("2023-11-09T02:30:00.000Z"),
  },
  {
    id: "",
    price: 200,
    startTime: new Date("2023-11-09T02:45:00.000Z"),
    endTime: new Date("2023-11-09T03:15:00.000Z"),
  },
  {
    id: "",
    price: 200,
    startTime: new Date("2023-11-09T03:30:00.000Z"),
    endTime: new Date("2023-11-09T04:30:00.000Z"),
  },
  {
    id: "",
    price: 200,
    startTime: new Date("2023-11-09T01:30:00.000Z"),
    endTime: new Date("2023-11-09T04:30:00.000Z"),
  },
  {
    id: "",
    price: 200,
    startTime: new Date("2023-11-09T02:00:00.000Z"),
    endTime: new Date("2023-11-09T04:00:00.000Z"),
  },
];

const notConflictingAppointments = [
  {
    id: "",
    price: 200,
    startTime: new Date("2023-11-09T04:30:00.000Z"),
    endTime: new Date("2023-11-09T05:30:00.000Z"),
  },
  {
    id: "",
    price: 200,
    startTime: new Date("2023-11-09T01:00:00.000Z"),
    endTime: new Date("2023-11-09T02:00:00.000Z"),
  },
  {
    id: "",
    price: 200,
    startTime: new Date("2023-11-09T04:00:00.000Z"),
    endTime: new Date("2023-11-09T05:00:00.000Z"),
  },
  {
    id: "",
    price: 200,
    startTime: new Date("2023-11-09T01:00:00.000Z"),
    endTime: new Date("2023-11-09T01:30:00.000Z"),
  },
];

jest.mock("@server/common/getServerAuthSession", () => ({
  getServerAuthSession: jest.fn<Session, []>(() => ({
    expires: "1",
    user: {
      ...testCustomerUser,
      firstName: testCustomerUser.firstName,
      lastName: testCustomerUser.lastName,
    },
  })),
}));

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

afterEach(async () => {
  await prisma.$transaction([
    prisma.appointment.deleteMany({}),
    prisma.workOrder.deleteMany({}),
    prisma.service.deleteMany({}),
    prisma.customer.deleteMany({}),
    prisma.vehicle.deleteMany({}),
    prisma.employee.deleteMany({}),
    prisma.shop.deleteMany({}),
  ]);
});

describe("Appointments Module", () => {
  it("FRT-M5-1: create appointment request with valid information", async () => {
    // Setup
    await createCustomer();
    await createVehicle();
    await createShop();
    await createEmployee();
    await createService();

    // Create Appointment
    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      price: testAppointment.price,
      startTime: testAppointment.startTime,
      endTime: testAppointment.endTime,
      vehicleId: testAppointment.vehicleId,
      customerId: testAppointment.customerId,
      shopId: testAppointment.shopId,
      serviceId: testAppointment.serviceId,
    };

    await appointmentHandler(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toMatchObject({
      id: expect.any(String),
      createTime: expect.any(String),
      updateTime: expect.any(String),
      workOrderId: expect.any(String),
      vehicleId: testAppointment.vehicleId,
      price: testAppointment.price,
      customerId: testAppointment.customerId,
      status: "PENDING_APPROVAL",
      startTime: testAppointment.startTime.toJSON(),
      endTime: testAppointment.endTime.toJSON(),
      shopId: testAppointment.shopId,
      serviceId: testAppointment.serviceId,
    });
  });

  it("FRT-M5-2: create appointment request with missing information", async () => {
    // Setup
    await createCustomer();
    await createVehicle();
    await createShop();
    await createEmployee();
    await createService();

    // Create Appointment
    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      price: testAppointment.price,
      endTime: testAppointment.endTime,
      vehicleId: testAppointment.vehicleId,
      customerId: testAppointment.customerId,
      shopId: testAppointment.shopId,
      serviceId: testAppointment.serviceId,
    };

    await appointmentHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("FRT-M5-3: create appointment request with an end time before the start time", async () => {
    // Setup
    await createCustomer();
    await createVehicle();
    await createShop();
    await createEmployee();
    await createService();

    // Create Appointment
    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      price: testAppointment.price,
      startTime: testAppointment.endTime,
      endTime: testAppointment.startTime,
      vehicleId: testAppointment.vehicleId,
      customerId: testAppointment.customerId,
      shopId: testAppointment.shopId,
      serviceId: testAppointment.serviceId,
    };

    await appointmentHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("FRT-M5-4: get appointment request with a valid appointment id", async () => {
    // Setup
    await createCustomer();
    await createVehicle();
    await createShop();
    await createEmployee();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      price: testAppointment.price,
      startTime: testAppointment.startTime,
      endTime: testAppointment.endTime,
      vehicleId: testAppointment.vehicleId,
      customerId: testAppointment.customerId,
      shopId: testAppointment.shopId,
      serviceId: testAppointment.serviceId,
    };
    await appointmentHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    const appointmentId = post.res._getJSONData()["id"] as string;

    // Get Appointment
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: appointmentId,
    };

    await appointmentByIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({
      id: expect.any(String),
      createTime: expect.any(String),
      updateTime: expect.any(String),
      workOrderId: expect.any(String),
      vehicleId: testAppointment.vehicleId,
      price: testAppointment.price,
      customerId: testAppointment.customerId,
      status: "PENDING_APPROVAL",
      startTime: testAppointment.startTime.toJSON(),
      endTime: testAppointment.endTime.toJSON(),
      shopId: testAppointment.shopId,
      serviceId: testAppointment.serviceId,
    });
  });

  it("FRT-M5-5: get appointment request with an invalid appointment id", async () => {
    // Setup
    await createCustomer();
    await createVehicle();
    await createShop();
    await createEmployee();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      price: testAppointment.price,
      startTime: testAppointment.startTime,
      endTime: testAppointment.endTime,
      vehicleId: testAppointment.vehicleId,
      customerId: testAppointment.customerId,
      shopId: testAppointment.shopId,
      serviceId: testAppointment.serviceId,
    };
    await appointmentHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Get Appointment
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "appointmentDoesNotExist",
    };

    await appointmentByIdHandler(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("FRT-M5-6: get appointments request with a valid shop id", async () => {
    // Setup
    await createCustomer();
    await createVehicle();
    await createShop();
    await createEmployee();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      price: testAppointment.price,
      startTime: testAppointment.startTime,
      endTime: testAppointment.endTime,
      vehicleId: testAppointment.vehicleId,
      customerId: testAppointment.customerId,
      shopId: testAppointment.shopId,
      serviceId: testAppointment.serviceId,
    };
    await appointmentHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Get Appointment
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: testAppointment.shopId,
    };

    await appointmentByShopIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(1);
    expect(res._getJSONData()[0]).toMatchObject({
      id: expect.any(String),
      createTime: expect.any(String),
      updateTime: expect.any(String),
      workOrderId: expect.any(String),
      vehicleId: testAppointment.vehicleId,
      price: testAppointment.price,
      customerId: testAppointment.customerId,
      status: "PENDING_APPROVAL",
      startTime: testAppointment.startTime.toJSON(),
      endTime: testAppointment.endTime.toJSON(),
      shopId: testAppointment.shopId,
      serviceId: testAppointment.serviceId,
    });
  });

  it("FRT-M5-7: get appointments request with an invalid shop id", async () => {
    // Setup
    await createCustomer();
    await createVehicle();
    await createShop();
    await createEmployee();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      price: testAppointment.price,
      startTime: testAppointment.startTime,
      endTime: testAppointment.endTime,
      vehicleId: testAppointment.vehicleId,
      customerId: testAppointment.customerId,
      shopId: testAppointment.shopId,
      serviceId: testAppointment.serviceId,
    };
    await appointmentHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Get Appointment
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "shopDoesNotExist",
    };

    await appointmentByShopIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(0);
  });

  it("FRT-M5-8: update an appointment request with a valid appointment id and valid information", async () => {
    // Setup
    await createCustomer();
    await createVehicle();
    await createShop();
    await createEmployee();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      price: testAppointment.price,
      startTime: testAppointment.startTime,
      endTime: testAppointment.endTime,
      vehicleId: testAppointment.vehicleId,
      customerId: testAppointment.customerId,
      shopId: testAppointment.shopId,
      serviceId: testAppointment.serviceId,
    };
    await appointmentHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    const appointmentId = post.res._getJSONData()["id"] as string;

    // Update Appointment
    const { req, res } = createMockRequestResponse({ method: "PATCH" });
    req.query = {
      id: appointmentId,
    };
    req.body = {
      price: testAppointment.price + 1000,
    };

    await appointmentByIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({
      id: expect.any(String),
      createTime: expect.any(String),
      updateTime: expect.any(String),
      workOrderId: expect.any(String),
      vehicleId: testAppointment.vehicleId,
      price: testAppointment.price + 1000,
      customerId: testAppointment.customerId,
      status: "PENDING_APPROVAL",
      startTime: testAppointment.startTime.toJSON(),
      endTime: testAppointment.endTime.toJSON(),
      shopId: testAppointment.shopId,
      serviceId: testAppointment.serviceId,
    });
  });

  it("FRT-M5-9: update an appointment request with an invalid appointment id and valid information", async () => {
    // Setup
    await createCustomer();
    await createVehicle();
    await createShop();
    await createEmployee();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      price: testAppointment.price,
      startTime: testAppointment.startTime,
      endTime: testAppointment.endTime,
      vehicleId: testAppointment.vehicleId,
      customerId: testAppointment.customerId,
      shopId: testAppointment.shopId,
      serviceId: testAppointment.serviceId,
    };
    await appointmentHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Update Appointment
    const { req, res } = createMockRequestResponse({ method: "PATCH" });
    req.query = {
      id: "appointmentDoesNotExist",
    };
    req.body = {
      price: testAppointment.price + 1000,
    };

    await appointmentByIdHandler(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("FRT-M5-10: update an appointment request with a valid appointment id and invalid information", async () => {
    // Setup
    await createCustomer();
    await createVehicle();
    await createShop();
    await createEmployee();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      price: testAppointment.price,
      startTime: testAppointment.startTime,
      endTime: testAppointment.endTime,
      vehicleId: testAppointment.vehicleId,
      customerId: testAppointment.customerId,
      shopId: testAppointment.shopId,
      serviceId: testAppointment.serviceId,
    };
    await appointmentHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    const appointmentId = post.res._getJSONData()["id"] as string;

    // Update Appointment
    const { req, res } = createMockRequestResponse({ method: "PATCH" });
    req.query = {
      id: appointmentId,
    };
    req.body = {
      price: -1,
    };

    await appointmentByIdHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("FRT-M5-11: update an appointment request with a valid appointment id and with an end time before the start time", async () => {
    // Setup
    await createCustomer();
    await createVehicle();
    await createShop();
    await createEmployee();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      price: testAppointment.price,
      startTime: testAppointment.startTime,
      endTime: testAppointment.endTime,
      vehicleId: testAppointment.vehicleId,
      customerId: testAppointment.customerId,
      shopId: testAppointment.shopId,
      serviceId: testAppointment.serviceId,
    };
    await appointmentHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    const appointmentId = post.res._getJSONData()["id"] as string;

    // Update Appointment
    const { req, res } = createMockRequestResponse({ method: "PATCH" });
    req.query = {
      id: appointmentId,
    };
    req.body = {
      startTime: testAppointment.endTime,
      endTime: testAppointment.startTime,
    };

    await appointmentByIdHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("FRT-M5-12: accept appointment and reject conflicting appointments", async () => {
    // Create Customer, Vehicle, Shop, Employee and Service
    await createCustomer();
    await createVehicle();
    await createShop();
    await createEmployee();
    await createService();

    // Create Appointments
    for (const ap of [
      appointment,
      ...conflictingAppointments,
      ...notConflictingAppointments,
    ]) {
      const { req, res } = createMockRequestResponse({ method: "POST" });
      req.body = {
        ...ap,
        vehicleId: testVehicle.id,
        customerId: testCustomerUser.id,
        shopId: testShop.id,
        serviceId: testService.id,
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

  it("FRT-M5-13: delete appointment request with a valid appointment id", async () => {
    // Setup
    await createCustomer();
    await createVehicle();
    await createShop();
    await createEmployee();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      price: testAppointment.price,
      startTime: testAppointment.startTime,
      endTime: testAppointment.endTime,
      vehicleId: testAppointment.vehicleId,
      customerId: testAppointment.customerId,
      shopId: testAppointment.shopId,
      serviceId: testAppointment.serviceId,
    };
    await appointmentHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    const appointmentId = post.res._getJSONData()["id"] as string;

    // Delete Appointment
    const { req, res } = createMockRequestResponse({ method: "DELETE" });
    req.query = {
      id: appointmentId,
    };

    await appointmentByIdHandler(req, res);

    expect(res.statusCode).toBe(204);
  });

  it("FRT-M5-14: delete appointment request with an invalid appointment id", async () => {
    // Setup
    await createCustomer();
    await createVehicle();
    await createShop();
    await createEmployee();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      price: testAppointment.price,
      startTime: testAppointment.startTime,
      endTime: testAppointment.endTime,
      vehicleId: testAppointment.vehicleId,
      customerId: testAppointment.customerId,
      shopId: testAppointment.shopId,
      serviceId: testAppointment.serviceId,
    };
    await appointmentHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Delete Appointment
    const { req, res } = createMockRequestResponse({ method: "DELETE" });
    req.query = {
      id: "appointmentDoesNotExist",
    };

    await appointmentByIdHandler(req, res);

    expect(res.statusCode).toBe(404);
  });
});

describe("Security Requirements", () => {
  it("NFRT-SR1-1: fail to get appointment details for another customer", async () => {
    await createCustomer();
    await createVehicle();
    await createShop();
    await createEmployee();
    await createService();

    await createCustomer({
      ...testCustomerUser,
      email: "customer_2@test.com",
      id: "testCustomerId_2",
    });

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      ...appointment,
      vehicleId: testVehicle.id,
      customerId: "testCustomerId_2",
      shopId: testShop.id,
      serviceId: testService.id,
    };
    await appointmentHandler(post.req, post.res);

    expect(post.res.statusCode).toBe(201);

    const appointmentId = post.res._getJSONData()["id"] as string;

    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = { id: appointmentId };

    await appointmentByIdHandler(req, res);

    expect(res.statusCode).toBe(403);
  });
});

const createCustomer = async (customerData: Customer = testCustomerUser) => {
  return await prisma.customer.create({ data: customerData });
};

const createEmployee = async () => {
  return await prisma.employee.create({ data: testEmployeeUser });
};

const createShop = async () => {
  return await prisma.shop.create({
    data: {
      id: testShop.id,
      phoneNumber: testShop.phoneNumber,
      email: testShop.email,
      name: testShop.name,
      address: testShop.address,
      postalCode: testShop.postalCode,
      city: testShop.city,
      province: testShop.province,
    },
  });
};

const createVehicle = async () => {
  return await prisma.vehicle.create({ data: testVehicle });
};

const createService = async () => {
  return await prisma.service.create({ data: testService });
};
