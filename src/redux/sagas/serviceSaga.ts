import { AuthSelectors } from "@redux/selectors/authSelectors";
import { Service, ServiceType } from "@server/db/client";
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
import { IParts, IService } from "src/types/service";
import {
  IServiceActionCreateService,
  IServiceActionDeleteService,
  IServiceActionSetService,
} from "../actions/serviceAction";
import ServiceTypes from "../types/serviceTypes";

interface IPatchServiceBody {
  id?: string;
  name?: string;
  description?: string;
  estimated_time?: string;
  total_price?: number;
  parts?: IParts[];
}

interface IPostServiceBody {
  id: string;
  name: string;
  description: string;
  estimated_time: string;
  total_price: number;
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

function getAllServices(shopId: string): Promise<IService[]> {
  return fetch(`/api/service/${shopId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const services = data.map((service: Service) => {
          return {
            id: service.id,
            name: service.id,
            description: service.description,
            estimated_time: service.estimated_time,
            total_price: service.total_price,
            parts: service.parts,
            type: service.type,
          };
        });
        return services;
      });
    } else {
      // TODO: check and handle errors
      return [];
    }
  });
}

function* updateService(
  action: IServiceActionSetService
): Generator<CallEffect | PutEffect> {
  const patch = action.payload.patch;
  const body: IPatchServiceBody = {
    id: patch.id,
    name: patch.name,
    description: patch.description,
    estimated_time: patch.estimated_time,
    total_price: patch.total_price,
    parts: patch.parts,
  };
  const success = yield call(patchService, action.payload.serviceId, body);
  if (success) {
    yield put({ type: ServiceTypes.READ_SERVICES });
  }
}

function* readServices(): Generator<CallEffect | PutEffect | SelectEffect> {
  const shopId = (yield select(AuthSelectors.getShopId)) as string | null;
  if (shopId) {
    const employees = yield call(getAllServices, shopId);
    yield put({
      type: ServiceTypes.SET_SERVICES,
      payload: { employees },
    });
  }
}

function* deleteService(
  action: IServiceActionDeleteService
): Generator<CallEffect | PutEffect> {
  const serviceId = action.payload.serviceId;
  yield call(deleteServiceById, serviceId);
}

function postCreate(body: IPostServiceBody, shopId: string): Promise<boolean> {
  return fetch(`/api/service/${shopId}`, {
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

function deleteServiceById(serviceId: string): Promise<boolean> {
  return fetch(`/api/service/${serviceId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  });
}

function* createService(
  action: IServiceActionCreateService
): Generator<CallEffect | PutEffect> {
  const payload = action.payload;
  const body: IPostServiceBody = {
    id: payload.id,
    name: payload.name,
    description: payload.description,
    estimated_time: payload.estimated_time,
    total_price: payload.total_price,
    parts: payload.parts,
    type: payload.type,
  };
  yield call(postCreate, body, payload.id);
}

/**
 * Saga to handle all Service related actions.
 */
export function* serviceSaga() {
  yield all([
    takeEvery(ServiceTypes.READ_SERVICES, readServices),
    takeEvery(ServiceTypes.CREATE_SERVICE, createService),
    takeEvery(ServiceTypes.DELETE_SERVICE, deleteService),
    takeEvery(ServiceTypes.SET_SERVICE, updateService),
  ]);
}
