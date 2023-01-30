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
import { Customer, prisma, Quote, Shop } from "@server/db/client";
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
};

const testQuote: Quote = {
  id: "",
  create_time: new Date(),
  update_time: new Date(),
  customer_id: "test_customer_id",
  shop_id: "test_shop_id",
  service_id: null,
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
  const deleteQuotes = prisma.quote.deleteMany();
  const deleteCustomerUsers = prisma.customer.deleteMany();
  const deleteEmployeeUsers = prisma.employee.deleteMany();
  const deleteShops = prisma.shop.deleteMany();
  await prisma.$transaction([
    deleteQuotes,
    deleteCustomerUsers,
    deleteEmployeeUsers,
    deleteShops,
  ]);
});

describe("create quote", () => {
  describe("given new quote", () => {
    it("should create new quote", async () => {
      await createCustomer();
      await createShop();

      // Create Quote
      const { req, res } = createMockRequestResponse({ method: "POST" });
      req.body = {
        customer_id: testQuote.customer_id,
        shop_id: testQuote.shop_id,
      };

      await quoteHandler(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toMatchObject({
        ...testQuote,
        id: expect.any(String),
        create_time: expect.any(String),
        update_time: expect.any(String),
      });
    });
  });
});

describe("get quote", () => {
  describe("give a quote ID", () => {
    it("should return the quote", async () => {
      await createCustomer();
      await createShop();

      // Create Quote
      const post = createMockRequestResponse({ method: "POST" });
      post.req.body = {
        customer_id: testQuote.customer_id,
        shop_id: testQuote.shop_id,
      };
      await quoteHandler(post.req, post.res);
      expect(post.res.statusCode).toBe(201);
      const quoteId = post.res._getJSONData()["id"];

      // Get Quote
      const { req, res } = createMockRequestResponse({ method: "GET" });
      req.query = { ...req.query, id: quoteId };
      await quoteByIdHandler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toMatchObject({
        ...testQuote,
        id: expect.any(String),
        create_time: expect.any(String),
        update_time: expect.any(String),
      });
    });
  });

  describe("given a customer ID", () => {
    it("should return all quotes under customer", async () => {
      await createCustomer();
      await createShop();

      // Create Quote
      const post = createMockRequestResponse({ method: "POST" });
      post.req.body = {
        customer_id: testQuote.customer_id,
        shop_id: testQuote.shop_id,
      };
      await quoteHandler(post.req, post.res);
      expect(post.res.statusCode).toBe(201);

      // Get Quote
      const { req, res } = createMockRequestResponse({ method: "GET" });
      req.query = { ...req.query, id: testQuote.customer_id };
      await quoteByCustomerIdHandler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()["length"]).toBe(1);
      expect(res._getJSONData()[0]).toMatchObject({
        ...testQuote,
        id: expect.any(String),
        create_time: expect.any(String),
        update_time: expect.any(String),
      });
    });
  });

  describe("given a shop ID", () => {
    it("should return all quotes under shop", async () => {
      await createCustomer();
      await createShop();

      // Create Quote
      const post = createMockRequestResponse({ method: "POST" });
      post.req.body = {
        customer_id: testQuote.customer_id,
        shop_id: testQuote.shop_id,
      };
      await quoteHandler(post.req, post.res);
      expect(post.res.statusCode).toBe(201);

      // Get Quote
      const { req, res } = createMockRequestResponse({ method: "GET" });
      req.query = { ...req.query, id: testQuote.shop_id };
      await quoteByShopIdHandler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()["length"]).toBe(1);
      expect(res._getJSONData()[0]).toMatchObject({
        ...testQuote,
        id: expect.any(String),
        create_time: expect.any(String),
        update_time: expect.any(String),
      });
    });
  });
});

describe("delete quote", () => {
  describe("given quote ID", () => {
    it("should delete quote", async () => {
      await createCustomer();
      await createShop();

      // Create Quote
      const post = createMockRequestResponse({ method: "POST" });
      post.req.body = {
        customer_id: testQuote.customer_id,
        shop_id: testQuote.shop_id,
      };
      await quoteHandler(post.req, post.res);
      expect(post.res.statusCode).toBe(201);
      const quoteId = post.res._getJSONData()["id"];

      // Delete Quote
      const { req, res } = createMockRequestResponse({ method: "DELETE" });
      req.query = { ...req.query, id: quoteId };
      await quoteByIdHandler(req, res);

      expect(res.statusCode).toBe(204);

      // Confirm Quote is Deleted
      const get = createMockRequestResponse({ method: "GET" });
      get.req.query = { ...get.req.query, id: quoteId };
      await quoteByIdHandler(get.req, get.res);
      expect(get.res.statusCode).toBe(404);
    });
  });
});

const createCustomer = async () => {
  return await prisma.customer.create({ data: testCustomerUser });
};

const createShop = async () => {
  return await prisma.shop.create({ data: testShop });
};
