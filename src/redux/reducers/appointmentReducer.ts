import { HYDRATE } from "next-redux-wrapper";
import { IAppointmentAction } from "../actions/appointmentAction";
import { IActionWithPayload } from "../actions/IActionWithPayload";
import { initialAppointmentsState } from "../state/user/appointmentState";
import AppointmentType from "../types/appointmentTypes";

const appointmentReducer = (
  state = initialAppointmentsState,
  action: IAppointmentAction | IActionWithPayload<any>
) => {
  switch (action.type) {
    case AppointmentType.SET_APPOINTMENTS:
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
