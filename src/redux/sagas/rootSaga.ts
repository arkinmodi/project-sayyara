import { all } from "redux-saga/effects";
import { appointmentSaga } from "./appointmentSaga";
import { authSaga } from "./authSaga";
import { quoteSaga } from "./quoteSaga";

export function* rootSaga() {
  yield all([authSaga(), appointmentSaga(), quoteSaga()]);
}
