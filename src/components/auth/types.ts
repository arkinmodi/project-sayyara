export interface IAuthSignUpFormValues {
  csrfToken: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IAuthSignUpFormCustomerValues extends IAuthSignUpFormValues {
  vehicleModel: string;
  vehicleMake: string;
  vehicleYear: number | null;
  vin: string;
  licensePlate: string;
}

export interface IAuthSignUpFormShopEmployeeValues
  extends IAuthSignUpFormValues {
  shopId: string;
}

export interface IAuthSignUpFormShopOwnerValues extends IAuthSignUpFormValues {
  shopAddress: string;
  shopPostalCode: string;
  shopPhoneNumber: string;
  shopName: string;
  shopCity: string;
  shopProvince: string;
}

export interface ILoginFormValues {
  csrfToken: string;
  email: string;
  password: string;
}
