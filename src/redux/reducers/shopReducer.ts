import { IShopAction } from "@redux/actions/shopActions";
import { initialShopState } from "@redux/state/shop/shopState";
import ShopTypes from "@redux/types/shopTypes";
import { HYDRATE } from "next-redux-wrapper";
import { IActionWithPayload } from "../actions/IActionWithPayload";

const shopReducer = (
  state = initialShopState,
  action: IShopAction | IActionWithPayload<any>
) => {
  switch (action.type) {
    case ShopTypes.SET_SHOP_EMPLOYEES:
      return { ...state, employees: action?.payload?.employees };
    case ShopTypes.SET_SHOP_SERVICES:
      return { ...state, services: action?.payload?.services };
    // This will overwrite client state - required for Next.js
    case HYDRATE: {
      return { ...action.payload.shopReducer };
    }
    default:
      return state;
  }
};

export default shopReducer;
