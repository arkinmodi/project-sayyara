/**
 *
 * User Registration Flow Integration Tests
 *
 * @group integration
 */

import registerCustomerHandler from "@pages/api/user/register/customer";
import registerEmployeeHandler from "@pages/api/user/register/employee";
import registerShopOwnerHandler from "@pages/api/user/register/shopOwner";
import {
  CustomerWithVehicles,
  Employee,
  EmployeeWithShop,
  prisma,
} from "@server/db/client";
import { createMockRequestResponse } from "@test/mocks/mockRequestResponse";

const testEmployee: Employee = {
  id: "",
  first_name: "employee_first_name",
  last_name: "employee_last_name",
  email: "employee@test.com",
  password: "employee_password",
  image: null,
  create_time: new Date(),
  update_time: new Date(),
  type: "EMPLOYEE",
  shop_id: "shop_id",
};

const testShopOwner: EmployeeWithShop = {
  id: "",
  first_name: "shop_owner_first_name",
  last_name: "shop_owner_last_name",
  email: "shop_owner@test.com",
  password: "shop_owner_password",
  image: null,
  create_time: new Date(),
  update_time: new Date(),
  type: "SHOP_OWNER",
  shop_id: "shop_id",
  shop: {
    id: "shop_id",
    create_time: new Date(),
    update_time: new Date(),
  },
};

const testCustomer: CustomerWithVehicles = {
  id: "",
  first_name: "customer_first_name",
  last_name: "customer_last_name",
  email: "customer@test.com",
  password: "customer_password",
  image: null,
  create_time: new Date(),
  update_time: new Date(),
  type: "CUSTOMER",
  vehicles: [
    {
      id: "test_customer_vehicle_id",
      create_time: new Date(),
      update_time: new Date(),
      customer_id: "test_customer_id",
      license_plate: "test_license_plate",
      make: "test_make",
      model: "test_model",
      vin: "test_vin",
      year: 2017,
    },
  ],
};

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

afterEach(async () => {
  const deleteEmployees = prisma.employee.deleteMany({});
  const deleteCustomers = prisma.customer.deleteMany({});
  await prisma.$transaction([deleteEmployees, deleteCustomers]);
});

describe("new user registration", () => {
  describe("given valid new user data", () => {
    it("should create new customer", async () => {
      const { req, res } = createMockRequestResponse({ method: "POST" });
      req.body = {
        email: testCustomer.email,
        password: testCustomer.password,
        first_name: testCustomer.first_name,
        last_name: testCustomer.last_name,
        vehicle: {
          year: testCustomer.vehicles[0]?.year,
          make: testCustomer.vehicles[0]?.make,
          model: testCustomer.vehicles[0]?.model,
          vin: testCustomer.vehicles[0]?.vin,
          license_plate: testCustomer.vehicles[0]?.license_plate,
        },
      };

      await registerCustomerHandler(req, res);
      const newCustomer = await prisma.customer.findUnique({
        where: { email: testCustomer.email },
        include: { vehicles: true },
      });

      expect(res.statusCode).toBe(302);
      expect(newCustomer).toEqual({
        id: expect.any(String),
        first_name: testCustomer.first_name,
        last_name: testCustomer.last_name,
        email: testCustomer.email,
        password: expect.any(String),
        image: null,
        create_time: expect.any(Date),
        update_time: expect.any(Date),
        type: "CUSTOMER",
        vehicles: [
          {
            id: expect.any(String),
            create_time: expect.any(Date),
            update_time: expect.any(Date),
            year: testCustomer.vehicles[0]?.year,
            make: testCustomer.vehicles[0]?.make,
            model: testCustomer.vehicles[0]?.model,
            vin: testCustomer.vehicles[0]?.vin,
            license_plate: testCustomer.vehicles[0]?.license_plate,
            customer_id: expect.any(String),
          },
        ],
      });
    });

    it("should create new employee", async () => {
      // Create Shop
      // TODO: Use REST controller
      const shop = await prisma.shop.create({ data: {} });
      testEmployee.shop_id = shop.id;

      const { req, res } = createMockRequestResponse({ method: "POST" });
      req.body = {
        email: testEmployee.email,
        password: testEmployee.password,
        first_name: testEmployee.first_name,
        last_name: testEmployee.last_name,
        shop_id: testEmployee.shop_id,
      };

      await registerEmployeeHandler(req, res);
      const newEmployee = await prisma.employee.findUnique({
        where: { email: testEmployee.email },
      });

      expect(res.statusCode).toBe(302);
      expect(newEmployee).toEqual({
        id: expect.any(String),
        create_time: expect.any(Date),
        update_time: expect.any(Date),
        first_name: testEmployee.first_name,
        last_name: testEmployee.last_name,
        email: testEmployee.email,
        password: expect.any(String),
        image: null,
        type: testEmployee.type,
        shop_id: testEmployee.shop_id,
      });
    });

    it("should create new shop owner", async () => {
      const { req, res } = createMockRequestResponse({ method: "POST" });
      req.body = {
        email: testShopOwner.email,
        password: testShopOwner.password,
        first_name: testShopOwner.first_name,
        last_name: testShopOwner.last_name,
        shop: {},
      };

      await registerShopOwnerHandler(req, res);
      const newShopOwner = await prisma.employee.findUnique({
        where: { email: testShopOwner.email },
      });

      expect(res.statusCode).toBe(302);
      expect(newShopOwner).toEqual({
        id: expect.any(String),
        create_time: expect.any(Date),
        update_time: expect.any(Date),
        first_name: testShopOwner.first_name,
        last_name: testShopOwner.last_name,
        email: testShopOwner.email,
        password: expect.any(String),
        image: null,
        type: testShopOwner.type,
        shop_id: expect.any(String),
      });
    });
  });
});
