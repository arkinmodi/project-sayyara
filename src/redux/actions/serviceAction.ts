import { IParts, ServiceType } from "src/types/service";
import ServiceTypes from "../types/serviceTypes";

interface IServiceActionBase {
  type: ServiceTypes;
}

export interface IServiceActionReadServices extends IServiceActionBase {
  payload: void;
}

export interface IServiceActionSetService extends IServiceActionBase {
  payload: { serviceId: string; patch: any };
}

export interface IServiceActionDeleteService extends IServiceActionBase {
  payload: { serviceId: string };
}

export interface IServiceActionCreateService extends IServiceActionBase {
  payload: {
    id: string;
    name: string;
    description: string;
    estimated_time: string;
    total_price: number;
    parts: IParts[];
    type: ServiceType;
  };
}

export interface IServiceActionDeleteService extends IServiceActionBase {
  payload: { id: string };
}

export type IServiceAction =
  | IServiceActionReadServices
  | IServiceActionSetService
  | IServiceActionCreateService
  | IServiceActionDeleteService;

export const readServices = (payload: void) => ({
  type: ServiceTypes.READ_SERVICES,
  payload,
});

export const setServices = (payload: IServiceActionSetService["payload"]) => ({
  type: ServiceTypes.SET_SERVICES,
  payload,
});

export const createService = (
  payload: IServiceActionCreateService["payload"]
) => ({
  type: ServiceTypes.CREATE_SERVICE,
  payload,
});

export const deleteService = (
  payload: IServiceActionDeleteService["payload"]
) => ({
  type: ServiceTypes.DELETE_SERVICE,
  payload,
});
