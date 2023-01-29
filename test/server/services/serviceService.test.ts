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
  id: "test_service_id",
  create_time: new Date(),
  update_time: new Date(),
  name: "test_service_name",
  description: "test_service_description",
  estimated_time: 2,
  total_price: 100,
  parts: null,
  type: "CANNED",
  shop_id: "test_shop_id",
};

describe("get service", () => {
  describe("given service does not exist", () => {
    it("should return null", async () => {
      prismaMock.service.findUnique.mockResolvedValue(null);

      await expect(getServiceById("does_not_exist")).resolves.toBeNull();
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
