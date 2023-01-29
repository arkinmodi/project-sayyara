import { Appointment } from "@server/db/client";
import {
  all,
  call,
  CallEffect,
  put,
  PutEffect,
  takeEvery,
} from "redux-saga/effects";
import { IAppointment } from "src/types/appointment";
import { ServiceType } from "src/types/service";
import {
  IAppointmentActionCreateAppointment,
  IAppointmentActionSetAppointmentStatus,
} from "../actions/appointmentAction";
import AppointmentTypes from "../types/appointmentTypes";
import { getCustomerById } from "./util/customerUtil";
import { getVehicleById } from "./util/vehicleUtil";

interface IPostCreateBody {
  service_type: ServiceType;
  start_time: string;
  end_time: string;
}

function patchAppointmentStatus(
  content: IAppointmentActionSetAppointmentStatus["payload"]
): Promise<boolean> {
  return fetch(`/api/appointment/${content.id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: content.status }),
  }).then((res) => {
    if (res.status === 200) {
      return true;
    } else {
      // TODO: check and handle errors
      return false;
    }
  });
}

function getAllAppointments(): Promise<IAppointment[]> {
  //TODO: change to use endpoint with store ID
  return fetch(`/api/appointment/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const appointments = data
          .map((appointment: Appointment) => {
            const vehicleId = appointment.vehicle_id;
            const customerId = appointment.customer_id;

            if (vehicleId && customerId) {
              const vehiclePromise = getVehicleById(vehicleId);

              const customerPromise = getCustomerById(customerId);
              return Promise.all([vehiclePromise, customerPromise]).then(
                (values) => {
                  const vehicle = values[0];
                  const customer = values[1];

                  return {
                    id: appointment.id,
                    startTime: appointment.start_time,
                    endTime: appointment.end_time,
                    customer: customer,
                    shopId: appointment.shop_id,
                    quoteId: appointment.quote_id,
                    serviceType: appointment.service_type,
                    price: appointment.price,
                    status: appointment.status,
                    workOrderId: appointment.work_order_id,
                    vehicle: vehicle,
                  };
                }
              );
            }
            /**
             * TODO(joy):
             * For now, an appointment can have shop or customer as optionals. To handle invalid appointments with no vehicleId or customerId, we will return an undefined object an filter it out.
             * This will be removed when the appointment schema is updated.
             */
          })
          .filter((appointment: IAppointment | undefined) => {
            return appointment !== undefined;
          });

        return Promise.all(appointments).then((appointmentList) => {
          return appointmentList;
        });
      });
    } else {
      // TODO: check and handle errors
      return [];
    }
  });
}

function* setAppointmentStatus(
  action: IAppointmentActionSetAppointmentStatus
): Generator<CallEffect | PutEffect> {
  const success = yield call(patchAppointmentStatus, action.payload);
  if (success) {
    yield call(readAppointments);
  }
}

function* readAppointments(): Generator<CallEffect | PutEffect> {
  const appointments = yield call(getAllAppointments);
  yield put({
    type: AppointmentTypes.SET_APPOINTMENTS,
    payload: { appointments },
  });
}

function postCreate(body: IPostCreateBody): Promise<boolean> {
  return fetch("/api/appointment/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => {
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  });
}

function* createAppointment(
  action: IAppointmentActionCreateAppointment
): Generator<CallEffect | PutEffect> {
  const payload = action.payload;
  const body: IPostCreateBody = {
    service_type: payload.serviceType,
    start_time: payload.startTime,
    end_time: payload.endTime,
  };
  yield call(postCreate, body);
}

/**
 * Saga to handle all appointment related actions.
 */
export function* appointmentSaga() {
  yield all([
    takeEvery(AppointmentTypes.SET_APPOINTMENT_STATUS, setAppointmentStatus),
    takeEvery(AppointmentTypes.READ_APPOINTMENTS, readAppointments),
    takeEvery(AppointmentTypes.CREATE_APPOINTMENT, createAppointment),
  ]);
}
