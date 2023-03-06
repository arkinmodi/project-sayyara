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
  name: "test_shop_name",
  address: "test_address",
  phone_number: "test_phone_number",
  email: "test@email.com",
  postal_code: "test_postal_code",
  city: "test_city",
  province: "test_province",
  hours_of_operation: null,
};

const testEmployeeUser: Employee = {
  id: "test_employee_id",
  first_name: "first_name",
  last_name: "last_name",
  phone_number: "1234567890",
  email: "employee@test.com",
  password: "test_password",
  image: null,
  create_time: new Date(),
  update_time: new Date(),
  type: "SHOP_OWNER",
  shop_id: testShop.id,
  status: "ACTIVE",
};

const testCannedService: ServiceWithPartsType = {
  id: "test_canned_service_id",
  create_time: new Date(),
  update_time: new Date(),
  name: "test_service_name",
  description: "test_service_description",
  estimated_time: 2,
  total_price: 100,
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
  shop_id: testShop.id,
};

const testCustomService: ServiceWithPartsType = {
  id: "test_custom_service_id",
  create_time: new Date(),
  update_time: new Date(),
  name: "test_service_name",
  description: "test_service_description",
  estimated_time: 2,
  total_price: 100,
  type: "CUSTOM",
  parts: [
    {
      quantity: 2,
      cost: 100.0,
      name: "test_part",
      condition: "NEW",
      build: "OEM",
    },
  ],
  shop_id: testShop.id,
};
jest.mock("@server/common/getServerAuthSession", () => ({
  getServerAuthSession: jest.fn<Session, []>(() => ({
    expires: "1",
    user: {
      id: testEmployeeUser.id,
      firstName: testEmployeeUser.first_name,
      lastName: testEmployeeUser.last_name,
      email: testEmployeeUser.email,
      type: testEmployeeUser.type,
      shopId: testEmployeeUser.shop_id,
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
      estimated_time: testCannedService.estimated_time,
      total_price: testCannedService.total_price,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shop_id: testCannedService.shop_id,
    };

    await serviceHandler(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toMatchObject({
      id: expect.any(String),
      create_time: expect.any(String),
      update_time: expect.any(String),
      name: testCannedService.name,
      description: testCannedService.description,
      estimated_time: testCannedService.estimated_time,
      total_price: testCannedService.total_price,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shop_id: testCannedService.shop_id,
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
      estimated_time: testCannedService.estimated_time,
      total_price: testCannedService.total_price,
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
      estimated_time: testCannedService.estimated_time,
      total_price: testCannedService.total_price,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shop_id: testCannedService.shop_id,
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
      create_time: expect.any(String),
      update_time: expect.any(String),
      name: testCannedService.name,
      description: testCannedService.description,
      estimated_time: testCannedService.estimated_time,
      total_price: testCannedService.total_price,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shop_id: testCannedService.shop_id,
    });
  });

  it("FRT-M8-4: get service request with an invalid service id", async () => {
    // Setup
    await createEmployeeAndShop();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      name: testCannedService.name,
      description: testCannedService.description,
      estimated_time: testCannedService.estimated_time,
      total_price: testCannedService.total_price,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shop_id: testCannedService.shop_id,
    };
    await serviceHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Get Service
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "service_does_not_exist",
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
      estimated_time: testCannedService.estimated_time,
      total_price: testCannedService.total_price,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shop_id: testCannedService.shop_id,
    };
    await serviceHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    const serviceId = post.res._getJSONData()["id"] as string;

    // Get Service
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: testCannedService.shop_id,
    };

    await serviceByShopIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(1);
    expect(res._getJSONData()[0]).toMatchObject({
      id: serviceId,
      create_time: expect.any(String),
      update_time: expect.any(String),
      name: testCannedService.name,
      description: testCannedService.description,
      estimated_time: testCannedService.estimated_time,
      total_price: testCannedService.total_price,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shop_id: testCannedService.shop_id,
    });
  });

  it("FRT-M8-6: get services request with an invalid shop id", async () => {
    // Setup
    await createEmployeeAndShop();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      name: testCannedService.name,
      description: testCannedService.description,
      estimated_time: testCannedService.estimated_time,
      total_price: testCannedService.total_price,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shop_id: testCannedService.shop_id,
    };
    await serviceHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Get Service
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "shop_does_not_exist",
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
      estimated_time: testCannedService.estimated_time,
      total_price: testCannedService.total_price,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shop_id: testCannedService.shop_id,
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
      estimated_time: testCustomService.estimated_time,
      total_price: testCustomService.total_price,
      parts: testCustomService.parts,
      type: testCustomService.type,
      shop_id: testCustomService.shop_id,
    };
    await serviceHandler(createCustomService.req, createCustomService.res);
    expect(createCustomService.res.statusCode).toBe(201);

    // Get Service
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: testCannedService.shop_id,
      type: [testCannedService.type],
    };

    await serviceByShopIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(1);
    expect(res._getJSONData()[0]).toMatchObject({
      id: cannedServiceId,
      create_time: expect.any(String),
      update_time: expect.any(String),
      name: testCannedService.name,
      description: testCannedService.description,
      estimated_time: testCannedService.estimated_time,
      total_price: testCannedService.total_price,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shop_id: testCannedService.shop_id,
    });
  });

  it("FRT-M8-8: get 'CANNED' services request with an invalid shop id", async () => {
    // Setup
    await createEmployeeAndShop();

    const createCannedService = createMockRequestResponse({ method: "POST" });
    createCannedService.req.body = {
      name: testCannedService.name,
      description: testCannedService.description,
      estimated_time: testCannedService.estimated_time,
      total_price: testCannedService.total_price,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shop_id: testCannedService.shop_id,
    };
    await serviceHandler(createCannedService.req, createCannedService.res);
    expect(createCannedService.res.statusCode).toBe(201);

    const createCustomService = createMockRequestResponse({ method: "POST" });
    createCustomService.req.body = {
      name: testCustomService.name,
      description: testCustomService.description,
      estimated_time: testCustomService.estimated_time,
      total_price: testCustomService.total_price,
      parts: testCustomService.parts,
      type: testCustomService.type,
      shop_id: testCustomService.shop_id,
    };
    await serviceHandler(createCustomService.req, createCustomService.res);
    expect(createCustomService.res.statusCode).toBe(201);

    // Get Service
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "shop_does_not_exist",
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
      estimated_time: testCannedService.estimated_time,
      total_price: testCannedService.total_price,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shop_id: testCannedService.shop_id,
    };
    await serviceHandler(createCannedService.req, createCannedService.res);
    expect(createCannedService.res.statusCode).toBe(201);

    const createCustomService = createMockRequestResponse({ method: "POST" });
    createCustomService.req.body = {
      name: testCustomService.name,
      description: testCustomService.description,
      estimated_time: testCustomService.estimated_time,
      total_price: testCustomService.total_price,
      parts: testCustomService.parts,
      type: testCustomService.type,
      shop_id: testCustomService.shop_id,
    };
    await serviceHandler(createCustomService.req, createCustomService.res);
    expect(createCustomService.res.statusCode).toBe(201);

    const customServiceId = createCustomService.res._getJSONData()[
      "id"
    ] as string;

    // Get Service
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: testCustomService.shop_id,
      type: [testCustomService.type],
    };

    await serviceByShopIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(1);
    expect(res._getJSONData()[0]).toMatchObject({
      id: customServiceId,
      create_time: expect.any(String),
      update_time: expect.any(String),
      name: testCustomService.name,
      description: testCustomService.description,
      estimated_time: testCustomService.estimated_time,
      total_price: testCustomService.total_price,
      parts: testCustomService.parts,
      type: testCustomService.type,
      shop_id: testCustomService.shop_id,
    });
  });

  it("FRT-M8-10: get 'CUSTOM' services request with an invalid shop id", async () => {
    // Setup
    await createEmployeeAndShop();

    const createCannedService = createMockRequestResponse({ method: "POST" });
    createCannedService.req.body = {
      name: testCannedService.name,
      description: testCannedService.description,
      estimated_time: testCannedService.estimated_time,
      total_price: testCannedService.total_price,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shop_id: testCannedService.shop_id,
    };
    await serviceHandler(createCannedService.req, createCannedService.res);
    expect(createCannedService.res.statusCode).toBe(201);

    const createCustomService = createMockRequestResponse({ method: "POST" });
    createCustomService.req.body = {
      name: testCustomService.name,
      description: testCustomService.description,
      estimated_time: testCustomService.estimated_time,
      total_price: testCustomService.total_price,
      parts: testCustomService.parts,
      type: testCustomService.type,
      shop_id: testCustomService.shop_id,
    };
    await serviceHandler(createCustomService.req, createCustomService.res);
    expect(createCustomService.res.statusCode).toBe(201);

    // Get Service
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "shop_does_not_exist",
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
      estimated_time: testCannedService.estimated_time,
      total_price: testCannedService.total_price,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shop_id: testCannedService.shop_id,
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
      create_time: expect.any(String),
      update_time: expect.any(String),
      name: testCannedService.name,
      description: "Updated description",
      estimated_time: testCannedService.estimated_time,
      total_price: testCannedService.total_price,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shop_id: testCannedService.shop_id,
    });
  });

  it("FRT-M8-12: update a service request with an invalid service id and valid information", async () => {
    // Setup
    await createEmployeeAndShop();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      name: testCannedService.name,
      description: testCannedService.description,
      estimated_time: testCannedService.estimated_time,
      total_price: testCannedService.total_price,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shop_id: testCannedService.shop_id,
    };
    await serviceHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Update Service
    const { req, res } = createMockRequestResponse({ method: "PATCH" });
    req.query = {
      id: "service_does_not_exist",
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
      estimated_time: testCannedService.estimated_time,
      total_price: testCannedService.total_price,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shop_id: testCannedService.shop_id,
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
      estimated_time: testCannedService.estimated_time,
      total_price: testCannedService.total_price,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shop_id: testCannedService.shop_id,
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
      estimated_time: testCannedService.estimated_time,
      total_price: testCannedService.total_price,
      parts: testCannedService.parts,
      type: testCannedService.type,
      shop_id: testCannedService.shop_id,
    };
    await serviceHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Delete Service
    const { req, res } = createMockRequestResponse({ method: "DELETE" });
    req.query = {
      id: "service_does_not_exist",
    };

    await serviceByIdHandler(req, res);

    expect(res.statusCode).toBe(404);
  });
});

const createEmployeeAndShop = async () => {
  return await prisma.employee.create({
    data: {
      id: testEmployeeUser.id,
      first_name: testEmployeeUser.first_name,
      last_name: testEmployeeUser.last_name,
      phone_number: testEmployeeUser.phone_number,
      email: testEmployeeUser.email,
      password: testEmployeeUser.password,
      type: testEmployeeUser.type,
      status: testEmployeeUser.status,
      shop: {
        create: {
          id: testShop.id,
          phone_number: testShop.phone_number,
          email: testShop.email,
          name: testShop.name,
          address: testShop.address,
          postal_code: testShop.postal_code,
          city: testShop.city,
          province: testShop.province,
        },
      },
    },
  });
};
