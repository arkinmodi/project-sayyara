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
  hoursOfOperation: null,
};

const testEmployeeUser: Employee = {
  id: "testEmployeeId",
  firstName: "firstName",
  lastName: "lastName",
  phoneNumber: "1234567890",
  email: "employee@test.com",
  password: "testPassword",
  image: null,
  createTime: new Date(),
  updateTime: new Date(),
  type: "SHOP_OWNER",
  shopId: testShop.id,
  status: "ACTIVE",
};

const testCannedService: ServiceWithPartsType = {
  id: "testCannedServiceId",
  createTime: new Date(),
  updateTime: new Date(),
  name: "testServiceName",
  description: "testServiceDescription",
  estimatedTime: 2,
  totalPrice: 100,
  type: "CANNED",
  parts: [
    {
      quantity: 2,
      cost: 100.0,
      name: "testPart",
      condition: "NEW",
      build: "OEM",
    },
  ],
  shopId: testShop.id,
};

const testCustomService: ServiceWithPartsType = {
  id: "testCustomServiceId",
  createTime: new Date(),
  updateTime: new Date(),
  name: "testServiceName",
  description: "testServiceDescription",
  estimatedTime: 2,
  totalPrice: 100,
  type: "CUSTOM",
  parts: [
    {
      quantity: 2,
      cost: 100.0,
      name: "testPart",
      condition: "NEW",
      build: "OEM",
    },
  ],
  shopId: testShop.id,
};
jest.mock("@server/common/getServerAuthSession", () => ({
  getServerAuthSession: jest.fn<Session, []>(() => ({
    expires: "1",
    user: {
      id: testEmployeeUser.id,
      firstName: testEmployeeUser.firstName,
      lastName: testEmployeeUser.lastName,
      email: testEmployeeUser.email,
      type: testEmployeeUser.type,
      shopId: testEmployeeUser.shopId,
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
    prisma.service.deleteMany(),
    prisma.employee.deleteMany(),
    prisma.shop.deleteMany(),
  ]);
});

describe("Services Module", () => {
  it("FRT-M8-1: create service request with valid information", async () => {
    // Setup
    await createEmployeeAndShop();

    // Create Service
    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      name: testCannedService.name,
      description: testCannedService.description,
      estimatedTime: testCannedService.estimatedTime,
      totalPrice: testCannedService.totalPrice,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shopId: testCannedService.shopId,
    };

    await serviceHandler(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toMatchObject({
      id: expect.any(String),
      createTime: expect.any(String),
      updateTime: expect.any(String),
      name: testCannedService.name,
      description: testCannedService.description,
      estimatedTime: testCannedService.estimatedTime,
      totalPrice: testCannedService.totalPrice,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shopId: testCannedService.shopId,
    });
  });

  it("FRT-M8-2: create service request with invalid information", async () => {
    // Setup
    await createEmployeeAndShop();

    // Create Service
    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      name: testCannedService.name,
      description: testCannedService.description,
      estimatedTime: testCannedService.estimatedTime,
      totalPrice: testCannedService.totalPrice,
      parts: testCannedService.parts,
      type: testCannedService.type,
    };

    await serviceHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("FRT-M8-3: get service request with a valid service id", async () => {
    // Setup
    await createEmployeeAndShop();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      name: testCannedService.name,
      description: testCannedService.description,
      estimatedTime: testCannedService.estimatedTime,
      totalPrice: testCannedService.totalPrice,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shopId: testCannedService.shopId,
    };
    await serviceHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    const serviceId = post.res._getJSONData()["id"] as string;

    // Get Service
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: serviceId,
    };

    await serviceByIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({
      id: serviceId,
      createTime: expect.any(String),
      updateTime: expect.any(String),
      name: testCannedService.name,
      description: testCannedService.description,
      estimatedTime: testCannedService.estimatedTime,
      totalPrice: testCannedService.totalPrice,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shopId: testCannedService.shopId,
    });
  });

  it("FRT-M8-4: get service request with an invalid service id", async () => {
    // Setup
    await createEmployeeAndShop();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      name: testCannedService.name,
      description: testCannedService.description,
      estimatedTime: testCannedService.estimatedTime,
      totalPrice: testCannedService.totalPrice,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shopId: testCannedService.shopId,
    };
    await serviceHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Get Service
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "serviceDoesNotExist",
    };

    await serviceByIdHandler(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("FRT-M8-5: get services request with a valid shop id", async () => {
    // Setup
    await createEmployeeAndShop();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      name: testCannedService.name,
      description: testCannedService.description,
      estimatedTime: testCannedService.estimatedTime,
      totalPrice: testCannedService.totalPrice,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shopId: testCannedService.shopId,
    };
    await serviceHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    const serviceId = post.res._getJSONData()["id"] as string;

    // Get Service
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: testCannedService.shopId,
    };

    await serviceByShopIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(1);
    expect(res._getJSONData()[0]).toMatchObject({
      id: serviceId,
      createTime: expect.any(String),
      updateTime: expect.any(String),
      name: testCannedService.name,
      description: testCannedService.description,
      estimatedTime: testCannedService.estimatedTime,
      totalPrice: testCannedService.totalPrice,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shopId: testCannedService.shopId,
    });
  });

  it("FRT-M8-6: get services request with an invalid shop id", async () => {
    // Setup
    await createEmployeeAndShop();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      name: testCannedService.name,
      description: testCannedService.description,
      estimatedTime: testCannedService.estimatedTime,
      totalPrice: testCannedService.totalPrice,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shopId: testCannedService.shopId,
    };
    await serviceHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Get Service
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "shopDoesNotExist",
    };

    await serviceByShopIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(0);
  });

  it("FRT-M8-7: get 'CANNED' services request with a valid shop id", async () => {
    // Setup
    await createEmployeeAndShop();

    const createCannedService = createMockRequestResponse({ method: "POST" });
    createCannedService.req.body = {
      name: testCannedService.name,
      description: testCannedService.description,
      estimatedTime: testCannedService.estimatedTime,
      totalPrice: testCannedService.totalPrice,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shopId: testCannedService.shopId,
    };
    await serviceHandler(createCannedService.req, createCannedService.res);
    expect(createCannedService.res.statusCode).toBe(201);

    const cannedServiceId = createCannedService.res._getJSONData()[
      "id"
    ] as string;

    const createCustomService = createMockRequestResponse({ method: "POST" });
    createCustomService.req.body = {
      name: testCustomService.name,
      description: testCustomService.description,
      estimatedTime: testCustomService.estimatedTime,
      totalPrice: testCustomService.totalPrice,
      parts: testCustomService.parts,
      type: testCustomService.type,
      shopId: testCustomService.shopId,
    };
    await serviceHandler(createCustomService.req, createCustomService.res);
    expect(createCustomService.res.statusCode).toBe(201);

    // Get Service
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: testCannedService.shopId,
      type: [testCannedService.type],
    };

    await serviceByShopIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(1);
    expect(res._getJSONData()[0]).toMatchObject({
      id: cannedServiceId,
      createTime: expect.any(String),
      updateTime: expect.any(String),
      name: testCannedService.name,
      description: testCannedService.description,
      estimatedTime: testCannedService.estimatedTime,
      totalPrice: testCannedService.totalPrice,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shopId: testCannedService.shopId,
    });
  });

  it("FRT-M8-8: get 'CANNED' services request with an invalid shop id", async () => {
    // Setup
    await createEmployeeAndShop();

    const createCannedService = createMockRequestResponse({ method: "POST" });
    createCannedService.req.body = {
      name: testCannedService.name,
      description: testCannedService.description,
      estimatedTime: testCannedService.estimatedTime,
      totalPrice: testCannedService.totalPrice,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shopId: testCannedService.shopId,
    };
    await serviceHandler(createCannedService.req, createCannedService.res);
    expect(createCannedService.res.statusCode).toBe(201);

    const createCustomService = createMockRequestResponse({ method: "POST" });
    createCustomService.req.body = {
      name: testCustomService.name,
      description: testCustomService.description,
      estimatedTime: testCustomService.estimatedTime,
      totalPrice: testCustomService.totalPrice,
      parts: testCustomService.parts,
      type: testCustomService.type,
      shopId: testCustomService.shopId,
    };
    await serviceHandler(createCustomService.req, createCustomService.res);
    expect(createCustomService.res.statusCode).toBe(201);

    // Get Service
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "shopDoesNotExist",
      type: [testCannedService.type],
    };

    await serviceByShopIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(0);
  });

  it("FRT-M8-9: get 'CUSTOM' services request with a valid shop id", async () => {
    // Setup
    await createEmployeeAndShop();

    const createCannedService = createMockRequestResponse({ method: "POST" });
    createCannedService.req.body = {
      name: testCannedService.name,
      description: testCannedService.description,
      estimatedTime: testCannedService.estimatedTime,
      totalPrice: testCannedService.totalPrice,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shopId: testCannedService.shopId,
    };
    await serviceHandler(createCannedService.req, createCannedService.res);
    expect(createCannedService.res.statusCode).toBe(201);

    const createCustomService = createMockRequestResponse({ method: "POST" });
    createCustomService.req.body = {
      name: testCustomService.name,
      description: testCustomService.description,
      estimatedTime: testCustomService.estimatedTime,
      totalPrice: testCustomService.totalPrice,
      parts: testCustomService.parts,
      type: testCustomService.type,
      shopId: testCustomService.shopId,
    };
    await serviceHandler(createCustomService.req, createCustomService.res);
    expect(createCustomService.res.statusCode).toBe(201);

    const customServiceId = createCustomService.res._getJSONData()[
      "id"
    ] as string;

    // Get Service
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: testCustomService.shopId,
      type: [testCustomService.type],
    };

    await serviceByShopIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(1);
    expect(res._getJSONData()[0]).toMatchObject({
      id: customServiceId,
      createTime: expect.any(String),
      updateTime: expect.any(String),
      name: testCustomService.name,
      description: testCustomService.description,
      estimatedTime: testCustomService.estimatedTime,
      totalPrice: testCustomService.totalPrice,
      parts: testCustomService.parts,
      type: testCustomService.type,
      shopId: testCustomService.shopId,
    });
  });

  it("FRT-M8-10: get 'CUSTOM' services request with an invalid shop id", async () => {
    // Setup
    await createEmployeeAndShop();

    const createCannedService = createMockRequestResponse({ method: "POST" });
    createCannedService.req.body = {
      name: testCannedService.name,
      description: testCannedService.description,
      estimatedTime: testCannedService.estimatedTime,
      totalPrice: testCannedService.totalPrice,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shopId: testCannedService.shopId,
    };
    await serviceHandler(createCannedService.req, createCannedService.res);
    expect(createCannedService.res.statusCode).toBe(201);

    const createCustomService = createMockRequestResponse({ method: "POST" });
    createCustomService.req.body = {
      name: testCustomService.name,
      description: testCustomService.description,
      estimatedTime: testCustomService.estimatedTime,
      totalPrice: testCustomService.totalPrice,
      parts: testCustomService.parts,
      type: testCustomService.type,
      shopId: testCustomService.shopId,
    };
    await serviceHandler(createCustomService.req, createCustomService.res);
    expect(createCustomService.res.statusCode).toBe(201);

    // Get Service
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "shopDoesNotExist",
      type: [testCustomService.type],
    };

    await serviceByShopIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(0);
  });

  it("FRT-M8-11: update a service request with a valid service id and valid information", async () => {
    // Setup
    await createEmployeeAndShop();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      name: testCannedService.name,
      description: testCannedService.description,
      estimatedTime: testCannedService.estimatedTime,
      totalPrice: testCannedService.totalPrice,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shopId: testCannedService.shopId,
    };
    await serviceHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    const serviceId = post.res._getJSONData()["id"] as string;

    // Update Service
    const { req, res } = createMockRequestResponse({ method: "PATCH" });
    req.query = {
      id: serviceId,
    };
    req.body = {
      description: "Updated description",
    };

    await serviceByIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({
      id: serviceId,
      createTime: expect.any(String),
      updateTime: expect.any(String),
      name: testCannedService.name,
      description: "Updated description",
      estimatedTime: testCannedService.estimatedTime,
      totalPrice: testCannedService.totalPrice,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shopId: testCannedService.shopId,
    });
  });

  it("FRT-M8-12: update a service request with an invalid service id and valid information", async () => {
    // Setup
    await createEmployeeAndShop();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      name: testCannedService.name,
      description: testCannedService.description,
      estimatedTime: testCannedService.estimatedTime,
      totalPrice: testCannedService.totalPrice,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shopId: testCannedService.shopId,
    };
    await serviceHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Update Service
    const { req, res } = createMockRequestResponse({ method: "PATCH" });
    req.query = {
      id: "serviceDoesNotExist",
    };
    req.body = {
      description: "Updated description",
    };

    await serviceByIdHandler(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("FRT-M8-13: update a service request with a valid service id and invalid information", async () => {
    // Setup
    await createEmployeeAndShop();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      name: testCannedService.name,
      description: testCannedService.description,
      estimatedTime: testCannedService.estimatedTime,
      totalPrice: testCannedService.totalPrice,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shopId: testCannedService.shopId,
    };
    await serviceHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    const serviceId = post.res._getJSONData()["id"] as string;

    // Update Service
    const { req, res } = createMockRequestResponse({ method: "PATCH" });
    req.query = {
      id: serviceId,
    };
    req.body = {
      parts: [{ invalid: "schema" }],
    };

    await serviceByIdHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("FRT-M8-14: delete a service request with a valid service id", async () => {
    // Setup
    await createEmployeeAndShop();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      name: testCannedService.name,
      description: testCannedService.description,
      estimatedTime: testCannedService.estimatedTime,
      totalPrice: testCannedService.totalPrice,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shopId: testCannedService.shopId,
    };
    await serviceHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    const serviceId = post.res._getJSONData()["id"] as string;

    // Delete Service
    const { req, res } = createMockRequestResponse({ method: "DELETE" });
    req.query = {
      id: serviceId,
    };

    await serviceByIdHandler(req, res);

    expect(res.statusCode).toBe(204);
  });

  it("FRT-M8-15: delete a service request with an invalid service id", async () => {
    // Setup
    await createEmployeeAndShop();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      name: testCannedService.name,
      description: testCannedService.description,
      estimatedTime: testCannedService.estimatedTime,
      totalPrice: testCannedService.totalPrice,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shopId: testCannedService.shopId,
    };
    await serviceHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Delete Service
    const { req, res } = createMockRequestResponse({ method: "DELETE" });
    req.query = {
      id: "serviceDoesNotExist",
    };

    await serviceByIdHandler(req, res);

    expect(res.statusCode).toBe(404);
  });
});

const createEmployeeAndShop = async () => {
  return await prisma.employee.create({
    data: {
      id: testEmployeeUser.id,
      firstName: testEmployeeUser.firstName,
      lastName: testEmployeeUser.lastName,
      phoneNumber: testEmployeeUser.phoneNumber,
      email: testEmployeeUser.email,
      password: testEmployeeUser.password,
      type: testEmployeeUser.type,
      status: testEmployeeUser.status,
      shop: {
        create: {
          id: testShop.id,
          phoneNumber: testShop.phoneNumber,
          email: testShop.email,
          name: testShop.name,
          address: testShop.address,
          postalCode: testShop.postalCode,
          city: testShop.city,
          province: testShop.province,
        },
      },
    },
  });
};
