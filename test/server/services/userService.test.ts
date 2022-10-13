/**
 * User Service Unit Tests
 *
 * @group unit
 */
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import {
  authorize,
  createUser,
  CreateUserInputType,
  getUser,
} from "@server/services/userService";
import { prismaMock } from "@test/mocks/prismaMock";

const testUser: User = {
  id: "test_id",
  first_name: "first_name",
  last_name: "last_name",
  email: "user@test.com",
  password: "test_password",
  image: null,
};

describe("get user", () => {
  describe("given user does not exist", () => {
    it("should return null", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(getUser("does_not_exists@test.com")).resolves.toBeNull();
    });
  });

  describe("given user does exist", () => {
    it("should return user", async () => {
      prismaMock.user.findUnique.mockResolvedValue(testUser);

      await expect(getUser(testUser.email)).resolves.toEqual(testUser);
    });
  });

  describe("given blank email address", () => {
    it("should return null", async () => {
      await expect(getUser("")).resolves.toBeNull();
    });
  });
});

describe("create user", () => {
  describe("given user", () => {
    it("should create user", async () => {
      const mockCreateUserInput: CreateUserInputType = testUser;

      prismaMock.user.create.mockResolvedValue(testUser);

      await expect(createUser(mockCreateUserInput)).resolves.toBe(testUser);
    });
  });

  describe("given user already exists", () => {
    it("should throw an exception", async () => {
      const mockCreateUserInput: CreateUserInputType = testUser;

      prismaMock.user.create.mockRejectedValue(
        new PrismaClientKnownRequestError(
          "Unique constraint failed on the constraint: `User_email_key`",
          "P2002",
          "4.4.0"
        )
      );

      await expect(createUser(mockCreateUserInput)).rejects.toBeInstanceOf(
        PrismaClientKnownRequestError
      );
    });
  });
});

describe("user authorization", () => {
  describe("given valid email and password", () => {
    it("should return user data", async () => {
      prismaMock.user.findUnique.mockResolvedValue(testUser);

      await expect(
        authorize(testUser.email, testUser.password)
      ).resolves.toEqual({
        id: testUser.id,
        firstName: testUser.first_name,
        lastName: testUser.last_name,
        email: testUser.email,
      });
    });
  });

  describe("given invalid email", () => {
    it("should reject", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        authorize("does_not_exists@test.com", testUser.password)
      ).rejects.toEqual("user not found");
    });
  });

  describe("given invalid password", () => {
    it("should reject", async () => {
      prismaMock.user.findUnique.mockResolvedValue(testUser);

      await expect(authorize(testUser.email, "wrong_password")).rejects.toEqual(
        "unauthorized"
      );
    });
  });
});
