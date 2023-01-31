import { IWorkOrder } from "src/types/workOrder";

export interface IWorkOrderState {
  workOrder: IWorkOrder | null;
}

export const initialWorkOrderState: IWorkOrderState = {
  workOrder: null,
};
