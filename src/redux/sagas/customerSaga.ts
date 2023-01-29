import CustomerTypes from "@redux/types/customerTypes";
import {
  all,
  call,
  CallEffect,
  PutEffect,
  takeEvery,
} from "redux-saga/effects";
import { ICustomer } from "src/types/customer";

function getCustomerById(): Promise<ICustomer[]> {
  return fetch(`/api/customer/{id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const customer = data.map((customer: ICustomer) => {
          return {
            id: customer.id,
            first_name: customer.first_name,
            last_name: customer.last_name,
            phone_number: customer.phone_number,
            email: customer.email,
          };
        });
        return customer;
      });
    } else {
      // TODO: check and handle errors
      return [];
    }
  });
}

function* readCustomerById(): Generator<CallEffect | PutEffect> {
  const appointments = yield call(getCustomerById);
  //   yield put({
  //     type: AppointmentTypes.SET_APPOINTMENTS,
  //     payload: { appointments },
  //   });
}

export function* appointmentSaga() {
  yield all([takeEvery(CustomerTypes.READ_CUSTOMER_BY_ID, readCustomerById)]);
}
