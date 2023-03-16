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
  id: "testId",
  firstName: "firstName",
  lastName: "lastName",
  phoneNumber: "1234567890",
  email: "user@test.com",
  password: hashPassword.hash,
  image: null,
  createTime: new Date(),
  updateTime: new Date(),
  type: "SHOP_OWNER",
  shopId: "shopId",
  status: "ACTIVE",
};

describe("get user", () => {
  describe("given user does not exist", () => {
    it("should return null", async () => {
      prismaMock.employee.findUnique.mockResolvedValue(null);

      await expect(
        getUserByEmail("doesNotExists@test.com")
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
        firstName: testEmployeeUser.firstName,
        lastName: testEmployeeUser.lastName,
        email: testEmployeeUser.email,
        type: testEmployeeUser.type,
        shopId: testEmployeeUser.shopId,
      });
    });
  });

  describe("given invalid email", () => {
    it("should reject", async () => {
      prismaMock.employee.findUnique.mockResolvedValue(null);

      await expect(
        authorize("doesNotExists@test.com", hashPassword.plaintext)
      ).rejects.toEqual("user not found");
    });
  });

  describe("given invalid password", () => {
    it("should reject", async () => {
      testEmployeeUser.password = hashPassword.hash;
      prismaMock.employee.findUnique.mockResolvedValue(testEmployeeUser);

      await expect(
        authorize(testEmployeeUser.email, "wrongPassword")
      ).rejects.toEqual("unauthorized");
    });
  });
});
