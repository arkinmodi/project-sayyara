/**
 *
 * Employee Management Flow Integration Tests
 *
 * @group integration
 */

import employeeHandler from "@pages/api/employeeManagement/[id]";
import { Employee, prisma, Shop } from "@server/db/client";
import { createMockRequestResponse } from "@test/mocks/mockRequestResponse";
import { Session } from "next-auth";

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
  shop_id: "1",
  status: "ACTIVE",
};

const testShop: Shop = {
  id: "test_shop_id",
  create_time: new Date(),
  update_time: new Date(),
};

jest.mock("@server/common/getServerAuthSession", () => ({
  getServerAuthSession: jest.fn<Session, []>(() => ({
    expires: "1",
    user: {
      ...testEmployee,
      firstName: testEmployee.first_name,
      lastName: testEmployee.last_name,
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
  await prisma.$transaction([prisma.employee.deleteMany({})]);
});

describe("get all employees", () => {
  describe("given employee does not exist", () => {
    it("should return 404", async () => {
      const { req, res } = createMockRequestResponse({ method: "GET" });
      req.query = { ...req.query, id: "does_not_exist" };
      await employeeHandler(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toMatchObject({
        message: "employees for shop not found.",
      });
    });
  });

  // describe("given employee does exist", () => {
  //   it("should return employee", async () => {
  //     // Create employee
  //     testEmployee.id = (await createEmployee()).id;

  //     // Get employee
  //     const get = createMockRequestResponse({ method: "GET" });
  //     get.req.query = { ...get.req.query, id: testEmployee.id };
  //     await employeeHandler(get.req, get.res);

  //     expect(get.res.statusCode).toBe(200);
  //     expect(get.res._getJSONData()).toMatchObject({
  //       ...testEmployee,
  //       create_time: expect.any(String),
  //       update_time: expect.any(String),
  //     });
  //   });
  // });
});

// describe("suspend employee", () => {
//   it("should update name", async () => {
//     const id = await createEmployee();
//     const update = createMockRequestResponse({ method: "PATCH" });
//     update.req.query = { ...update.req.query, id };

//     await employeeHandler(update.req, update.res);

//     expect(update.res.statusCode).toBe(200);
//     expect(update.res._getJSONData()).toMatchObject({ status: "SUSPENDED" });

//     const get = createMockRequestResponse({ method: "GET" });
//     get.req.query = { ...get.req.query, id };
//     await employeeHandler(get.req, get.res);

//     expect(get.res.statusCode).toBe(200);
//     expect(get.res._getJSONData()).toMatchObject({
//       ...testEmployee,
//       create_time: expect.any(String),
//       update_time: expect.any(String),
//       id,
//       status: "SUSPENDED",
//     });
//   });
// });

const createEmployee = async () => {
  return await prisma.employee.create({ data: testEmployee });
};

const createShop = async () => {
  return await prisma.shop.create({ data: testShop });
};
