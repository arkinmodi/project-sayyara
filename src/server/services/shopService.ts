import { hoursOfOperationSchema, prisma } from "@server/db/client";
import { LatLong } from "src/types/auth";
import { getLatLongByAddress } from "src/utils/authUtil";
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
  latitude: z.string(),
  longitude: z.string(),
});

export type CreateShopType = z.infer<typeof createShopSchema>;

export const createShop = async (shop: CreateShopType) => {
  const latlong: LatLong | null = await getLatLongByAddress(
    shop.address,
    shop.postalCode,
    shop.province,
    shop.city
  );

  if (!latlong) {
    return Promise.reject("Invalid Location");
  }

  return await prisma.shop.create({
    data: {
      name: shop.name,
      address: shop.address,
      city: shop.city,
      province: shop.province,
      postalCode: shop.postalCode,
      phoneNumber: shop.phoneNumber,
      email: shop.email,
      latitude: latlong.latitude,
      longitude: latlong.longitude,
    },
  });
};

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

export const getShopsByName = async (name: string) => {
  const shops = await prisma.shop.findMany({
    where: {
      name: {
        contains: name,
      },
    },
    include: {
      services: true,
    },
  });

  return shops;
};

export const getShopsByService = async (service: string) => {
  const shops = await prisma.shop.findMany({
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

  return shops;
};
