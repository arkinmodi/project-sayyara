/**
 *
 * Service Flow Integration Tests
 *
 * @group integration
 */

import serviceHandler from "@pages/api/service";
import serviceByIdHandler from "@pages/api/service/[id]";
import serviceByShopIdHandler from "@pages/api/shop/[id]/services/[[...type]]";
import {
  Employee,
  prisma,
  ServiceWithPartsType,
  Shop,
} from "@server/db/client";
import { createMockRequestResponse } from "@test/mocks/mockRequestResponse";
import { Session } from "next-auth";

const testShop: Shop = {
  id: "test_shop_id",
  create_time: new Date(),
  update_time: new Date(),
};

const testService: ServiceWithPartsType = {
  id: "",
  create_time: new Date(),
  update_time: new Date(),
  name: "test_service_name",
  description: "test_service_description",
  estimated_time: 2,
  total_price: 100,
  shop_id: testShop.id,
  type: "CANNED",
  parts: [
    {
      quantity: 2,
      cost: 100.0,
      name: "test_part",
      condition: "NEW",
      build: "OEM",
    },
  ],
  shop_id: null,
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
  await prisma.$transaction([
    prisma.service.deleteMany({}),
    prisma.shop.deleteMany({}),
  ]);
});

describe("create service", () => {
  describe("given new service", () => {
    it("should create the service", async () => {
      // Create Shop
      await createShop();

      const { req, res } = createMockRequestResponse({ method: "POST" });
      req.body = testService;
      await serviceHandler(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toMatchObject({
        ...testService,
        id: expect.any(String),
        create_time: expect.any(String),
        update_time: expect.any(String),
      });
    });
  });

  describe("given duplicate service", () => {
    it("should create a duplicate service", async () => {
      // Create Shop
      await createShop();

      // Create First Service
      const firstService = createMockRequestResponse({ method: "POST" });
      firstService.req.body = testService;
      await serviceHandler(firstService.req, firstService.res);

      expect(firstService.res.statusCode).toBe(201);
      expect(firstService.res._getJSONData()).toMatchObject({
        ...testService,
        id: expect.any(String),
        create_time: expect.any(String),
        update_time: expect.any(String),
      });

      // Create Duplicate Service
      const duplicateService = createMockRequestResponse({ method: "POST" });
      duplicateService.req.body = testService;
      await serviceHandler(duplicateService.req, duplicateService.res);

      expect(duplicateService.res.statusCode).toBe(201);
      expect(duplicateService.res._getJSONData()).toMatchObject({
        ...testService,
        id: expect.any(String),
        create_time: expect.any(String),
        update_time: expect.any(String),
      });

      expect(firstService.res._getJSONData()["id"]).not.toBe(
        duplicateService.res._getJSONData()["id"]
      );
    });
  });
});

describe("get service", () => {
  describe("given service does not exist", () => {
    it("should return 404", async () => {
      const { req, res } = createMockRequestResponse({ method: "GET" });
      req.query = { ...req.query, id: "does_not_exist" };
      await serviceByIdHandler(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toMatchObject({
        message: "Service not found.",
      });
    });
  });

  describe("given service does exist", () => {
    it("should return service", async () => {
      // Create Shop
      await createShop();

      // Create Service
      const post = createMockRequestResponse({ method: "POST" });
      post.req.body = testService;
      await serviceHandler(post.req, post.res);

      expect(post.res.statusCode).toBe(201);

      testService.id = post.res._getJSONData()["id"];

      // Get Service
      const get = createMockRequestResponse({ method: "GET" });
      get.req.query = { ...get.req.query, id: testService.id };
      await serviceByIdHandler(get.req, get.res);

      expect(get.res.statusCode).toBe(200);
      expect(get.res._getJSONData()).toMatchObject({
        ...testService,
        create_time: expect.any(String),
        update_time: expect.any(String),
      });
    });

    describe("given a shop ID", () => {
      it("should return all the services for the shop", async () => {
        // Create Shop
        await createShop();

        // Create Service
        const post = createMockRequestResponse({ method: "POST" });
        post.req.body = testService;
        await serviceHandler(post.req, post.res);

        expect(post.res.statusCode).toBe(201);

        testService.id = post.res._getJSONData()["id"];

        // Get Service
        const get = createMockRequestResponse({ method: "GET" });
        get.req.query = { ...get.req.query, id: testService.shop_id };
        await serviceByShopIdHandler(get.req, get.res);

        expect(get.res.statusCode).toBe(200);
        expect(get.res._getJSONData()["length"]).toBe(1);
        expect(get.res._getJSONData()[0]).toMatchObject({
          ...testService,
          create_time: expect.any(String),
          update_time: expect.any(String),
        });
      });

      it("should return all the services for the shop which are of type CANNED", async () => {
        // Create Shop
        await createShop();

        // Create 2 Services
        const cannedService = createMockRequestResponse({ method: "POST" });
        cannedService.req.body = testService;
        await serviceHandler(cannedService.req, cannedService.res);
        expect(cannedService.res.statusCode).toBe(201);

        testService.type = "CUSTOM";
        const customService = createMockRequestResponse({ method: "POST" });
        customService.req.body = testService;
        await serviceHandler(customService.req, customService.res);
        expect(customService.res.statusCode).toBe(201);

        testService.id = cannedService.res._getJSONData()["id"];
        testService.type = "CANNED";

        // Get Service
        const get = createMockRequestResponse({ method: "GET" });
        get.req.query = {
          ...get.req.query,
          id: testService.shop_id,
          type: ["canned"],
        };
        await serviceByShopIdHandler(get.req, get.res);

        expect(get.res.statusCode).toBe(200);
        expect(get.res._getJSONData()["length"]).toBe(1);
        expect(get.res._getJSONData()[0]).toMatchObject({
          ...testService,
          create_time: expect.any(String),
          update_time: expect.any(String),
        });
      });

      it("should return all the services for the shop which are of type CUSTOM", async () => {
        // Create Shop
        await createShop();

        // Create 2 Services
        const cannedService = createMockRequestResponse({ method: "POST" });
        cannedService.req.body = testService;
        await serviceHandler(cannedService.req, cannedService.res);
        expect(cannedService.res.statusCode).toBe(201);

        testService.type = "CUSTOM";
        const customService = createMockRequestResponse({ method: "POST" });
        customService.req.body = testService;
        await serviceHandler(customService.req, customService.res);
        expect(customService.res.statusCode).toBe(201);

        testService.id = customService.res._getJSONData()["id"];

        // Get Service
        const get = createMockRequestResponse({ method: "GET" });
        get.req.query = {
          ...get.req.query,
          id: testService.shop_id,
          type: ["custom"],
        };
        await serviceByShopIdHandler(get.req, get.res);

        expect(get.res.statusCode).toBe(200);
        expect(get.res._getJSONData()["length"]).toBe(1);
        expect(get.res._getJSONData()[0]).toMatchObject({
          ...testService,
          create_time: expect.any(String),
          update_time: expect.any(String),
        });
      });
    });
  });

  describe("given no service ID", () => {
    it("should reject request", async () => {
      const { req, res } = createMockRequestResponse({ method: "GET" });
      await serviceByIdHandler(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toMatchObject({
        message: "Invalid Service ID.",
      });
    });
  });
});

describe("update service", () => {
  describe("given new name", () => {
    it("should update name", async () => {
      await createShop();
      const id = await createService();
      const update = createMockRequestResponse({ method: "PATCH" });
      update.req.query = { ...update.req.query, id };
      update.req.body = { name: "new_name" };

      await serviceByIdHandler(update.req, update.res);

      expect(update.res.statusCode).toBe(200);
      expect(update.res._getJSONData()).toMatchObject({ name: "new_name" });

      const get = createMockRequestResponse({ method: "GET" });
      get.req.query = { ...get.req.query, id };
      await serviceByIdHandler(get.req, get.res);

      expect(get.res.statusCode).toBe(200);
      expect(get.res._getJSONData()).toMatchObject({
        ...testService,
        create_time: expect.any(String),
        update_time: expect.any(String),
        id,
        name: "new_name",
      });
    });
  });
});

describe("delete service", () => {
  describe("given service ID", () => {
    it("should delete service", async () => {
      await createShop();
      const id = await createService();
      const deleteMock = createMockRequestResponse({ method: "DELETE" });
      deleteMock.req.query = { ...deleteMock.req.query, id };
      await serviceByIdHandler(deleteMock.req, deleteMock.res);

      expect(deleteMock.res.statusCode).toBe(204);

      const get = createMockRequestResponse({ method: "GET" });
      get.req.query = { ...get.req.query, id };
      await serviceByIdHandler(get.req, get.res);

      expect(get.res.statusCode).toBe(404);
    });
  });
});

const createService = async () => {
  const { req, res } = createMockRequestResponse({ method: "POST" });
  req.body = testService;
  await serviceHandler(req, res);
  return res._getJSONData()["id"] as string;
};

const createShop = async () => {
  return await prisma.shop.create({ data: testShop });
};
