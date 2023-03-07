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

const testEmployee: Employee = {
  id: "1",
  create_time: new Date(),
  update_time: new Date(),
  first_name: "bob",
  last_name: "ban",
  phone_number: "4162342343",
  email: "bob@gmail.com",
  password: "password",
  image: null,
  type: "EMPLOYEE",
  shop_id: testShop.id,
  status: "ACTIVE",
};

const testShopOwner: Employee = {
  id: "2",
  first_name: "shop_owner_first_name",
  last_name: "shop_owner_last_name",
  phone_number: "1234567890",
  email: "shop_owner@test.com",
  password: "shop_owner_password",
  image: null,
  create_time: new Date(),
  update_time: new Date(),
  type: "SHOP_OWNER",
  status: "ACTIVE",
  shop_id: testShop.id,
};

jest.mock("@server/common/getServerAuthSession", () => ({
  getServerAuthSession: jest.fn<Session, []>(() => ({
    expires: "1",
    user: {
      ...testShopOwner,
      firstName: testShopOwner.first_name,
      lastName: testShopOwner.last_name,
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
    req.query = { id: testEmployee.shop_id };
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
    patch.req.query = { id: "employee_id_does_not_exist" };
    patch.req.body = { status: "SUSPENDED" };

    await employeeByIdHandler(patch.req, patch.res);

    expect(patch.res.statusCode).toBe(403);
  });
});

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

const createEmployee = async () => {
  return await prisma.employee.create({ data: testEmployee });
};

const createShopOwner = async () => {
  return await prisma.employee.create({ data: testShopOwner });
};
