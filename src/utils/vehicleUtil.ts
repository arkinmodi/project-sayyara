import { IVehicle } from "src/types/vehicle";

/**
 * Get vehicle by vehicle ID
 *
 * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
 * @date 01/30/2023
 * @param {string} id - Vehicle ID
 * @returns A vehicle object
 */
export async function getVehicleById(id: string): Promise<IVehicle | null> {
  return fetch(`/api/vehicle/` + id, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const vehicle: IVehicle = {
          id: data.id,
          make: data.make,
          model: data.model,
          year: data.year,
          vin: data.vin,
          licensePlate: data.licensePlate,
        };
        return vehicle;
      });
    } else {
      return null;
    }
  });
}

/**
 *  Gets the vehicle related to the customer
 *
 * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
 * @date 02/13/2023
 * @param {string} id - Customer ID
 * @returns The vehicle related to the customer
 */
export async function getVehicleByCustomerId(
  id: string
): Promise<IVehicle | null> {
  return fetch(`/api/customer/${id}/vehicle`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((dataList) => {
        /**
         * TODO: Multiple vehicles for a user
         * `/api/customer/${id}/vehicle` returns a list of vehicle, but currently we assume the user will only have one vehicle
         */
        const data = dataList[0];
        const vehicle: IVehicle = {
          id: data.id,
          make: data.make,
          model: data.model,
          year: data.year,
          vin: data.vin,
          licensePlate: data.licensePlate,
        };
        return vehicle;
      });
    } else {
      return null;
    }
  });
}
