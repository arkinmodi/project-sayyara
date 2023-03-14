import { AppointmentStatus, UserType } from "@prisma/client";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import ShopTypes from "@redux/types/shopTypes";
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
import { ICustomerAppointment } from "src/types/appointment";
import {
  IAppointmentActionCreateAppointment,
  IAppointmentActionSetAppointmentStatus,
  IAppointmentActionSetAppointmentTime,
  IAppointmentActionSetCancelAppointment,
} from "../actions/appointmentAction";
import AppointmentTypes from "../types/appointmentTypes";

interface IPostCreateBody {
  shop_id: string;
  customer_id: string;
  service_id: string;
  vehicle_id: string;
  quote_id?: string;
  price: number;
  status: AppointmentStatus;
  start_time: string;
  end_time: string;
}

interface ICustomerAppointments {
  [key: string]: ICustomerAppointment;
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

function patchAppointmentTime(
  content: IAppointmentActionSetAppointmentTime["payload"]
): Promise<boolean> {
  return fetch(`/api/appointment/${content.id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      start_time: content.startTime,
      end_time: content.endTime,
      status: AppointmentStatus.PENDING_APPROVAL,
    }),
  }).then((res) => {
    if (res.status === 200) {
      return true;
    } else {
      // TODO: check and handle errors
      return false;
    }
  });
}

function patchCancelAppointment(
  content: IAppointmentActionSetCancelAppointment["payload"]
): Promise<boolean> {
  return fetch(`/api/appointment/${content.id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cancellation_reason: content.reason,
      status: AppointmentStatus.CANCELLED,
    }),
  }).then((res) => {
    if (res.status === 200) {
      return true;
    } else {
      // TODO: check and handle errors
      return false;
    }
  });
}

function getCustomerAppointments(
  customerId: string
): Promise<ICustomerAppointments> {
  return fetch(`/api/customer/${customerId}/appointments`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const appointments: ICustomerAppointments = {};
        const appointmentsList: ICustomerAppointment[] = data.map(
          (appointment: any) => {
            return {
              id: appointment.id,
              startTime: appointment.start_time,
              endTime: appointment.end_time,
              shopId: appointment.shop_id,
              shopName: appointment.shop.name,
              shopAddress: appointment.shop.address,
              shopPhoneNumber: appointment.shop.phone_number,
              quoteId: appointment.quote_id,
              serviceName: appointment.service.name,
              price: appointment.price,
              status: appointment.status,
              workOrderId: appointment.work_order_id,
              cancellationReason: appointment.cancellation_reason,
            };
          }
        );

        appointmentsList.forEach(
          (appointment) => (appointments[appointment.id] = appointment)
        );
        return appointments;
      });
    } else {
      return {};
    }
  });
}

function* setAppointmentStatus(
  action: IAppointmentActionSetAppointmentStatus
): Generator<CallEffect | PutEffect | SelectEffect> {
  const userType = yield select(AuthSelectors.getUserType);
  const success = yield call(patchAppointmentStatus, action.payload);
  if (success) {
    if (userType === UserType.SHOP_OWNER || userType == UserType.EMPLOYEE) {
      yield put({ type: ShopTypes.READ_SHOP_APPOINTMENTS });
    } else {
      yield call(readAppointments);
    }
  }
}

function* setAppointmentTime(
  action: IAppointmentActionSetAppointmentTime
): Generator<CallEffect | PutEffect | SelectEffect> {
  const userType = yield select(AuthSelectors.getUserType);
  if (userType == UserType.CUSTOMER) {
    const success = yield call(patchAppointmentTime, action.payload);
    if (success) {
      yield call(readAppointments);
    }
  }
}

function* setCancelAppointment(
  action: IAppointmentActionSetCancelAppointment
): Generator<CallEffect | PutEffect | SelectEffect> {
  const userType = yield select(AuthSelectors.getUserType);
  const success = yield call(patchCancelAppointment, action.payload);
  if (success) {
    if (userType === UserType.SHOP_OWNER || userType === UserType.EMPLOYEE) {
      yield put({ type: ShopTypes.READ_SHOP_APPOINTMENTS });
    } else {
      yield call(readAppointments);
    }
  }
}

function* readAppointments(): Generator<CallEffect | PutEffect | SelectEffect> {
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
    shop_id: payload.shopId,
    customer_id: payload.customerId,
    service_id: payload.serviceId,
    vehicle_id: payload.vehicleId,
    quote_id: payload.quoteId,
    price: payload.price,
    status: payload.status,
    start_time: payload.startTime,
    end_time: payload.endTime,
  };
  yield call(postCreate, body);
  yield put({
    type: AppointmentTypes.READ_APPOINTMENTS,
  });
}

/**
 * Saga to handle all appointment related actions.
 */
export function* appointmentSaga() {
  yield all([
    takeEvery(AppointmentTypes.SET_APPOINTMENT_STATUS, setAppointmentStatus),
    takeEvery(AppointmentTypes.SET_APPOINTMENT_TIME, setAppointmentTime),
    takeEvery(AppointmentTypes.READ_APPOINTMENTS, readAppointments),
    takeEvery(AppointmentTypes.CREATE_APPOINTMENT, createAppointment),
    takeEvery(AppointmentTypes.SET_CANCEL_APPOINTMENT, setCancelAppointment),
  ]);
}
