/**
 *
 * Shop Flow Integration Tests
 *
 * @group integration
 */

import shopLookupHandler from "@pages/api/shop/lookup";
import shopByIdHandler from "@pages/api/shop/[id]";
import { Employee, prisma, ServiceType } from "@server/db/client";
import { createService } from "@server/services/serviceService";
import { createShop } from "@server/services/shopService";
import { createMockRequestResponse } from "@test/mocks/mockRequestResponse";
import { Session } from "next-auth";

const testShop = {
  createTime: new Date(),
  updateTime: new Date(),
  name: "testShopName",
  address: "testAddress",
  phoneNumber: "testPhoneNumber",
  email: "test@email.com",
  postalCode: "testPostalCode",
  city: "testCity",
  province: "testProvince",
};

const testShop2 = {
  createTime: new Date(),
  updateTime: new Date(),
  name: "anotherShop",
  address: "testAddress2",
  phoneNumber: "testPhoneNumber2",
  email: "test2@email.com",
  postalCode: "testPostalCode2",
  city: "testCity",
  province: "testProvince",
};

const testShop3 = {
  createTime: new Date(),
  updateTime: new Date(),
  name: "oneMoreShop",
  address: "testAddress3",
  phoneNumber: "testPhoneNumber3",
  email: "test3@email.com",
  postalCode: "testPostalCode3",
  city: "testCity",
  province: "testProvince",
};

const testService = {
  id: "testServiceId",
  createTime: new Date(),
  updateTime: new Date(),
  name: "testServiceName",
  description: "testServiceDescription",
  estimatedTime: 2,
  totalPrice: 100,
  type: ServiceType.CANNED,
  parts: [],
};

const testEmployeeUser: Employee = {
  id: "testId",
  firstName: "firstName",
  lastName: "lastName",
  phoneNumber: "1234567890",
  email: "user@test.com",
  password: "testPassword",
  image: null,
  createTime: new Date(),
  updateTime: new Date(),
  type: "SHOP_OWNER",
  shopId: "shopId",
  status: "ACTIVE",
};

jest.mock("@server/common/getServerAuthSession", () => ({
  getServerAuthSession: jest.fn<Session, []>(() => ({
    expires: "1",
    user: {
      ...testEmployeeUser,
      firstName: testEmployeeUser.firstName,
      lastName: testEmployeeUser.lastName,
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
    prisma.service.deleteMany({}),
    prisma.shop.deleteMany({}),
  ]);
});

describe("Shop Module", () => {
  it("FRT-M9-1: Get shop request with an invalid shop ID", async () => {
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = { ...req.query, id: "doesNotExist" };
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
      createTime: expect.any(String),
      updateTime: expect.any(String),
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
      name: "newName",
      hoursOfOperation: hoursOfOperation,
    };

    await shopByIdHandler(update.req, update.res);

    expect(update.res.statusCode).toBe(200);
    expect(update.res._getJSONData()).toMatchObject({
      name: "newName",
      hoursOfOperation: hoursOfOperation,
    });

    const get = createMockRequestResponse({ method: "GET" });
    get.req.query = { ...get.req.query, id: shop.id };
    await shopByIdHandler(get.req, get.res);

    expect(get.res.statusCode).toBe(200);
    expect(get.res._getJSONData()).toMatchObject({
      ...testShop,
      createTime: expect.any(String),
      updateTime: expect.any(String),
      id: shop.id,
      name: "newName",
      hoursOfOperation: hoursOfOperation,
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
    update.req.query = { ...update.req.query, id: "invalidShopId" };
    // Change name and hours of operation
    update.req.body = {
      name: "newName",
      hoursOfOperation: hoursOfOperation,
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
      email: "invalidEmail",
    };

    await shopByIdHandler(update.req, update.res);

    expect(update.res.statusCode).toBe(400);
  });

  it("FRT-M9-6: Get shop request with a valid shop name", async () => {
    const shop = await createShop(testShop);
    const shop2 = await createShop(testShop2);
    const shop3 = await createShop(testShop3);

    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = { ...req.query, name: shop.name, shop: "true" };
    await shopLookupHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(1);
    expect(res._getJSONData()).toMatchObject([
      {
        ...testShop,
        name: shop.name,
        createTime: expect.any(String),
        updateTime: expect.any(String),
      },
    ]);
  });

  it("FRT-M9-7: Get shop request with a phrase that exists in multiple shop names", async () => {
    const shop = await createShop(testShop);
    const shop2 = await createShop(testShop2);
    const shop3 = await createShop(testShop3);

    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = { ...req.query, name: "shop", shop: "true" };
    await shopLookupHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(3);
    expect(res._getJSONData()).toMatchObject([
      {
        ...testShop,
        name: shop.name,
        createTime: expect.any(String),
        updateTime: expect.any(String),
      },
      {
        ...testShop2,
        name: shop2.name,
        createTime: expect.any(String),
        updateTime: expect.any(String),
      },
      {
        ...testShop3,
        name: shop3.name,
        createTime: expect.any(String),
        updateTime: expect.any(String),
      },
    ]);
  });

  it("FRT-M9-8: Get shop request with a shop name that does not exist in the list of shop names", async () => {
    const shop = await createShop(testShop);
    const shop2 = await createShop(testShop2);
    const shop3 = await createShop(testShop3);

    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = { ...req.query, name: "asfasdf", shop: "true" };
    await shopLookupHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(0);
    expect(res._getJSONData()).toMatchObject([]);
  });

  it("FRT-M9-9: Get shop request with a service name", async () => {
    const shop = await createShop(testShop);
    const shop2 = await createShop(testShop2);
    const shop3 = await createShop(testShop3);

    const service = await createService({ ...testService, shopId: shop.id });

    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = { ...req.query, name: "testServiceName", shop: "false" };
    await shopLookupHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(1);
    expect(res._getJSONData()).toMatchObject([
      {
        ...testShop,
        name: shop.name,
        createTime: expect.any(String),
        updateTime: expect.any(String),
      },
    ]);
  });

  it("FRT-M9-10: Get shop request with a service name that does not exist in any shop", async () => {
    const shop = await createShop(testShop);
    const shop2 = await createShop(testShop2);
    const shop3 = await createShop(testShop3);

    const service = await createService({ ...testService, shopId: shop.id });

    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = { ...req.query, name: "asdf", shop: "false" };
    await shopLookupHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(0);
    expect(res._getJSONData()).toMatchObject([]);
  });
});
