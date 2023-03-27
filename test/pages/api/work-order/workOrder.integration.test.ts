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
  latitude: "43.0000",
  longitude: "-79.0000",
  hoursOfOperation: null,
};

const testEmployeeUser: Employee = {
  id: "testEmployeeId",
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

const testWorkOrder: WorkOrder = {
  id: "testWorkOrderId",
  createTime: new Date(),
  updateTime: new Date(),
  title: "New Test Work Order",
  customerId: testCustomerUser.id,
  vehicleId: testVehicle.id,
  body: "Test Work Order Body",
  shopId: testShop.id,
  employeeId: null,
};

jest.mock("@server/common/getServerAuthSession", () => ({
  getServerAuthSession: jest.fn<Session, []>(() => ({
    expires: "1",
    user: {
      id: testEmployeeUser.id,
      firstName: testEmployeeUser.firstName,
      lastName: testEmployeeUser.lastName,
      email: testEmployeeUser.email,
      type: testEmployeeUser.type,
      shopId: testEmployeeUser.shopId,
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
      createTime: expect.any(String),
      updateTime: expect.any(String),
      title: testWorkOrder.title,
      body: testWorkOrder.body,
      customerId: testWorkOrder.customerId,
      vehicleId: testWorkOrder.vehicleId,
      shopId: testWorkOrder.shopId,
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
      id: "workOrderDoesNotExist",
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
      id: testWorkOrder.shopId,
    };

    await workOrdersByShopIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(1);
    expect(res._getJSONData()[0]).toMatchObject({
      id: testWorkOrder.id,
      createTime: expect.any(String),
      updateTime: expect.any(String),
      title: testWorkOrder.title,
      body: testWorkOrder.body,
      customerId: testWorkOrder.customerId,
      vehicleId: testWorkOrder.vehicleId,
      shopId: testWorkOrder.shopId,
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
      id: "shopDoesNotExist",
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
      createTime: expect.any(String),
      updateTime: expect.any(String),
      title: testWorkOrder.title,
      body: "Updated Body",
      customerId: testWorkOrder.customerId,
      vehicleId: testWorkOrder.vehicleId,
      shopId: testWorkOrder.shopId,
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
      id: "workOrderDoesNotExist",
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
      employeeEmail: "Not An Email Address",
    };

    await workOrderByIdHandler(req, res);

    expect(res.statusCode).toBe(400);
  });
});

const createCustomerAndVehicle = async () => {
  return await prisma.customer.create({
    data: {
      id: testCustomerUser.id,
      firstName: testCustomerUser.firstName,
      lastName: testCustomerUser.lastName,
      phoneNumber: testCustomerUser.phoneNumber,
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
          licensePlate: testVehicle.licensePlate,
        },
      },
    },
  });
};

const createEmployeeAndShop = async () => {
  return await prisma.employee.create({
    data: {
      id: testEmployeeUser.id,
      firstName: testEmployeeUser.firstName,
      lastName: testEmployeeUser.lastName,
      phoneNumber: testEmployeeUser.phoneNumber,
      email: testEmployeeUser.email,
      password: testEmployeeUser.password,
      type: testEmployeeUser.type,
      status: testEmployeeUser.status,
      shop: {
        create: {
          id: testShop.id,
          phoneNumber: testShop.phoneNumber,
          email: testShop.email,
          name: testShop.name,
          address: testShop.address,
          postalCode: testShop.postalCode,
          city: testShop.city,
          province: testShop.province,
          latitude: testShop.latitude,
          longitude: testShop.longitude,
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
          id: testWorkOrder.customerId,
        },
      },
      vehicle: {
        connect: {
          id: testWorkOrder.vehicleId,
        },
      },
      shop: {
        connect: {
          id: testWorkOrder.shopId,
        },
      },
    },
  });
};
