/**
 * User Service Unit Tests
 *
 * @group unit
 */
import { Employee } from "@prisma/client";
import { authorize, getUserByEmail } from "@server/services/userService";
import { prismaMock } from "@test/mocks/prismaMock";

const hashPassword = {
  hash: "$2b$10$0hhwu7ukxDsEaVe/0vW3/.RgvcBhsvUOO6ThYJwQsNWqp6eKwCaN6",
  plaintext: "password",
};

const testEmployeeUser: Employee = {
  id: "test_id",
  first_name: "first_name",
  last_name: "last_name",
  email: "user@test.com",
  password: hashPassword.hash,
  image: null,
  create_time: new Date(),
  update_time: new Date(),
  type: "SHOP_OWNER",
  shop_id: "shop_id",
};

describe("get user", () => {
  describe("given user does not exist", () => {
    it("should return null", async () => {
      prismaMock.employee.findUnique.mockResolvedValue(null);

      await expect(
        getUserByEmail("does_not_exists@test.com")
      ).resolves.toBeNull();
    });
  });

  describe("given user does exist", () => {
    it("should return user", async () => {
      prismaMock.employee.findUnique.mockResolvedValue(testEmployeeUser);

      await expect(getUserByEmail(testEmployeeUser.email)).resolves.toEqual(
        testEmployeeUser
      );
    });
  });

  describe("given blank email address", () => {
    it("should return null", async () => {
      await expect(getUserByEmail("")).resolves.toBeNull();
    });
  });
});

describe("user authorization", () => {
  describe("given valid email and password", () => {
    it("should return user data", async () => {
      testEmployeeUser.password = hashPassword.hash;
      prismaMock.employee.findUnique.mockResolvedValue(testEmployeeUser);

      await expect(
        authorize(testEmployeeUser.email, hashPassword.plaintext)
      ).resolves.toEqual({
        id: testEmployeeUser.id,
        firstName: testEmployeeUser.first_name,
        lastName: testEmployeeUser.last_name,
        email: testEmployeeUser.email,
        type: testEmployeeUser.type,
      });
    });
  });

  describe("given invalid email", () => {
    it("should reject", async () => {
      prismaMock.employee.findUnique.mockResolvedValue(null);

      await expect(
        authorize("does_not_exists@test.com", hashPassword.plaintext)
      ).rejects.toEqual("user not found");
    });
  });

  describe("given invalid password", () => {
    it("should reject", async () => {
      testEmployeeUser.password = hashPassword.hash;
      prismaMock.employee.findUnique.mockResolvedValue(testEmployeeUser);

      await expect(
        authorize(testEmployeeUser.email, "wrong_password")
      ).rejects.toEqual("unauthorized");
    });
  });
});
