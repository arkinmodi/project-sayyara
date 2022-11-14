import { all } from "redux-saga/effects";
import { appointmentSaga } from "./appointmentSaga";
import { authSaga } from "./authSaga";

export function* rootSaga() {
  yield all([authSaga(), appointmentSaga()]);
}
