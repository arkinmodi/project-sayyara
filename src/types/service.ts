export enum ServiceType {
  CANNED = "CANNED",
  CUSTOM = "CUSTOM",
  REWORK = "REWORK",
}

export enum PartCondition {
  NEW = "NEW",
  USED = "USED",
  NEW_AND_USED = "NEW_AND_USED",
}

export enum PartType {
  OEM = "OEM",
  AFTERMARKET = "AFTERMARKET",
  OEM_AND_AFTERMARKET = "OEM_AND_AFTERMARKET",
}

export interface IService {
  id: string;
  name: string;
  description: string;
  estimated_time: number;
  total_price: number;
  parts: IParts[];
  type: ServiceType;
  shop_id: string;
}

export interface IParts {
  quantity?: number;
  cost?: number;
  name?: string;
  condition: string;
  build: string;
}
