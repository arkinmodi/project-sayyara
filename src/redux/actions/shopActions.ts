import { IShopState } from "@redux/state/shop/shopState";
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

export interface IShopActionReadShopServices extends IShopActionBase {
  payload: void;
}

export interface IShopActionSetShopServices extends IShopActionBase {
  payload: { services: IService[] };
}

export interface IShopActionSetShopState extends IShopActionBase {
  payload: IShopState;
}

export type IShopAction =
  | IShopActionReadShopEmployees
  | IShopActionSetShopState
  | IShopActionSetShopEmployees
  | IShopActionSetShopServices;

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
  payload: IShopActionSetShopServices["payload"]
) => ({
  type: ShopTypes.SET_SHOP_SERVICES,
  payload,
});

export const setShopState = (payload: IShopActionSetShopState["payload"]) => ({
  type: ShopTypes.SET_SHOP_STATE,
  payload,
});
