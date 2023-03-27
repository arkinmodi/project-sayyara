import { IService } from "src/types/service";

export function getServiceById(id: string): Promise<IService | null> {
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
      // TODO: check and handle errors
      return null;
    }
  });
}

export function deleteServiceById(serviceId: string): Promise<boolean> {
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
