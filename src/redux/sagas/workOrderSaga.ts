import {
  getWorkOrderByIdActionBuilder,
  IWorkOrderActionGetWorkOrderById,
  IWorkOrderActionPatchWorkOrderById,
  IWorkOrderActionPatchWorkOrderByIdBody,
} from "@redux/actions/workOrderAction";
import WorkOrderTypes from "@redux/types/workOrderTypes";
import {
  all,
  call,
  CallEffect,
  put,
  PutEffect,
  takeEvery,
} from "redux-saga/effects";
import { IEmployee } from "src/types/employee";
import { IWorkOrder } from "src/types/workOrder";

const getWorkOrderById = async (id: string) => {
  return fetch(`/api/work-order/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json().then((data): IWorkOrder => {
        const employee: IEmployee | null =
          data.employee !== null
            ? {
                id: data.employee.id,
                firstName: data.employee.first_name,
                lastName: data.employee.last_name,
                phoneNumber: data.employee.phone_number,
                email: data.employee.email,
                type: data.employee.type,
                status: data.employee.status,
              }
            : null;

        return {
          id: data.id,
          createTime: data.create_time,
          updateTime: data.update_time,
          status: data.status,
          title: data.title,
          customerId: data.customer_id,
          vehicleId: data.vehicle_id,
          employeeId: data.employee_id,
          body: data.body,
          shopId: data.shop_id,
          customer: {
            id: data.customer.id,
            first_name: data.customer.first_name,
            last_name: data.customer.last_name,
            phone_number: data.customer.phone_number,
            email: data.customer.email,
          },
          vehicle: {
            id: data.vehicle.id,
            make: data.vehicle.make,
            model: data.vehicle.model,
            year: data.vehicle.year,
            vin: data.vehicle.vin,
            license_plate: data.vehicle.license_plate,
          },
          employee: employee,
        };
      });

      return {
        data,
        success: true,
      };
    } else {
      return {
        data: await res.json(),
        success: false,
      };
    }
  });
};

const patchWorkOrderById = async (
  id: string,
  patch: IWorkOrderActionPatchWorkOrderByIdBody
) => {
  return fetch(`/api/work-order/${id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patch),
  }).then(async (res) => ({ data: await res.json(), success: res.ok }));
};

function* getWorkOrderByIdGenerator(
  action: IWorkOrderActionGetWorkOrderById
): Generator<CallEffect | PutEffect> {
  const workOrder = (yield call(getWorkOrderById, action.payload.id)) as {
    data: any;
    success: boolean;
  };
  if (workOrder.success) {
    yield put({
      type: WorkOrderTypes.SET_WORK_ORDER_ERROR,
      payload: { error: null },
    });

    yield put({
      type: WorkOrderTypes.SET_WORK_ORDER,
      payload: { workOrder: workOrder.data },
    });
  } else {
    yield put({
      type: WorkOrderTypes.SET_WORK_ORDER_ERROR,
      payload: { error: workOrder.data },
    });
  }
}

function* patchWorkOrderByIdGenerator(
  action: IWorkOrderActionPatchWorkOrderById
): Generator<CallEffect | PutEffect> {
  const workOrder = (yield call(
    patchWorkOrderById,
    action.payload.id,
    action.payload.patch
  )) as {
    data: any;
    success: boolean;
  };

  if (workOrder.success) {
    yield call(
      getWorkOrderByIdGenerator,
      getWorkOrderByIdActionBuilder(action.payload.id)
    );
  } else {
    yield put({
      type: WorkOrderTypes.SET_WORK_ORDER_ERROR,
      payload: { error: workOrder.data },
    });
  }
}

/**
 * Saga to handle all work order related actions.
 */
export function* workOrderSaga() {
  yield all([
    takeEvery(WorkOrderTypes.READ_WORK_ORDER_BY_ID, getWorkOrderByIdGenerator),
    takeEvery(
      WorkOrderTypes.PATCH_WORK_ORDER_BY_ID,
      patchWorkOrderByIdGenerator
    ),
  ]);
}
