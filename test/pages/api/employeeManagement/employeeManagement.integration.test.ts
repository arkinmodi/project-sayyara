/**
 *
 * Employee Management Flow Integration Tests
 *
 * @group integration
 */

import employeeByIdHandler from "@pages/api/employee/[id]";
import employeeByShopIdHandler from "@pages/api/shop/[id]/employees";
import { Employee, prisma, Shop } from "@server/db/client";
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

const testEmployee: Employee = {
  id: "1",
  createTime: new Date(),
  updateTime: new Date(),
  firstName: "bob",
  lastName: "ban",
  phoneNumber: "4162342343",
  email: "bob@gmail.com",
  password: "password",
  image: null,
  type: "EMPLOYEE",
  shopId: testShop.id,
  status: "ACTIVE",
};

const testShopOwner: Employee = {
  id: "2",
  firstName: "shopOwnerFirstName",
  lastName: "shopOwnerLastName",
  phoneNumber: "1234567890",
  email: "shopOwner@test.com",
  password: "shopOwnerPassword",
  image: null,
  createTime: new Date(),
  updateTime: new Date(),
  type: "SHOP_OWNER",
  status: "ACTIVE",
  shopId: testShop.id,
};

jest.mock("@server/common/getServerAuthSession", () => ({
  getServerAuthSession: jest.fn<Session, []>(() => ({
    expires: "1",
    user: {
      ...testShopOwner,
      firstName: testShopOwner.firstName,
      lastName: testShopOwner.lastName,
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
    prisma.employee.deleteMany({}),
    prisma.shop.deleteMany({}),
  ]);
});

describe("Employee Management Module", () => {
  it("FRT-M7-1: get all employees given valid shop ID", async () => {
    // Create shop and employees
    await createShop();
    await createShopOwner();
    await createEmployee();

    // Get employee
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = { id: testEmployee.shopId };
    await employeeByShopIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(2);
  });

  it("FRT-M7-2: get all employees given invalid shop ID", async () => {
    // Create shop and employees
    await createShop();
    await createShopOwner();
    await createEmployee();

    // Get employee
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = { id: testEmployee.id };
    await employeeByShopIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(0);
  });

  it("FRT-M7-3: suspend employee for given valid employee ID", async () => {
    // Create shop and employees
    await createShop();
    await createShopOwner();
    await createEmployee();

    const patch = createMockRequestResponse({ method: "PATCH" });
    patch.req.query = { ...patch.req.query, id: testEmployee.id };
    patch.req.body = { status: "SUSPENDED" };

    await employeeByIdHandler(patch.req, patch.res);

    expect(patch.res.statusCode).toBe(200);
    expect(patch.res._getJSONData()).toMatchObject({
      status: "SUSPENDED",
    });
  });

  it("FRT-M7-4: suspend employee for given invalid employee ID", async () => {
    // Create shop and employees
    await createShop();
    await createShopOwner();
    await createEmployee();

    const patch = createMockRequestResponse({ method: "PATCH" });
    patch.req.query = { id: "employeeIdDoesNotExist" };
    patch.req.body = { status: "SUSPENDED" };

    await employeeByIdHandler(patch.req, patch.res);

    expect(patch.res.statusCode).toBe(403);
  });
});

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
      latitude: testShop.latitude,
      longitude: testShop.longitude,
    },
  });
};

const createEmployee = async () => {
  return await prisma.employee.create({ data: testEmployee });
};

const createShopOwner = async () => {
  return await prisma.employee.create({ data: testShopOwner });
};
