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
  id: "test_customer_id",
  create_time: new Date(),
  update_time: new Date(),
  first_name: "first_name",
  last_name: "last_name",
  phone_number: "1234567890",
  email: "customer@test.com",
  password: "test_password",
  image: null,
  type: "CUSTOMER",
};

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

const testService: ServiceWithPartsType = {
  id: "test_service_id",
  create_time: new Date(),
  update_time: new Date(),
  name: "test_name",
  description: "test_description",
  estimated_time: 2,
  total_price: 100,
  parts: [],
  type: "CANNED",
  shop_id: testShop.id,
};

const testQuote: Quote = {
  id: "",
  create_time: new Date(),
  update_time: new Date(),
  service_id: testService.id,
  customer_id: testCustomerUser.id,
  shop_id: testShop.id,
  status: QuoteStatus.IN_PROGRESS,
  estimated_price: null,
  duration: null,
  description: null,
};

jest.mock("@server/common/getServerAuthSession", () => ({
  getServerAuthSession: jest.fn<Session, []>(() => ({
    expires: "1",
    user: {
      ...testCustomerUser,
      firstName: testCustomerUser.first_name,
      lastName: testCustomerUser.last_name,
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
      customer_id: testQuote.customer_id,
      shop_id: testQuote.shop_id,
      service_id: testQuote.service_id,
    };

    await quoteHandler(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toMatchObject({
      id: expect.any(String),
      create_time: expect.any(String),
      update_time: expect.any(String),
      service_id: testQuote.service_id,
      customer_id: testQuote.customer_id,
      shop_id: testQuote.shop_id,
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
      customer_id: testQuote.customer_id,
      shop_id: testQuote.shop_id,
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
      customer_id: testQuote.customer_id,
      shop_id: testQuote.shop_id,
      service_id: testQuote.service_id,
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
      description: "test_patch_quote_description",
    };

    await quoteByIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["description"]).toBe(
      "test_patch_quote_description"
    );
  });

  it("FRT-M4-4: update quote request with an invalid id and valid information", async () => {
    // Setup
    await createCustomer();
    await createShop();
    await createService();

    const post = createMockRequestResponse({ method: "POST" });
    post.req.body = {
      customer_id: testQuote.customer_id,
      shop_id: testQuote.shop_id,
      service_id: testQuote.service_id,
    };
    await quoteHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Update Quote
    const { req, res } = createMockRequestResponse({ method: "PATCH" });
    req.query = {
      id: "quote_does_not_exist",
    };
    req.body = {
      description: "test_patch_quote_description",
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
      customer_id: testQuote.customer_id,
      shop_id: testQuote.shop_id,
      service_id: testQuote.service_id,
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
      customer_id: testQuote.customer_id,
      shop_id: testQuote.shop_id,
      service_id: testQuote.service_id,
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
      create_time: expect.any(String),
      update_time: expect.any(String),
      service_id: testQuote.service_id,
      customer_id: testQuote.customer_id,
      shop_id: testQuote.shop_id,
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
      customer_id: testQuote.customer_id,
      shop_id: testQuote.shop_id,
      service_id: testQuote.service_id,
    };
    await quoteHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Get Quote
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "quote_does_not_exist",
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
      customer_id: testQuote.customer_id,
      shop_id: testQuote.shop_id,
      service_id: testQuote.service_id,
    };
    await quoteHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Get Quote
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: testQuote.customer_id,
    };

    await quoteByCustomerIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(1);
    expect(res._getJSONData()[0]).toMatchObject({
      id: expect.any(String),
      create_time: expect.any(String),
      update_time: expect.any(String),
      service_id: testQuote.service_id,
      customer_id: testQuote.customer_id,
      shop_id: testQuote.shop_id,
      status: testQuote.status,
      customer: {
        id: expect.any(String),
        create_time: expect.any(String),
        update_time: expect.any(String),
        email: testCustomerUser.email,
        first_name: testCustomerUser.first_name,
        last_name: testCustomerUser.last_name,
        phone_number: testCustomerUser.phone_number,
        type: testCustomerUser.type,
      },
      service: {
        id: expect.any(String),
        create_time: expect.any(String),
        update_time: expect.any(String),
        description: testService.description,
        estimated_time: testService.estimated_time,
        name: testService.name,
        parts: testService.parts,
        shop_id: expect.any(String),
        total_price: testService.total_price,
        type: testService.type,
      },
      shop: {
        id: expect.any(String),
        create_time: expect.any(String),
        update_time: expect.any(String),
        address: testShop.address,
        city: testShop.city,
        email: testShop.email,
        hours_of_operation: testShop.hours_of_operation,
        name: testShop.name,
        phone_number: testShop.phone_number,
        postal_code: testShop.postal_code,
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
      customer_id: testQuote.customer_id,
      shop_id: testQuote.shop_id,
      service_id: testQuote.service_id,
    };
    await quoteHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Get Quote
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "customer_does_not_exist",
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
      customer_id: testQuote.customer_id,
      shop_id: testQuote.shop_id,
      service_id: testQuote.service_id,
    };
    await quoteHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Get Quote
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: testQuote.shop_id,
    };

    await quoteByShopIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(1);
    expect(res._getJSONData()[0]).toMatchObject({
      id: expect.any(String),
      create_time: expect.any(String),
      update_time: expect.any(String),
      service_id: testQuote.service_id,
      customer_id: testQuote.customer_id,
      shop_id: testQuote.shop_id,
      status: testQuote.status,
      customer: {
        id: expect.any(String),
        create_time: expect.any(String),
        update_time: expect.any(String),
        email: testCustomerUser.email,
        first_name: testCustomerUser.first_name,
        last_name: testCustomerUser.last_name,
        phone_number: testCustomerUser.phone_number,
        type: testCustomerUser.type,
      },
      service: {
        id: expect.any(String),
        create_time: expect.any(String),
        update_time: expect.any(String),
        description: testService.description,
        estimated_time: testService.estimated_time,
        name: testService.name,
        parts: testService.parts,
        shop_id: expect.any(String),
        total_price: testService.total_price,
        type: testService.type,
      },
      shop: {
        id: expect.any(String),
        create_time: expect.any(String),
        update_time: expect.any(String),
        address: testShop.address,
        city: testShop.city,
        email: testShop.email,
        hours_of_operation: testShop.hours_of_operation,
        name: testShop.name,
        phone_number: testShop.phone_number,
        postal_code: testShop.postal_code,
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
      customer_id: testQuote.customer_id,
      shop_id: testQuote.shop_id,
      service_id: testQuote.service_id,
    };
    await quoteHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Get Quote
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "shop_does_not_exist",
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
      customer_id: testQuote.customer_id,
      shop_id: testQuote.shop_id,
      service_id: testQuote.service_id,
    };
    await quoteHandler(post.req, post.res);
    expect(post.res.statusCode).toBe(201);

    // Delete Quote
    const { req, res } = createMockRequestResponse({ method: "DELETE" });
    req.query = {
      id: "quote_does_not_exist",
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
      phone_number: testShop.phone_number,
      email: testShop.email,
      name: testShop.name,
      address: testShop.address,
      postal_code: testShop.postal_code,
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
      estimated_time: testService.estimated_time,
      total_price: testService.total_price,
      parts: testService.parts,
      type: testService.type,
      shop_id: testService.id,
    },
  });
};
