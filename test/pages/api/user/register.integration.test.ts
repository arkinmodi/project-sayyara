/**
 *
 * User Registration Flow Integration Tests
 *
 * @group integration
 */

import { User } from "@prisma/client";

import registrationHandler from "@pages/api/user/register";
import { prisma } from "@server/db/client";
import { mockRequestResponse } from "@test/mocks/mockRequestResponse";

const testUser: User = {
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
  const deleteUsers = prisma.user.deleteMany({});
  await prisma.$transaction([deleteUsers]);
});

describe("new user registration", () => {
  describe("given valid new user data", () => {
    it("should create new user", async () => {
      const { req, res } = mockRequestResponse({ method: "POST" });
      req.body = {
        email: testUser.email,
        password: testUser.password,
        first_name: testUser.first_name,
        last_name: testUser.last_name,
        type: testUser.type,
      };

      await registrationHandler(req, res);
      const newUser = await prisma.user.findUnique({
        where: { email: testUser.email },
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
      await prisma.user.create({
        data: {
          email: testUser.email,
          password: testUser.password,
          first_name: testUser.first_name,
          last_name: testUser.last_name,
          type: testUser.type,
        },
      });

      const { req, res } = mockRequestResponse({ method: "POST" });
      req.body = {
        email: testUser.email,
        password: testUser.password,
        first_name: testUser.first_name,
        last_name: testUser.last_name,
        type: testUser.type,
      };

      await registrationHandler(req, res);

      console.log(res._getJSONData());

      expect(res.statusCode).toBe(409);
      expect(res._getJSONData()).toEqual({
        message: "User with email address already exists.",
      });
    });
  });

  describe("given invalid user data", () => {
    it("should return 400", async () => {
      const { req, res } = mockRequestResponse({ method: "POST" });
      req.body = {
        password: testUser.password,
        first_name: testUser.first_name,
        last_name: testUser.last_name,
      };

      await registrationHandler(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        message: expect.anything(),
      });
    });
  });
});
