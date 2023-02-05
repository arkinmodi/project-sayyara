import { all } from "redux-saga/effects";
import { appointmentSaga } from "./appointmentSaga";
import { authSaga } from "./authSaga";
import { employeeSaga } from "./employeeSaga";
import { shopSaga } from "./shopSaga";
import { workOrderSaga } from "./workOrderSaga";

export function* rootSaga() {
  yield all([
    authSaga(),
    appointmentSaga(),
    shopSaga(),
    employeeSaga(),
    workOrderSaga(),
  ]);
}
