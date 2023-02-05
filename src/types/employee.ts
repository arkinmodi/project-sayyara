import { EmployeeStatus, UserType } from "@prisma/client";

export interface IEmployee {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  type: UserType;
  status: EmployeeStatus;
}
