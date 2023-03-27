import { IParts, ServiceType } from "src/types/service";
import ServiceTypes from "../types/serviceTypes";
interface IServiceActionBase {
  type: ServiceTypes;
}

export interface IServiceActionSetService extends IServiceActionBase {
  payload: {
    serviceId: string;
    patch: {
      name?: string;
      description?: string;
      estimatedTime?: number;
      totalPrice?: number;
      parts?: IParts[];
    };
  };
}

export interface IServiceActionCreateService extends IServiceActionBase {
  payload: {
    name: string;
    description: string;
    estimatedTime: number;
    totalPrice: number;
    parts: IParts[];
    type: ServiceType;
  };
}

export type IServiceAction =
  | IServiceActionSetService
  | IServiceActionCreateService;

export const setService = (payload: IServiceActionSetService["payload"]) => ({
  type: ServiceTypes.SET_SERVICE,
  payload,
});

export const createService = (
  payload: IServiceActionCreateService["payload"]
) => ({
  type: ServiceTypes.CREATE_SERVICE,
  payload,
});
