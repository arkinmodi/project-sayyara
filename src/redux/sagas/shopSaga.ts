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
import { IEmployee } from "src/types/employee";
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

/**
 * Saga to handle all employee related actions.
 */
export function* shopSaga() {
  yield all([
    takeEvery(ShopTypes.READ_SHOP_EMPLOYEES, readShopEmployees),
    takeEvery(ShopTypes.READ_SHOP_SERVICES, readShopServices),
  ]);
}
