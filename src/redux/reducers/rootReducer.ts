import { combineReducers } from "redux";
import appointmentReducer from "./appointmentReducer";
import authReducer from "./authReducer";
import quoteReducer from "./quoteReducer";
import shopReducer from "./shopReducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  appointments: appointmentReducer,
  quotes: quoteReducer,
  shop: shopReducer,
});
