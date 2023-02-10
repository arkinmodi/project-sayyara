import { Service, ServiceType } from "@prisma/client";
import { IService } from "src/types/service";
import { IShop } from "src/types/shop";

export function getShopId(id: string): Promise<IShop | null> {
  return fetch(`/api/shop/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const shop: IShop = {
          name: data.name,
          address: data.address,
          province: data.province,
          postalCode: data.postal_code,
          city: data.city,
          phoneNumber: data.phone_number,
          email: data.email,
          hoursOfOperation: data.hours_of_operation,
        };
        return shop;
      });
    } else {
      // TODO: check and handle errors
      return null;
    }
  });
}

export function getServicesByShopId(
  shopId: string,
  type?: ServiceType
): Promise<IService[] | null> {
  const url =
    type != undefined
      ? `/api/shop/${shopId}/services/${type}`
      : `/api/shop/${shopId}/services`;

  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const services = data.map((service: Service) => {
          return {
            id: service.id,
            name: service.name,
            description: service.description,
            estimatedTime: service.estimated_time,
            totalPrice: service.total_price,
            parts: service.parts,
            type: service.type,
          };
        });
        return services;
      });
    } else {
      // TODO: check and handle errors
      return null;
    }
  });
}

export function patchShop(shopId: string, patch: IShop): Promise<IShop | null> {
  const hoursOfOp = patch.hoursOfOperation;
  return fetch(`/api/shop/${shopId}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: patch.name,
      address: patch.address,
      postal_code: patch.postalCode,
      city: patch.city,
      province: patch.province,
      phone_number: patch.phoneNumber,
      hours_of_operation:
        hoursOfOp != null
          ? {
              monday: {
                ...hoursOfOp.monday,
                openTime: hoursOfOp.monday.openTime,
                closeTime: hoursOfOp.monday.closeTime,
              },
              tuesday: {
                ...hoursOfOp.tuesday,
                openTime: hoursOfOp.tuesday.openTime,
                closeTime: hoursOfOp.tuesday.closeTime,
              },
              wednesday: {
                ...hoursOfOp.wednesday,
                openTime: hoursOfOp.wednesday.openTime,
                closeTime: hoursOfOp.wednesday.closeTime,
              },
              thursday: {
                ...hoursOfOp.thursday,
                openTime: hoursOfOp.thursday.openTime,
                closeTime: hoursOfOp.thursday.closeTime,
              },
              friday: {
                ...hoursOfOp.friday,
                openTime: hoursOfOp.friday.openTime,
                closeTime: hoursOfOp.friday.closeTime,
              },
              saturday: {
                ...hoursOfOp.saturday,
                openTime: hoursOfOp.saturday.openTime,
                closeTime: hoursOfOp.saturday.closeTime,
              },
              sunday: {
                ...hoursOfOp.sunday,
                openTime: hoursOfOp.sunday.openTime,
                closeTime: hoursOfOp.sunday.closeTime,
              },
            }
          : null,
      email: patch.email,
    }),
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const shop: IShop = {
          name: data.name,
          address: data.address,
          province: data.province,
          postalCode: data.postal_code,
          city: data.city,
          phoneNumber: data.phone_number,
          email: data.email,
          hoursOfOperation: data.hours_of_operation,
        };
        return shop;
      });
    } else {
      // TODO: check and handle errors
      return null;
    }
  });
}
