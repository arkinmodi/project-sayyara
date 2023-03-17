import { EmployeeStatus } from "@prisma/client";
import { IEmployeeActionSetEmployeeStatus } from "@redux/actions/employeeActions";
import EmployeeTypes from "@redux/types/employeeTypes";
import ShopTypes from "@redux/types/shopTypes";
import {
  all,
  call,
  CallEffect,
  put,
  PutEffect,
  takeEvery,
} from "redux-saga/effects";

interface IPatchEmployeeBody {
  email?: string;
  phoneNumber?: string;
  status?: EmployeeStatus;
  firstName?: string;
  lastName?: string;
}

function patchEmployeeStatus(
  employeeId: string,
  body: IPatchEmployeeBody
): Promise<boolean> {
  return fetch(`/api/employee/${employeeId}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => {
    if (res.status === 200) {
      return true;
    } else {
      // TODO: check and handle errors
      return false;
    }
  });
}

function* updateEmployeeStatus(
  action: IEmployeeActionSetEmployeeStatus
): Generator<CallEffect | PutEffect> {
  const body: IPatchEmployeeBody = { status: action.payload.status };
  const success = yield call(
    patchEmployeeStatus,
    action.payload.employeeId,
    body
  );
  if (success) {
    yield put({ type: ShopTypes.READ_SHOP_EMPLOYEES });
  }
}

/**
 * Saga to handle all employee related actions.
 */
export function* employeeSaga() {
  yield all([
    takeEvery(EmployeeTypes.SET_EMPLOYEE_STATUS, updateEmployeeStatus),
  ]);
}
