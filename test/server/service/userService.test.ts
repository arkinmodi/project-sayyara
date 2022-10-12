import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import {
  createUser,
  getUser,
  CreateUserInputType,
} from "@server/service/userService";
import { prismaMock } from "@test/mocks/prismaMock";

const testUser: User = {
  id: "test_id",
  first_name: "first_name",
  last_name: "last_name",
  email: "user@test.com",
  password: "test_password",
  image: null,
};

describe("user service", () => {
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
});
