export enum AuthDialogType {
  CUSTOMER = "CUSTOMER",
  SHOP = "SHOP",
}

export enum ShopRoles {
  SHOP_OWNER = "SHOP OWNER",
  EMPLOYEE = "EMPLOYEE",
}

export interface LatLong {
  latitude: string;
  longitude: string;
}
