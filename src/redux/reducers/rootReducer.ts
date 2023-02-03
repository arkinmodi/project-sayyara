import { combineReducers } from "redux";
import appointmentReducer from "./appointmentReducer";
import authReducer from "./authReducer";
import quoteReducer from "./quoteReducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  appointments: appointmentReducer,
  quotes: quoteReducer,
});
