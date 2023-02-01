export interface IAuthSignUpFormValues {
  csrfToken: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
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
  shopName: string;
  shopAddress: string;
  shopPostalCode: string;
  shopPhoneNumber: string;
  shopCity: string;
  shopProvince: string;
  shopEmail: string;
}

export interface ILoginFormValues {
  csrfToken: string;
  email: string;
  password: string;
}
