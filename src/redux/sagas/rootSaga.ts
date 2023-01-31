import { all } from "redux-saga/effects";
import { appointmentSaga } from "./appointmentSaga";
import { authSaga } from "./authSaga";
import { workOrderSaga } from "./workOrderSaga";

export function* rootSaga() {
  yield all([authSaga(), appointmentSaga(), workOrderSaga()]);
}
