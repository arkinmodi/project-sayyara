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
  id: "test_shop_id",
  create_time: new Date(),
  update_time: new Date(),
  name: "test_shop_name",
  address: "test_address",
  phone_number: "test_phone_number",
  email: "test@email.com",
  postal_code: "test_postal_code",
  city: "test_city",
  province: "test_province",
  hours_of_operation: null,
};

const testEmployeeUser: Employee = {
  id: "test_id",
  first_name: "first_name",
  last_name: "last_name",
  phone_number: "1234567890",
  email: "employee@test.com",
  password: "test_password",
  image: null,
  create_time: new Date(),
  update_time: new Date(),
  type: "SHOP_OWNER",
  shop_id: testShop.id,
  status: "ACTIVE",
};

const testVehicle: Vehicle = {
  id: "test_customer_vehicle_id",
  create_time: new Date(),
  update_time: new Date(),
  customer_id: "test_customer_id",
  license_plate: "test_license_plate",
  make: "test_make",
  model: "test_model",
  vin: "test_vin",
  year: 2017,
};

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

const testService: ServiceWithPartsType = {
  id: "test_service_id",
  create_time: new Date(),
  update_time: new Date(),
  name: "test_name",
  description: "test_description",
  estimated_time: 2,
  total_price: 100,
  parts: [],
  type: "CANNED",
  shop_id: testShop.id,
};

const testAppointment: Appointment = {
  id: "test_appointment_id",
  create_time: new Date(),
  update_time: new Date(),
  quote_id: null,
  work_order_id: "test_work_order_id",
  vehicle_id: testVehicle.id,
  price: 100,
  employee_id: null,
  customer_id: testCustomerUser.id,
  status: "PENDING_APPROVAL",
  start_time: new Date("2023-11-09T02:00:00.000Z"),
  end_time: new Date("2023-11-09T04:00:00.000Z"),
  shop_id: testShop.id,
  service_id: testService.id,
  cancellation_reason: null,
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
  start_time: new Date("2023-11-09T02:00:00.000Z"),
  end_time: new Date("2023-11-09T04:00:00.000Z"),
};

const conflictingAppointments = [
  {
    id: "",
    price: 200,
    start_time: new Date("2023-11-09T01:30:00.000Z"),
    end_time: new Date("2023-11-09T02:30:00.000Z"),
  },
  {
    id: "",
    price: 200,
    start_time: new Date("2023-11-09T02:45:00.000Z"),
    end_time: new Date("2023-11-09T03:15:00.000Z"),
  },
  {
    id: "",
    price: 200,
    start_time: new Date("2023-11-09T03:30:00.000Z"),
    end_time: new Date("2023-11-09T04:30:00.000Z"),
  },
  {
    id: "",
    price: 200,
    start_time: new Date("2023-11-09T01:30:00.000Z"),
    end_time: new Date("2023-11-09T04:30:00.000Z"),
  },
  {
    id: "",
    price: 200,
    start_time: new Date("2023-11-09T02:00:00.000Z"),
    end_time: new Date("2023-11-09T04:00:00.000Z"),
  },
];

const notConflictingAppointments = [
  {
    id: "",
    price: 200,
    start_time: new Date("2023-11-09T04:30:00.000Z"),
    end_time: new Date("2023-11-09T05:30:00.000Z"),
  },
  {
    id: "",
    price: 200,
    start_time: new Date("2023-11-09T01:00:00.000Z"),
    end_time: new Date("2023-11-09T02:00:00.000Z"),
  },
  {
    id: "",
    price: 200,
    start_time: new Date("2023-11-09T04:00:00.000Z"),
    end_time: new Date("2023-11-09T05:00:00.000Z"),
  },
  {
    id: "",
    price: 200,
    start_time: new Date("2023-11-09T01:00:00.000Z"),
    end_time: new Date("2023-11-09T01:30:00.000Z"),
  },
];

jest.mock("@server/common/getServerAuthSession", () => ({
  getServerAuthSession: jest.fn<Session, []>(() => ({
    expires: "1",
    user: {
      ...testCustomerUser,
      firstName: testCustomerUser.first_name,
      lastName: testCustomerUser.last_name,
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
      start_time: testAppointment.start_time,
      end_time: testAppointment.end_time,
      vehicle_id: testAppointment.vehicle_id,
      customer_id: testAppointment.customer_id,
      shop_id: testAppointment.shop_id,
      service_id: testAppointment.service_id,
    };

    await appointmentHandler(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toMatchObject({
      id: expect.any(String),
      create_time: expect.any(String),
      update_time: expect.any(String),
      work_order_id: expect.any(String),
      vehicle_id: testAppointment.vehicle_id,
      price: testAppointment.price,
      customer_id: testAppointment.customer_id,
      status: "PENDING_APPROVAL",
      start_time: testAppointment.start_time.toJSON(),
      end_time: testAppointment.end_time.toJSON(),
      shop_id: testAppointment.shop_id,
      service_id: testAppointment.service_id,
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
      end_time: testAppointment.end_time,
      vehicle_id: testAppointment.vehicle_id,
      customer_id: testAppointment.customer_id,
      shop_id: testAppointment.shop_id,
      service_id: testAppointment.service_id,
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
      start_time: testAppointment.end_time,
      end_time: testAppointment.start_time,
      vehicle_id: testAppointment.vehicle_id,
      customer_id: testAppointment.customer_id,
      shop_id: testAppointment.shop_id,
      service_id: testAppointment.service_id,
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
      start_time: testAppointment.start_time,
      end_time: testAppointment.end_time,
      vehicle_id: testAppointment.vehicle_id,
      customer_id: testAppointment.customer_id,
      shop_id: testAppointment.shop_id,
      service_id: testAppointment.service_id,
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
      create_time: expect.any(String),
      update_time: expect.any(String),
      work_order_id: expect.any(String),
      vehicle_id: testAppointment.vehicle_id,
      price: testAppointment.price,
      customer_id: testAppointment.customer_id,
      status: "PENDING_APPROVAL",
      start_time: testAppointment.start_time.toJSON(),
      end_time: testAppointment.end_time.toJSON(),
      shop_id: testAppointment.shop_id,
      service_id: testAppointment.service_id,
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
      start_time: testAppointment.start_time,
      end_time: testAppointment.end_time,
      vehicle_id: testAppointment.vehicle_id,
      customer_id: testAppointment.customer_id,
      shop_id: testAppointment.shop_id,
      service_id: testAppointment.service_id,
    };
    await appointmentHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Get Appointment
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "appointment_does_not_exist",
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
      start_time: testAppointment.start_time,
      end_time: testAppointment.end_time,
      vehicle_id: testAppointment.vehicle_id,
      customer_id: testAppointment.customer_id,
      shop_id: testAppointment.shop_id,
      service_id: testAppointment.service_id,
    };
    await appointmentHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Get Appointment
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: testAppointment.shop_id,
    };

    await appointmentByShopIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(1);
    expect(res._getJSONData()[0]).toMatchObject({
      id: expect.any(String),
      create_time: expect.any(String),
      update_time: expect.any(String),
      work_order_id: expect.any(String),
      vehicle_id: testAppointment.vehicle_id,
      price: testAppointment.price,
      customer_id: testAppointment.customer_id,
      status: "PENDING_APPROVAL",
      start_time: testAppointment.start_time.toJSON(),
      end_time: testAppointment.end_time.toJSON(),
      shop_id: testAppointment.shop_id,
      service_id: testAppointment.service_id,
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
      start_time: testAppointment.start_time,
      end_time: testAppointment.end_time,
      vehicle_id: testAppointment.vehicle_id,
      customer_id: testAppointment.customer_id,
      shop_id: testAppointment.shop_id,
      service_id: testAppointment.service_id,
    };
    await appointmentHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Get Appointment
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "shop_does_not_exist",
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
      start_time: testAppointment.start_time,
      end_time: testAppointment.end_time,
      vehicle_id: testAppointment.vehicle_id,
      customer_id: testAppointment.customer_id,
      shop_id: testAppointment.shop_id,
      service_id: testAppointment.service_id,
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
      create_time: expect.any(String),
      update_time: expect.any(String),
      work_order_id: expect.any(String),
      vehicle_id: testAppointment.vehicle_id,
      price: testAppointment.price + 1000,
      customer_id: testAppointment.customer_id,
      status: "PENDING_APPROVAL",
      start_time: testAppointment.start_time.toJSON(),
      end_time: testAppointment.end_time.toJSON(),
      shop_id: testAppointment.shop_id,
      service_id: testAppointment.service_id,
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
      start_time: testAppointment.start_time,
      end_time: testAppointment.end_time,
      vehicle_id: testAppointment.vehicle_id,
      customer_id: testAppointment.customer_id,
      shop_id: testAppointment.shop_id,
      service_id: testAppointment.service_id,
    };
    await appointmentHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Update Appointment
    const { req, res } = createMockRequestResponse({ method: "PATCH" });
    req.query = {
      id: "appointment_does_not_exist",
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
      start_time: testAppointment.start_time,
      end_time: testAppointment.end_time,
      vehicle_id: testAppointment.vehicle_id,
      customer_id: testAppointment.customer_id,
      shop_id: testAppointment.shop_id,
      service_id: testAppointment.service_id,
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
      start_time: testAppointment.start_time,
      end_time: testAppointment.end_time,
      vehicle_id: testAppointment.vehicle_id,
      customer_id: testAppointment.customer_id,
      shop_id: testAppointment.shop_id,
      service_id: testAppointment.service_id,
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
      start_time: testAppointment.end_time,
      end_time: testAppointment.start_time,
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
        vehicle_id: testVehicle.id,
        customer_id: testCustomerUser.id,
        shop_id: testShop.id,
        service_id: testService.id,
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
      start_time: testAppointment.start_time,
      end_time: testAppointment.end_time,
      vehicle_id: testAppointment.vehicle_id,
      customer_id: testAppointment.customer_id,
      shop_id: testAppointment.shop_id,
      service_id: testAppointment.service_id,
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
      start_time: testAppointment.start_time,
      end_time: testAppointment.end_time,
      vehicle_id: testAppointment.vehicle_id,
      customer_id: testAppointment.customer_id,
      shop_id: testAppointment.shop_id,
      service_id: testAppointment.service_id,
    };
    await appointmentHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Delete Appointment
    const { req, res } = createMockRequestResponse({ method: "DELETE" });
    req.query = {
      id: "appointment_does_not_exist",
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
      id: "test_customer_id_2",
    });

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      ...appointment,
      vehicle_id: testVehicle.id,
      customer_id: "test_customer_id_2",
      shop_id: testShop.id,
      service_id: testService.id,
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
      phone_number: testShop.phone_number,
      email: testShop.email,
      name: testShop.name,
      address: testShop.address,
      postal_code: testShop.postal_code,
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
