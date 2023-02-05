import { combineReducers } from "redux";
import appointmentReducer from "./appointmentReducer";
import authReducer from "./authReducer";
import shopReducer from "./shopReducer";
import workOrderReducer from "./workOrderReducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  appointments: appointmentReducer,
  workOrder: workOrderReducer,
  shop: shopReducer,
});
