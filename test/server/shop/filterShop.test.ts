/**
 * Filter Shop Unit Tests
 *
 * @group unit
 */
import { Shop } from "@prisma/client";
import { getFilteredShops } from "@server/services/shopService";
import { prismaMock } from "@test/mocks/prismaMock";

const testFilteredShops: Shop[] = [
  {
    id: "cldum3czo0001luej3n674gt4",
    create_time: new Date("2023-02-07T19:05:10.021Z"),
    update_time: new Date("2023-02-07T19:05:10.021Z"),
    name: "A Shop Name",
    address: "123 Address St.",
    phone_number: "123456789",
    email: "shopname@gmail.com",
    city: "Hamilton",
    province: "Ontario",
    postal_code: "",
    hours_of_operation: null,
  },
];

describe("get shops", () => {
  describe("given filters", () => {
    it("should return a list of valid shops", async () => {
      prismaMock.shop.findMany.mockResolvedValue(testFilteredShops);

      await expect(getFilteredShops("", "Oil Change")).resolves.toContainEqual([
        { id: testFilteredShops[0]!.id, name: testFilteredShops[0]!.name },
      ]);
    });
  });
});
