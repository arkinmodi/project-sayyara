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
          estimated_time: data.estimated_time,
          total_price: data.total_price,
          parts: data.parts,
          type: data.type,
          shop_id: data.shop_id,
        };
        return service;
      });
    } else {
      // TODO: check and handle errors
      return null;
    }
  });
}
