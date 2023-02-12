import { initialAppointmentsState } from "@redux/state/user/appointmentState";
import AppointmentTypes from "@redux/types/appointmentTypes";
import { HYDRATE } from "next-redux-wrapper";
import { IAppointmentAction } from "../actions/appointmentAction";
import { IActionWithPayload } from "../actions/IActionWithPayload";

const appointmentReducer = (
  state = initialAppointmentsState,
  action: IAppointmentAction | IActionWithPayload<any>
) => {
  switch (action.type) {
    case AppointmentTypes.SET_APPOINTMENTS:
      return { ...state, appointments: action?.payload?.appointments ?? [] };
    // This will overwrite client state - required for Next.js
    case HYDRATE: {
      return { ...action.payload.appointmentReducer };
    }
    default:
      return state;
  }
};

export default appointmentReducer;
