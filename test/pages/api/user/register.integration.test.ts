/**
 *
 * User Registration Flow Integration Tests
 *
 * @group integration
 */

import registerCustomerHandler from "@pages/api/user/register/customer";
import registerEmployeeHandler from "@pages/api/user/register/employee";
import registerShopOwnerHandler from "@pages/api/user/register/shopOwner";
import {
  CustomerWithVehiclesType,
  Employee,
  EmployeeWithShopType,
  prisma,
} from "@server/db/client";
import { createMockRequestResponse } from "@test/mocks/mockRequestResponse";

const testEmployee: Employee = {
  id: "",
  firstName: "employeeFirstName",
  lastName: "employeeLastName",
  phoneNumber: "1234567890",
  email: "employee@test.com",
  password: "testPASSWORD11",
  image: null,
  createTime: new Date(),
  updateTime: new Date(),
  type: "EMPLOYEE",
  shopId: "shopId",
  status: "ACTIVE",
};

const testShopOwner: EmployeeWithShopType = {
  id: "",
  firstName: "shopOwnerFirstName",
  lastName: "shopOwnerLastName",
  phoneNumber: "1234567890",
  email: "shopOwner@test.com",
  password: "testPASSWORD11",
  image: null,
  createTime: new Date(),
  updateTime: new Date(),
  type: "SHOP_OWNER",
  status: "ACTIVE",
  shopId: "shopId",
  shop: {
    id: "shopId",
    createTime: new Date(),
    updateTime: new Date(),
    name: "testShopName",
    address: "testAddress",
    phoneNumber: "1234567890",
    email: "test@email.com",
    postalCode: "A1A 1A1",
    city: "testCity",
    province: "testProvince",
    latitude: "43.0000",
    longitude: "-79.0000",
    hoursOfOperation: null,
  },
};

const testCustomer: CustomerWithVehiclesType = {
  id: "",
  firstName: "customerFirstName",
  lastName: "customerLastName",
  phoneNumber: "1234567890",
  email: "customer@test.com",
  password: "testPASSWORD11",
  image: null,
  createTime: new Date(),
  updateTime: new Date(),
  type: "CUSTOMER",
  vehicles: [
    {
      id: "testCustomerVehicleId",
      createTime: new Date(),
      updateTime: new Date(),
      customerId: "testCustomerId",
      licensePlate: "testLicensePlate",
      make: "testMake",
      model: "testModel",
      vin: "testVin",
      year: 2017,
    },
  ],
};

const MOCK_BING_MAPS_RESPONSE = {
  resourceSets: [
    {
      resources: [
        {
          point: {
            coordinates: [43.1, -79.1],
          },
        },
      ],
    },
  ],
};

(global as any).fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(MOCK_BING_MAPS_RESPONSE),
    ok: true,
    status: 200,
  })
);

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

afterEach(async () => {
  await prisma.$transaction([
    prisma.vehicle.deleteMany(),
    prisma.employee.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.shop.deleteMany(),
  ]);
});

describe("User Module", () => {
  it("FRT-M3-1: create customer request received with valid information", async () => {
    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      email: testCustomer.email,
      password: testCustomer.password,
      firstName: testCustomer.firstName,
      lastName: testCustomer.lastName,
      phoneNumber: testCustomer.phoneNumber,
      vehicle: {
        year: testCustomer.vehicles[0]?.year,
        make: testCustomer.vehicles[0]?.make,
        model: testCustomer.vehicles[0]?.model,
        vin: testCustomer.vehicles[0]?.vin,
        licensePlate: testCustomer.vehicles[0]?.licensePlate,
      },
    };

    await registerCustomerHandler(req, res);
    const newCustomer = await prisma.customer.findUnique({
      where: { email: testCustomer.email },
      include: { vehicles: true },
    });

    expect(res.statusCode).toBe(302);
    expect(newCustomer).toEqual({
      id: expect.any(String),
      firstName: testCustomer.firstName,
      lastName: testCustomer.lastName,
      phoneNumber: testCustomer.phoneNumber,
      email: testCustomer.email,
      password: expect.any(String),
      image: null,
      createTime: expect.any(Date),
      updateTime: expect.any(Date),
      type: "CUSTOMER",
      vehicles: [
        {
          id: expect.any(String),
          createTime: expect.any(Date),
          updateTime: expect.any(Date),
          year: testCustomer.vehicles[0]?.year,
          make: testCustomer.vehicles[0]?.make,
          model: testCustomer.vehicles[0]?.model,
          vin: testCustomer.vehicles[0]?.vin,
          licensePlate: testCustomer.vehicles[0]?.licensePlate,
          customerId: expect.any(String),
        },
      ],
    });
  });

  it("FRT-M3-2: create customer request received with invalid information", async () => {
    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      email: testCustomer.email,
      password: testCustomer.password,
      firstName: testCustomer.firstName,
      lastName: testCustomer.lastName,
      phoneNumber: testCustomer.phoneNumber,
    };

    await registerCustomerHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("FRT-M3-3: create shop owner request received with valid information", async () => {
    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      email: testShopOwner.email,
      password: testShopOwner.password,
      firstName: testShopOwner.firstName,
      lastName: testShopOwner.lastName,
      phoneNumber: testShopOwner.phoneNumber,
      shop: testShopOwner.shop,
    };

    await registerShopOwnerHandler(req, res);
    const newShopOwner = await prisma.employee.findUnique({
      where: { email: testShopOwner.email },
    });

    expect(res.statusCode).toBe(302);
    expect(newShopOwner).toEqual({
      id: expect.any(String),
      createTime: expect.any(Date),
      updateTime: expect.any(Date),
      firstName: testShopOwner.firstName,
      lastName: testShopOwner.lastName,
      phoneNumber: testShopOwner.phoneNumber,
      email: testShopOwner.email,
      password: expect.any(String),
      image: null,
      type: testShopOwner.type,
      shopId: expect.any(String),
      status: testEmployee.status,
    });
  });

  it("FRT-M3-4: create shop owner request received with invalid information", async () => {
    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      email: testShopOwner.email,
      password: testShopOwner.password,
      firstName: testShopOwner.firstName,
      lastName: testShopOwner.lastName,
      phoneNumber: testShopOwner.phoneNumber,
    };

    await registerCustomerHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("FRT-M3-5: create employee request received with valid information", async () => {
    // Create Shop
    const shop = await createShop();
    testEmployee.shopId = shop.id;

    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      email: testEmployee.email,
      password: testEmployee.password,
      firstName: testEmployee.firstName,
      lastName: testEmployee.lastName,
      phoneNumber: testEmployee.phoneNumber,
      shopId: testEmployee.shopId,
    };

    await registerEmployeeHandler(req, res);
    const newEmployee = await prisma.employee.findUnique({
      where: { email: testEmployee.email },
    });

    expect(res.statusCode).toBe(302);
    expect(newEmployee).toEqual({
      id: expect.any(String),
      createTime: expect.any(Date),
      updateTime: expect.any(Date),
      firstName: testEmployee.firstName,
      lastName: testEmployee.lastName,
      phoneNumber: testEmployee.phoneNumber,
      email: testEmployee.email,
      password: expect.any(String),
      image: null,
      type: testEmployee.type,
      shopId: testEmployee.shopId,
      status: testEmployee.status,
    });
  });

  it("FRT-M3-6: create employee request received with invalid information", async () => {
    // Create Shop
    const shop = await createShop();
    testEmployee.shopId = shop.id;

    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      email: testEmployee.email,
      password: testEmployee.password,
      firstName: testEmployee.firstName,
      lastName: testEmployee.lastName,
      shopId: testEmployee.shopId,
    };

    await registerEmployeeHandler(req, res);

    expect(res.statusCode).toBe(400);
  });
});

const createShop = async () => {
  return await prisma.shop.create({
    data: {
      phoneNumber: testShopOwner.shop.phoneNumber,
      email: testShopOwner.shop.email,
      name: testShopOwner.shop.name,
      address: testShopOwner.shop.address,
      postalCode: testShopOwner.shop.postalCode,
      city: testShopOwner.shop.city,
      province: testShopOwner.shop.province,
      latitude: testShopOwner.shop.latitude,
      longitude: testShopOwner.shop.longitude,
    },
  });
};
