/**
 *
 * Chat Flow Integration Tests
 *
 * @group integration
 */

import quoteHandler from "@pages/api/quotes";
import quoteByIdHandler from "@pages/api/quotes/[id]";
import chatHandler from "@pages/api/quotes/[id]/chat";
import {
  ChatMessage,
  Customer,
  Employee,
  prisma,
  Quote,
  QuoteStatus,
  ServiceWithPartsType,
  Shop,
} from "@server/db/client";
import { createMockRequestResponse } from "@test/mocks/mockRequestResponse";
import type { Session } from "next-auth";

const testEmployeeUser: Employee = {
  id: "test_id",
  first_name: "first_name",
  last_name: "last_name",
  phone_number: "1234567890",
  email: "employee@test.com",
  password: "test_password",
  image: null,
  create_time: new Date(),
  update_time: new Date(),
  type: "SHOP_OWNER",
  shop_id: "test_shop_id",
  status: "ACTIVE",
};

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

const testQuote: Quote = {
  id: "",
  create_time: new Date(),
  update_time: new Date(),
  customer_id: "test_customer_id",
  shop_id: "test_shop_id",
  service_id: "test_service_id",
  status: QuoteStatus.IN_PROGRESS,
  estimated_price: null,
  duration: null,
  description: null,
};

const testChatMessage: ChatMessage = {
  id: "",
  create_time: new Date(),
  update_time: new Date(),
  message: "test_message",
  quote_id: "",
  customer_id: null,
  shop_id: null,
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
    prisma.chatMessage.deleteMany(),
    prisma.quote.deleteMany(),
    prisma.service.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.employee.deleteMany(),
    prisma.shop.deleteMany(),
  ]);
});

describe("Quotes Module", () => {
  it("FRT-M4-12: delete quote request with a valid quote id", async () => {
    // Setup
    await createCustomer();
    await createEmployee();
    await createShop();
    await createService();
    const quoteId = await createQuote();

    // Create Employee Chat Message
    const employeePost = createMockRequestResponse({ method: "POST" });
    employeePost.req.body = {
      shop_id: testEmployeeUser.shop_id,
      message: testChatMessage.message,
    };
    employeePost.req.query = {
      id: quoteId,
    };
    await chatHandler(employeePost.req, employeePost.res);
    expect(employeePost.res.statusCode).toBe(201);

    // Create Customer Chat Message
    const customerPost = createMockRequestResponse({ method: "POST" });
    customerPost.req.body = {
      customer_id: testCustomerUser.id,
      message: testChatMessage.message,
    };
    customerPost.req.query = {
      id: quoteId,
    };
    await chatHandler(customerPost.req, customerPost.res);
    expect(customerPost.res.statusCode).toBe(201);

    // Delete Quote and Chat Messages
    const { req, res } = createMockRequestResponse({ method: "DELETE" });
    req.query = {
      id: quoteId,
    };
    await quoteByIdHandler(req, res);

    expect(res.statusCode).toBe(204);

    // Confirm Chat Messages are Deleted
    const get = createMockRequestResponse({ method: "GET" });
    get.req.query = {
      id: quoteId,
    };
    await chatHandler(get.req, get.res);

    expect(get.res.statusCode).toBe(200);
    expect(get.res._getJSONData()["length"]).toBe(0);
  });

  it("FRT-M4-14: create a chat message request with valid information", async () => {
    // Setup
    await createCustomer();
    await createEmployee();
    await createShop();
    await createService();

    const quoteId = await createQuote();

    // Create Chat Message
    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      shop_id: testEmployeeUser.shop_id,
      message: testChatMessage.message,
    };
    req.query = {
      id: quoteId,
    };

    await chatHandler(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toMatchObject({
      id: expect.any(String),
      create_time: expect.any(String),
      update_time: expect.any(String),
      shop_id: testEmployeeUser.shop_id,
      quote_id: quoteId,
      message: testChatMessage.message,
    });
  });

  it("FRT-M4-15: create a chat message request with invalid information", async () => {
    // Setup
    await createCustomer();
    await createEmployee();
    await createShop();
    await createService();

    const quoteId = await createQuote();

    // Create Chat Message
    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      shop_id: testEmployeeUser.shop_id,
    };
    req.query = {
      id: quoteId,
    };

    await chatHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("FRT-M4-16: get chat messages request with a valid quote id", async () => {
    // Setup
    await createCustomer();
    await createEmployee();
    await createShop();
    await createService();
    const quoteId = await createQuote();

    // Create Employee Chat Message
    const employeePost = createMockRequestResponse({ method: "POST" });
    employeePost.req.body = {
      shop_id: testEmployeeUser.shop_id,
      message: testChatMessage.message,
    };
    employeePost.req.query = {
      id: quoteId,
    };
    await chatHandler(employeePost.req, employeePost.res);
    expect(employeePost.res.statusCode).toBe(201);

    // Create Customer Chat Message
    const customerPost = createMockRequestResponse({ method: "POST" });
    customerPost.req.body = {
      customer_id: testCustomerUser.id,
      message: testChatMessage.message,
    };
    customerPost.req.query = {
      id: quoteId,
    };
    await chatHandler(customerPost.req, customerPost.res);
    expect(customerPost.res.statusCode).toBe(201);

    // Get Chat Messages
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: quoteId,
    };
    await chatHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(2);

    expect(res._getJSONData()[0]["customer_id"]).toBe(testCustomerUser.id);
    expect(res._getJSONData()[0]["shop_id"]).toBeNull();

    expect(res._getJSONData()[1]["shop_id"]).toBe(testEmployeeUser.shop_id);
    expect(res._getJSONData()[1]["customer_id"]).toBeNull();
  });

  it("FRT-M4-17: get chat messages request with an invalid quote id", async () => {
    // Setup
    await createCustomer();
    await createEmployee();
    await createShop();
    await createService();
    const quoteId = await createQuote();

    // Create Employee Chat Message
    const employeePost = createMockRequestResponse({ method: "POST" });
    employeePost.req.body = {
      shop_id: testEmployeeUser.shop_id,
      message: testChatMessage.message,
    };
    employeePost.req.query = {
      id: quoteId,
    };
    await chatHandler(employeePost.req, employeePost.res);
    expect(employeePost.res.statusCode).toBe(201);

    // Create Customer Chat Message
    const customerPost = createMockRequestResponse({ method: "POST" });
    customerPost.req.body = {
      customer_id: testCustomerUser.id,
      message: testChatMessage.message,
    };
    customerPost.req.query = {
      id: quoteId,
    };
    await chatHandler(customerPost.req, customerPost.res);
    expect(customerPost.res.statusCode).toBe(201);

    // Get Chat Messages
    const { req, res } = createMockRequestResponse({ method: "GET" });
    req.query = {
      id: "quote_does_not_exist",
    };
    await chatHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()["length"]).toBe(0);
  });
});

const createCustomer = async () => {
  return await prisma.customer.create({ data: testCustomerUser });
};

const createEmployee = async () => {
  return await prisma.employee.create({ data: testEmployeeUser });
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

const createQuote = async () => {
  const { req, res } = createMockRequestResponse({ method: "POST" });
  req.body = testQuote;
  await quoteHandler(req, res);
  return res._getJSONData()["id"] as string;
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
