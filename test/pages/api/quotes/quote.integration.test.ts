/**
 *
 * Quotes Flow Integration Tests
 *
 * @group integration
 */
import quoteByCustomerIdHandler from "@pages/api/customer/[id]/quotes";
import quoteHandler from "@pages/api/quotes";
import quoteByIdHandler from "@pages/api/quotes/[id]";
import quoteByShopIdHandler from "@pages/api/shop/[id]/quotes";
import {
  Customer,
  prisma,
  Quote,
  QuoteStatus,
  ServiceWithPartsType,
  Shop,
} from "@server/db/client";
import { createMockRequestResponse } from "@test/mocks/mockRequestResponse";
import { Session } from "next-auth";

const testCustomerUser: Customer = {
  id: "testCustomerId",
  createTime: new Date(),
  updateTime: new Date(),
  firstName: "firstName",
  lastName: "lastName",
  phoneNumber: "1234567890",
  email: "customer@test.com",
  password: "testPassword",
  image: null,
  type: "CUSTOMER",
};

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

const testService: ServiceWithPartsType = {
  id: "testServiceId",
  createTime: new Date(),
  updateTime: new Date(),
  name: "testName",
  description: "testDescription",
  estimatedTime: 2,
  totalPrice: 100,
  parts: [],
  type: "CANNED",
  shopId: testShop.id,
};

const testQuote: Quote = {
  id: "",
  createTime: new Date(),
  updateTime: new Date(),
  serviceId: testService.id,
  customerId: testCustomerUser.id,
  shopId: testShop.id,
  status: QuoteStatus.IN_PROGRESS,
  estimatedPrice: null,
  duration: null,
  description: null,
};

jest.mock("@server/common/getServerAuthSession", () => ({
  getServerAuthSession: jest.fn<Session, []>(() => ({
    expires: "1",
    user: {
      ...testCustomerUser,
      firstName: testCustomerUser.firstName,
      lastName: testCustomerUser.lastName,
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
    prisma.quote.deleteMany(),
    prisma.service.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.employee.deleteMany(),
    prisma.shop.deleteMany(),
  ]);
});

describe("Quotes Module", () => {
  it("FRT-M4-1: create quote request with valid information", async () => {
    // Setup
    await createCustomer();
    await createShop();
    await createService();

    // Create Quote
    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      customerId: testQuote.customerId,
      shopId: testQuote.shopId,
      serviceId: testQuote.serviceId,
    };

    await quoteHandler(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toMatchObject({
      id: expect.any(String),
      createTime: expect.any(String),
      updateTime: expect.any(String),
      serviceId: testQuote.serviceId,
      customerId: testQuote.customerId,
      shopId: testQuote.shopId,
      status: testQuote.status,
    });
  });

  it("FRT-M4-2: create quote request with invalid information", async () => {
    // Setup
    await createCustomer();
    await createShop();
    await createService();

    // Create Quote
    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      customerId: testQuote.customerId,
      shopId: testQuote.shopId,
    };

    await quoteHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("FRT-M4-3: update quote request with a valid id and valid information", async () => {
    // Setup
    await createCustomer();
    await createShop();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      customerId: testQuote.customerId,
      shopId: testQuote.shopId,
      serviceId: testQuote.serviceId,
    };
    await quoteHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    const quoteId = post.res._getJSONData()["id"] as string;

    // Update Quote
    const { req, res } = createMockRequestResponse({ method: "PATCH" });
    req.query = {
      id: quoteId,
    };
    req.body = {
      description: "testPatchQuoteDescription",
    };

    await quoteByIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["description"]).toBe("testPatchQuoteDescription");
  });

  it("FRT-M4-4: update quote request with an invalid id and valid information", async () => {
    // Setup
    await createCustomer();
    await createShop();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      customerId: testQuote.customerId,
      shopId: testQuote.shopId,
      serviceId: testQuote.serviceId,
    };
    await quoteHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Update Quote
    const { req, res } = createMockRequestResponse({ method: "PATCH" });
    req.query = {
      id: "quoteDoesNotExist",
    };
    req.body = {
      description: "testPatchQuoteDescription",
    };

    await quoteByIdHandler(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("FRT-M4-5: update quote request with a valid id and invalid information", async () => {
    // Setup
    await createCustomer();
    await createShop();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      customerId: testQuote.customerId,
      shopId: testQuote.shopId,
      serviceId: testQuote.serviceId,
    };
    await quoteHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    const quoteId = post.res._getJSONData()["id"] as string;

    // Update Quote
    const { req, res } = createMockRequestResponse({ method: "PATCH" });
    req.query = {
      id: quoteId,
    };
    req.body = {
      status: "NOT_A_VALID_STATUS",
    };

    await quoteByIdHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("FRT-M4-6: get quote request with a valid quote id", async () => {
    // Setup
    await createCustomer();
    await createShop();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      customerId: testQuote.customerId,
      shopId: testQuote.shopId,
      serviceId: testQuote.serviceId,
    };
    await quoteHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    const quoteId = post.res._getJSONData()["id"] as string;

    // Get Quote
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: quoteId,
    };

    await quoteByIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchObject({
      id: expect.any(String),
      createTime: expect.any(String),
      updateTime: expect.any(String),
      serviceId: testQuote.serviceId,
      customerId: testQuote.customerId,
      shopId: testQuote.shopId,
      status: testQuote.status,
    });
  });

  it("FRT-M4-7: get quote request with an invalid quote id", async () => {
    // Setup
    await createCustomer();
    await createShop();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      customerId: testQuote.customerId,
      shopId: testQuote.shopId,
      serviceId: testQuote.serviceId,
    };
    await quoteHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Get Quote
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "quoteDoesNotExist",
    };

    await quoteByIdHandler(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("FRT-M4-8: get quote request with a valid customer id", async () => {
    // Setup
    await createCustomer();
    await createShop();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      customerId: testQuote.customerId,
      shopId: testQuote.shopId,
      serviceId: testQuote.serviceId,
    };
    await quoteHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Get Quote
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: testQuote.customerId,
    };

    await quoteByCustomerIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(1);
    expect(res._getJSONData()[0]).toMatchObject({
      id: expect.any(String),
      createTime: expect.any(String),
      updateTime: expect.any(String),
      serviceId: testQuote.serviceId,
      customerId: testQuote.customerId,
      shopId: testQuote.shopId,
      status: testQuote.status,
      customer: {
        id: expect.any(String),
        createTime: expect.any(String),
        updateTime: expect.any(String),
        email: testCustomerUser.email,
        firstName: testCustomerUser.firstName,
        lastName: testCustomerUser.lastName,
        phoneNumber: testCustomerUser.phoneNumber,
        type: testCustomerUser.type,
      },
      service: {
        id: expect.any(String),
        createTime: expect.any(String),
        updateTime: expect.any(String),
        description: testService.description,
        estimatedTime: testService.estimatedTime,
        name: testService.name,
        parts: testService.parts,
        shopId: expect.any(String),
        totalPrice: testService.totalPrice,
        type: testService.type,
      },
      shop: {
        id: expect.any(String),
        createTime: expect.any(String),
        updateTime: expect.any(String),
        address: testShop.address,
        city: testShop.city,
        email: testShop.email,
        hoursOfOperation: testShop.hoursOfOperation,
        name: testShop.name,
        phoneNumber: testShop.phoneNumber,
        postalCode: testShop.postalCode,
        province: testShop.province,
      },
    });
  });

  it("FRT-M4-9: get quote request with an invalid customer id", async () => {
    // Setup
    await createCustomer();
    await createShop();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      customerId: testQuote.customerId,
      shopId: testQuote.shopId,
      serviceId: testQuote.serviceId,
    };
    await quoteHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Get Quote
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "customerDoesNotExist",
    };

    await quoteByCustomerIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(0);
  });

  it("FRT-M4-10: get quote request with a valid shop id", async () => {
    // Setup
    await createCustomer();
    await createShop();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      customerId: testQuote.customerId,
      shopId: testQuote.shopId,
      serviceId: testQuote.serviceId,
    };
    await quoteHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Get Quote
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: testQuote.shopId,
    };

    await quoteByShopIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(1);
    expect(res._getJSONData()[0]).toMatchObject({
      id: expect.any(String),
      createTime: expect.any(String),
      updateTime: expect.any(String),
      serviceId: testQuote.serviceId,
      customerId: testQuote.customerId,
      shopId: testQuote.shopId,
      status: testQuote.status,
      customer: {
        id: expect.any(String),
        createTime: expect.any(String),
        updateTime: expect.any(String),
        email: testCustomerUser.email,
        firstName: testCustomerUser.firstName,
        lastName: testCustomerUser.lastName,
        phoneNumber: testCustomerUser.phoneNumber,
        type: testCustomerUser.type,
      },
      service: {
        id: expect.any(String),
        createTime: expect.any(String),
        updateTime: expect.any(String),
        description: testService.description,
        estimatedTime: testService.estimatedTime,
        name: testService.name,
        parts: testService.parts,
        shopId: expect.any(String),
        totalPrice: testService.totalPrice,
        type: testService.type,
      },
      shop: {
        id: expect.any(String),
        createTime: expect.any(String),
        updateTime: expect.any(String),
        address: testShop.address,
        city: testShop.city,
        email: testShop.email,
        hoursOfOperation: testShop.hoursOfOperation,
        name: testShop.name,
        phoneNumber: testShop.phoneNumber,
        postalCode: testShop.postalCode,
        province: testShop.province,
      },
    });
  });

  it("FRT-M4-11: get quote request with an invalid shop id", async () => {
    // Setup
    await createCustomer();
    await createShop();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      customerId: testQuote.customerId,
      shopId: testQuote.shopId,
      serviceId: testQuote.serviceId,
    };
    await quoteHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Get Quote
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "shopDoesNotExist",
    };

    await quoteByShopIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(0);
  });

  it("FRT-M4-13: delete quote request with an invalid quote id", async () => {
    // Setup
    await createCustomer();
    await createShop();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      customerId: testQuote.customerId,
      shopId: testQuote.shopId,
      serviceId: testQuote.serviceId,
    };
    await quoteHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Delete Quote
    const { req, res } = createMockRequestResponse({ method: "DELETE" });
    req.query = {
      id: "quoteDoesNotExist",
    };

    await quoteByIdHandler(req, res);

    expect(res.statusCode).toBe(404);
  });
});

const createCustomer = async () => {
  return await prisma.customer.create({ data: testCustomerUser });
};

const createShop = async () => {
  return await prisma.shop.create({
    data: {
      id: testShop.id,
      phoneNumber: testShop.phoneNumber,
      email: testShop.email,
      name: testShop.name,
      address: testShop.address,
      postalCode: testShop.postalCode,
      city: testShop.city,
      province: testShop.province,
    },
  });
};

const createService = async () => {
  return await prisma.service.create({
    data: {
      id: testService.id,
      name: testService.name,
      description: testService.description,
      estimatedTime: testService.estimatedTime,
      totalPrice: testService.totalPrice,
      parts: testService.parts,
      type: testService.type,
      shopId: testService.id,
    },
  });
};
