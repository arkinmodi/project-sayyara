import { Appointment, Employee } from "@prisma/client";
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
import { IEmployee } from "src/types/employee";
import { getCustomerById } from "src/utils/customerUtil";
import { getServiceById } from "src/utils/serviceUtil";
import { getServicesByShopId } from "src/utils/shopUtil";
import { getVehicleById } from "src/utils/vehicleUtil";

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
            firstName: employee.first_name,
            lastName: employee.last_name,
            phoneNumber: employee.phone_number,
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
