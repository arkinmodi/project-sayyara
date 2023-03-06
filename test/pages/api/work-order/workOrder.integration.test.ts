/**
 *
 * Work Order Flow Integration Tests
 *
 * @group integration
 */

import workOrdersByShopIdHandler from "@pages/api/shop/[id]/workOrders";
import workOrderByIdHandler from "@pages/api/work-order/[id]";
import {
  Customer,
  Employee,
  prisma,
  Shop,
  Vehicle,
  WorkOrder,
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
  id: "test_employee_id",
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

const testWorkOrder: WorkOrder = {
  id: "test_work_order_id",
  create_time: new Date(),
  update_time: new Date(),
  title: "New Test Work Order",
  customer_id: testCustomerUser.id,
  vehicle_id: testVehicle.id,
  body: "Test Work Order Body",
  shop_id: testShop.id,
  employee_id: null,
};

jest.mock("@server/common/getServerAuthSession", () => ({
  getServerAuthSession: jest.fn<Session, []>(() => ({
    expires: "1",
    user: {
      id: testEmployeeUser.id,
      firstName: testEmployeeUser.first_name,
      lastName: testEmployeeUser.last_name,
      email: testEmployeeUser.email,
      type: testEmployeeUser.type,
      shopId: testEmployeeUser.shop_id,
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
    prisma.workOrder.deleteMany({}),
    prisma.customer.deleteMany({}),
    prisma.vehicle.deleteMany({}),
    prisma.employee.deleteMany({}),
    prisma.shop.deleteMany({}),
  ]);
});

describe("Work Orders Module", () => {
  it("FRT-M6-1: get work order request with a valid work order id", async () => {
    // Setup
    await createCustomerAndVehicle();
    await createEmployeeAndShop();
    await createWorkOrder();

    // Get Work Order
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: testWorkOrder.id,
    };

    await workOrderByIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({
      id: testWorkOrder.id,
      create_time: expect.any(String),
      update_time: expect.any(String),
      title: testWorkOrder.title,
      body: testWorkOrder.body,
      customer_id: testWorkOrder.customer_id,
      vehicle_id: testWorkOrder.vehicle_id,
      shop_id: testWorkOrder.shop_id,
    });
  });

  it("FRT-M6-2: get work order request with an invalid work order id", async () => {
    // Setup
    await createCustomerAndVehicle();
    await createEmployeeAndShop();
    await createWorkOrder();

    // Get Work Order
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "work_order_does_not_exist",
    };

    await workOrderByIdHandler(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("FRT-M6-3: get work order request with a valid shop id", async () => {
    // Setup
    await createCustomerAndVehicle();
    await createEmployeeAndShop();
    await createWorkOrder();

    // Get Work Order
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: testWorkOrder.shop_id,
    };

    await workOrdersByShopIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(1);
    expect(res._getJSONData()[0]).toMatchObject({
      id: testWorkOrder.id,
      create_time: expect.any(String),
      update_time: expect.any(String),
      title: testWorkOrder.title,
      body: testWorkOrder.body,
      customer_id: testWorkOrder.customer_id,
      vehicle_id: testWorkOrder.vehicle_id,
      shop_id: testWorkOrder.shop_id,
    });
  });

  it("FRT-M6-4: get work order request with an invalid shop id", async () => {
    // Setup
    await createCustomerAndVehicle();
    await createEmployeeAndShop();
    await createWorkOrder();

    // Get Work Order
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "shop_does_not_exist",
    };

    await workOrdersByShopIdHandler(req, res);

    expect(res.statusCode).toBe(403);
  });

  it("FRT-M6-5: update work order request with a valid work order id and valid information", async () => {
    // Setup
    await createCustomerAndVehicle();
    await createEmployeeAndShop();
    await createWorkOrder();

    // Update Work Order
    const { req, res } = createMockRequestResponse({ method: "PATCH" });
    req.query = {
      id: testWorkOrder.id,
    };
    req.body = {
      body: "Updated Body",
    };

    await workOrderByIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({
      id: testWorkOrder.id,
      create_time: expect.any(String),
      update_time: expect.any(String),
      title: testWorkOrder.title,
      body: "Updated Body",
      customer_id: testWorkOrder.customer_id,
      vehicle_id: testWorkOrder.vehicle_id,
      shop_id: testWorkOrder.shop_id,
    });
  });

  it("FRT-M6-6: update work order request with an invalid work order id and valid information", async () => {
    // Setup
    await createCustomerAndVehicle();
    await createEmployeeAndShop();
    await createWorkOrder();

    // Update Work Order
    const { req, res } = createMockRequestResponse({ method: "PATCH" });
    req.query = {
      id: "work_order_does_not_exist",
    };
    req.body = {
      body: "Updated Body",
    };

    await workOrderByIdHandler(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("FRT-M6-7: update work order request with a valid work order id and invalid information", async () => {
    // Setup
    await createCustomerAndVehicle();
    await createEmployeeAndShop();
    await createWorkOrder();

    // Update Work Order
    const { req, res } = createMockRequestResponse({ method: "PATCH" });
    req.query = {
      id: testWorkOrder.id,
    };
    req.body = {
      employee_email: "Not An Email Address",
    };

    await workOrderByIdHandler(req, res);

    expect(res.statusCode).toBe(400);
  });
});

const createCustomerAndVehicle = async () => {
  return await prisma.customer.create({
    data: {
      id: testCustomerUser.id,
      first_name: testCustomerUser.first_name,
      last_name: testCustomerUser.last_name,
      phone_number: testCustomerUser.phone_number,
      email: testCustomerUser.email,
      password: testCustomerUser.password,
      type: testCustomerUser.type,
      vehicles: {
        create: {
          id: testVehicle.id,
          year: testVehicle.year,
          make: testVehicle.make,
          model: testVehicle.model,
          vin: testVehicle.vin,
          license_plate: testVehicle.license_plate,
        },
      },
    },
  });
};

const createEmployeeAndShop = async () => {
  return await prisma.employee.create({
    data: {
      id: testEmployeeUser.id,
      first_name: testEmployeeUser.first_name,
      last_name: testEmployeeUser.last_name,
      phone_number: testEmployeeUser.phone_number,
      email: testEmployeeUser.email,
      password: testEmployeeUser.password,
      type: testEmployeeUser.type,
      status: testEmployeeUser.status,
      shop: {
        create: {
          id: testShop.id,
          phone_number: testShop.phone_number,
          email: testShop.email,
          name: testShop.name,
          address: testShop.address,
          postal_code: testShop.postal_code,
          city: testShop.city,
          province: testShop.province,
        },
      },
    },
  });
};

const createWorkOrder = async () => {
  return await prisma.workOrder.create({
    data: {
      id: testWorkOrder.id,
      title: testWorkOrder.title,
      body: testWorkOrder.body,
      customer: {
        connect: {
          id: testWorkOrder.customer_id,
        },
      },
      vehicle: {
        connect: {
          id: testWorkOrder.vehicle_id,
        },
      },
      shop: {
        connect: {
          id: testWorkOrder.shop_id,
        },
      },
    },
  });
};
