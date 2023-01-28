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
  id: String;
  name: String;
  description: String;
  estimated_time: Number;
  total_price: Number;
  parts: IParts;
}

export interface IParts {
  quantity: Number;
  cost: Number;
  name: String;
  condition: PartCondition;
  build: PartType;
}
