import { Service } from "@server/db/client";
import {
  all,
  call,
  CallEffect,
  put,
  PutEffect,
  takeEvery,
} from "redux-saga/effects";
import { IParts, IService, ServiceType } from "src/types/service";
import {
  IServiceActionCreateService,
  IServiceActionSetServiceStatus,
} from "../actions/ServiceAction";
import ServiceTypes from "../types/ServiceTypes";

interface IPostCreateBody {
  id: string;
  name: string;
  description: string;
  estimated_time: string;
  total_price: number;
  parts: IParts[];
  type: ServiceType;
}

function patchService(
  content: IServiceActionSetServiceStatus["payload"]
): Promise<boolean> {
  return fetch(`/api/service/${content.id}`, {
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

function* setService(
  action: IServiceActionSetServiceStatus
): Generator<CallEffect | PutEffect> {
  const success = yield call(patchService, action.payload);
  // if (success) {
  //   yield call(readServices);
  // }
}

function* readServices(shopId: string): Generator<CallEffect | PutEffect> {
  const services = yield call(getAllServices, shopId);
  yield put({
    type: ServiceTypes.SET_SERVICE,
    payload: { services },
  });
}

function postCreate(body: IPostCreateBody, shopId: string): Promise<boolean> {
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

function* createService(
  action: IServiceActionCreateService
): Generator<CallEffect | PutEffect> {
  const payload = action.payload;
  const body: IPostCreateBody = {
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
export function* ServiceSaga() {
  yield all([
    takeEvery(ServiceTypes.SET_SERVICE, setService),
    takeEvery(ServiceTypes.READ_SERVICES, readServices),
    takeEvery(ServiceTypes.CREATE_SERVICE, createService),
  ]);
}
