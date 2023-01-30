/**
 *
 * Shop Flow Integration Tests
 *
 * @group integration
 */

import shopByIdHandler from "@pages/api/shop/[id]";
import { Employee, prisma } from "@server/db/client";
import { createShop } from "@server/services/shopService";
import { createMockRequestResponse } from "@test/mocks/mockRequestResponse";
import { Session } from "next-auth";

const testShop = {
  create_time: new Date(),
  update_time: new Date(),
  name: "test_shop_name",
  address: "test_address",
  phone_number: "test_phone_number",
  email: "test@email.com",
  postal_code: "test_postal_code",
  city: "test_city",
  province: "test_province",
};

const testEmployeeUser: Employee = {
  id: "test_id",
  first_name: "first_name",
  last_name: "last_name",
  phone_number: "1234567890",
  email: "user@test.com",
  password: "test_password",
  image: null,
  create_time: new Date(),
  update_time: new Date(),
  type: "SHOP_OWNER",
  shop_id: "shop_id",
};

jest.mock("@server/common/getServerAuthSession", () => ({
  getServerAuthSession: jest.fn<Session, []>(() => ({
    expires: "1",
    user: {
      ...testEmployeeUser,
      firstName: testEmployeeUser.first_name,
      lastName: testEmployeeUser.last_name,
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
  const deleteShops = prisma.shop.deleteMany({});
  await prisma.$transaction([deleteShops]);
});

describe("get shop", () => {
  describe("given shop does not exist", () => {
    it("should return 404", async () => {
      const { req, res } = createMockRequestResponse({ method: "GET" });
      req.query = { ...req.query, id: "does_not_exist" };
      await shopByIdHandler(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toMatchObject({
        message: "Shop not found.",
      });
    });
  });

  describe("given shop does exist", () => {
    it("should return shop", async () => {
      // Create Shop
      const shop = await createShop(testShop);

      // Get Shop
      const get = createMockRequestResponse({ method: "GET" });
      get.req.query = { ...get.req.query, id: shop.id };
      await shopByIdHandler(get.req, get.res);

      expect(get.res.statusCode).toBe(200);
      expect(get.res._getJSONData()).toMatchObject({
        ...testShop,
        id: shop.id,
        create_time: expect.any(String),
        update_time: expect.any(String),
      });
    });
  });

  describe("given no shop ID", () => {
    it("should reject request", async () => {
      const { req, res } = createMockRequestResponse({ method: "GET" });
      await shopByIdHandler(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toMatchObject({
        message: "Invalid Shop ID.",
      });
    });
  });
});

describe("update shop", () => {
  describe("given new name", () => {
    it("should update name", async () => {
      const shop = await createShop(testShop);
      const update = createMockRequestResponse({ method: "PATCH" });
      update.req.query = { ...update.req.query, id: shop.id };
      update.req.body = { name: "new_name" };

      await shopByIdHandler(update.req, update.res);

      expect(update.res.statusCode).toBe(200);
      expect(update.res._getJSONData()).toMatchObject({ name: "new_name" });

      const get = createMockRequestResponse({ method: "GET" });
      get.req.query = { ...get.req.query, id: shop.id };
      await shopByIdHandler(get.req, get.res);

      expect(get.res.statusCode).toBe(200);
      expect(get.res._getJSONData()).toMatchObject({
        ...testShop,
        create_time: expect.any(String),
        update_time: expect.any(String),
        id: shop.id,
        name: "new_name",
      });
    });

    describe("given new hours of operation", () => {
      it("should update hours of operation", async () => {
        const hoursOfOperation = {
          monday: {
            isOpen: true,
            openTime: "1970-01-01T09:00:00Z",
            closeTime: "1970-01-01T17:00:00Z",
          },
          tuesday: {
            isOpen: true,
            openTime: "1970-01-01T09:00:00Z",
            closeTime: "1970-01-01T17:00:00Z",
          },
          wednesday: {
            isOpen: true,
            openTime: "1970-01-01T09:00:00Z",
            closeTime: "1970-01-01T17:00:00Z",
          },
          thursday: {
            isOpen: true,
            openTime: "1970-01-01T09:00:00Z",
            closeTime: "1970-01-01T17:00:00Z",
          },
          friday: {
            isOpen: true,
            openTime: "1970-01-01T09:00:00Z",
            closeTime: "1970-01-01T17:00:00Z",
          },
          saturday: {
            isOpen: false,
            openTime: "1970-01-01T09:00:00Z",
            closeTime: "1970-01-01T17:00:00Z",
          },
          sunday: {
            isOpen: false,
            openTime: "1970-01-01T09:00:00Z",
            closeTime: "1970-01-01T17:00:00Z",
          },
        };
        const shop = await createShop(testShop);
        const update = createMockRequestResponse({ method: "PATCH" });
        update.req.query = { ...update.req.query, id: shop.id };
        update.req.body = {
          hours_of_operation: hoursOfOperation,
        };

        await shopByIdHandler(update.req, update.res);

        expect(update.res.statusCode).toBe(200);
        expect(update.res._getJSONData()).toMatchObject({
          hours_of_operation: hoursOfOperation,
        });

        const get = createMockRequestResponse({ method: "GET" });
        get.req.query = { ...get.req.query, id: shop.id };
        await shopByIdHandler(get.req, get.res);

        expect(get.res.statusCode).toBe(200);
        expect(get.res._getJSONData()).toMatchObject({
          ...testShop,
          create_time: expect.any(String),
          update_time: expect.any(String),
          id: shop.id,
          hours_of_operation: hoursOfOperation,
        });
      });
    });
  });
});
