import { combineReducers } from "redux";
import appointmentReducer from "./appointmentReducer";
import authReducer from "./authReducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  appointments: appointmentReducer,
});
