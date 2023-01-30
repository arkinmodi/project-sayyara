import { HYDRATE } from "next-redux-wrapper";
import { IActionWithPayload } from "../actions/IActionWithPayload";
import { IServiceAction } from "../actions/serviceAction";
import { initialServicesState } from "../state/user/serviceState";
import ServiceType from "../types/serviceTypes";

const ServiceReducer = (
  state = initialServicesState,
  action: IServiceAction | IActionWithPayload<any>
) => {
  switch (action.type) {
    case ServiceType.SET_SERVICES:
      return { ...state, Services: action?.payload?.Services ?? [] };
    // This will overwrite client state - required for Next.js
    case HYDRATE: {
      return { ...action.payload.ServiceReducer };
    }
    default:
      return state;
  }
};

export default ServiceReducer;
