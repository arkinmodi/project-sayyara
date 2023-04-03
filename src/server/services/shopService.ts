import { hoursOfOperationSchema, prisma } from "@server/db/client";
import {
  PHONE_NUMBER_REGEX,
  POSTAL_CODE_REGEX,
} from "src/utils/formValidationUtil";
import { z } from "zod";

export const createShopSchema = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  postalCode: z.string().regex(POSTAL_CODE_REGEX),
  phoneNumber: z.string().regex(PHONE_NUMBER_REGEX),
  email: z.string().email(),
});

export type CreateShopType = z.infer<typeof createShopSchema>;

/**
 * Get shop by ID
 *
 * @author Leon So <34189743+LeonSo7@users.noreply.github.com>
 * @date 02/01/2023
 * @param {string} id - Shop ID
 * @returns Shop object
 */
export const getShopById = async (id: string) => {
  return await prisma.shop.findUnique({ where: { id } });
};

export const updateShopSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().regex(POSTAL_CODE_REGEX).optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  phoneNumber: z.string().regex(PHONE_NUMBER_REGEX).optional(),
  hoursOfOperation: z.optional(hoursOfOperationSchema),
  email: z.string().email().optional(),
});
export type UpdateShopType = z.infer<typeof updateShopSchema>;

/**
 * Update shop by ID
 *
 * @author Leon So <34189743+LeonSo7@users.noreply.github.com>
 * @date 02/01/2023
 * @param {string} id - Shop ID
 * @param {UpdateShopType} patch - Update data
 * @returns Shop object
 */
export const updateShopById = async (id: string, patch: UpdateShopType) => {
  const shop = await getShopById(id);
  if (!shop) return Promise.reject("Shop not found.");

  const hoursOfOperation:
    | {
        [key: string]: { [key: string]: string | boolean };
      }
    | undefined = patch.hoursOfOperation;

  if (hoursOfOperation) {
    Object.keys(hoursOfOperation).forEach((day) => {
      if (
        /**
         * String comparison of time should work here as timezone is restricted to UTC with precision 0.
         * See hoursOfOperationSchema for more details.
         */
        new Date(hoursOfOperation[day]!.openTime! as string).toLocaleTimeString(
          "en-US",
          { hour: "numeric", minute: "numeric", hour12: false }
        ) >
        new Date(
          hoursOfOperation[day]!.closeTime! as string
        ).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        })
      ) {
        return Promise.reject("Invalid open time and/or close time.");
      }
    });
  }

  return await prisma.shop.update({
    where: { id },
    data: {
      name: patch.name,
      address: patch.address,
      postalCode: patch.postalCode,
      city: patch.city,
      province: patch.province,
      phoneNumber: patch.phoneNumber,
      hoursOfOperation: hoursOfOperation,
      email: patch.email,
    },
  });
};

/**
 * Get list of shops by shop name
 *
 * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
 * @date 03/26/2023
 * @param {string} shop - Shop name
 * @returns List of shop objects
 */
export const getShopsByName = async (shop: string) => {
  return await prisma.shop.findMany({
    where: {
      name: {
        contains: shop,
      },
    },
    include: {
      services: true,
    },
  });
};

/**
 * Get list of shops by service name
 *
 * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
 * @date 03/26/2023
 * @param {string} service - Service name
 * @returns List of shop objects
 */
export const getShopsByService = async (service: string) => {
  return await prisma.shop.findMany({
    where: {
      services: {
        some: {
          name: {
            contains: service,
          },
        },
      },
    },
    include: {
      services: true,
    },
  });
};

export type LatLong = {
  latitude: string;
  longitude: string;
};

/**
 * Get Longitude and Latitude from an Address
 *
 * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
 * @date 03/26/2023
 * @param {string} address - Address to get coordinates of
 * @param {string} postalCode - Postal Code to the address
 * @param {string} adminDistrict - Administrative district of address (e.g., Ontario)
 * @param {string} locality - City or neighbourhood of address (e.g., Hamilton)
 * @returns Latitude and Longitude object
 */
export async function getLatLongByAddress(
  address: string,
  postalCode: string,
  adminDistrict: string,
  locality: string
): Promise<LatLong | null> {
  const res = await fetch(
    `http://dev.virtualearth.net/REST/v1/Locations?key=${process.env.BING_API_KEY}&countryRegion=CA&addressLine=${address}&postalCode=${postalCode}&adminDistrict=${adminDistrict}&locality=${locality}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  if (res.status === 200) {
    return res.json().then((data: any) => {
      const latLong: LatLong = {
        latitude:
          data.resourceSets[0].resources[0].point.coordinates[0].toString(),
        longitude:
          data.resourceSets[0].resources[0].point.coordinates[1].toString(),
      };
      return latLong;
    });
  } else {
    return null;
  }
}
