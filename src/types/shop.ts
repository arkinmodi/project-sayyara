import { IService } from "./service";

export interface IShopOperatingDay {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}
export interface IShopHoursOfOperation {
  monday: IShopOperatingDay;
  tuesday: IShopOperatingDay;
  wednesday: IShopOperatingDay;
  thursday: IShopOperatingDay;
  friday: IShopOperatingDay;
  saturday: IShopOperatingDay;
  sunday: IShopOperatingDay;
}

export interface IShop {
  id?: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  province: string;
  phoneNumber: string;
  hoursOfOperation?: IShopHoursOfOperation;
  email: string;
  services?: IService[] | null;
}

export interface IAvailabilitiesTime {
  startTime: Date;
  endTime: Date;
}

export interface IAvailabilities {
  [key: string]: IAvailabilitiesTime[];
}
