import { combineReducers } from "redux";
import appointmentReducer from "./appointmentReducer";
import authReducer from "./authReducer";
import shopReducer from "./shopReducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  appointments: appointmentReducer,
  shop: shopReducer,
});
