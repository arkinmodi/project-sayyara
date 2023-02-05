import { IShopState } from "@redux/state/shop/shopState";
import { createSelector } from "reselect";
import { RootState } from "../store";

const getShopState = (state: RootState): IShopState => state.shop;

const getShopEmployees = createSelector(
  getShopState,
  (shopState) => shopState.employees
);

export const ShopSelectors = {
  getShopEmployees,
};
