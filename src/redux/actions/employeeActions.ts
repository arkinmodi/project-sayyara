import { EmployeeStatus } from "@prisma/client";
import EmployeeTypes from "@redux/types/employeeTypes";

interface IEmployeeActionBase {
  type: EmployeeTypes;
}

export interface IEmployeeActionSetEmployeeStatus extends IEmployeeActionBase {
  payload: { employeeId: string; status: EmployeeStatus };
}

export type IEmployeeAction = IEmployeeActionSetEmployeeStatus;

export const setEmployeeStatus = (
  payload: IEmployeeActionSetEmployeeStatus["payload"]
) => ({
  type: EmployeeTypes.SET_EMPLOYEE_STATUS,
  payload,
});
