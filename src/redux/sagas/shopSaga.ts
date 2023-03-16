import { Employee } from "@prisma/client";
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
import { IAppointment } from "src/types/appointment";
import { ICustomer } from "src/types/customer";
import { IEmployee } from "src/types/employee";
import { IVehicle } from "src/types/vehicle";
import { getServicesByShopId } from "src/utils/shopUtil";

function getAllEmployees(shopId: string): Promise<IEmployee[] | null> {
  return fetch(`/api/shop/${shopId}/employees`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const employees: IEmployee[] = data.map((employee: Employee) => {
          return {
            id: employee.id,
            email: employee.email,
            firstName: employee.firstName,
            lastName: employee.lastName,
            phoneNumber: employee.phoneNumber,
            status: employee.status,
            type: employee.type,
          };
        });
        return employees;
      });
    } else {
      // TODO: check and handle errors
      return null;
    }
  });
}

function* readShopEmployees(): Generator<
  CallEffect | PutEffect | SelectEffect
> {
  const shopId = (yield select(AuthSelectors.getShopId)) as string | null;
  if (shopId) {
    const employees = yield call(getAllEmployees, shopId);
    yield put({
      type: ShopTypes.SET_SHOP_EMPLOYEES,
      payload: { employees },
    });
  }
}

function getAllAppointments(shopId: string): Promise<IAppointment[]> {
  return fetch(`/api/shop/${shopId}/appointments`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const appointments: IAppointment[] = data
          .map((appointment: any) => {
            const customer: ICustomer = {
              id: appointment.customerId,
              firstName: appointment.customer.firstName,
              lastName: appointment.customer.lastName,
              phoneNumber: appointment.customer.phoneNumber,
              email: appointment.customer.email,
            };

            const vehicle: IVehicle = {
              id: appointment.vehicleId,
              make: appointment.vehicle.make,
              model: appointment.vehicle.model,
              year: appointment.vehicle.year,
              vin: appointment.vehicle.vin,
              licensePlate: appointment.vehicle.licensePlate,
            };

            return {
              id: appointment.id,
              startTime: appointment.startTime,
              endTime: appointment.endTime,
              customer: customer,
              shopId: appointment.shopId,
              quoteId: appointment.quoteId,
              serviceName: appointment.service.name,
              price: appointment.price,
              status: appointment.status,
              workOrderId: appointment.workOrderId,
              vehicle: vehicle,
              cancellationReason: appointment.cancellationReason,
            };
          })
          .filter((appointment: IAppointment | undefined) => {
            return appointment !== undefined;
          });

        return appointments;
      });
    } else {
      // TODO: check and handle errors
      return [];
    }
  });
}

function* readShopServices(): Generator<CallEffect | PutEffect | SelectEffect> {
  const shopId = (yield select(AuthSelectors.getShopId)) as string | null;
  if (shopId) {
    const services = yield call(getServicesByShopId, shopId);
    yield put({
      type: ShopTypes.SET_SHOP_SERVICES,
      payload: { services },
    });
  }
}

function* readShopAppointments(): Generator<
  CallEffect | PutEffect | SelectEffect
> {
  const shopId = (yield select(AuthSelectors.getShopId)) as string | null;
  if (shopId) {
    const appointments = yield call(getAllAppointments, shopId);
    yield put({
      type: ShopTypes.SET_SHOP_APPOINTMENTS,
      payload: { shopId, appointments },
    });
  }
}

/**
 * Saga to handle all employee related actions.
 */
export function* shopSaga() {
  yield all([
    takeEvery(ShopTypes.READ_SHOP_EMPLOYEES, readShopEmployees),
    takeEvery(ShopTypes.READ_SHOP_SERVICES, readShopServices),
    takeEvery(ShopTypes.READ_SHOP_APPOINTMENTS, readShopAppointments),
  ]);
}
