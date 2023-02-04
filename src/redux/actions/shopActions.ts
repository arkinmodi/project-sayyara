import ShopTypes from "@redux/types/shopTypes";
import { IEmployee } from "src/types/employee";
import { IService } from "src/types/service";

interface IShopActionBase {
  type: ShopTypes;
}

export interface IShopActionReadShopEmployees extends IShopActionBase {
  payload: void;
}

export interface IShopActionSetShopEmployees extends IShopActionBase {
  payload: { employees: IEmployee[] | null };
}

export interface IServiceActionReadShopServices extends IShopActionBase {
  payload: void;
}

export interface IServiceActionSetShopServices extends IShopActionBase {
  payload: { services: IService[] };
}

export type IShopAction =
  | IShopActionReadShopEmployees
  | IShopActionSetShopEmployees
  | IServiceActionSetShopServices;

export const readShopEmployees = (payload: void) => ({
  type: ShopTypes.READ_SHOP_EMPLOYEES,
  payload,
});

export const setShopEmployees = (
  payload: IShopActionSetShopEmployees["payload"]
) => ({
  type: ShopTypes.SET_SHOP_EMPLOYEES,
  payload,
});

export const readShopServices = (payload: void) => ({
  type: ShopTypes.READ_SHOP_SERVICES,
  payload,
});

export const setShopServices = (
  payload: IServiceActionSetShopServices["payload"]
) => ({
  type: ShopTypes.SET_SHOP_SERVICES,
  payload,
});
