import { LatLong } from "src/types/auth";

export function getLatLongByAddress(
  address: string,
  postalCode: string,
  adminDistrict: string,
  locality: string
): Promise<LatLong | null> {
  return fetch(
    `http://dev.virtualearth.net/REST/v1/Locations?key=${process.env.BING_API_KEY}&countryRegion=CA&addressLine=${address}&postalCode=${postalCode}&adminDistrict=${adminDistrict}&locality=${locality}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  ).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
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
  });
}
