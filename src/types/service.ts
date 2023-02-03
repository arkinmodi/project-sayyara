export enum ServiceType {
  CANNED = "CANNED",
  CUSTOM = "CUSTOM",
  REWORK = "REWORK",
}

export enum PartCondition {
  NEW = "NEW",
  USED = "USED",
}

export enum PartType {
  OEM = "OEM",
  AFTER_MARKET = "AFTER_MARKET",
}

export interface IService {
  id: string;
  name: string;
  description: string;
  estimated_time: number;
  total_price: string;
  parts: IParts[];
  type: ServiceType;
  shop_id: string;
}

export interface IParts {
  id: string;
  quantity: Number;
  cost: Number;
  name: String;
  condition: PartCondition;
  build: PartType;
}
