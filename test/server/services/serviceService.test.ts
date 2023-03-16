/**
 *
 * Service Service Unit Tests
 *
 * @group unit
 */

import { Service } from "@server/db/client";
import { getServiceById } from "@server/services/serviceService";
import { prismaMock } from "@test/mocks/prismaMock";

const testService: Service = {
  id: "testServiceId",
  createTime: new Date(),
  updateTime: new Date(),
  name: "testServiceName",
  description: "testServiceDescription",
  estimatedTime: 2,
  totalPrice: 100,
  parts: null,
  type: "CANNED",
  shopId: "shopId",
};

describe("get service", () => {
  describe("given service does not exist", () => {
    it("should return null", async () => {
      prismaMock.service.findUnique.mockResolvedValue(null);

      await expect(getServiceById("doesNotExist")).resolves.toBeNull();
    });
  });

  describe("given service does exist", () => {
    it("should return service", async () => {
      prismaMock.service.findUnique.mockResolvedValue(testService);

      await expect(getServiceById(testService.id)).resolves.toEqual(
        testService
      );
    });
  });
});
