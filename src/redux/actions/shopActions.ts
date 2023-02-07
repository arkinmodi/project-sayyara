import ShopTypes from "@redux/types/shopTypes";
import { IEmployee } from "src/types/employee";

interface IShopActionBase {
  type: ShopTypes;
}

export interface IShopActionReadShopEmployees extends IShopActionBase {
  payload: void;
}

export interface IShopActionSetShopEmployees extends IShopActionBase {
  payload: { employees: IEmployee[] | null };
}

export type IShopAction =
  | IShopActionReadShopEmployees
  | IShopActionSetShopEmployees;

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
