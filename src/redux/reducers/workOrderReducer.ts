import { IWorkOrderAction } from "@redux/actions/workOrderAction";
import { initialWorkOrderState } from "@redux/state/workOrderState";
import WorkOrderTypes from "@redux/types/workOrderTypes";
import { HYDRATE } from "next-redux-wrapper";
import { IActionWithPayload } from "../actions/IActionWithPayload";

const workOrderReducer = (
  state = initialWorkOrderState,
  action: IWorkOrderAction | IActionWithPayload<any>
) => {
  switch (action.type) {
    case WorkOrderTypes.SET_WORK_ORDER:
      return { ...state, workOrder: action?.payload?.workOrder };

    // This will overwrite client state - required for Next.js
    case HYDRATE:
      return { ...action.payload.workOrderReducer };

    default:
      return state;
  }
};

export default workOrderReducer;
