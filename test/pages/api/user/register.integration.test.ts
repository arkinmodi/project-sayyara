/**
 *
 * User Registration Flow Integration Tests
 *
 * @group integration
 */

import { Employee } from "@server/db/client";

import registrationHandler from "@pages/api/user/register";
import { prisma } from "@server/db/client";
import { createMockRequestResponse } from "@test/mocks/mockRequestResponse";

const testEmployeeUser: Employee = {
  id: "test_id",
  first_name: "first_name",
  last_name: "last_name",
  email: "user@test.com",
  password: "test_password",
  image: null,
  create_time: new Date(),
  update_time: new Date(),
  type: "SHOP_OWNER",
  shop_id: "shop_id",
};

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

afterEach(async () => {
  const deleteEmployees = prisma.employee.deleteMany({});
  const deleteCustomers = prisma.customer.deleteMany({});
  await prisma.$transaction([deleteEmployees, deleteCustomers]);
});

describe("new user registration", () => {
  describe("given valid new user data", () => {
    it("should create new user", async () => {
      const { req, res } = createMockRequestResponse({ method: "POST" });
      req.body = {
        email: testEmployeeUser.email,
        password: testEmployeeUser.password,
        first_name: testEmployeeUser.first_name,
        last_name: testEmployeeUser.last_name,
        type: testEmployeeUser.type,
      };

      await registrationHandler(req, res);
      const newUser = await prisma.employee.findUnique({
        where: { email: testEmployeeUser.email },
      });

      expect(res.statusCode).toBe(302);
      expect(newUser).toEqual({
        id: expect.any(String),
        first_name: "first_name",
        last_name: "last_name",
        email: "user@test.com",
        password: "test_password",
        image: null,
        type: "SHOP_OWNER",
        create_time: expect.any(Date),
        update_time: expect.any(Date),
        shop_id: null,
      });
    });
  });

  describe("given valid existing user data", () => {
    it("should not create new user", async () => {
      await prisma.employee.create({
        data: {
          email: testEmployeeUser.email,
          password: testEmployeeUser.password,
          first_name: testEmployeeUser.first_name,
          last_name: testEmployeeUser.last_name,
          type: testEmployeeUser.type,
        },
      });

      const { req, res } = createMockRequestResponse({ method: "POST" });
      req.body = {
        email: testEmployeeUser.email,
        password: testEmployeeUser.password,
        first_name: testEmployeeUser.first_name,
        last_name: testEmployeeUser.last_name,
        type: testEmployeeUser.type,
      };

      await registrationHandler(req, res);

      expect(res.statusCode).toBe(409);
      expect(res._getJSONData()).toEqual({
        message: "User with email address already exists.",
      });
    });
  });

  describe("given invalid user data", () => {
    it("should return 400", async () => {
      const { req, res } = createMockRequestResponse({ method: "POST" });
      req.body = {
        password: testEmployeeUser.password,
        first_name: testEmployeeUser.first_name,
        last_name: testEmployeeUser.last_name,
      };

      await registrationHandler(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        message: expect.anything(),
      });
    });
  });
});
