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
  id: "testId",
  firstName: "firstName",
  lastName: "lastName",
  phoneNumber: "1234567890",
  email: "employee@test.com",
  password: "testPassword",
  image: null,
  createTime: new Date(),
  updateTime: new Date(),
  type: "SHOP_OWNER",
  shopId: "testShopId",
  status: "ACTIVE",
};

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
  latitude: "43.0000",
  longitude: "-79.0000",
  hoursOfOperation: null,
};

const testQuote: Quote = {
  id: "",
  createTime: new Date(),
  updateTime: new Date(),
  customerId: "testCustomerId",
  shopId: "testShopId",
  serviceId: "testServiceId",
  status: QuoteStatus.IN_PROGRESS,
  estimatedPrice: null,
  duration: null,
  description: null,
};

const testChatMessage: ChatMessage = {
  id: "",
  createTime: new Date(),
  updateTime: new Date(),
  message: "testMessage",
  quoteId: "",
  customerId: null,
  shopId: null,
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
      shopId: testEmployeeUser.shopId,
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
      customerId: testCustomerUser.id,
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
      shopId: testEmployeeUser.shopId,
      message: testChatMessage.message,
    };
    req.query = {
      id: quoteId,
    };

    await chatHandler(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toMatchObject({
      id: expect.any(String),
      createTime: expect.any(String),
      updateTime: expect.any(String),
      shopId: testEmployeeUser.shopId,
      quoteId: quoteId,
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
      shopId: testEmployeeUser.shopId,
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
      shopId: testEmployeeUser.shopId,
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
      customerId: testCustomerUser.id,
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

    expect(res._getJSONData()[0]["customerId"]).toBe(testCustomerUser.id);
    expect(res._getJSONData()[0]["shopId"]).toBeNull();

    expect(res._getJSONData()[1]["shopId"]).toBe(testEmployeeUser.shopId);
    expect(res._getJSONData()[1]["customerId"]).toBeNull();
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
      shopId: testEmployeeUser.shopId,
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
      customerId: testCustomerUser.id,
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
      id: "quoteDoesNotExist",
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
      phoneNumber: testShop.phoneNumber,
      email: testShop.email,
      name: testShop.name,
      address: testShop.address,
      postalCode: testShop.postalCode,
      city: testShop.city,
      province: testShop.province,
      latitude: testShop.latitude,
      longitude: testShop.longitude,
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
      estimatedTime: testService.estimatedTime,
      totalPrice: testService.totalPrice,
      parts: testService.parts,
      type: testService.type,
      shopId: testService.id,
    },
  });
};
