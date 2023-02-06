import { IWorkOrder } from "src/types/workOrder";

export interface IWorkOrderState {
  workOrder: IWorkOrder | null;
  error: { message: string } | null;
}

export const initialWorkOrderState: IWorkOrderState = {
  workOrder: null,
  error: null,
};
