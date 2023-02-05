import WorkOrderTypes from "@redux/types/workOrderTypes";
import { IWorkOrder, WorkOrderStatus } from "src/types/workOrder";

interface IWorkOrderActionBase {
  type: WorkOrderTypes;
}

export interface IWorkOrderActionGetWorkOrderById extends IWorkOrderActionBase {
  payload: { id: string };
}

export interface IWorkOrderActionPatchWorkOrderByIdBody {
  title?: string;
  body?: string;
  employee_id?: string;
  employee_email?: string;
  status?: WorkOrderStatus;
}

export interface IWorkOrderActionPatchWorkOrderById
  extends IWorkOrderActionBase {
  payload: { id: string; patch: IWorkOrderActionPatchWorkOrderByIdBody };
}

export interface IWorkOrderActionSetWorkOrder extends IWorkOrderActionBase {
  payload: { workOrder: IWorkOrder };
}

export type IWorkOrderAction =
  | IWorkOrderActionGetWorkOrderById
  | IWorkOrderActionPatchWorkOrderById
  | IWorkOrderActionSetWorkOrder;

export const getWorkOrderByIdActionBuilder = (id: string) => ({
  type: WorkOrderTypes.GET_WORK_ORDER_BY_ID,
  payload: { id },
});

export const patchWorkOrderByIdActionBuilder = (
  id: string,
  patch: IWorkOrderActionPatchWorkOrderByIdBody
) => ({
  type: WorkOrderTypes.PATCH_WORK_ORDER_BY_ID,
  payload: { id, patch },
});
