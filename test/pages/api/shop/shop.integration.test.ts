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
  status: "ACTIVE",
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

describe("Shop Module", () => {
  it("FRT-M9-1: Get shop request with an invalid shop ID", async () => {
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = { ...req.query, id: "does_not_exist" };
    await shopByIdHandler(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toMatchObject({
      message: "Shop not found.",
    });
  });

  it("FRT-M9-2: Get shop request with an valid shop ID", async () => {
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

  it("FRT-M9-3: Update shop request with a valid shop ID and valid information", async () => {
    const hoursOfOperation = {
      monday: {
        isOpen: true,
        openTime: "1970-01-01T09:00:00.000Z",
        closeTime: "1970-01-01T17:00:00.000Z",
      },
      tuesday: {
        isOpen: true,
        openTime: "1970-01-01T09:00:00.000Z",
        closeTime: "1970-01-01T17:00:00.000Z",
      },
      wednesday: {
        isOpen: true,
        openTime: "1970-01-01T09:00:00.000Z",
        closeTime: "1970-01-01T17:00:00.000Z",
      },
      thursday: {
        isOpen: true,
        openTime: "1970-01-01T09:00:00.000Z",
        closeTime: "1970-01-01T17:00:00.000Z",
      },
      friday: {
        isOpen: true,
        openTime: "1970-01-01T09:00:00.000Z",
        closeTime: "1970-01-01T17:00:00.000Z",
      },
      saturday: {
        isOpen: false,
        openTime: "1970-01-01T09:00:00.000Z",
        closeTime: "1970-01-01T17:00:00.000Z",
      },
      sunday: {
        isOpen: false,
        openTime: "1970-01-01T09:00:00.000Z",
        closeTime: "1970-01-01T17:00:00.000Z",
      },
    };

    const shop = await createShop(testShop);
    const update = createMockRequestResponse({ method: "PATCH" });
    update.req.query = { ...update.req.query, id: shop.id };
    // Change name and hours of operation
    update.req.body = {
      name: "new_name",
      hours_of_operation: hoursOfOperation,
    };

    await shopByIdHandler(update.req, update.res);

    expect(update.res.statusCode).toBe(200);
    expect(update.res._getJSONData()).toMatchObject({
      name: "new_name",
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
      name: "new_name",
      hours_of_operation: hoursOfOperation,
    });
  });

  it("FRT-M9-4: Update shop request with an invalid shop ID and valid information", async () => {
    const hoursOfOperation = {
      monday: {
        isOpen: true,
        openTime: "1970-01-01T09:00:00.000Z",
        closeTime: "1970-01-01T17:00:00.000Z",
      },
      tuesday: {
        isOpen: true,
        openTime: "1970-01-01T09:00:00.000Z",
        closeTime: "1970-01-01T17:00:00.000Z",
      },
      wednesday: {
        isOpen: true,
        openTime: "1970-01-01T09:00:00.000Z",
        closeTime: "1970-01-01T17:00:00.000Z",
      },
      thursday: {
        isOpen: true,
        openTime: "1970-01-01T09:00:00.000Z",
        closeTime: "1970-01-01T17:00:00.000Z",
      },
      friday: {
        isOpen: true,
        openTime: "1970-01-01T09:00:00.000Z",
        closeTime: "1970-01-01T17:00:00.000Z",
      },
      saturday: {
        isOpen: false,
        openTime: "1970-01-01T09:00:00.000Z",
        closeTime: "1970-01-01T17:00:00.000Z",
      },
      sunday: {
        isOpen: false,
        openTime: "1970-01-01T09:00:00.000Z",
        closeTime: "1970-01-01T17:00:00.000Z",
      },
    };

    const shop = await createShop(testShop);
    const update = createMockRequestResponse({ method: "PATCH" });
    update.req.query = { ...update.req.query, id: "invalid_shop_id" };
    // Change name and hours of operation
    update.req.body = {
      name: "new_name",
      hours_of_operation: hoursOfOperation,
    };

    await shopByIdHandler(update.req, update.res);

    expect(update.res.statusCode).toBe(404);
    expect(update.res._getJSONData()).toMatchObject({
      message: "Shop not found.",
    });
  });

  it("FRT-M9-5: Update shop request with an valid shop ID and invalid information", async () => {
    const shop = await createShop(testShop);
    const update = createMockRequestResponse({ method: "PATCH" });
    update.req.query = { ...update.req.query, id: shop.id };
    // Change name and hours of operation
    update.req.body = {
      email: "invalid_email",
    };

    await shopByIdHandler(update.req, update.res);

    expect(update.res.statusCode).toBe(400);
  });
});
