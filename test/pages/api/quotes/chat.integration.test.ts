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
  Shop,
} from "@server/db/client";
import { createMockRequestResponse } from "@test/mocks/mockRequestResponse";
import type { Session } from "next-auth";

const testEmployeeUser: Employee = {
  id: "test_id",
  first_name: "first_name",
  last_name: "last_name",
  email: "employee@test.com",
  password: "test_password",
  image: null,
  create_time: new Date(),
  update_time: new Date(),
  type: "SHOP_OWNER",
  shop_id: "test_shop_id",
};

const testCustomerUser: Customer = {
  id: "test_customer_id",
  create_time: new Date(),
  update_time: new Date(),
  first_name: "first_name",
  last_name: "last_name",
  email: "customer@test.com",
  password: "test_password",
  image: null,
  type: "CUSTOMER",
};

const testShop: Shop = {
  id: "test_shop_id",
  create_time: new Date(),
  update_time: new Date(),
};

const testQuote: Quote = {
  id: "",
  create_time: new Date(),
  update_time: new Date(),
  customer_id: "test_customer_id",
  shop_id: "test_shop_id",
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
  const deleteQuotes = prisma.quote.deleteMany();
  const deleteChatMessages = prisma.chatMessage.deleteMany();
  const deleteCustomerUsers = prisma.customer.deleteMany();
  const deleteEmployeeUsers = prisma.employee.deleteMany();
  const deleteShops = prisma.shop.deleteMany();
  await prisma.$transaction([
    deleteChatMessages,
    deleteQuotes,
    deleteCustomerUsers,
    deleteEmployeeUsers,
    deleteShops,
  ]);
});

describe("create chat messages", () => {
  describe("given new chat message", () => {
    it("should create new chat message", async () => {
      await createCustomer();
      await createEmployee();
      await createShop();

      const quoteId = await createQuote();

      const { req, res } = createMockRequestResponse({ method: "POST" });
      req.body = {
        shop_id: testEmployeeUser.shop_id,
        message: testChatMessage.message,
      };
      req.query = { ...req.query, id: quoteId };

      await chatHandler(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toMatchObject({
        ...testChatMessage,
        id: expect.any(String),
        create_time: expect.any(String),
        update_time: expect.any(String),
        shop_id: testEmployeeUser.shop_id,
        quote_id: quoteId,
      });
    });
  });
});

describe("get chat messages", () => {
  describe("given quote ID with messages", () => {
    it("should return all messages related to the quote", async () => {
      await createCustomer();
      await createEmployee();
      await createShop();
      const quoteId = await createQuote();

      // Create Employee Chat Message
      const employeePost = createMockRequestResponse({ method: "POST" });
      employeePost.req.body = {
        shop_id: testEmployeeUser.shop_id,
        message: testChatMessage.message,
      };
      employeePost.req.query = { ...employeePost.req.query, id: quoteId };
      await chatHandler(employeePost.req, employeePost.res);
      expect(employeePost.res.statusCode).toBe(201);

      // Create Customer Chat Message
      const customerPost = createMockRequestResponse({ method: "POST" });
      customerPost.req.body = {
        customer_id: testCustomerUser.id,
        message: testChatMessage.message,
      };
      customerPost.req.query = { ...customerPost.req.query, id: quoteId };
      await chatHandler(customerPost.req, customerPost.res);
      expect(customerPost.res.statusCode).toBe(201);

      // Get Chat Messages
      const { req, res } = createMockRequestResponse({ method: "GET" });
      req.query = { ...req.query, id: quoteId };
      await chatHandler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()["length"]).toBe(2);

      expect(res._getJSONData()[0]["customer_id"]).toBe(testCustomerUser.id);
      expect(res._getJSONData()[0]["shop_id"]).toBeNull();

      expect(res._getJSONData()[1]["shop_id"]).toBe(testEmployeeUser.shop_id);
      expect(res._getJSONData()[1]["customer_id"]).toBeNull();
    });
  });

  describe("given quote ID with messages", () => {
    it("should return an empty list", async () => {
      await createCustomer();
      await createEmployee();
      await createShop();
      const quoteId = await createQuote();

      // Get Chat Messages
      const { req, res } = createMockRequestResponse({ method: "GET" });
      req.query = { ...req.query, id: quoteId };
      await chatHandler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()["length"]).toBe(0);
    });
  });
});

describe("delete quote and chat messages", () => {
  describe("given quote ID", () => {
    it("should delete quote and all chat messages", async () => {
      await createCustomer();
      await createEmployee();
      await createShop();
      const quoteId = await createQuote();

      // Create Employee Chat Message
      const employeePost = createMockRequestResponse({ method: "POST" });
      employeePost.req.body = {
        shop_id: testEmployeeUser.shop_id,
        message: testChatMessage.message,
      };
      employeePost.req.query = { ...employeePost.req.query, id: quoteId };
      await chatHandler(employeePost.req, employeePost.res);
      expect(employeePost.res.statusCode).toBe(201);

      // Create Customer Chat Message
      const customerPost = createMockRequestResponse({ method: "POST" });
      customerPost.req.body = {
        customer_id: testCustomerUser.id,
        message: testChatMessage.message,
      };
      customerPost.req.query = { ...customerPost.req.query, id: quoteId };
      await chatHandler(customerPost.req, customerPost.res);
      expect(customerPost.res.statusCode).toBe(201);

      // Delete Quote and Chat Messages
      const { req, res } = createMockRequestResponse({ method: "DELETE" });
      req.query = { ...req.query, id: quoteId };
      await quoteByIdHandler(req, res);

      expect(res.statusCode).toBe(204);

      // Confirm Chat Messages are Deleted
      const get = createMockRequestResponse({ method: "GET" });
      get.req.query = { ...get.req.query, id: quoteId };
      await chatHandler(get.req, get.res);

      expect(get.res.statusCode).toBe(200);
      expect(get.res._getJSONData()["length"]).toBe(0);
    });
  });
});

const createCustomer = async () => {
  return await prisma.customer.create({ data: testCustomerUser });
};

const createEmployee = async () => {
  return await prisma.employee.create({ data: testEmployeeUser });
};

const createShop = async () => {
  return await prisma.shop.create({ data: testShop });
};

const createQuote = async () => {
  const { req, res } = createMockRequestResponse({ method: "POST" });
  req.body = testQuote;
  await quoteHandler(req, res);
  return res._getJSONData()["id"] as string;
};
