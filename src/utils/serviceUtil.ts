import { IService } from "src/types/service";

/**
 * Get service by service ID
 *
 * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
 * @date 01/30/2023
 * @param {string} id - Service ID
 * @returns A service object
 */
export async function getServiceById(id: string): Promise<IService | null> {
  return fetch(`/api/service/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const service: IService = {
          id: data.id,
          name: data.name,
          description: data.description,
          estimatedTime: data.estimatedTime,
          totalPrice: data.totalPrice,
          parts: data.parts,
          type: data.type,
          shopId: data.shopId,
        };
        return service;
      });
    } else {
      return null;
    }
  });
}

/**
 * Deletes a service by given the service ID
 *
 * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
 * @date 03/26/2023
 * @param {string} serviceId - Service ID
 * @returns A boolean representing if the deletion was successful
 */
export async function deleteServiceById(serviceId: string): Promise<boolean> {
  return fetch(`/api/service/${serviceId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 204) {
      return true;
    } else {
      return false;
    }
  });
}
