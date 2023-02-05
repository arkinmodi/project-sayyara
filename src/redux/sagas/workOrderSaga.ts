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

const getWorkOrderById = async (id: string) => {
  return fetch(`/api/work-order/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
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
  }).then((res) => res.json());
};

function* getWorkOrderByIdGenerator(
  action: IWorkOrderActionGetWorkOrderById
): Generator<CallEffect | PutEffect> {
  const workOrder = yield call(getWorkOrderById, action.payload.id);
  yield put({
    type: WorkOrderTypes.SET_WORK_ORDER,
    payload: { workOrder },
  });
}

function* patchWorkOrderByIdGenerator(
  action: IWorkOrderActionPatchWorkOrderById
): Generator<CallEffect> {
  yield call(patchWorkOrderById, action.payload.id, action.payload.patch);
  yield call(
    getWorkOrderByIdGenerator,
    getWorkOrderByIdActionBuilder(action.payload.id)
  );
}

/**
 * Saga to handle all work order related actions.
 */
export function* workOrderSaga() {
  yield all([
    takeEvery(WorkOrderTypes.GET_WORK_ORDER_BY_ID, getWorkOrderByIdGenerator),
    takeEvery(
      WorkOrderTypes.PATCH_WORK_ORDER_BY_ID,
      patchWorkOrderByIdGenerator
    ),
  ]);
}
