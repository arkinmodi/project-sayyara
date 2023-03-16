import { AuthSelectors } from "@redux/selectors/authSelectors";
import ShopTypes from "@redux/types/shopTypes";
import { ServiceType } from "@server/db/client";
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
import { IParts } from "src/types/service";
import {
  IServiceActionCreateService,
  IServiceActionDeleteService,
  IServiceActionSetService,
} from "../actions/serviceAction";
import ServiceTypes from "../types/serviceTypes";

interface IPatchServiceBody {
  name?: string;
  description?: string;
  estimatedTime?: number;
  totalPrice?: number;
  parts?: IParts[];
}

interface IPostServiceBody {
  shopId: string;
  name: string;
  description: string;
  estimatedTime?: number;
  totalPrice?: number;
  parts: IParts[];
  type: ServiceType;
}

function patchService(
  serviceId: string,
  body: IPatchServiceBody
): Promise<boolean> {
  return fetch(`/api/service/${serviceId}`, {
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

function* updateService(
  action: IServiceActionSetService
): Generator<CallEffect | PutEffect> {
  const patch = action.payload.patch;
  const body: IPatchServiceBody = {
    name: patch.name,
    description: patch.description,
    estimatedTime: patch.estimatedTime,
    totalPrice: patch.totalPrice,
    parts: patch.parts,
  };
  const success = yield call(patchService, action.payload.serviceId, body);
  if (success) {
    yield put({ type: ShopTypes.READ_SHOP_SERVICES });
  }
}

function* deleteService(
  action: IServiceActionDeleteService
): Generator<CallEffect | PutEffect> {
  const serviceId = action.payload.serviceId;
  const success = yield call(deleteServiceById, serviceId);
  if (success) {
    yield put({ type: ShopTypes.READ_SHOP_SERVICES });
  }
}

function postCreate(body: IPostServiceBody): Promise<boolean> {
  return fetch(`/api/service/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => {
    if (res.status === 201) {
      return true;
    } else {
      return false;
    }
  });
}

function deleteServiceById(serviceId: string): Promise<boolean> {
  return fetch(`/api/service/${serviceId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 204) {
      return true;
    } else {
      return false;
    }
  });
}

function* createService(
  action: IServiceActionCreateService
): Generator<CallEffect | PutEffect | SelectEffect> {
  const shopId = (yield select(AuthSelectors.getShopId)) as string | null;

  if (shopId) {
    const payload = action.payload;
    const body: IPostServiceBody = {
      shopId: shopId,
      name: payload.name,
      description: payload.description,
      estimatedTime: payload.estimatedTime,
      totalPrice: payload.totalPrice,
      parts: payload.parts,
      type: payload.type,
    };
    const success = yield call(postCreate, body);
    if (success) {
      yield put({ type: ShopTypes.READ_SHOP_SERVICES });
    }
  }
}

/**
 * Saga to handle all Service related actions.
 */
export function* serviceSaga() {
  yield all([
    takeEvery(ServiceTypes.SET_SERVICE, updateService),
    takeEvery(ServiceTypes.CREATE_SERVICE, createService),
    takeEvery(ServiceTypes.DELETE_SERVICE, deleteService),
  ]);
}
