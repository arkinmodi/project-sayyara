import { ICreateAppointmentAction } from "@redux/actions/createAppointmentAction";
import { IActionWithPayload } from "@redux/actions/IActionWithPayload";
import { initialCreateAppointmentState } from "@redux/state/user/createAppointmentState";
import CreateAppointmentTypes from "@redux/types/createAppointmentTypes";
import { HYDRATE } from "next-redux-wrapper";

const createAppointmentReducer = (
  state = initialCreateAppointmentState,
  action: ICreateAppointmentAction | IActionWithPayload<any>
) => {
  switch (action.type) {
    case CreateAppointmentTypes.SET_SERVICE:
      return { ...state, createAppointments: action?.payload?.service ?? null };
    case HYDRATE:
      return { ...action.payload.createAppointmentReducer };
    default:
      return state;
  }
};

export default createAppointmentReducer;
