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
  shopId: string;
  customerId: string;
  serviceId: string;
  vehicleId: string;
  quoteId?: string;
  price: number;
  status: AppointmentStatus;
  startTime: string;
  endTime: string;
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
      startTime: content.startTime,
      endTime: content.endTime,
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
      cancellationReason: content.reason,
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
              startTime: appointment.startTime,
              endTime: appointment.endTime,
              shopId: appointment.shopId,
              shopName: appointment.shop.name,
              shopAddress: appointment.shop.address,
              shopPhoneNumber: appointment.shop.phoneNumber,
              quoteId: appointment.quoteId,
              serviceName: appointment.service.name,
              price: appointment.price,
              status: appointment.status,
              workOrderId: appointment.workOrderId,
              cancellationReason: appointment.cancellationReason,
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
    shopId: payload.shopId,
    customerId: payload.customerId,
    serviceId: payload.serviceId,
    vehicleId: payload.vehicleId,
    quoteId: payload.quoteId,
    price: payload.price,
    status: payload.status,
    startTime: payload.startTime,
    endTime: payload.endTime,
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
