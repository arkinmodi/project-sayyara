import { AuthSelectors } from "@redux/selectors/authSelectors";
import { Appointment } from "@server/db/client";
import {
  all,
  call,
  CallEffect,
  put,
  PutEffect,
  select,
  SelectEffect,
  takeEvery,
} from "redux-saga/effects";
import { IAppointment, ICustomerAppointment } from "src/types/appointment";
import { ServiceType } from "src/types/service";
import { getCustomerById } from "src/utils/customerUtil";
import { getServiceById } from "src/utils/serviceUtil";
import { getShopId } from "src/utils/shopUtil";
import { getVehicleById } from "src/utils/vehicleUtil";
import {
  IAppointmentActionCreateAppointment,
  IAppointmentActionSetAppointmentStatus,
} from "../actions/appointmentAction";
import AppointmentTypes from "../types/appointmentTypes";

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

function getAllAppointments(shopId: string): Promise<IAppointment[]> {
  return fetch(`/api/shop/${shopId}/appointments/`, {
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
            const serviceId = appointment.service_id;

            if (vehicleId && customerId && serviceId) {
              const vehiclePromise = getVehicleById(vehicleId);
              const customerPromise = getCustomerById(customerId);
              const servicePromise = getServiceById(serviceId);

              return Promise.all([
                vehiclePromise,
                customerPromise,
                servicePromise,
              ]).then((values) => {
                const vehicle = values[0];
                const customer = values[1];
                const service = values[2];

                return {
                  id: appointment.id,
                  startTime: appointment.start_time,
                  endTime: appointment.end_time,
                  customer: customer,
                  shopId: appointment.shop_id,
                  quoteId: appointment.quote_id,
                  serviceName: service?.name,
                  price: appointment.price,
                  status: appointment.status,
                  workOrderId: appointment.work_order_id,
                  vehicle: vehicle,
                };
              });
            } else {
              // Return undefined if vehicle, customer, or service are null and filter out invalid appointments below
              return;
            }
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

function getCustomerAppointments(
  customerId: string
): Promise<ICustomerAppointment[]> {
  return fetch(`/api/customer/${customerId}/appointments/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const appointments = data.map((appointment: Appointment) => {
          const serviceId = appointment.service_id;
          const shopId = appointment.shop_id;

          if (shopId && serviceId) {
            const shopPromise = getShopId(shopId);
            const servicePromise = getServiceById(serviceId);

            return Promise.all([shopPromise, servicePromise]).then((values) => {
              const shop = values[0];
              const service = values[1];

              return {
                id: appointment.id,
                startTime: appointment.start_time,
                endTime: appointment.end_time,
                shopName: shop?.name,
                shopAddress: shop?.address,
                shopPhoneNumber: shop?.phoneNumber,
                quoteId: appointment.quote_id,
                serviceName: service?.name,
                price: appointment.price,
                status: appointment.status,
                workOrderId: appointment.work_order_id,
              };
            });
          }
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

function* readAppointments(): Generator<CallEffect | PutEffect | SelectEffect> {
  const shopId = (yield select(AuthSelectors.getShopId)) as string | null;
  if (shopId) {
    const appointments = yield call(getAllAppointments, shopId);
    yield put({
      type: AppointmentTypes.SET_APPOINTMENTS,
      payload: { shopId, appointments },
    });
  }
}

function* readCustomerAppointments(): Generator<
  CallEffect | PutEffect | SelectEffect
> {
  const customerId = (yield select(AuthSelectors.getUserId)) as string;
  if (customerId) {
    const appointments = yield call(getCustomerAppointments, customerId);
    yield put({
      type: AppointmentTypes.SET_APPOINTMENTS,
      payload: { customerId, appointments },
    });
  }
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
    takeEvery(
      AppointmentTypes.READ_CUSTOMER_APPOINTMENTS,
      readCustomerAppointments
    ),
    takeEvery(AppointmentTypes.CREATE_APPOINTMENT, createAppointment),
  ]);
}
