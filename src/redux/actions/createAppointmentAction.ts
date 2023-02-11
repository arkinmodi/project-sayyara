import CreateAppointmentTypes from "@redux/types/createAppointmentTypes";
import { IService } from "src/types/service";

interface ICreateAppointmentActionBase {
  type: CreateAppointmentTypes;
}

export interface ICreateAppointmentActionSetService
  extends ICreateAppointmentActionBase {
  payload: { service: IService };
}

export type ICreateAppointmentAction = ICreateAppointmentActionSetService;

export const setService = (
  payload: ICreateAppointmentActionSetService["payload"]
) => ({
  type: CreateAppointmentTypes.SET_SERVICE,
  payload,
});
