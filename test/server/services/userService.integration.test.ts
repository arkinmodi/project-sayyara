/**
 * User Service Unit Tests
 *
 * @group integration
 */
import { CustomerWithVehiclesType, prisma } from "@server/db/client";
import { authorize, getUserByEmail } from "@server/services/userService";

const hashPassword = {
  hash: "$2b$10$0hhwu7ukxDsEaVe/0vW3/.RgvcBhsvUOO6ThYJwQsNWqp6eKwCaN6",
  plaintext: "password",
};

const testCustomer: CustomerWithVehiclesType = {
  id: "",
  firstName: "customerFirstName",
  lastName: "customerLastName",
  phoneNumber: "1234567890",
  email: "customer@test.com",
  password: hashPassword.hash,
  image: null,
  createTime: new Date(),
  updateTime: new Date(),
  type: "CUSTOMER",
  vehicles: [
    {
      id: "testCustomerVehicleId",
      createTime: new Date(),
      updateTime: new Date(),
      customerId: "testCustomerId",
      licensePlate: "testLicensePlate",
      make: "testMake",
      model: "testModel",
      vin: "testVin",
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
  await prisma.$transaction([
    prisma.vehicle.deleteMany(),
    prisma.customer.deleteMany(),
  ]);
});

describe("User Module", () => {
  it("FRT-M3-7: get user by an email address for an existing user", async () => {
    // Setup
    await createUser();

    await expect(getUserByEmail(testCustomer.email)).resolves.toEqual({
      id: expect.any(String),
      createTime: expect.any(Date),
      updateTime: expect.any(Date),
      email: testCustomer.email,
      password: testCustomer.password,
      firstName: testCustomer.firstName,
      lastName: testCustomer.lastName,
      image: null,
      phoneNumber: testCustomer.phoneNumber,
      type: testCustomer.type,
    });
  });

  it("FRT-M3-8: get user by an email address for a user that does not exist", async () => {
    // Setup
    await createUser();

    await expect(getUserByEmail("doesNotExists@test.com")).resolves.toBeNull();
    await expect(getUserByEmail("")).resolves.toBeNull();
  });

  it("FRT-M3-9: authorize a user with a valid email and password", async () => {
    // Setup
    await createUser();

    await expect(
      authorize(testCustomer.email, hashPassword.plaintext)
    ).resolves.toEqual({
      id: expect.any(String),
      firstName: testCustomer.firstName,
      lastName: testCustomer.lastName,
      email: testCustomer.email,
      type: testCustomer.type,
    });
  });

  it("FRT-M3-10: authorize a user with an invalid email and password", async () => {
    // Setup
    await createUser();

    await expect(
      authorize("doesNotExists@test.com", "fakePassword")
    ).rejects.toEqual("user not found");
    await expect(
      authorize(testCustomer.email, "wrongPassword")
    ).rejects.toEqual("unauthorized");
  });
});

const createUser = async () => {
  return await prisma.customer.create({
    data: {
      firstName: testCustomer.firstName,
      lastName: testCustomer.lastName,
      phoneNumber: testCustomer.phoneNumber,
      email: testCustomer.email,
      password: testCustomer.password,
      type: testCustomer.type,
      vehicles: {
        create: {
          licensePlate: testCustomer.vehicles[0]!.licensePlate,
          make: testCustomer.vehicles[0]!.make,
          model: testCustomer.vehicles[0]!.model,
          vin: testCustomer.vehicles[0]!.vin,
          year: testCustomer.vehicles[0]!.year,
        },
      },
    },
  });
};
