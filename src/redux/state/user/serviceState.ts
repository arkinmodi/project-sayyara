import { IService } from "src/types/service";

export interface IServiceState {
  services: IService[];
}

export const initialServicesState: IServiceState = {
  services: [],
};
