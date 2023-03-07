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
  first_name: "customer_first_name",
  last_name: "customer_last_name",
  phone_number: "1234567890",
  email: "customer@test.com",
  password: hashPassword.hash,
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
      create_time: expect.any(Date),
      update_time: expect.any(Date),
      email: testCustomer.email,
      password: testCustomer.password,
      first_name: testCustomer.first_name,
      last_name: testCustomer.last_name,
      image: null,
      phone_number: testCustomer.phone_number,
      type: testCustomer.type,
    });
  });

  it("FRT-M3-8: get user by an email address for a user that does not exist", async () => {
    // Setup
    await createUser();

    await expect(
      getUserByEmail("does_not_exists@test.com")
    ).resolves.toBeNull();
    await expect(getUserByEmail("")).resolves.toBeNull();
  });

  it("FRT-M3-9: authorize a user with a valid email and password", async () => {
    // Setup
    await createUser();

    await expect(
      authorize(testCustomer.email, hashPassword.plaintext)
    ).resolves.toEqual({
      id: expect.any(String),
      firstName: testCustomer.first_name,
      lastName: testCustomer.last_name,
      email: testCustomer.email,
      type: testCustomer.type,
    });
  });

  it("FRT-M3-10: authorize a user with an invalid email and password", async () => {
    // Setup
    await createUser();

    await expect(
      authorize("does_not_exists@test.com", "fake_password")
    ).rejects.toEqual("user not found");
    await expect(
      authorize(testCustomer.email, "wrong_password")
    ).rejects.toEqual("unauthorized");
  });
});

const createUser = async () => {
  return await prisma.customer.create({
    data: {
      first_name: testCustomer.first_name,
      last_name: testCustomer.last_name,
      phone_number: testCustomer.phone_number,
      email: testCustomer.email,
      password: testCustomer.password,
      type: testCustomer.type,
      vehicles: {
        create: {
          license_plate: testCustomer.vehicles[0]!.license_plate,
          make: testCustomer.vehicles[0]!.make,
          model: testCustomer.vehicles[0]!.model,
          vin: testCustomer.vehicles[0]!.vin,
          year: testCustomer.vehicles[0]!.year,
        },
      },
    },
  });
};
