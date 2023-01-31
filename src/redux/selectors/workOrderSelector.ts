import { IWorkOrderState } from "@redux/state/workOrderState";
import { createSelector } from "reselect";
import { RootState } from "../store";

const getWorkOrderState = (state: RootState): IWorkOrderState =>
  state.workOrder;

const getWorkOrder = createSelector(
  getWorkOrderState,
  (workOrderState) => workOrderState.workOrder
);

export const WorkOrderSelectors = {
  getWorkOrder,
};
